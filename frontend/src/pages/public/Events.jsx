import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import { useQuery } from '@tanstack/react-query'
import { eventService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const Events = () => {
  const { language } = useLanguage()
  const [selectedEvent, setSelectedEvent] = useState(null)

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getAll({ limit: 20 }).then(r => r.data.data)
  })

  const getTitle = (e) => language === 'bn' ? (e?.title?.bn || e?.title?.en || e?.title) : (e?.title?.en || e?.title?.bn || e?.title)
  const getDesc = (e) => language === 'bn' ? (e?.description?.bn || e?.description?.en || e?.description) : (e?.description?.en || e?.description?.bn || e?.description)
  const getLoc = (e) => language === 'bn' ? (e?.location?.bn || e?.location?.en || e?.location) : (e?.location?.en || e?.location?.bn || e?.location)

  const upcomingEvents = (events || []).filter(e => new Date(e.date) >= new Date())
  const pastEvents = (events || []).filter(e => new Date(e.date) < new Date())

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{language === 'bn' ? 'ইভেন্টসমূহ' : 'Events'}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest events and activities at Chilahati Merchants High School.
          </p>
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">{language === 'bn' ? 'আসন্ন ইভেন্টসমূহ' : 'Upcoming Events'}</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden" hover>
                  <div className="relative h-48">
                    {event.image ? (
                      <img src={event.image} alt={getTitle(event)} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">{getTitle(event)?.[0] || '?'}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white text-xs font-semibold rounded-full text-gray-800 shadow">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{getTitle(event)}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {getDesc(event)}
                    </p>
                    {event.startTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <FiClock size={14} />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                    )}
                    {getLoc(event) && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiMapPin size={14} />
                        <span>{getLoc(event)}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center mb-12">
            <p className="text-gray-500">No upcoming events.</p>
          </Card>
        )}

        {pastEvents.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{language === 'bn' ? 'পূর্ববর্তী ইভেন্টসমূহ' : 'Past Events'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event._id} className="p-4 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FiCalendar className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{getTitle(event)}</h3>
                      <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} showClose title={getTitle(selectedEvent)}>
        {selectedEvent && (
          <div className="space-y-4">
            {selectedEvent.image && (
              <img src={selectedEvent.image} alt={getTitle(selectedEvent)} className="w-full h-64 object-cover rounded-lg" />
            )}
            <p className="text-gray-700">{getDesc(selectedEvent)}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FiClock size={16} /> <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
              </div>
              {getLoc(selectedEvent) && (
                <div className="flex items-center gap-2">
                  <FiMapPin size={16} /> <span>{getLoc(selectedEvent)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

export default Events
