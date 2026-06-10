from pydantic import BaseModel, Field, StrictInt

class AIResponseChecker(BaseModel):
    id: int
# classes to include