#Save pdf document embeddings in vector store

import io
from pypdf import PdfReader
from langchain_core.documents import Document
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