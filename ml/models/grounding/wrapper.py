"""Prototype visual grounding for visible water bodies.

This intentionally lightweight adapter finds blue-dominant water-like pixels in
RGB satellite imagery.  It provides a deterministic, demo-safe path until a
remote-sensing grounding model is selected and downloaded.
"""

from __future__ import annotations

from typing import Any, Dict, List

from ml.utils.image_arrays import dimensions, load_rgb


def run_grounding(image: Any, query: str) -> Dict[str, Any]:
    """Return water-body bounding boxes for water-oriented natural-language queries.

    Unsupported concepts return no evidence instead of guessing. Coordinates use
    top-left origin and ``width``/``height`` pixel dimensions.
    """
    if not isinstance(query, str) or not query.strip():
        raise ValueError("query must be a non-empty string")
    if not _is_water_query(query):
        return {"boxes": [], "confidence": 0.0}

    rgb = load_rgb(image)
    width, height = dimensions(rgb)
    mask = [[_is_water_pixel(*rgb[y][x]) for x in range(width)] for y in range(height)]
    components = _components(mask)
    minimum_area = max(4, (width * height) // 500)
    regions = [region for region in components if region["area"] >= minimum_area]
    regions.sort(key=lambda region: region["area"], reverse=True)
    boxes: List[Dict[str, int]] = [
        {"x": region["x"], "y": region["y"], "width": region["width"], "height": region["height"]}
        for region in regions
    ]
    covered = sum(region["area"] for region in regions) / (width * height)
    confidence = round(min(0.95, 0.5 + covered * 2.0), 3) if boxes else 0.0
    return {"boxes": boxes, "confidence": confidence}


def _is_water_query(query: str) -> bool:
    lowered = query.lower()
    return any(term in lowered for term in ("water", "river", "lake", "pond", "reservoir"))


def _is_water_pixel(red: int, green: int, blue: int) -> bool:
    return blue >= 70 and blue > red * 1.25 and blue > green * 1.10


def _components(mask: List[List[bool]]) -> List[Dict[str, int]]:
    height, width = len(mask), len(mask[0])
    seen = [[False] * width for _ in range(height)]
    regions: List[Dict[str, int]] = []
    for start_y in range(height):
        for start_x in range(width):
            if seen[start_y][start_x] or not mask[start_y][start_x]:
                continue
            stack = [(start_x, start_y)]
            seen[start_y][start_x] = True
            points = []
            while stack:
                x, y = stack.pop()
                points.append((x, y))
                for next_x, next_y in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= next_x < width and 0 <= next_y < height and mask[next_y][next_x] and not seen[next_y][next_x]:
                        seen[next_y][next_x] = True
                        stack.append((next_x, next_y))
            xs, ys = zip(*points)
            regions.append({"x": min(xs), "y": min(ys), "width": max(xs) - min(xs) + 1,
                            "height": max(ys) - min(ys) + 1, "area": len(points)})
    return regions
