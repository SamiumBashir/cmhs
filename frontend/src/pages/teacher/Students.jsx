import { useState } from 'react'
import { FiUser, FiBook, FiMail, FiPhone } from 'react-icons/fi'
import Card from '../../components/ui/Card'

const students = [
  { id: 1, name: 'Alice Ahmed', roll: 1, email: 'alice@student.cmhs.edu', phone: '+880 171 111 1111', attendance: '95%' },
  { id: 2, name: 'Bob Karim', roll: 2, email: 'bob@student.cmhs.edu', phone: '+880 171 222 2222', attendance: '92%' },
  { id: 3, name: 'Charlie Hossain', roll: 3, email: 'charlie@student.cmhs.edu', phone: '+880 171 333 3333', attendance: '88%' },
  { id: 4, name: 'Diana Begum', roll: 4, email: 'diana@student.cmhs.edu', phone: '+880 171 444 4444', attendance: '97%' },
  { id: 5, name: 'Ehsan Ali', roll: 5, email: 'ehsan@student.cmhs.edu', phone: '+880 171 555 5555', attendance: '85%' }
]

const TeacherStudents = () => {
  const [_selectedStudent, _setSelectedStudent] = useState(null)

  const handleStudentClick = (student) => {
    _setSelectedStudent(student)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary">
          <option>Class 10-A</option>
          <option>Class 9-B</option>
          <option>Class 8-A</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Roll</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Phone</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Attendance</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium">{student.roll}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4 text-sm">{student.email}</td>
                  <td className="px-6 py-4 text-sm">{student.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      parseInt(student.attendance) >= 90
                        ? 'bg-green-100 text-green-800'
                        : parseInt(student.attendance) >= 75
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleStudentClick(student)}
                      className="text-primary hover:bg-gray-100 p-1 rounded"
                    >
                      <FiUser size={16} />
                    </button>
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

export default TeacherStudents

