from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]
UPLOAD_DIR = PROJECT_ROOT / "data" / "uploads"
RESULT_DIR = PROJECT_ROOT / "outputs" / "results"
EVIDENCE_DIR = PROJECT_ROOT / "outputs" / "evidence"
SUPPORTED_SUFFIXES = {".png", ".jpg", ".jpeg", ".tif", ".tiff"}
