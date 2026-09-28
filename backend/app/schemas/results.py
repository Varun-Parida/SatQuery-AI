from typing import Any

from pydantic import BaseModel, Field


class AnalysisResult(BaseModel):
    id: str
    task: str
    answer: str
    confidence: float = Field(ge=0, le=1)
    evidence: dict[str, Any]
    model: str
    trace: list[str]
