def build_trace(*steps: str) -> list[str]:
    """Create the ordered, JSON-safe execution trace returned by the API."""
    return list(steps)
