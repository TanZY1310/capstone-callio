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
        'Label each speaker as "agent" or "buyer". '
        "Return ONLY a JSON array with no other text:\n"
        '[{"speaker": "agent", "text": "..."}, {"speaker": "buyer", "text": "..."}]'
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

    buyer_stages = [
        "Awareness", "Interested", "Considering",
        "Negotiation", "Ready to close", "Cold lead",
    ]

    prompt = (
        f"Here is a transcribed conversation between a real estate agent and a buyer:\n\n"
        f"{transcript_text}\n\n"
        "Extract insights and return ONLY a JSON object with this exact structure:\n"
        "{\n"
        '  "sentiment": {\n'
        '    "overallSentiment": "Positive|Neutral|Negative",\n'
        '    "intentScore": 85,\n'
        '    "urgency": "Low|Medium|High",\n'
        '    "emotions": ["emotion1"],\n'
        '    "objections": ["objection1"],\n'
        '    "interestTags": ["tag1"]\n'
        "  },\n"
        '  "nextActions": ["action1", "action2"],\n'
        '  "preferences": {\n'
        '    "preferences": "summary",\n'
        '    "preferenceNote": "detail",\n'
        '    "signals": ["signal1"],\n'
        '    "budgetValue": "budget range",\n'
        '    "budgetNote": "flexibility note",\n'
        '    "location": "preferred city/area/neighborhood",\n'
        '    "locationNote": "details about location preference",\n'
        '    "purpose": "Brief description of the main purpose of this call"\n'
        "  },\n"
        '  "objections": ["duplicate of sentiment.objections for easy storage"],\n'
        f'  "buyerStage": "one of {buyer_stages}",\n'
        '  "summary": "A short 2-3 sentence plain-text summary of the conversation covering preferences, next actions, and sentiment."\n'
        "}\n"
        "Do not include any markdown formatting or code blocks."
    )

    msg = HumanMessage(content=prompt)
    response = _invoke_with_fallback([msg], progress_callback=progress_callback)

    raw = response.content
    if isinstance(raw, list):
        text = "".join(p.get("text", "") for p in raw if isinstance(p, dict))
    else:
        text = raw

    return _parse_json(text)
