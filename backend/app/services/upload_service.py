from backend.app.storage.local_storage import save_upload


def store_upload(filename: str, contents: bytes) -> dict[str, object]:
    return save_upload(filename, contents)
