from pydantic import BaseModel


class UploadResponse(BaseModel):
    id: str
    filename: str
    path: str
    width: int
    height: int
    status: str = "uploaded"
