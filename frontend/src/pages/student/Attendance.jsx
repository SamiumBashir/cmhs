import { motion } from 'framer-motion'
import { FiCalendar } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { useQuery } from '@tanstack/react-query'
import { attendanceService } from '../../services'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const StudentAttendance = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['student-attendance'],
    queryFn: () => attendanceService.getAll({ studentId: 'student-001', limit: 100 }).then(r => r.data)
  })

  const records = data?.data || []
  const totalDays = records.length
  const presentDays = records.filter(r => r.status === 'present').length
  const absentDays = records.filter(r => r.status === 'absent').length
  const lateDays = records.filter(r => r.status === 'late').length
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0


  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-600 mt-1">Class 10, Section A</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-primary">{percentage}%</div>
          <p className="text-sm text-gray-500 mt-1">Overall Attendance</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-green-600">{presentDays}</div>
          <p className="text-sm text-gray-500 mt-1">Present</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-red-600">{absentDays}</div>
          <p className="text-sm text-gray-500 mt-1">Absent</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-amber-600">{lateDays}</div>
          <p className="text-sm text-gray-500 mt-1">Late</p>
        </Card>
      </div>

      <Card title="Attendance Records" glass>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id} className="border-b border-gray-100">
                    <td className="px-6 py-4 text-sm">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={record.status === 'present' ? 'success' : record.status === 'absent' ? 'danger' : record.status === 'late' ? 'warning' : 'info'}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default StudentAttendance


