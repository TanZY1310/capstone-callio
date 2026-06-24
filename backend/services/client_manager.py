import asyncio
import atexit
import httpx

# Private global variables
_client: httpx.AsyncClient | None = None
_lock = asyncio.Lock()

async def get_shared_client() -> httpx.AsyncClient:
    """
    Returns a shared, persistent HTTP client.
    Initializes lazily on the very first call, completely bypassing main.py startup.
    """
    global _client
    
    # Check if already initialized without locking (fast path)
    if _client is not None:
        return _client
        
    # Thread/Async safe locking to ensure only ONE client is created under load
    async with _lock:
        if _client is None:
            # Configure your Node.js or WhatsApp settings completely here
            _client = httpx.AsyncClient(
                timeout=10.0,
                limits=httpx.Limits(max_connections=100, max_keepalive_connections=20)
            )
            
            # Register an automatic teardown hook when the application process dies
            atexit.register(_sync_cleanup)
            
    return _client

def _sync_cleanup():
    """
    Runs automatically when the Python process terminates.
    Closes the connection pool cleanly without needing FastAPI's lifespan.
    """
    global _client
    if _client is not None:
        # httpx client close is async, but atexit is sync. 
        # We force-run the close coroutine in a temporary loop.
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                loop.create_task(_client.aclose())
            else:
                loop.run_until_complete(_client.aclose())
        except Exception:
            pass # Suppress exit errors to ensure clean OS process teardown
        _client = None
