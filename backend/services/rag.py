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

#Define database and collection names
DB_NAME= "test_db"
COLLECTION_NAME = "test_collection"
ATLAS_VECTOR_SEARCH_INDEX_NAME = "test-index-1"
MONGODB_COLLECTION = client[DB_NAME][COLLECTION_NAME]

#Instantiate the vector store
vector_store = MongoDBAtlasVectorSearch(
    collection=MONGODB_COLLECTION,
    embedding=embeddings,
    index_name=ATLAS_VECTOR_SEARCH_INDEX_NAME,
    relevance_score_fn="cosine"
)

#Clear all exisiting documents from the collections
MONGODB_COLLECTION.delete_many({})
print("Previous documents cleared")

#Custome native PDF loader Function
def load_pdf_document(file_path: str) -> list[Document]:
    reader = PdfReader(file_path)
    docs = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            #Add page numbers to the metadata so the llm knows exactly where the info came from!
            docs.append(Document(page_content=text, metadata={"source":file_path, "page": i +1}))
        return docs
    
print("Loading PDF...")
pdf_docs = load_pdf_document('diabetes.pdf')

#Setup the text splitter
text_splitter = RecursiveCharacterTextSplitter()