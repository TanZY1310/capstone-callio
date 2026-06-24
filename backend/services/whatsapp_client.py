import httpx
from services.client_manager import get_shared_client
# consider if there's better ways to pass the url into httpxasyncclient object request functions later

NODE_BASE_URL = "http://localhost:3001"  # Your Node.js server address

async def fetch_connection_status():
    print("\nfetching connection status...")
    client = await get_shared_client()
    try:
        response = await client.get(f"{NODE_BASE_URL}/whatsapp/status")
        return response.json()
    except httpx.RequestError:
        return {"status": "offline"}

# NEED WORK & CUSTOMIZATION
async def fetch_chat_messages(cust_id):
    
    print(f"\nwill read whatsapp history of this user: {cust_id}")
    client = await get_shared_client()

    try:
        response = await client.get(f"{NODE_BASE_URL}/whatsapp/read")
        return response.json()
    except httpx.HTTPStatusError as e:
        return {"status": "error", "message": f"Node.js error: {e.response.text}"}
    except httpx.RequestError:
        return {"status": "error", "message": "Node.js server is offline"}


    return

# send_chat_message & confirm_ai_draft endpoints in router use the same function in services
async def send_whatsapp_message(cust_phone, content):
    print(f"Send message by {cust_phone} matching, send {content}")
    
    client = await get_shared_client()

    try:
        url = f"{NODE_BASE_URL}/whatsapp/send"
        
        # phone number & message will be received from router/whatsapp.py
        # passed into nodejs express router endpoint via httpxasyncclient object post request function
        payload = {"phone": cust_phone, "message": content}
        
        response = await client.post(url, json=payload)
        
        # raise an error if Node returns a bad status code (404, 500, etc.)
        response.raise_for_status()
        return response.json()
        
    except httpx.HTTPStatusError as e:
        return {"status": "error", "message": f"Node.js error: {e.response.text}"}
    except httpx.RequestError:
        return {"status": "error", "message": "Node.js server is offline"}

# DONE
async def connect_whatsapp():
    print("Connect to whatsapp hehe.")

    client = await get_shared_client()
    
    try:
        response = await client.post(f"{NODE_BASE_URL}/whatsapp/connect")
        return response.json()
    except httpx.RequestError:
        return {"status": "error", "message": "Failed to connect to Node"}

