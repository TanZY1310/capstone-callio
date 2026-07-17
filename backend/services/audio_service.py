import os
import json
import base64
import logging
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

logger = logging.getLogger(__name__)

FALLBACK_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
]


def _create_llm(model: str):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY not set in .env file")
    return ChatGoogleGenerativeAI(model=model, google_api_key=key)


def _invoke_with_fallback(messages, models=None, progress_callback=None):
    if models is None:
        models = FALLBACK_MODELS
    last_exception = None
    for model in models:
        try:
            if progress_callback:
                progress_callback(f"Using {model}...")
            llm = _create_llm(model)
            response = llm.invoke(messages)
            logger.info("LLM call succeeded with model: %s", model)
            if progress_callback:
                progress_callback(f"Completed with {model}")
            return response
        except Exception as e:
            exc_name = type(e).__name__
            logger.warning("Model %s failed: %s", model, e)
            if progress_callback:
                progress_callback(f"{model} failed ({exc_name}). Trying next model...")
            last_exception = e
    raise RuntimeError(
        f"All fallback models failed. Last error: {last_exception}"
    ) from last_exception


def _parse_json(text: str) -> dict:
    text = text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
    return json.loads(text)


def transcribe_audio(audio_bytes: bytes, mime_type: str, progress_callback=None) -> list:
    audio_b64 = base64.b64encode(audio_bytes).decode()

    prompt = (
        "Transcribe this phone call between a real estate agent and a buyer. "
        "The call may contain multiple languages: English, Malay, Mandarin Chinese, and Tamil. "
        'Label each speaker as "agent" or "buyer". '
        "For each utterance:\n"
        "- Detect the language(s) being spoken\n"
        "- If English, output the text as-is\n"
        "- If Malay, Mandarin, or Tamil, output in this format:\n"
        "  original_script (English_translation)\n"
        "  Examples:\n"
        "    Tamil: 'வணக்கம் (good morning)'\n"
        "    Malay: 'Apa khabar (how are you)'\n"
        "    Chinese: '你好 (hello)'\n"
        "- Include a 'language' field indicating the detected language (english, malay, mandarin, tamil, or mixed)\n"
        "Return ONLY a JSON array with no other text:\n"
        '[{"speaker": "agent", "text": "...", "language": "..."}, {"speaker": "buyer", "text": "...", "language": "..."}]'
    )

    msg = HumanMessage(content=[
        {"type": "text", "text": prompt},
        {"type": "media", "data": audio_b64, "mime_type": mime_type},
    ])
    response = _invoke_with_fallback([msg], progress_callback=progress_callback)

    raw = response.content
    if isinstance(raw, list):
        text = "".join(p.get("text", "") for p in raw if isinstance(p, dict))
    else:
        text = raw

    return _parse_json(text)


def analyze_transcript(transcript: list, progress_callback=None) -> dict:
    transcript_text = "\n".join(
        f"{s['speaker']}: {s['text']}" for s in transcript
    )

    customer_statuses = [
        "No Pickup", "Might Keep In Touch", "Not Interested",
        "WhatsApp", "Stop Following Up", "Pending Appointment",
        "Appointment", "Booking", "Completed", "Not Yet Call",
    ]

    prompt = (
        "You are an expert real estate call analyst. Your task is to extract structured insights "
        "from transcribed conversations between a real estate agent and a buyer.\n\n"

        "Here are examples of the expected input and output:\n\n"

        "--- Example 1 (Positive / High Intent) ---\n"
        "Transcript:\n"
        "agent: Selamat petang (good afternoon)! I saw you were enquiring about the Bukit Jalil project.\n"
        "buyer: Yes, I'm interested in a 3-bedroom unit. Brapa harga (what's the price)?\n"
        "agent: Starting from RM650k. We have a show unit this Saturday.\n"
        "buyer: Bagus (great), can I book for Saturday?\n\n"
        "Output:\n"
        '{"sentiment":{"overallSentiment":"Positive","intentScore":82,"urgency":"Medium","emotions":["interested","proactive"],"objections":[],"interestTags":["3-bedroom","bukit jalil","rm650k","weekend viewing"]},"nextActions":["book saturday viewing","prepare 3-bedroom unit details","send project brochure"],"preferences":{"preferences":"Interested in a 3-bedroom unit in Bukit Jalil","preferenceNote":"Price inquiry made, show unit viewing requested","signals":["requested viewing","specific unit type","price inquiry"],"budgetValue":"RM650k+","budgetNote":"Starting price acceptable, no negotiation mentioned","location":"Bukit Jalil","locationNote":"Actively looking at Bukit Jalil project","purpose":"Looking to purchase a 3-bedroom unit"},"objections":[],"customerStatus":"Appointment","summary":"Buyer is actively interested in a 3-bedroom unit at the Bukit Jalil project starting from RM650k. Weekend viewing booked."}\n\n'

        "--- Example 2 (Neutral / Objections) ---\n"
        "Transcript:\n"
        "agent: Hi, following up on the Seri Kembangan unit we discussed.\n"
        "buyer: Saya sudah fikir (I've been thinking), but the maintenance fee is quite tinggi (high). Also lokasi (location) not sure.\n"
        "agent: The facilities justify the fee, and the area is developing fast.\n"
        "buyer: Mungkin (maybe), but I want to banding (compare) with other options first.\n\n"
        "Output:\n"
        '{"sentiment":{"overallSentiment":"Neutral","intentScore":35,"urgency":"Low","emotions":["hesitant","price-sensitive","uncertain"],"objections":["maintenance fee too high","unsure about location","wants to compare options"],"interestTags":["seri kembangan","facilities-aware","comparing options"]},"nextActions":["send comparison of maintenance fees in area","share area development plans","follow up in 2 weeks"],"preferences":{"preferences":"Considering Seri Kembangan but has concerns","preferenceNote":"Concerned about maintenance fee and location","signals":["still considering","raised specific concerns","open to comparison"],"budgetValue":"not specified","budgetNote":"Not mentioned, but sensitive to ongoing costs","location":"Seri Kembangan","locationNote":"Has doubts about the location","purpose":"Evaluating property with concerns about costs and location"},"objections":["maintenance fee too high","unsure about location","wants to compare options"],"customerStatus":"Might Keep In Touch","summary":"Buyer is hesitant about the Seri Kembangan property due to high maintenance fees and location concerns, wants to explore other options before deciding."}\n\n'

        "--- Now analyze this transcript ---\n\n"
        f"{transcript_text}\n\n"

        "First, reason through it step by step:\n"
        "- What languages are used in each utterance?\n"
        "- What is the buyer's emotional state and sentiment?\n"
        "- Are there any objections, hesitations, or concerns?\n"
        "- What signals indicate the buyer's intent level (price checks, viewing requests, comparisons)?\n"
        "- What should the agent do next to move the deal forward?\n\n"

        "- For the 'location' field, extract ONLY the place name (e.g. 'Shah Alam', 'Kg Kayu Ara', 'Bukit Jalil'). Do not include travel time, proximity notes, or any qualifiers.\n\n"
        "Then output your final answer as a JSON code block with this exact structure:\n"
        "```json\n"
        "{\n"
        '  "sentiment": {\n'
        '    "overallSentiment": "Positive|Neutral|Negative",\n'
        '    "intentScore": 0-100,\n'
        '    "urgency": "Low|Medium|High",\n'
        '    "emotions": ["emotion1", "emotion2"],\n'
        '    "objections": ["objection1"],\n'
        '    "interestTags": ["tag1"]\n'
        "  },\n"
        '  "nextActions": ["action1", "action2"],\n'
        '  "preferences": {\n'
        '    "preferences": "summary of what buyer wants",\n'
        '    "preferenceNote": "additional detail",\n'
        '    "signals": ["buying signal 1"],\n'
        '    "budgetValue": "budget range or not specified",\n'
        '    "budgetNote": "flexibility or constraints",\n'
        '    "location": "place name ONLY (e.g. \'Shah Alam\', \'Kg Kayu Ara\'). No travel time, no proximity notes.",\n'
        '    "locationNote": "details about location preference",\n'
        '    "purpose": "main purpose of this call"\n'
        "  },\n"
        '  "objections": ["same as sentiment.objections"],\n'
        f'  "customerStatus": "choose from {customer_statuses}",\n'
        '  "summary": "2-3 sentence summary covering preferences, next actions, and sentiment"\n'
        "}\n"
        "```"
    )

    msg = HumanMessage(content=prompt)
    response = _invoke_with_fallback([msg], progress_callback=progress_callback)

    raw = response.content
    if isinstance(raw, list):
        text = "".join(p.get("text", "") for p in raw if isinstance(p, dict))
    else:
        text = raw

    return _parse_json(text)
