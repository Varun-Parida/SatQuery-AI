"""Small image adapters shared by prototype specialist tools.

The core path intentionally uses only the Python standard library.  It accepts
RGB nested sequences (including NumPy-like arrays) and optionally uses Pillow
when a caller passes a file path or PIL image.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, List, Sequence, Tuple


RGBImage = List[List[Tuple[int, int, int]]]


def load_rgb(image: Any) -> RGBImage:
    """Convert an RGB-like input to a rectangular ``[(r, g, b)]`` grid."""
    if isinstance(image, (str, Path)):
        return _load_file(Path(image))
    if hasattr(image, "convert") and hasattr(image, "getdata"):
        converted = image.convert("RGB")
        width, height = converted.size
        pixels = list(converted.getdata())
        return [[_pixel(pixels[y * width + x]) for x in range(width)] for y in range(height)]
    if hasattr(image, "tolist"):
        image = image.tolist()

    if not isinstance(image, Sequence) or not image:
        raise ValueError("image must be a non-empty RGB array or image file")
    rows: RGBImage = []
    width = None
    for row in image:
        if not isinstance(row, Sequence) or not row:
            raise ValueError("image rows must be non-empty sequences")
        converted_row = [_pixel(pixel) for pixel in row]
        width = len(converted_row) if width is None else width
        if len(converted_row) != width:
            raise ValueError("image rows must have equal widths")
        rows.append(converted_row)
    return rows


def dimensions(image: RGBImage) -> Tuple[int, int]:
    return len(image[0]), len(image)


def _pixel(value: Any) -> Tuple[int, int, int]:
    if not isinstance(value, Sequence) or len(value) < 3:
        raise ValueError("each pixel must contain at least three RGB channels")
    channels = [float(value[index]) for index in range(3)]
    if all(0.0 <= channel <= 1.0 for channel in channels):
        channels = [channel * 255.0 for channel in channels]
    return tuple(max(0, min(255, int(round(channel)))) for channel in channels)  # type: ignore[return-value]


def _load_file(path: Path) -> RGBImage:
    if not path.is_file():
        raise FileNotFoundError(path)
    if path.suffix.lower() in {".ppm", ".pnm"}:
        return _load_ppm(path)
    try:
        from PIL import Image  # type: ignore[import-not-found]
    except ImportError as error:
        raise ValueError("file inputs need Pillow; pass an RGB array instead") from error
    with Image.open(path) as image:
        return load_rgb(image)


def _load_ppm(path: Path) -> RGBImage:
    tokens = [token for token in path.read_bytes().split() if not token.startswith(b"#")]
    if len(tokens) < 4 or tokens[0] not in {b"P3", b"P6"}:
        raise ValueError("only P3/P6 PPM images are supported without Pillow")
    if tokens[0] == b"P6":
        raise ValueError("binary P6 PPM requires Pillow; use P3 or an RGB array")
    width, height, maximum = (int(tokens[index]) for index in range(1, 4))
    values = [int(token) for token in tokens[4:]]
    if len(values) != width * height * 3 or maximum <= 0:
        raise ValueError("invalid P3 PPM image")
    return [
        [tuple(round(values[(y * width + x) * 3 + c] * 255 / maximum) for c in range(3)) for x in range(width)]
        for y in range(height)
    ]
