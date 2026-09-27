from fastapi import APIRouter, File, HTTPException, UploadFile, status

from backend.app.core.exceptions import ValidationError
from backend.app.schemas.uploads import UploadResponse
from backend.app.services.upload_service import store_upload


router = APIRouter(tags=["uploads"])


@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(file: UploadFile = File(...)) -> dict[str, object]:
    try:
        return store_upload(file.filename or "upload", await file.read())
    except ValidationError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
