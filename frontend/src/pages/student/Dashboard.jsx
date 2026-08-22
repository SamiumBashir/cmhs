import { motion } from 'framer-motion'
import { FiBook, FiCalendar, FiTrendingUp, FiBell, FiFileText, FiAward, FiClock, FiBarChart2 } from 'react-icons/fi'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { resultService, routineService, noticeService, attendanceService } from '../../services'
import { useAuth } from '../../context/AuthContext'

const StudentDashboard = () => {
  const { user } = useAuth()

  const studentId = user?.studentId || user?._id || 'student-001'

  const { data: results } = useQuery({
    queryKey: ['student-results', studentId],
    queryFn: () => resultService.getByStudent(studentId).then(r => r.data),
    retry: 1
  })

  const { data: routines } = useQuery({
    queryKey: ['student-routine'],
    queryFn: () => routineService.getAll({ limit: 20 }).then(r => r.data),
    retry: 1
  })

  const { data: notices } = useQuery({
    queryKey: ['student-notices'],
    queryFn: () => noticeService.getAll({ limit: 5 }).then(r => r.data),
    retry: 1
  })

  const { data: attendance } = useQuery({
    queryKey: ['student-attendance', studentId],
    queryFn: () => attendanceService.getAll({ studentId, limit: 30 }).then(r => r.data),
    retry: 1
  })

  const attendanceRecords = attendance?.data || []
  const totalDays = attendanceRecords.length
  const presentDays = attendanceRecords.filter(a => a.status === 'present').length
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  const recentResults = Array.isArray(results) ? results.slice(0, 3) : (results?.data?.slice(0, 3) || [])

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayName = days[new Date().getDay()].toLowerCase()
  const allRoutines = routines?.data || []
  const todayRoutine = allRoutines.filter(r =>
    r.day?.toLowerCase() === todayName || r.day?.toLowerCase() === 'monday'
  ).slice(0, 5)

  const recentNotices = notices?.data || []

  const userName = user?.name?.en || user?.name || 'Student'
  const rollNumber = user?.rollNumber || user?.studentId || '—'
  const className = user?.class || user?.className || '—'

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-secondary to-primary rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
            <p className="text-white/80 text-sm mt-0.5">
              Student Portal
              {rollNumber !== '—' && ` • Roll: ${rollNumber}`}
              {className !== '—' && ` • Class: ${className}`}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-white/70 text-xs">Today</p>
            <p className="text-white font-semibold text-sm">
              {new Date().toLocaleDateString('en-BD', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Attendance',
            value: totalDays > 0 ? `${attendancePercentage}%` : '—',
            icon: <FiCalendar size={24} />,
            color: attendancePercentage >= 75 ? 'success' : 'danger'
          },
          {
            title: 'Exams Taken',
            value: recentResults.length || 0,
            icon: <FiBook size={24} />,
            color: 'primary'
          },
          {
            title: 'Notices',
            value: recentNotices.length || 0,
            icon: <FiBell size={24} />,
            color: 'accent'
          },
          {
            title: 'Total Results',
            value: Array.isArray(results) ? results.length : (results?.total || 0),
            icon: <FiTrendingUp size={24} />,
            color: 'secondary'
          }
        ].map((stat, i) => (
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Routine */}
        <Card title="Today's Routine" glass>
          <div className="space-y-3">
            {todayRoutine.length > 0 ? todayRoutine.map((r, i) => (
              <div key={r._id || i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-secondary/5 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {r.period || i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{r.subject || 'Subject'}</p>
                  <p className="text-xs text-gray-500">{r.teacherName || r.teacher || 'Teacher'} • {r.startTime || '—'}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <FiClock size={11} />
                  <span>{r.room || '—'}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <FiCalendar size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No classes today</p>
                <p className="text-gray-400 text-xs mt-1">Enjoy your day off!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Results */}
        <Card title="Recent Results" glass>
          <div className="space-y-3">
            {recentResults.length > 0 ? recentResults.map((result, i) => (
              <div key={result._id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FiAward size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{result.subject || 'Subject'}</p>
                    <p className="text-xs text-gray-500">{result.exam || result.examName || 'Exam'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{result.marksObtained ?? '—'}/{result.fullMarks ?? '—'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    result.grade === 'A+' ? 'bg-green-100 text-green-700' :
                    result.grade === 'A' ? 'bg-blue-100 text-blue-700' :
                    result.grade === 'B' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {result.grade || '—'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <FiBarChart2 size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No results yet</p>
                <p className="text-gray-400 text-xs mt-1">Results will appear after exams</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Notices */}
      <Card title="Latest Notices" glass>
        {recentNotices.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentNotices.map((notice) => (
              <div key={notice._id} className="py-3 first:pt-0 last:pb-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                    {notice.title?.en || notice.title || 'Notice'}
                  </h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                  {notice.content?.en || notice.description || ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <FiBell size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No notices available</p>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" glass>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'My Routine', icon: <FiCalendar size={20} />, path: '/student/routine', color: 'bg-blue-50 text-blue-600' },
            { label: 'Results', icon: <FiTrendingUp size={20} />, path: '/student/results', color: 'bg-green-50 text-green-600' },
            { label: 'Attendance', icon: <FiFileText size={20} />, path: '/student/attendance', color: 'bg-purple-50 text-purple-600' },
            { label: 'Notices', icon: <FiBell size={20} />, path: '/student/notices', color: 'bg-orange-50 text-orange-600' }
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

export default StudentDashboard
