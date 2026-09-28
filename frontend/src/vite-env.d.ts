/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK_API: string
  readonly VITE_MAP_TILE_URL: string
  readonly VITE_MAX_FILE_SIZE_MB: string
  readonly VITE_SUPPORTED_FORMATS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
