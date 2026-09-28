TOOL_REGISTRY = {
    "grounding": "prototype-grounding",
    "change": "prototype-change-detection",
    "vqa": "not_implemented",
}


def model_name(task: str) -> str:
    return TOOL_REGISTRY[task]
