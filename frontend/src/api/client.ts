import axios from 'axios'

/** FastAPI backend base URL (routes are served at the root: /upload, /analyze, /result/{id}). */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')

/** Explicit mode switch: only VITE_USE_MOCK_API=true uses the mock service. */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('sat_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('sat_token')
    }
    return Promise.reject(error)
  }
)

export default apiClient
