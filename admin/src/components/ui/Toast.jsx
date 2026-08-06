import { motion } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

const Toast = ({
  message,
  type = 'info',
  duration: _duration = 4000,
  onClose
}) => {
  const typeConfig = {
    success: {
      bg: 'bg-green-50 border-green-200 text-green-800',
      icon: <FiCheckCircle className="text-green-500" size={20} />
    },
    error: {
      bg: 'bg-red-50 border-red-200 text-red-800',
      icon: <FiAlertCircle className="text-red-500" size={20} />
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <FiAlertCircle className="text-blue-500" size={20} />
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <FiAlertCircle className="text-amber-500" size={20} />
    }
  }

  const config = typeConfig[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bg}`}
    >
      {config.icon}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        ×
      </button>
    </motion.div>
  )
}

export default Toast


