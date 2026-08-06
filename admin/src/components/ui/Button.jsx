import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg focus:ring-secondary',
    accent: 'bg-accent hover:bg-accent/90 text-white shadow-md hover:shadow-lg focus:ring-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red/90 text-white shadow-md hover:shadow-lg focus:ring-red-500',
    glass: 'glass bg-white/30 hover:bg-white/40 border border-white/30 text-gray-800 focus:ring-secondary'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  const Component = motion.button

  return (
    <Component
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {Icon && <span className="mr-2">{Icon}</span>}
      {children}
    </Component>
  )
}

export default Button

