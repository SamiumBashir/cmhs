import { motion } from 'framer-motion'

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'positive',
  color = 'primary',
  loading = false
}) => {
  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-green-500',
    danger: 'text-red-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass card p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-1" />
          ) : (
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          )}
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`text-3xl ${colorMap[color]}`}>
            {Icon}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard


