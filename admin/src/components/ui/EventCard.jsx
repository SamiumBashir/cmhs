import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'

const EventCard = ({ event, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className="glass card cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white text-4xl font-bold">{event.title?.en?.[0] || '?'}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FiCalendar size={16} />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock size={16} />
            <span>{event.startTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiMapPin size={16} />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EventCard


