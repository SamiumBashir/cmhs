import axios from 'axios'

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim()
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  if (backendUrl && typeof backendUrl === 'string' && backendUrl.trim() !== '') {
    const clean = backendUrl.trim().replace(/\/$/, '')
    return clean.endsWith('/api') ? clean : `${clean}/api`
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api'
  }

  // Production: always use Railway directly (Vercel static can't proxy POST requests)
  return 'https://cmhs-production.up.railway.app/api'
}


const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
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
