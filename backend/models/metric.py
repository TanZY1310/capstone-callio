import uuid
from datetime import datetime
from sqlalchemy import Integer, ForeignKey, String, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB #JSONB supports indexing and fast lookups compared to JSON
from database import Base

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base









    
    
    























# agent_ID = Column(Integer, primary_key = True, index = True)
# agent_Call = Column(Integer)
# agent_Lead = Column(Integer)
# agent_Followup = Column(Integer)
# agent_Appoinment = Column(Integer)
# agent_Objection = Column(String)
# agent_Region = Column(String)







    