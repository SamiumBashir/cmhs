import { motion } from 'framer-motion'

const Timeline = ({ events = [] }) => {
  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
      <div className="space-y-6">
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-4"
          >
            <div className="absolute left-2.5 top-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center z-10">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <div className="ml-10">
              <time className="text-sm font-medium text-gray-500">{event.date}</time>
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <p className="text-gray-600 mt-1">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Timeline

