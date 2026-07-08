# consider call transcript history in the future

# customer_info.name, customer_info.phone

from services.embeddings import retrieval_and_generation
async def generate_reply_draft(chat_history, customer_info):
    print(f"""ChatGoogleGenerativeAI shenanigans go here
          \n Will use {customer_info}'s {chat_history}""")
    
    reply = await retrieval_and_generation(customer_info["id"], customer_info["phone"], "STUB QUERY INVOKED INTO THE RAG_CHAIN HERE")

    return reply