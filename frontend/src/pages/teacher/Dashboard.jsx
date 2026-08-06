import { motion } from 'framer-motion'
import { FiUsers, FiBriefcase, FiCalendar, FiBarChart2 } from 'react-icons/fi'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'

const TeacherDashboard = () => {
  const mockClasses = [
    { id: 1, name: 'Class 10', section: 'A', subject: 'Mathematics', students: 35 },
    { id: 2, name: 'Class 9', section: 'B', subject: 'Mathematics', students: 28 },
    { id: 3, name: 'Class 8', section: 'A', subject: 'Mathematics', students: 42 }
  ]

  const mockNotices = [
    { _id: 1, title: { en: 'Exam Schedule Updated' }, category: 'exam', date: '2024-01-15' },
    { _id: 2, title: { en: 'Holiday Notice' }, category: 'holiday', date: '2024-01-10' }
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Mr. Smith!</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="My Classes" value={mockClasses.length} icon={<FiBriefcase size={24} />} color="primary" />
        <StatCard title="Total Students" value={mockClasses.reduce((s, c) => s + c.students, 0)} icon={<FiUsers size={24} />} color="secondary" />
        <StatCard title="Today's Classes" value={3} icon={<FiCalendar size={24} />} color="accent" />
        <StatCard title="Notices" value={mockNotices.length} icon={<FiBarChart2 size={24} />} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="My Classes" glass>
          <div className="space-y-3">
            {mockClasses.map((cls) => (
              <div key={cls.id} className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cls.name}, Section {cls.section}</h3>
                    <p className="text-sm text-gray-500">{cls.subject}</p>
                  </div>
                  <span className="text-sm text-gray-600">{cls.students} students</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Notices" glass>
          <div className="space-y-3">
            {mockNotices.map((notice) => (
              <div key={notice._id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-900">{notice.title.en}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(notice.date).toLocaleDateString()} • {notice.category}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TeacherDashboard



