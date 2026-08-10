import axios from 'axios'

const DEFAULT_RAILWAY_URL = 'https://cmhs-production.up.railway.app/api'

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.startsWith('/')) {
    return import.meta.env.VITE_API_URL
  }
  if (import.meta.env.PROD) {
    return DEFAULT_RAILWAY_URL
  }
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
})

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = error.response?.data?.message

    if (!message) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        message = 'Unable to connect to the backend server. Please check your network connection or verify the backend service is active.'
      } else {
        message = error.message || 'Something went wrong'
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(new Error(message))
  }
)

export default api
