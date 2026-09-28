GROUNDING_TERMS = ("where", "locate", "location", "highlight", "find", "water body", "show where", "point out")


def has_grounding_intent(query: str) -> bool:
    lowered = query.lower()
    return any(term in lowered for term in GROUNDING_TERMS)
