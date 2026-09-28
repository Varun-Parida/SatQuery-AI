"""Interface for bi-temporal change-detection tools."""

from typing import Any, Dict


def run_change_detection(before_image: Any, after_image: Any) -> Dict[str, Any]:
    """Compare two already co-registered RGB images."""
    raise NotImplementedError
