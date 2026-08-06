import { useState } from 'react'
import { FiUsers, FiCalendar, FiClock, FiChevronRight } from 'react-icons/fi'
import Card from '../../components/ui/Card'

const mockClasses = [
  { id: 1, name: 'Class 10', section: 'A', subject: 'Mathematics', students: 35, room: 'Room 101' },
  { id: 2, name: 'Class 9', section: 'B', subject: 'Mathematics', students: 28, room: 'Room 102' },
  { id: 3, name: 'Class 8', section: 'A', subject: 'Mathematics', students: 42, room: 'Room 103' }
]

const todaySchedule = [
  { period: 1, subject: 'Mathematics', class: 'Class 10-A', startTime: '08:00', endTime: '08:45', room: 'Room 101' },
  { period: 2, subject: 'Mathematics', class: 'Class 9-B', startTime: '08:45', endTime: '09:30', room: 'Room 102' },
  { period: 4, subject: 'Mathematics', class: 'Class 8-A', startTime: '10:30', endTime: '11:15', room: 'Room 103' }
]

const TeacherClasses = () => {
  const [_selectedClass, _setSelectedClass] = useState(null)

  const handleClassClick = (cls) => {
    _setSelectedClass(cls)
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Section</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Subject</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Students</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Room</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockClasses.map((cls) => (
                <tr key={cls.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium">{cls.name}</td>
                  <td className="px-6 py-4">{cls.section}</td>
                  <td className="px-6 py-4">{cls.subject}</td>
                  <td className="px-6 py-4 text-center">{cls.students}</td>
                  <td className="px-6 py-4 text-center">{cls.room}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleClassClick(cls)}
                      className="text-primary hover:bg-gray-100 p-1 rounded"
                      title="View Details"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Today's Schedule" glass>
        <div className="space-y-3">
          {todaySchedule.map((item) => (
            <div key={item.period} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                {item.period}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.subject}</h4>
                <p className="text-sm text-gray-500">{item.class} • {item.room}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                {item.startTime} - {item.endTime}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default TeacherClasses


