import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
    }
    setLoading(false)
  }, [])

  const login = async (identifier, password, role) => {
    const response = await api.post('/auth/login', {
      email: identifier,
      identifier,
      password,
      role
    })
    const { token: newToken, user: userData } = response.data.data

    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`

    setToken(newToken)
    setUser(userData)
    setIsAuthenticated(true)
    return { token: newToken, user: userData }
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common.Authorization
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh')
      const { token: newToken } = response.data.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`
      return newToken
    } catch (error) {
      logout()
      throw error
    }
  }, [logout])

  const hasRole = useCallback((roles) => {
    if (!user) return false
    if (typeof roles === 'string') return user.role === roles
    return roles.includes(user.role)
  }, [user])

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    hasRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
