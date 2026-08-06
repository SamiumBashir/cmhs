import { motion } from 'framer-motion'
import { FiUsers, FiBook, FiBarChart2, FiBriefcase, FiClipboard, FiAlertCircle, FiTrendingUp, FiCalendar } from 'react-icons/fi'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { studentService, teacherService, admissionService, noticeService, eventService } from '../services'

const AdminDashboard = () => {
  const { data: students } = useQuery({
    queryKey: ['dashboard-students'],
    queryFn: () => studentService.getAll({ limit: 100 }).then(r => r.data)
  })

  const { data: teachers } = useQuery({
    queryKey: ['dashboard-teachers'],
    queryFn: () => teacherService.getAll({ limit: 100 }).then(r => r.data)
  })

  const { data: admissions } = useQuery({
    queryKey: ['dashboard-admissions'],
    queryFn: () => admissionService.getAll({ limit: 100 }).then(r => r.data)
  })

  const { data: notices } = useQuery({
    queryKey: ['dashboard-notices'],
    queryFn: () => noticeService.getAll({ limit: 5 }).then(r => r.data)
  })

  const { data: events } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: () => eventService.getAll({ limit: 5 }).then(r => r.data)
  })

  const stats = [
    { title: 'Total Students', value: students?.pagination?.total || '-', icon: <FiUsers size={28} />, color: 'primary' },
    { title: 'Total Teachers', value: teachers?.pagination?.total || '-', icon: <FiBook size={28} />, color: 'secondary' },
    { title: 'Admissions (Pending)', value: admissions?.pagination?.total || '-', icon: <FiAlertCircle size={28} />, color: 'accent' },
    { title: 'Total Staff', value: '-', icon: <FiBriefcase size={28} />, color: 'primary' },
    { title: 'Notices', value: notices?.pagination?.total || '-', icon: <FiClipboard size={28} />, color: 'secondary' },
    { title: 'Events', value: events?.pagination?.total || '-', icon: <FiCalendar size={28} />, color: 'accent' }
  ]

  const recentNotices = notices?.data?.slice(0, 5) || []
  const upcomingEvents = events?.data?.slice(0, 3).filter(e => new Date(e.date) >= new Date()) || []

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900"
      >
        Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card title="Recent Notices" glass>
            <div className="space-y-3">
              {recentNotices.map((notice) => (
                <div key={notice._id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900">{notice.title?.en || notice.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                    {notice.content?.en || ''}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card title="Upcoming Events" glass>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900">{event.title?.en || event.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(event.date).toLocaleDateString()} | {event.startTime} - {event.endTime}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard



