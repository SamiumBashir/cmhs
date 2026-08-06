import { useState } from 'react'
import { FiBook, FiSave } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

const subjects = [
  { id: 1, name: 'Mathematics', class: 'Class 10-A' },
  { id: 2, name: 'Mathematics', class: 'Class 9-B' },
  { id: 3, name: 'Mathematics', class: 'Class 8-A' }
]

const recentResults = [
  { id: 1, student: 'Alice Ahmed', subject: 'Mathematics', exam: 'Half Yearly', marks: '85/100', grade: 'A+' },
  { id: 2, student: 'Bob Karim', subject: 'Mathematics', exam: 'Half Yearly', marks: '78/100', grade: 'A' },
  { id: 3, student: 'Charlie Hossain', subject: 'Mathematics', exam: 'Half Yearly', marks: '65/100', grade: 'B' }
]

const TeacherResults = () => {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
        >
          {subjects.map((subj) => (
            <option key={subj.id} value={subj.id}>{subj.name} - {subj.class}</option>
          ))}
        </select>
      </div>

      <Card title="Recent Results" glass>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Exam</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Marks</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Grade</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((result) => (
                <tr key={result.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium">{result.student}</td>
                  <td className="px-6 py-4">{result.subject}</td>
                  <td className="px-6 py-4">{result.exam}</td>
                  <td className="px-6 py-4 text-center">{result.marks}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      result.grade === 'A+' ? 'bg-green-100 text-green-800' :
                      result.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {result.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Add/Edit Result" glass>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Student" placeholder="Search student..." />
          <Input label="Marks Obtained" type="number" placeholder="0" />
          <Input label="Full Marks" type="number" placeholder="100" defaultValue="100" />
        </div>
        <div className="mt-4">
          <Select
            label="Grade"
            options={[
              { value: 'A+', label: 'A+' },
              { value: 'A', label: 'A' },
              { value: 'A-', label: 'A-' },
              { value: 'B', label: 'B' },
              { value: 'C', label: 'C' },
              { value: 'F', label: 'F' }
            ]}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" icon={<FiSave />}>
            Save Result
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default TeacherResults

