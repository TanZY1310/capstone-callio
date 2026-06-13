from fastapi import APIRouter

router = APIRouter(
    prefix = "/whatsapp",
    tags = ["whatsapp"]
)

@router.get("/")
async def test():
    return "endpoint working fine"


# check if connected, if not allow connect (sync status in frontend)

# read whatsapp history (ideally read it in a way that matches frontend rendering and make it show)

# take input in from user and prompt the send

# endpoint for frontend to read AI powered response and show

# endpoint for editing AI powered response before sending

# endpoint for confirming AI powered response and send