#Save pdf document embeddings in vector store

import os 
import time 
from pypdf import PdfReader
from pymongo import MongoClient
from langchain_core.documents import Document
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

#Access environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_ATLAS_CLUSTER_URI")

#Initialize the embedding model and llm for QUERYING
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-2",
    google_api_key = GEMINI_API_KEY,
    output_dimensionality=768,
    task_type="RETRIEVAL_DOCUMENT"
)

# Connect to MongoDB
client = MongoClient(MONGODB_URI)

# Verify the connection
try:
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB!")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")

#Define database and collection names
DB_NAME= "rag_db"
COLLECTION_NAME = "rag_collection"
ATLAS_VECTOR_SEARCH_INDEX_NAME = "test-index-1"
MONGODB_COLLECTION = client[DB_NAME][COLLECTION_NAME]

#Instantiate the vector store
vector_store = MongoDBAtlasVectorSearch(
    collection=MONGODB_COLLECTION,
    embedding=embeddings,
    index_name=ATLAS_VECTOR_SEARCH_INDEX_NAME,
    relevance_score_fn="cosine"
)

import io

def process_and_store_pdf(file_bytes: bytes, file_name: str) -> int:
    """Processes a PDF file from bytes, splits it, and adds it to the vector store."""
    reader = PdfReader(io.BytesIO(file_bytes))
    docs = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            #Add page numbers to the metadata so the llm knows exactly where the info came from!
            docs.append(Document(page_content=text, metadata={"source": file_name, "page": i + 1}))
            
    if not docs:
        print(f"❌ No text extracted from {file_name}. It might be a scanned image.")
        return 0

    print(f"✅ Extracted text from {len(docs)} pages.")

    #Setup the text splitter
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    split_docs = text_splitter.split_documents(docs)
    
    print(f"✅ Generated {len(split_docs)} chunks. Sending to MongoDB...")
    
    vector_store.add_documents(split_docs)
    
    print("✅ Successfully added chunks to MongoDB!")
    
    return len(split_docs)

def delete_pdf_from_store(file_name: str) -> int:
    """Deletes all chunks associated with a specific PDF file from the vector store."""
    result = MONGODB_COLLECTION.delete_many({"source": file_name})
    return result.deleted_count

def get_all_pdfs_from_store() -> list[str]:
    """Retrieves a list of all unique PDF filenames currently stored in the vector store."""
    unique_sources = MONGODB_COLLECTION.distinct("source")
    return [source for source in unique_sources if source]