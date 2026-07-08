import os
import time
import asyncio
import logging
from operator import itemgetter
from pathlib import Path
from pypdf import PdfReader
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from services.whatsapp_client import fetch_chat_messages
# this services layer needs to be imported into my langchain related router functions

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")

DB_NAME = "property_info_db"
PROPERTY_COLLECTION_NAME = "property_collection_pdf"
PROPERTY_INDEX_NAME = "property_index_1"
TRANSCRIPT_COLLECTION_NAME = "call_transcript_collection"
TRANSCRIPT_INDEX_NAME = "transcript_index_1"
EMBEDDING_DIMENSIONS = 768
CHAT_HISTORY_LIMIT = 20

_mongo_client = None
_property_vector_store = None
_transcript_vector_store = None
_llm = None

def _ensure_vector_search_index(collection, vector_store, index_name, filters=None):
    """Creates the Atlas vector search index if it doesn't already exist."""
    existing_indexes = [index["name"] for index in collection.list_search_indexes()]
    if index_name not in existing_indexes:
        vector_store.create_vector_search_index(dimensions=EMBEDDING_DIMENSIONS, filters=filters)

# function: check for existing mongodb cluster if not, create, if yes, open
def get_or_create_client(uri: str) -> tuple[MongoClient, MongoDBAtlasVectorSearch, MongoDBAtlasVectorSearch, ChatGoogleGenerativeAI]:
    """Returns existing MongoDB client/vector stores/llm, or creates them on first call."""
    global _mongo_client
    global _property_vector_store
    global _transcript_vector_store
    global _llm

    # If everything already exists, return it immediately without recreating
    if (
        _mongo_client is not None
        and _property_vector_store is not None
        and _transcript_vector_store is not None
        and _llm is not None
    ):
        return _mongo_client, _property_vector_store, _transcript_vector_store, _llm

    # If it does not exist, instantiate it using the URI
    try:
        _mongo_client = MongoClient(uri)
        database = _mongo_client[DB_NAME]
        property_collection = database[PROPERTY_COLLECTION_NAME]
        transcript_collection = database[TRANSCRIPT_COLLECTION_NAME]

        embeddings = GoogleGenerativeAIEmbeddings(
            model = "models/gemini-embedding-2",
            google_api_key = GEMINI_API_KEY,
            output_dimensionality = EMBEDDING_DIMENSIONS,
            task_type = "RETRIEVAL_DOCUMENT"
        )

        _llm = ChatGoogleGenerativeAI(model = "gemini-3.1-flash-lite", api_key= GEMINI_API_KEY)

        _property_vector_store = MongoDBAtlasVectorSearch(
            collection = property_collection,
            embedding = embeddings,
            index_name = PROPERTY_INDEX_NAME,
            relevance_score_fn = "cosine",
        )
        _ensure_vector_search_index(property_collection, _property_vector_store, PROPERTY_INDEX_NAME)

        _transcript_vector_store = MongoDBAtlasVectorSearch(
            collection = transcript_collection,
            embedding = embeddings,
            index_name = TRANSCRIPT_INDEX_NAME,
            relevance_score_fn = "cosine",
        )
        # cust_id is declared as a filter field so retrieval can be scoped to one customer
        _ensure_vector_search_index(
            transcript_collection, _transcript_vector_store, TRANSCRIPT_INDEX_NAME, filters=["cust_id"]
        )

        return _mongo_client, _property_vector_store, _transcript_vector_store, _llm
    except Exception as e:
        _mongo_client = None  # Reset on failure
        raise ConnectionError(f"Failed to open MongoDB connection: {e}")

def _split_documents(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 500,
        chunk_overlap = 100
    )
    return text_splitter.split_documents(documents)

# # function: pass in file, open file and pulls raw text for chunking
# def chunk_file(file: str | Path):
#     """Extract and chunk a PDF or plain-text file."""
#     if Path(file).suffix == ".pdf":
#         reader = PdfReader(file)
#         result = []
#         for i in range(len(reader.pages)):
#             page = reader.pages[i]
#             text = page.extract_text()
#             if text:
#                 result.append(Document(page_content = text, metadata={"source": file, "page": i+1}))
#         print(f"Result of using PDFReader is {result}")
#     else:
#         with open(file, "r") as f:
#             text = f.read()
#         result = [Document(page_content=text, metadata={"source": file})]
#         print(f"Result of using standard open is {result}")

#     return _split_documents(result)

def chunk_text(text: str, metadata: dict):
    """Chunk a raw string (e.g. a call transcript) tagged with the given metadata."""
    result = [Document(page_content=text, metadata=metadata)]
    return _split_documents(result)

# function: the actual embedding
def embed_and_index(vector_store, chunks):
    print(f"Total chunks: {len(chunks)}")
    print(f"Estimated time: {max(1, len(chunks)/50):.1f} minutes (at 100 RPM)")

    batch_size = 50
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        vector_store.add_documents(batch)
        print(f"Done process {min(i + batch_size, len(chunks))}/{len(chunks)} documents")

        if i + batch_size < len(chunks):
            print("Wait for 60 seconds...")
            time.sleep(60)

def embed_call_transcript(cust_id: str, transcription_text: str):
    """Chunk and embed a call transcript, scoped to one customer via cust_id metadata.

    Not wired into any router yet - exposed for whichever future change hooks
    this into the speech analysis pipeline (backend/routers/speech.py).
    """
    chunks = chunk_text(transcription_text, metadata={"cust_id": cust_id, "source": "call_transcript"})
    embed_and_index(_transcript_vector_store, chunks)

def delete_documents(collection, source: str) -> int:
    """Delete all chunks tagged with the given source from the collection."""
    result = collection.delete_many({"source": source})
    return result.deleted_count

def get_all_sources(collection) -> list[str]:
    """Return the distinct sources currently stored in the collection."""
    return [source for source in collection.distinct("source") if source]

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def format_chat_history(chat_history) -> str:
    """fetch_chat_messages returns a list of message dicts, or an error dict if the
    Node WhatsApp backend is unreachable - degrade to empty history rather than fail."""
    if not isinstance(chat_history, list):
        logger.warning(f"Could not use chat history: {chat_history}")
        return ""

    lines = []
    for message in chat_history[-CHAT_HISTORY_LIMIT:]:
        speaker = "Agent" if message.get("fromMe") else "Customer"
        lines.append(f"{speaker}: {message.get('body', '')}")
    return "\n".join(lines)

# function: retrieval and generation, takes in the query
async def retrieval_and_generation(cust_id: str, phone: str, query: str):
    _, _property_vector_store, _transcript_vector_store, _llm = get_or_create_client(MONGODB_URI)
    property_retriever = _property_vector_store.as_retriever(search_kwargs={"k": 10})
    transcript_retriever = _transcript_vector_store.as_retriever(
        search_kwargs={"k": 10, "pre_filter": {"cust_id": cust_id}}
    )

    chat_history = await fetch_chat_messages(phone)

    system_prompt = (
    """
    You are a knowledgeable real-estate assistant that answers questions using ONLY the provided context.
    If the context does not contain enough information to answer the question, say "I don't have enough information to answer that."
    Do not make up facts or use knowledge outside of the provided context.
    Prefer the call transcript context for the customer's stated preferences, and the property context for factual details.
    Keep your answers concise and directly relevant to the question.

    PROPERTY CONTEXT:
    {property_context}

    CALL TRANSCRIPT CONTEXT (this customer's past calls):
    {transcript_context}

    CHAT HISTORY (this conversation):
    {chat_history}
    """
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}")
    ])

    setup_and_retrieval = {
        "property_context": itemgetter("input") | property_retriever | format_docs,
        "transcript_context": itemgetter("input") | transcript_retriever | format_docs,
        "chat_history": itemgetter("chat_history"),
        "input": itemgetter("input"),
    }

    rag_chain = setup_and_retrieval | prompt | _llm | StrOutputParser()
    print("Querying Vector DB...")
    response = rag_chain.invoke({"input": query, "chat_history": format_chat_history(chat_history)})
    print(f"\nAI Response: {response}")

    return response

# if __name__ == "__main__":
#     get_or_create_client(MONGODB_URI)
#     chunks = chunk_file("C:/Users/User/Desktop/workspace/property/propertymaxxing/the shang/The_Shang_Residence_Project_Summary.pdf")
#     embed_and_index(_property_vector_store, chunks)
#     response = asyncio.run(
#         retrieval_and_generation(
#             cust_id = "test-customer",
#             phone = "0000000000",
#             query = "If someone wants to buy a The Shang unit, what should they know?",
#         )
#     )