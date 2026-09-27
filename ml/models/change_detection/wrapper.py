"""Dependency-free bi-temporal change detection for prepared RGB image pairs."""

from __future__ import annotations

from typing import Any, Dict, List

from ml.utils.image_arrays import dimensions, load_rgb


def run_change_detection(before_image: Any, after_image: Any) -> Dict[str, Any]:
    """Detect substantial pixel changes in co-registered before/after RGB images.

    The returned ``change_map`` is a JSON-safe binary greyscale image: ``255``
    marks changed pixels and ``0`` marks unchanged pixels.
    """
    before = load_rgb(before_image)
    after = load_rgb(after_image)
    if dimensions(before) != dimensions(after):
        raise ValueError("before and after images must have identical dimensions and be co-registered")
    width, height = dimensions(before)
    mask = [
        [_pixel_difference(before[y][x], after[y][x]) >= 60 for x in range(width)]
        for y in range(height)
    ]
    components = _components(mask)
    minimum_area = max(4, (width * height) // 1000)
    regions = [region for region in components if region["area"] >= minimum_area]
    regions.sort(key=lambda region: region["area"], reverse=True)
    change_regions: List[Dict[str, int]] = [
        {"x": region["x"], "y": region["y"], "width": region["width"], "height": region["height"]}
        for region in regions
    ]
    kept = {(x, y) for region in regions for x, y in region["points"]}
    change_map = [[255 if (x, y) in kept else 0 for x in range(width)] for y in range(height)]
    changed_fraction = len(kept) / (width * height)
    confidence = round(min(0.95, 0.55 + changed_fraction * 3.0), 3) if kept else 0.0
    return {"changed": bool(change_regions), "change_regions": change_regions,
            "confidence": confidence, "change_map": change_map}


def _pixel_difference(before: tuple[int, int, int], after: tuple[int, int, int]) -> float:
    return sum(abs(left - right) for left, right in zip(before, after)) / 3.0


def _components(mask: List[List[bool]]) -> List[Dict[str, Any]]:
    height, width = len(mask), len(mask[0])
    seen = [[False] * width for _ in range(height)]
    regions: List[Dict[str, Any]] = []
    for start_y in range(height):
        for start_x in range(width):
            if seen[start_y][start_x] or not mask[start_y][start_x]:
                continue
            stack, points = [(start_x, start_y)], []
            seen[start_y][start_x] = True
            while stack:
                x, y = stack.pop()
                points.append((x, y))
                for next_x, next_y in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= next_x < width and 0 <= next_y < height and mask[next_y][next_x] and not seen[next_y][next_x]:
                        seen[next_y][next_x] = True
                        stack.append((next_x, next_y))
            xs, ys = zip(*points)
            regions.append({"x": min(xs), "y": min(ys), "width": max(xs) - min(xs) + 1,
                            "height": max(ys) - min(ys) + 1, "area": len(points), "points": points})
    return regions
