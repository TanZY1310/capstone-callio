# Specify the pydantic model here
from pydantic import BaseModel, Field, StrictInt


# Example only, modify based on requirements
class CustomerRequest(BaseModel):
    title: str = Field(min_length=3, max_length=1000)
    author: str = Field(min_length=3, max_length=1000)
    published_year: StrictInt = Field(gt=1800, lt=2026)

class CustomerCreate(BaseModel):
    id: int
    name: str
    phone: int
    budget: float
    