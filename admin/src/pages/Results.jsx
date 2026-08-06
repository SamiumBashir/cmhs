import CrudPage from '../components/CrudPage'
import { resultService } from '../services'

const AdminResults = () => {
  const columns = [
    { key: 'studentId', label: 'Student', render: (value) => value?.name?.en || value?.name || '' },
    { key: 'class', label: 'Class' },
    { key: 'exam', label: 'Exam' },
    { key: 'subject', label: 'Subject' },
    { key: 'marksObtained', label: 'Marks' },
    { key: 'grade', label: 'Grade' },
    { key: 'academicYear', label: 'Year' }
  ]

  const formFields = [
    { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Student ObjectId', required: true },
    { name: 'class', label: 'Class', type: 'text', required: true },
    { name: 'exam', label: 'Exam', type: 'text', required: true, placeholder: 'Half Yearly, Final, etc.' },
    { name: 'subject', label: 'Subject', type: 'text', required: true },
    { name: 'marksObtained', label: 'Marks Obtained', type: 'number', required: true },
    { name: 'fullMarks', label: 'Full Marks', type: 'number', default: '100' },
    { name: 'grade', label: 'Grade', type: 'text', placeholder: 'A+, A, B, etc.' },
    { name: 'gpa', label: 'GPA', type: 'number', step: '0.01' },
    { name: 'academicYear', label: 'Academic Year', type: 'text', required: true, placeholder: '2024-2025' },
    { name: 'remarks', label: 'Remarks', type: 'textarea', rows: 3 }
  ]

  return (
    <CrudPage
      title="Results"
      service={resultService}
      columns={columns}
      formFields={formFields}
      createTitle="Add New Result"
      editTitle="Edit Result"
      defaultValues={{ fullMarks: '100', status: 'active' }}
    />
  )
}

export default AdminResults

