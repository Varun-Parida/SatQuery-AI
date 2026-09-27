from pathlib import Path

from PIL import Image, UnidentifiedImageError

from backend.app.core.config import SUPPORTED_SUFFIXES
from backend.app.core.exceptions import ValidationError


def validate_image(path: Path) -> tuple[int, int]:
    """Check that an uploaded image is supported and readable."""
    if not path.is_file() or path.stat().st_size == 0:
        raise ValidationError("image file is missing or empty")
    if path.suffix.lower() not in SUPPORTED_SUFFIXES:
        raise ValidationError("supported formats are PNG, JPG, JPEG, TIF, and TIFF")
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            return image.size
    except (UnidentifiedImageError, OSError) as error:
        raise ValidationError("image file is not readable") from error


def validate_query(query: str) -> str:
    cleaned = query.strip() if isinstance(query, str) else ""
    if not cleaned:
        raise ValidationError("query must not be empty")
    return cleaned
