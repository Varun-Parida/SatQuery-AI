/**
 * API barrel export.
 * Mode is chosen explicitly by VITE_USE_MOCK_API (see ./client.ts):
 *   true  → mockApi (simulated responses)
 *   false → real FastAPI backend (never falls back to mock on failure)
 */
export { mockApi } from './mock/mockService'
export * from './analysis'
export * from './upload'
export * from './history'
export * from './adapters'
export { default as apiClient, API_BASE_URL, USE_MOCK_API } from './client'
