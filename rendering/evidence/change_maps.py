from pathlib import Path
from typing import Sequence

from PIL import Image


def save_change_map_png(change_map: Sequence[Sequence[int]], destination: Path) -> None:
    """Write the existing 0/255 change mask as an 8-bit greyscale PNG."""
    if not change_map or not change_map[0]:
        raise ValueError("change map must be a non-empty rectangular matrix")
    width = len(change_map[0])
    if any(len(row) != width for row in change_map):
        raise ValueError("change map must be rectangular")
    image = Image.new("L", (width, len(change_map)))
    image.putdata([value for row in change_map for value in row])
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, format="PNG")
