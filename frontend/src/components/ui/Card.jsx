import { motion } from 'framer-motion'

const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  hover = false,
  glass = false,
  className = '',
  ...props
}) => {
  const cardClass = glass
    ? 'glass bg-white/70 backdrop-blur-lg border border-white/20'
    : 'bg-white border border-gray-100 shadow-sm'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${cardClass} rounded-xl overflow-hidden ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle || Icon || action) && (
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && <div className="text-primary text-2xl">{Icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

export default Card


