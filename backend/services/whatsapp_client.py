async def fetch_connection_status():
    print("stub for now, fetch status")
    return

async def fetch_chat_messages(cust_id):
    print(f"will read whatsapp history of this user: {cust_id}")
    return

# send_chat_message & confirm_ai_draft endpoints in router use the same function in services
async def send_whatsapp_message(cust_id, content):
    print(f"Send message by {cust_id} matching, send {content}")

async def connect_whatsapp():
    print("Connect to whatsapp hehe.")
