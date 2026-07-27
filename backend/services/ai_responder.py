# customer_info.name, customer_info.phone

from services.embeddings import retrieval_and_generation
async def generate_reply_draft(chat_history, customer_info, transcript_history=None, metadata_out=None):
    print(f"""ChatGoogleGenerativeAI shenanigans go here
          \n Will use {customer_info}'s {chat_history}""")

    reply = await retrieval_and_generation(
        customer_info["id"],
        customer_info["phone"],
        chat_history=chat_history,
        transcript_history=transcript_history or [],
        metadata_out=metadata_out,
    )

    return reply