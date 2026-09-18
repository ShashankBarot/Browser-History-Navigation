from pydantic import BaseModel
from typing import List, Optional


class VisitRequest(BaseModel):
    url: str
    title: str


class NodeResponse(BaseModel):
    id: int
    title: str
    url: str
    prev: Optional[int] = None
    next: Optional[int] = None


class HistoryResponse(BaseModel):
    head: Optional[int] = None
    tail: Optional[int] = None
    current: Optional[int] = None
    nodes: List[NodeResponse]


class MessageResponse(BaseModel):
    message: str