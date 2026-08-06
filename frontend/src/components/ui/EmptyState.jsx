import { motion } from 'framer-motion'

const EmptyState = ({
  title = 'No data found',
  description = 'There\'s nothing to show here yet.',
  icon: Icon,
  action
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 text-6xl mb-4"
        >
          {Icon}
        </motion.div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4 max-w-md">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  )
}

export default EmptyState


