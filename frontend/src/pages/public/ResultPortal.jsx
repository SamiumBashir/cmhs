import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiSearch, FiDownload } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { resultService } from '../../services'

const ResultPortal = () => {
  const [studentId, setStudentId] = useState('')
  const [examName, setExamName] = useState('Final Exam')
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultsData, setResultsData] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!studentId) return
    setIsLoading(true)
    setErrorMessage('')

    try {
      const res = await resultService.getAll({ search: studentId, limit: 50 })
      const list = res.data?.data || []

      if (list.length > 0) {
        setResultsData(list)
        const first = list[0]
        setStudentInfo({
          name: first.student?.name?.en || first.student?.name?.bn || first.studentName || 'Student',
          roll: first.rollNumber || first.student?.rollNumber || studentId,
          class: first.className || first.student?.class || 'N/A',
          exam: first.examName || examName
        })
        setShowResult(true)
      } else {
        setErrorMessage('No results found for this Student Roll / ID.')
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch result')
    } finally {
      setIsLoading(false)
    }
  }

  const totalObtained = resultsData.reduce((acc, curr) => acc + (Number(curr.marksObtained) || 0), 0)
  const totalFull = resultsData.reduce((acc, curr) => acc + (Number(curr.fullMarks) || 100), 0)

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Result Portal</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View your official examination results online. Enter your student Roll Number or ID to access your marksheet.
          </p>
        </motion.div>

        {!showResult ? (
          <Card className="max-w-2xl mx-auto p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {errorMessage}
                </div>
              )}

              <Input
                label="Student Roll / ID"
                name="studentId"
                placeholder="Enter Student Roll or ID (e.g. 1001 or S-1001)"
                icon={<FiSearch />}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />

              <Input
                label="Examination"
                name="examName"
                placeholder="e.g. Annual Examination 2026"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />

              <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
                {isLoading ? 'Searching...' : 'View Result'}
              </Button>
            </form>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Student: {studentInfo?.name}</h2>
                  <p className="text-gray-600">Roll: {studentInfo?.roll} | Class: {studentInfo?.class}</p>
                </div>
                <Badge variant="success">{studentInfo?.exam}</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Subject</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Marks</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Out of</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">Grade</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsData.map((res, index) => (
                      <tr key={res._id || index} className="border-b border-gray-100">
                        <td className="px-6 py-4 font-medium text-gray-900">{res.subjectName || res.subject?.name?.en || res.subject}</td>
                        <td className="px-6 py-4 text-center">{res.marksObtained}</td>
                        <td className="px-6 py-4 text-center">{res.fullMarks || 100}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={res.grade === 'A+' ? 'success' : res.grade === 'A' ? 'primary' : 'warning'}>
                            {res.grade || 'A'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">{res.gpa || '4.00'}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-6 py-4">Total</td>
                      <td className="px-6 py-4 text-center">{totalObtained}</td>
                      <td className="px-6 py-4 text-center">{totalFull}</td>
                      <td className="px-6 py-4 text-center">—</td>
                      <td className="px-6 py-4 text-center">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" size="sm" icon={<FiDownload />} onClick={() => window.print()}>
                  Download Marksheet (PDF)
                </Button>
              </div>
            </Card>

            <Button variant="secondary" onClick={() => setShowResult(false)}>
              Check Another Result
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default ResultPortal
