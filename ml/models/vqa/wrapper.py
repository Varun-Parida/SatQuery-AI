
from __future__ import annotations

from typing import Any, Dict

import torch
from PIL import Image
from transformers import BlipForQuestionAnswering, BlipProcessor


MODEL_NAME = "Salesforce/blip-vqa-base"

_processor = None
_model = None


def _load_model():

    global _processor, _model

    if _processor is None or _model is None:
        _processor = BlipProcessor.from_pretrained(MODEL_NAME)
        _model = BlipForQuestionAnswering.from_pretrained(MODEL_NAME)
        _model.eval()

    return _processor, _model


def run_vqa(image: Any, query: str) -> Dict[str, Any]:

    if not isinstance(query, str) or not query.strip():
        raise ValueError("query must be a non-empty string")

    if not isinstance(image, Image.Image):
        image = Image.open(image).convert("RGB")
    else:
        image = image.convert("RGB")

    processor, model = _load_model()

    inputs = processor(
        images=image,
        text=query,
        return_tensors="pt",
    )

    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=30,
        )

    answer = processor.decode(
        output[0],
        skip_special_tokens=True,
    ).strip()

    return {
        "task": "vqa",
        "answer": answer,
        "confidence": 0.0,
        "evidence": {},
        "model": MODEL_NAME,
        "trace": [],
    }