import uuid
from pydantic import BaseModel, Field, ConfigDict
from typing import List
from typing_extensions import Self
from datetime import datetime
from enum import Enum

class SendMessage(BaseModel):
    message: str

class ResponseStatus(str, Enum):
    draft = "draft"
    edited = "edited"      # user has personalized it, not yet sent
    confirmed = "confirmed"

class AIResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    response_id: int
    content: str
    status: ResponseStatus
    cust_id: uuid.UUID
    created_at: datetime

class AIResponseUpdate(BaseModel):
    content: str

class AIResponses(BaseModel):
    id: int # client ID
    responses: List[AIResponseSchema] = Field(default_factory = list)

class AIResponseList(BaseModel):
    clients: List[AIResponses]