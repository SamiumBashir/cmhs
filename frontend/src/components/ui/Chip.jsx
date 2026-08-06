import { motion } from 'framer-motion'

const Chip = ({
  children,
  selected = false,
  onClick,
  color = 'primary',
  className = ''
}) => {
  const colorClasses = {
    primary: selected
      ? 'bg-primary text-white'
      : 'bg-primary/10 text-primary hover:bg-primary/20',
    secondary: selected
      ? 'bg-secondary text-white'
      : 'bg-secondary/10 text-secondary hover:bg-secondary/20',
    accent: selected
      ? 'bg-accent text-white'
      : 'bg-accent/10 text-accent hover:bg-accent/20',
    neutral: selected
      ? 'bg-gray-700 text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${colorClasses[color]} ${className}`}
    >
      {children}
    </motion.button>
  )
}

export default Chip


