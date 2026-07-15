#Save pdf document embeddings in vector store

import io
import json
import logging
from pypdf import PdfReader
from langchain_core.documents import Document
from langchain_core.messages import HumanMessage
from langchain_text_splitters import RecursiveCharacterTextSplitter

from services.embeddings import (
    get_or_create_client,
    embed_and_index,
    delete_documents,
    get_all_sources,
    MONGODB_URI,
    DB_NAME,
    PROPERTY_COLLECTION_NAME,
)

logger = logging.getLogger(__name__)


def _get_property_store_and_collection():
    mongo_client, property_vector_store, _, _ = get_or_create_client(MONGODB_URI)
    property_collection = mongo_client[DB_NAME][PROPERTY_COLLECTION_NAME]
    return property_vector_store, property_collection

#process PDF file and store embeddings in vector store
def process_and_store_pdf(file_bytes: bytes, file_name: str) -> int:
    reader = PdfReader(io.BytesIO(file_bytes))
    docs = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            #Add page numbers to the metadata so the llm knows exactly where the info came from!
            docs.append(Document(page_content=text, metadata={"source": file_name, "page": i + 1}))

    if not docs:
        print(f"No text extracted from {file_name}. It might be a scanned image.")
        return 0

    print(f"Extracted text from {len(docs)} pages.")

    #Setup the text splitter
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    split_docs = text_splitter.split_documents(docs)

    property_vector_store, _ = _get_property_store_and_collection()
    embed_and_index(property_vector_store, split_docs)
    return len(split_docs)

#delete PDF file from vector store
def delete_pdf_from_store(file_name: str) -> int:
    _, property_collection = _get_property_store_and_collection()
    return delete_documents(property_collection, file_name)

#get all PDF files from vector store
def get_all_pdfs_from_store() -> list[str]:
    _, property_collection = _get_property_store_and_collection()
    return get_all_sources(property_collection)


def suggest_properties(preferences_text: str, budget: str | None, location: str | None) -> list[dict]:
    """Query property vector store and return up to 3 property suggestions matching customer preferences."""
    try:
        _, property_vector_store, _, llm = get_or_create_client(MONGODB_URI, for_query=True)
    except Exception as e:
        logger.warning("Could not connect to property store for suggestions: %s", e)
        return []

    query_parts = []
    if location and location.lower() not in ("not specified", "none", ""):
        query_parts.append(f"Location: {location}")
    if budget and budget.lower() not in ("not specified", "none", ""):
        query_parts.append(f"Budget: {budget}")
    if preferences_text and preferences_text.lower() not in ("not specified", "none", ""):
        query_parts.append(f"Preferences: {preferences_text}")
    if not query_parts:
        return []

    query = "\n".join(query_parts)
    retriever = property_vector_store.as_retriever(search_kwargs={"k": 10})
    docs = retriever.invoke(query)
    if not docs:
        return []

    context = "\n\n---\n\n".join(d.page_content for d in docs)

    prompt = (
        "You are a real estate property advisor. Based on the property listing context below "
        "and the customer's stated preferences, suggest up to 3 suitable properties.\n\n"
        "CUSTOMER PREFERENCES:\n"
        f"Location: {location or 'not specified'}\n"
        f"Budget: {budget or 'not specified'}\n"
        f"Preferences: {preferences_text or 'not specified'}\n\n"
        "PROPERTY LISTINGS:\n"
        f"{context}\n\n"
        "Use your knowledge of Malaysian geography to determine if a property matches "
        "the customer's preferred location, even if the listing uses different area names "
        "(e.g., customer says 'Shah Alam' but listing says 'Section 15' — these are the same area). "
        "Be conservative — only suggest properties you are confident are genuinely relevant "
        "to the customer's request.\n\n"
        "For each suggestion:\n"
        "- propertyName: name of the property\n"
        "- reason: why it matches this customer's needs\n"
        "- matchScore: 0-100 how well it fits\n"
        "- highlights: up to 4 key selling points relevant to this customer\n"
        "- location: the property's location/area\n"
        "- budget: the property's price range\n"
        "Return ONLY a JSON array with no other text:\n"
        '[{"propertyName": "...", "reason": "...", "matchScore": 85, "highlights": ["point1"], "location": "Bukit Jalil", "budget": "RM650k+"}]'
    )

    msg = HumanMessage(content=prompt)
    response = llm.invoke([msg])
    raw = response.content
    if isinstance(raw, list):
        raw = "".join(p.get("text", "") for p in raw if isinstance(p, dict))

    parsed = raw.strip()
    if "```json" in parsed:
        parsed = parsed.split("```json")[1].split("```")[0].strip()
    elif "```" in parsed:
        parsed = parsed.split("```")[1].split("```")[0].strip()

    try:
        result = json.loads(parsed)
        return result if isinstance(result, list) else []
    except json.JSONDecodeError:
        logger.warning(f"Failed to parse property suggestions: {parsed[:200]}")
        return []