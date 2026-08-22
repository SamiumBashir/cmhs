import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

const RequireAuth = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-600 mb-4">Your account role ({user?.role || 'user'}) does not have permission to access the Admin Panel.</p>
        <button
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
        >
          Sign In with Admin Account
        </button>
      </div>
    )
  }

  return <Outlet />
}

export default RequireAuth


