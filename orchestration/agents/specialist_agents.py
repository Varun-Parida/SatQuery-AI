from typing import Any

from ml.models.change_detection.wrapper import run_change_detection
from ml.models.grounding.wrapper import run_grounding


def run_specialist(task: str, image_paths: list[Any], query: str) -> dict[str, Any]:
    """Invoke only the available prototype specialist for the selected task."""
    if task == "grounding":
        return run_grounding(image_paths[0], query)
    if task == "change":
        return run_change_detection(image_paths[0], image_paths[1])
    return {}
