from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional
import uuid
from typing import List

class CustomerResponse(BaseModel):
    cust_id: uuid.UUID
    cust_name: str
    phone: str
    budget: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    last_contact: Optional[datetime] = None
    remarks: Optional[dict] = None
    user_id: uuid.UUID

    model_config = {"from_attributes": True} 

class CustomerSheetRow(BaseModel):
    cust_name: str
    phone: str
    budget: Optional[str] = None        # nullable — filled in later
    location: Optional[str] = None      
    status: Optional[str] = None
    last_contact: Optional[datetime] = None

    # Convert empty values from google sheets to null value so that it can still be saved to database (For eg: datetime from last_contact got error since it requires datetime format)
    @field_validator("budget", "location", "status", "last_contact", "phone", mode="before")
    @classmethod
    def empty_string_to_none(cls, v):
        if v == "" or v is None:
            return None
        return v

class StatusUpdateItem(BaseModel):
    cust_id: uuid.UUID
    status: str

class BatchStatusUpdate(BaseModel):
    updates: List[StatusUpdateItem]

class StatusUpdateRequest(BaseModel):
    status: str

class SyncResult(BaseModel):
    synced: int
    skipped: int
    total: int

class ChangesResponse(BaseModel):
    count: int
    updated_ids: list[uuid.UUID]