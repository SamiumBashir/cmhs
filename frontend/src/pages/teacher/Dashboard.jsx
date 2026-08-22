import { motion } from 'framer-motion'
import { FiUsers, FiBriefcase, FiCalendar, FiBarChart2, FiBell, FiBook, FiClock, FiCheckCircle } from 'react-icons/fi'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { noticeService, routineService } from '../../services'
import { useAuth } from '../../context/AuthContext'

const TeacherDashboard = () => {
  const { user } = useAuth()

  const { data: notices } = useQuery({
    queryKey: ['teacher-notices'],
    queryFn: () => noticeService.getAll({ limit: 5 }).then(r => r.data),
    retry: 1
  })

  const { data: routines } = useQuery({
    queryKey: ['teacher-routines'],
    queryFn: () => routineService.getAll({ limit: 20 }).then(r => r.data),
    retry: 1
  })

  const recentNotices = notices?.data || []
  const allRoutines = routines?.data || []

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayName = days[new Date().getDay()].toLowerCase()
  const todayClasses = allRoutines.filter(r =>
    r.day?.toLowerCase() === todayName || r.day?.toLowerCase() === 'monday'
  ).slice(0, 5)

  const userName = user?.name?.en || user?.name || 'Teacher'
  const teacherId = user?.teacherId || user?.staffId || '—'

  const quickStats = [
    {
      title: 'Today\'s Classes',
      value: todayClasses.length || 0,
      icon: <FiCalendar size={24} />,
      color: 'primary'
    },
    {
      title: 'Total Routines',
      value: allRoutines.length || 0,
      icon: <FiBriefcase size={24} />,
      color: 'secondary'
    },
    {
      title: 'Notices',
      value: recentNotices.length || 0,
      icon: <FiBell size={24} />,
      color: 'accent'
    },
    {
      title: 'Teacher ID',
      value: teacherId,
      icon: <FiUsers size={24} />,
      color: 'primary'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
            <p className="text-white/80 text-sm mt-0.5">
              Teacher Portal • {new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card title="Today's Schedule" glass>
          <div className="space-y-3">
            {todayClasses.length > 0 ? todayClasses.map((r, i) => (
              <div key={r._id || i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {r.period || i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{r.subject || 'Subject'}</p>
                  <p className="text-xs text-gray-500">{r.class || r.className || 'Class'} • {r.startTime || '—'} - {r.endTime || '—'}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FiClock size={12} />
                  <span>{r.room || 'Room—'}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <FiCalendar size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No classes scheduled today</p>
                <p className="text-gray-400 text-xs mt-1">Enjoy your free day!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Notices */}
        <Card title="Recent Notices" glass>
          <div className="space-y-3">
            {recentNotices.length > 0 ? recentNotices.map((notice) => (
              <div key={notice._id} className="p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {notice.title?.en || notice.title || 'Notice'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notice.content?.en || notice.description || ''}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                    {new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <FiBell size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No notices yet</p>
                <p className="text-gray-400 text-xs mt-1">New notices will appear here</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" glass>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'My Classes', icon: <FiBook size={20} />, path: '/teacher/classes', color: 'bg-blue-50 text-blue-600' },
            { label: 'Attendance', icon: <FiCheckCircle size={20} />, path: '/teacher/attendance', color: 'bg-green-50 text-green-600' },
            { label: 'Routine', icon: <FiCalendar size={20} />, path: '/teacher/routine', color: 'bg-purple-50 text-purple-600' },
            { label: 'Students', icon: <FiUsers size={20} />, path: '/teacher/students', color: 'bg-orange-50 text-orange-600' }
          ].map((action) => (
            <a
              key={action.label}
              href={action.path}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} hover:shadow-md transition-all group`}
            >
              <div className="group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <span className="text-xs font-semibold">{action.label}</span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default TeacherDashboard
