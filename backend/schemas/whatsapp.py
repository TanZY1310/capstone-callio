from pydantic import BaseModel, Field, model_validator
from typing import List
from typing_extensions import Self

class AIResponse(BaseModel):
    id: int
    content: str
    confirmed: bool = False
    needsEdit: bool = False

    @model_validator(mode='after')
    def check_confirm_edit_exclusive(self) -> Self:
        if (self.needsEdit is True) and (self.confirmed is True):
            raise ValueError("Generated response can't be true in both confirmed & needsEdit at the same time!")
        return self

class AIResponses(BaseModel):
    id: int # client ID
    responses: List[AIResponse] = Field(default_factory = list)

class AIResponseList(BaseModel):
    clients: List[AIResponses]