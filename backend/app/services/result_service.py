from backend.app.storage.local_storage import get_result, save_result


def store_result(result: dict[str, object]) -> str:
    return save_result(result)


def fetch_result(result_id: str) -> dict[str, object]:
    return get_result(result_id)
