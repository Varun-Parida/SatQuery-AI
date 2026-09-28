from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    image_ids: list[str] = Field(min_length=1, max_length=2)
    query: str = Field(min_length=1, max_length=500)
