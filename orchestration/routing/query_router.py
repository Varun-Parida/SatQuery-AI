from orchestration.routing.query_analyzer import has_grounding_intent


def route_query(image_count: int, query: str) -> str:
    """Deterministically choose the prototype specialist task."""
    if image_count == 2:
        return "change"
    if image_count == 1 and has_grounding_intent(query):
        return "grounding"
    return "vqa"
