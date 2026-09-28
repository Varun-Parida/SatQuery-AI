from fastapi import APIRouter, HTTPException, status

from backend.app.core.exceptions import SpecialistError, ValidationError
from backend.app.schemas.queries import AnalyzeRequest
from backend.app.schemas.results import AnalysisResult
from backend.app.services.query_service import analyze


router = APIRouter(tags=["analysis"])


@router.post("/analyze", response_model=AnalysisResult)
def analyze_images(request: AnalyzeRequest) -> dict[str, object]:
    try:
        return analyze(request.image_ids, request.query)
    except ValidationError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    except SpecialistError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(error)) from error
