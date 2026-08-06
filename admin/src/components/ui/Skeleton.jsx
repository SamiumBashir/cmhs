import { motion } from 'framer-motion'

const Skeleton = ({ className = '', count = 1 }) => {
  const skeletons = Array.from({ length: count })

  return (
    <>
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg ${className}`}
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  )
}

export default Skeleton


