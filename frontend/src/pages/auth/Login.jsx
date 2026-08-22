import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield, FiBookOpen, FiUserCheck } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Login = () => {
  const [roleTab, setRoleTab] = useState('admin') // 'admin', 'teacher', 'student'
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleRoleSwitch = (tab) => {
    setRoleTab(tab)
    setError('')
    if (tab === 'admin') setIdentifier('admin@cmhs.edu.bd')
    else if (tab === 'teacher') setIdentifier('teacher@cmhs.edu.bd')
    else if (tab === 'student') setIdentifier('student@cmhs.edu.bd')
    else setIdentifier('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(identifier, password, roleTab)
      const userRole = result?.user?.role || roleTab

      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname, { replace: true })
      } else if (userRole === 'super_admin' || userRole === 'admin') {
        const adminUrl = import.meta.env.VITE_ADMIN_URL
        if (adminUrl && typeof adminUrl === 'string' && adminUrl.startsWith('http')) {
          window.location.href = adminUrl
        } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          window.location.href = 'http://localhost:5174'
        } else {
          navigate('/', { replace: true })
        }
      } else if (userRole === 'teacher') {
        navigate('/teacher', { replace: true })
      } else if (userRole === 'student') {
        navigate('/student', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg">
          CMHS
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Portal Login</h1>
        <p className="text-white/80 text-sm">Chilahati Merchants High School</p>
      </div>

      {/* Role Tabs */}
      <div className="flex bg-black/20 p-1 rounded-xl mb-6 border border-white/10">
        <button
          type="button"
          onClick={() => handleRoleSwitch('admin')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            roleTab === 'admin' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:text-white'
          }`}
        >
          <FiShield size={14} /> Admin
        </button>
        <button
          type="button"
          onClick={() => handleRoleSwitch('teacher')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            roleTab === 'teacher' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:text-white'
          }`}
        >
          <FiUserCheck size={14} /> Teacher
        </button>
        <button
          type="button"
          onClick={() => handleRoleSwitch('student')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            roleTab === 'student' ? 'bg-primary text-white shadow-md' : 'text-white/70 hover:text-white'
          }`}
        >
          <FiBookOpen size={14} /> Student
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/90 mb-1">
            {roleTab === 'admin' ? 'Email Address' : roleTab === 'teacher' ? 'Teacher ID / Email / Phone' : 'Student ID / Roll / Email'}
          </label>
          <Input
            type="text"
            placeholder={
              roleTab === 'admin' ? 'admin@cmhs.edu.bd' : roleTab === 'teacher' ? 'teacher@cmhs.edu.bd or T-101' : 'student@cmhs.edu.bd or 1001'
            }
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            icon={<FiUser className="text-gray-400" />}
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
          className="mt-2"
        >
          {loading ? 'Authenticating...' : `Login as ${roleTab.toUpperCase()}`}
        </Button>
      </form>
    </div>
  )
}

export default Login
