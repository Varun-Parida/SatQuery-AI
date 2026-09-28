from pathlib import Path
from typing import Any

from PIL import Image

from backend.app.core.exceptions import SpecialistError, ValidationError
from backend.app.services.result_service import store_result
from backend.app.storage.local_storage import get_upload, save_change_map
from backend.app.utils.validation import validate_query
from orchestration.agents.specialist_agents import run_specialist
from orchestration.context.execution_trace import build_trace
from orchestration.registry.tool_registry import model_name
from orchestration.routing.query_router import route_query


def analyze(image_ids: list[str], query: str) -> dict[str, Any]:
    """Execute the local prototype analysis flow and persist its common result."""
    query = validate_query(query)
    if not 1 <= len(image_ids) <= 2:
        raise ValidationError("provide one image for grounding/VQA or two images for change detection")
    image_paths = [get_upload(image_id) for image_id in image_ids]
    task = route_query(len(image_paths), query)
    if task == "change":
        _validate_temporal_pair(image_paths[0], image_paths[1])

    try:
        specialist_result = run_specialist(task, image_paths, query)
    except (ValueError, OSError) as error:
        raise SpecialistError("specialist analysis could not be completed") from error

    result = _common_result(task, specialist_result)
    result["id"] = store_result(result)
    return result


def _validate_temporal_pair(before: Path, after: Path) -> None:
    with Image.open(before) as before_image, Image.open(after) as after_image:
        if before_image.size != after_image.size:
            raise ValidationError("before and after images must have matching dimensions")


def _common_result(task: str, specialist_result: dict[str, Any]) -> dict[str, Any]:
    if task == "grounding":
        boxes = specialist_result.get("boxes", [])
        answer = "A water-like region was detected." if boxes else "No water-like region was detected."
        return {
            "task": task, "answer": answer,
            "confidence": specialist_result.get("confidence", 0.0),
            "evidence": {"boxes": boxes}, "model": model_name(task),
            "trace": build_trace("Input validated", "Task classified as grounding",
                                 "Grounding model selected", "Inference completed", "Evidence prepared"),
        }
    if task == "change":
        changed = specialist_result.get("changed", False)
        answer = "Changes were detected between the images." if changed else "No substantial changes were detected between the images."
        change_map_reference = save_change_map(specialist_result.get("change_map"))
        return {
            "task": task, "answer": answer,
            "confidence": specialist_result.get("confidence", 0.0),
            "evidence": {"change_regions": specialist_result.get("change_regions", []),
                         "change_map": change_map_reference},
            "model": model_name(task),
            "trace": build_trace("Input validated", "Temporal pair detected",
                                 "Task classified as change detection", "Change detection model selected",
                                 "Change map generated", "Evidence prepared"),
        }
    return {
        "task": "vqa", "answer": "VQA model is not implemented yet.", "confidence": 0.0,
        "evidence": {}, "model": model_name("vqa"),
        "trace": build_trace("Input validated", "Task classified as VQA",
                             "VQA integration point reached", "VQA model not implemented"),
    }
