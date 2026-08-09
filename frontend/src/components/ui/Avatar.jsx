import { motion } from 'framer-motion'
import { FiUser } from 'react-icons/fi'
import { getImageUrl } from '../../utils/image'

const Avatar = ({
  src,
  name,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const getInitials = (name) => {
    if (!name) return ''
    const parts = name.split(' ')
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase()
  }

  if (src) {
    return (
      <img
        src={getImageUrl(src)}
        alt={name || 'Avatar'}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <motion.div
      className={`rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold ${sizeClasses[size]} ${className}`}
    >
      {name ? getInitials(name) : <FiUser size={24} />}
    </motion.div>
  )
}

export default Avatar


