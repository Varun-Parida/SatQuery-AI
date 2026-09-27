from fastapi import FastAPI

from backend.app.api.router import api_router


app = FastAPI(title="SatQuery AI", version="0.1.0", description="Local satellite-image analysis prototype")
app.include_router(api_router)


@app.get("/health", tags=["health"])
def health() -> dict[str, object]:
    return {
        "status": "ok",
        "service": "satquery-ai-backend",
        "components": {
            "grounding": "available",
            "change_detection": "available",
            "vqa": "not_implemented",
        },
    }
