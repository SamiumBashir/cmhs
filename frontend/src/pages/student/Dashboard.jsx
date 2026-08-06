import { motion } from 'framer-motion'
import { FiBook, FiCalendar, FiTrendingUp, FiClipboard, FiBell, FiFileText } from 'react-icons/fi'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { resultService, routineService, noticeService, attendanceService } from '../../services'

const StudentDashboard = () => {
  const studentId = 'student-001'

  const { data: results } = useQuery({
    queryKey: ['student-results'],
    queryFn: () => resultService.getByStudent(studentId).then(r => r.data)
  })

  const { data: routines } = useQuery({
    queryKey: ['student-routine'],
    queryFn: () => routineService.getAll({ limit: 20 }).then(r => r.data)
  })

  const { data: notices } = useQuery({
    queryKey: ['student-notices'],
    queryFn: () => noticeService.getAll({ limit: 5 }).then(r => r.data)
  })

  const { data: attendance } = useQuery({
    queryKey: ['student-attendance'],
    queryFn: () => attendanceService.getAll({ studentId, limit: 30 }).then(r => r.data)
  })

  const attendanceRecords = attendance?.data || []
  const totalDays = attendanceRecords.length
  const presentDays = attendanceRecords.filter(a => a.status === 'present').length
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  const recentResults = results?.slice(0, 3) || []
  const todayRoutine = routines?.data?.filter(r => r.day === 'monday').slice(0, 5) || []
  const recentNotices = notices?.data || []

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, John Doe!</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Attendance" value={`${attendancePercentage}%`} icon={<FiCalendar size={24} />} color="primary" />
        <StatCard title="Exams Taken" value={recentResults.length} icon={<FiBook size={24} />} color="secondary" />
        <StatCard title="Unread Notices" value={recentNotices.length} icon={<FiBell size={24} />} color="accent" />
        <StatCard title="Total Results" value={results?.length || 0} icon={<FiTrendingUp size={24} />} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Today's Routine" glass>
          <div className="space-y-3">
            {todayRoutine.length > 0 ? todayRoutine.map((r, i) => (
              <div key={r._id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {r.period}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{r.subject}</p>
                    <p className="text-sm text-gray-500">{r.startTime} - {r.endTime}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{r.room || '—'}</span>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No classes today</p>
            )}
          </div>
        </Card>

        <Card title="Recent Results" glass>
          <div className="space-y-3">
            {recentResults.length > 0 ? recentResults.map((result, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{result.subject}</p>
                  <p className="text-sm text-gray-500">{result.exam}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{result.marksObtained}/{result.fullMarks}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${result.grade === 'A+' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {result.grade}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No results available yet</p>
            )}
          </div>
        </Card>
      </div>

      <Card title="Latest Notices" glass>
        <div className="space-y-3">
          {recentNotices.map((notice) => (
            <div key={notice._id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{notice.title?.en || notice.title}</h4>
                <span className="text-xs text-gray-400">
                  {new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {notice.content?.en || ''}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default StudentDashboard



