class BackendError(Exception):
    """Base exception for expected prototype API errors."""


class ValidationError(BackendError):
    """Raised for invalid client input."""


class ResultNotFoundError(BackendError):
    """Raised when a requested stored result does not exist."""


class SpecialistError(BackendError):
    """Raised when a specialist tool cannot complete analysis."""
