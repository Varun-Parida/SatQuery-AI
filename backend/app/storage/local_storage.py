import json
from pathlib import Path
from uuid import uuid4

from backend.app.core.config import EVIDENCE_DIR, PROJECT_ROOT, RESULT_DIR, UPLOAD_DIR
from backend.app.core.exceptions import ResultNotFoundError, ValidationError
from backend.app.utils.validation import validate_image
from rendering.evidence.change_maps import save_change_map_png


def save_upload(filename: str, contents: bytes) -> dict[str, object]:
    """Persist one validated upload locally and return its client-safe metadata."""
    safe_name = Path(filename or "upload").name
    if not safe_name or safe_name == ".":
        raise ValidationError("a filename is required")
    upload_id = uuid4().hex
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    destination = UPLOAD_DIR / f"{upload_id}_{safe_name}"
    destination.write_bytes(contents)
    try:
        width, height = validate_image(destination)
    except Exception:
        destination.unlink(missing_ok=True)
        raise
    return {"id": upload_id, "filename": safe_name,
            "path": str(destination.relative_to(PROJECT_ROOT)),
            "width": width, "height": height, "status": "uploaded"}


def get_upload(upload_id: str) -> Path:
    matches = list(UPLOAD_DIR.glob(f"{upload_id}_*"))
    if len(matches) != 1:
        raise ValidationError("uploaded image was not found")
    return matches[0]


def save_change_map(change_map: list[list[int]]) -> str:
    """Store a change-mask PNG and return its project-relative reference."""
    EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)
    destination = EVIDENCE_DIR / f"change_map_{uuid4().hex}.png"
    save_change_map_png(change_map, destination)
    try:
        return str(destination.relative_to(PROJECT_ROOT))
    except ValueError:
        return str(destination)


def save_result(result: dict[str, object]) -> str:
    result_id = uuid4().hex
    result["id"] = result_id
    RESULT_DIR.mkdir(parents=True, exist_ok=True)
    (RESULT_DIR / f"{result_id}.json").write_text(json.dumps(result), encoding="utf-8")
    return result_id


def get_result(result_id: str) -> dict[str, object]:
    path = RESULT_DIR / f"{result_id}.json"
    if not path.is_file():
        raise ResultNotFoundError("result was not found")
    return json.loads(path.read_text(encoding="utf-8"))
