from fastapi import APIRouter

from backend.app.api.routes import queries, results, uploads


api_router = APIRouter()
api_router.include_router(uploads.router)
api_router.include_router(queries.router)
api_router.include_router(results.router)
