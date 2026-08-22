import axios from 'axios'

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '')
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  if (backendUrl && typeof backendUrl === 'string' && backendUrl.trim() !== '') {
    const clean = backendUrl.trim().replace(/\/$/, '')
    return clean.endsWith('/api') ? clean : `${clean}/api`
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api'
  }

  // Fallback to relative /api for same-origin proxy or direct backend
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: true
})

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 with automatic token refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const storedRefreshToken = localStorage.getItem('refreshToken')

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        )

        const { token: newToken, refreshToken: newRefreshToken, user } = res.data.data
        if (newToken) {
          localStorage.setItem('token', newToken)
          if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken)
          if (user) localStorage.setItem('user', JSON.stringify(user))

          api.defaults.headers.common.Authorization = `Bearer ${newToken}`
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          processQueue(null, newToken)
          return api(originalRequest)
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    let message = error.response?.data?.message

    if (!message) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        message = 'Unable to connect to the backend server. Please check your network connection or verify the backend service is active.'
      } else {
        message = error.message || 'Something went wrong'
      }
    }

    return Promise.reject(new Error(message))
  }
)

export default api
