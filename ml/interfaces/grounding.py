"""Interface for lightweight visual grounding tools."""

from typing import Any, Dict


def run_grounding(image: Any, query: str) -> Dict[str, Any]:
    """Locate evidence for *query* in a single RGB image.

    Concrete implementations live in :mod:`ml.models.grounding.wrapper`.
    """
    raise NotImplementedError
