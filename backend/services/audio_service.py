import os
import json
import base64
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()


def _get_llm():
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY not set in .env file")
    return ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite", google_api_key=key)


def _detect_mime_type(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    mapping = {
        ".wav": "audio/wav",
        ".mp3": "audio/mpeg",
        ".m4a": "audio/mp4",
        ".ogg": "audio/ogg",
        ".flac": "audio/flac",
        ".webm": "audio/webm",
    }
    return mapping.get(ext, "audio/wav")


def _parse_json(text: str) -> dict:
    text = text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
    return json.loads(text)


def transcribe_audio(file_path: str) -> list:
    llm = _get_llm()

    with open(file_path, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode()

    mime_type = _detect_mime_type(file_path)

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
    response = llm.invoke([msg])

    raw = response.content
    if isinstance(raw, list):
        text = "".join(p.get("text", "") for p in raw if isinstance(p, dict))
    else:
        text = raw

    return _parse_json(text)


def analyze_transcript(transcript: list) -> dict:
    llm = _get_llm()

    transcript_text = "\n".join(
        f"{s['speaker']}: {s['text']}" for s in transcript
    )

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
        '    "budgetNote": "flexibility note"\n'
        "  },\n"
        '  "summary": {\n'
        '    "nextActions": "comma-separated next actions",\n'
        '    "customerStanding": "current status/interest level of the buyer",\n'
        '    "preferencesSpecified": "summary of preferences mentioned"\n'
        "  }\n"
        "}\n"
        "Do not include any markdown formatting or code blocks."
    )

    msg = HumanMessage(content=prompt)
    response = llm.invoke([msg])

    raw = response.content
    if isinstance(raw, list):
        text = "".join(p.get("text", "") for p in raw if isinstance(p, dict))
    else:
        text = raw

    return _parse_json(text)
