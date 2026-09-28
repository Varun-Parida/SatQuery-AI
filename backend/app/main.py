from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.api.router import api_router
from backend.app.core.config import EVIDENCE_DIR


app = FastAPI(title="SatQuery AI", version="0.1.0", description="Local satellite-image analysis prototype")

# Allow the Vite dev server to call the API directly from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(api_router)

# Serve already-generated evidence files (e.g. change maps) over HTTP so the
# browser can display them; results reference them by project-relative path.
EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/evidence", StaticFiles(directory=EVIDENCE_DIR), name="evidence")


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
