import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiExternalLink } from 'react-icons/fi'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Login = () => {
  const [identifier, setIdentifier] = useState('admin@cmhs.edu.bd')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(identifier, password, 'admin')
      const userRole = result?.user?.role || 'admin'
      const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'https://cmhs-nine.vercel.app'

      if (userRole === 'teacher') {
        window.location.href = `${frontendUrl}/teacher`
      } else if (userRole === 'student') {
        window.location.href = `${frontendUrl}/student`
      } else if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.')
    } finally {
      setLoading(false)
    }
  }

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'https://cmhs-nine.vercel.app'

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">
          <FiShield size={28} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
        <p className="text-white/80 text-sm">Chilahati Merchants High School Management</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/90 mb-1">
            Admin Email or Username
          </label>
          <Input
            type="text"
            placeholder="admin@cmhs.edu.bd"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            icon={<FiMail className="text-gray-400" />}
            required
            className="bg-white/90 text-gray-900 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/90 mb-1">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<FiLock className="text-gray-400" />}
              required
              className="bg-white/90 text-gray-900 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-xs text-red-100"
          >
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          className="mt-2 shadow-lg"
        >
          {loading ? 'Authenticating...' : 'Sign In as Administrator'}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-white/70 mb-2">Are you a Student or Teacher?</p>
        <a
          href={`${frontendUrl}/login`}
          className="inline-flex items-center gap-1 text-xs font-medium text-white hover:text-white/90 underline"
        >
          Go to Student / Teacher Login Portal <FiExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}

export default Login
