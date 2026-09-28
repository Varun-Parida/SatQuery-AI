from fastapi import APIRouter, HTTPException, status

from backend.app.core.exceptions import ResultNotFoundError
from backend.app.schemas.results import AnalysisResult
from backend.app.services.result_service import fetch_result


router = APIRouter(tags=["results"])


@router.get("/result/{result_id}", response_model=AnalysisResult)
def get_analysis_result(result_id: str) -> dict[str, object]:
    try:
        return fetch_result(result_id)
    except ResultNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
