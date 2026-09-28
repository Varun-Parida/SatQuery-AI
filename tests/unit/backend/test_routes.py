from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.storage import local_storage


DEMO = Path("data/demo")


def _client_with_local_storage(monkeypatch, tmp_path):
    monkeypatch.setattr(local_storage, "UPLOAD_DIR", tmp_path / "uploads")
    monkeypatch.setattr(local_storage, "RESULT_DIR", tmp_path / "results")
    monkeypatch.setattr(local_storage, "EVIDENCE_DIR", tmp_path / "evidence")
    monkeypatch.setattr(local_storage, "PROJECT_ROOT", tmp_path)
    return TestClient(app)


def _upload(client, filename):
    with (DEMO / filename).open("rb") as handle:
        response = client.post("/upload", files={"file": (filename, handle, "image/png")})
    assert response.status_code == 201
    return response.json()["id"]


def test_health():
    response = TestClient(app).get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_grounding_analyze_and_result_lookup(monkeypatch, tmp_path):
    client = _client_with_local_storage(monkeypatch, tmp_path)
    image_id = _upload(client, "water_test.png")
    response = client.post("/analyze", json={"image_ids": [image_id], "query": "Where is the water body?"})
    assert response.status_code == 200
    result = response.json()
    assert result["task"] == "grounding"
    assert "boxes" in result["evidence"]
    assert client.get(f"/result/{result['id']}").json() == result


def test_change_and_vqa_placeholder(monkeypatch, tmp_path):
    client = _client_with_local_storage(monkeypatch, tmp_path)
    before_id, after_id = _upload(client, "before.png"), _upload(client, "after.png")
    change = client.post("/analyze", json={"image_ids": [before_id, after_id], "query": "What changed?"})
    assert change.status_code == 200
    assert change.json()["task"] == "change"
    assert "change_map" in change.json()["evidence"]
    after2_id = _upload(client, "after2.png")
    alternate_change = client.post("/analyze", json={"image_ids": [before_id, after2_id], "query": "What changed?"})
    assert alternate_change.status_code == 200
    assert alternate_change.json()["task"] == "change"
    vqa = client.post("/analyze", json={"image_ids": [before_id], "query": "What is visible?"})
    assert vqa.status_code == 200
    assert vqa.json()["model"] == "not_implemented"


def test_invalid_and_mismatched_requests(monkeypatch, tmp_path):
    client = _client_with_local_storage(monkeypatch, tmp_path)
    before_id, water_id = _upload(client, "before.png"), _upload(client, "water_test.png")
    assert client.post("/analyze", json={"image_ids": [before_id], "query": "   "}).status_code == 400
    mismatch = client.post("/analyze", json={"image_ids": [before_id, water_id], "query": "What changed?"})
    assert mismatch.status_code == 400
