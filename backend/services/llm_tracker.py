from uuid import UUID
from sqlalchemy.orm import Session
from models.user import Users

def update_user_token_usage(db: Session, user_id: UUID, tokens_used: int) -> int:
    """
    Increments the token usage for a specific user and returns the new total.
    """
    if tokens_used <= 0:
        return 0

    user = db.query(Users).filter(Users.user_id == user_id).first()
    if not user:
        raise ValueError(f"User with id {user_id} not found")
        
    user.tokens_used += tokens_used
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user.tokens_used

def extract_token_usage_from_langchain(response) -> int:
    """
    Example utility to extract token usage from a Langchain ChatGoogleGenerativeAI response.
    Usage:
        response = llm.invoke("Hello")
        tokens = extract_token_usage_from_langchain(response)
        update_user_token_usage(db, current_user.user_id, tokens)
    """
    try:
        # Debug logging to file
        try:
            with open("token_debug.txt", "a") as f:
                f.write(f"Type: {type(response)}\n")
                f.write(f"Usage metadata: {getattr(response, 'usage_metadata', 'MISSING')}\n")
                f.write(f"Response metadata: {getattr(response, 'response_metadata', 'MISSING')}\n")
        except Exception:
            pass
            
        # Check standard usage_metadata introduced in LangChain Core >= 0.2.x
        if hasattr(response, 'usage_metadata') and response.usage_metadata:
            return response.usage_metadata.get('input_tokens', 0) + response.usage_metadata.get('output_tokens', 0) or response.usage_metadata.get('total_tokens', 0)
            
        # Fallback to older response_metadata structure
        if hasattr(response, 'response_metadata'):
            metadata = response.response_metadata
            if 'token_usage' in metadata:
                return metadata['token_usage'].get('total_tokens', 0)
    except Exception as e:
        print(f"Error extracting tokens: {e}")
        
    return 0
