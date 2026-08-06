import { useState } from 'react'
import { FiSave } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const classStudents = [
  { id: 's1', name: 'Alice Ahmed', roll: 1, status: 'present' },
  { id: 's2', name: 'Bob Karim', roll: 2, status: 'present' },
  { id: 's3', name: 'Charlie Hossain', roll: 3, status: 'absent' },
  { id: 's4', name: 'Diana Begum', roll: 4, status: 'present' },
  { id: 's5', name: 'Ehsan Ali', roll: 5, status: 'late' }
]

const TeacherAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('Class 10-A')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})

  const markAttendance = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const saveAttendance = () => {
    console.log('Saving attendance:', { selectedClass, selectedDate, attendance })
  }

  const statusButtons = [
    { value: 'present', label: 'Present', color: 'bg-green-500' },
    { value: 'absent', label: 'Absent', color: 'bg-red-500' },
    { value: 'late', label: 'Late', color: 'bg-amber-500' },
    { value: 'excused', label: 'Excused', color: 'bg-blue-500' }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Take Attendance</h1>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option>Class 10-A</option>
              <option>Class 9-B</option>
              <option>Class 8-A</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-end">
            <Button variant="primary" icon={<FiSave />} onClick={saveAttendance}>
              Save Attendance
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Roll</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium">{student.roll}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {statusButtons.map((btn) => (
                        <button
                          key={btn.value}
                          onClick={() => markAttendance(student.id, btn.value)}
                          className={`px-3 py-1 text-xs font-medium text-white rounded-lg transition-all ${
                            attendance[student.id] === btn.value
                              ? `${btn.color} ring-2 ring-offset-2 ring-gray-300`
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default TeacherAttendance

