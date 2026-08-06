import { useState } from 'react'
import { FiBook, FiTrendingUp, FiBarChart2 } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { useQuery } from '@tanstack/react-query'
import { resultService } from '../../services'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const StudentResults = () => {
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const { data: results, isLoading } = useQuery({
    queryKey: ['student-results'],
    queryFn: () => resultService.getByStudent('student-001').then(r => r.data)
  })

  const resultsData = results || []
  const exams = [...new Set(resultsData.map(r => r.exam))]
  const years = [...new Set(resultsData.map(r => r.academicYear))]

  const filteredResults = resultsData.filter(r => {
    if (selectedExam && r.exam !== selectedExam) return false
    if (selectedYear && r.academicYear !== selectedYear) return false
    return true
  })

  const totalMarks = filteredResults.reduce((sum, r) => sum + r.marksObtained, 0)
  const totalPossible = filteredResults.reduce((sum, r) => sum + (r.fullMarks || 100), 0)
  const avgPercentage = filteredResults.length > 0 ? Math.round((totalMarks / totalPossible) * 100) : 0

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'success'
    if (grade === 'A-') return 'primary'
    if (grade === 'B' || grade === 'B+') return 'info'
    if (grade === 'C') return 'warning'
    return 'danger'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
        <div className="flex gap-3">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="">All Exams</option>
            {exams.map((exam) => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {filteredResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-primary">{filteredResults.length}</div>
                <p className="text-sm text-gray-500">Subjects</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-green-600">{totalMarks}</div>
                <p className="text-sm text-gray-500">Total Marks</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-blue-600">{avgPercentage}%</div>
                <p className="text-sm text-gray-500">Average</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-accent">
                  {filteredResults.some(r => r.grade === 'A+' ) ? 'A+' : 'A'}
                </div>
                <p className="text-sm text-gray-500">Overall Grade</p>
              </Card>
            </div>
          )}

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Exam</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Subject</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Marks</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Full</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Grade</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, index) => (
                    <tr key={result._id || index} className="border-b border-gray-100">
                      <td className="px-6 py-4 text-sm">{result.exam}</td>
                      <td className="px-6 py-4 font-medium">{result.subject}</td>
                      <td className="px-6 py-4 text-center">{result.marksObtained}</td>
                      <td className="px-6 py-4 text-center">{result.fullMarks || 100}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={getGradeColor(result.grade)}>{result.grade || '—'}</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">{result.gpa || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {filteredResults.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <FiBook size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No results found</p>
        </Card>
      )}
    </div>
  )
}

export default StudentResults


