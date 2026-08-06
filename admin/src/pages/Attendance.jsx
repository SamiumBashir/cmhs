import CrudPage from '../components/CrudPage'
import { attendanceService } from '../services'

const AdminAttendance = () => {
  const columns = [
    { key: 'studentId', label: 'Student', render: (value) => value?.name?.en || value?.rollNumber || '—' },
    { key: 'class', label: 'Class' },
    { key: 'section', label: 'Section' },
    { key: 'date', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (value) => <span className={`px-2 py-1 rounded-full text-xs ${value === 'present' ? 'bg-green-100 text-green-800' : value === 'absent' ? 'bg-red-100 text-red-800' : value === 'late' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>{value}</span> }
  ]

  const formFields = [
    { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Student ObjectId', required: true },
    { name: 'class', label: 'Class', type: 'text', required: true },
    { name: 'section', label: 'Section', type: 'select', options: Array.from({length: 4}, (_, i) => ({value: String.fromCharCode(65+i), label: String.fromCharCode(65+i)})) },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'status', label: 'Status', type: 'select', required: true, options: [
      {value: 'present', label: 'Present'},
      {value: 'absent', label: 'Absent'},
      {value: 'late', label: 'Late'},
      {value: 'excused', label: 'Excused'}
    ]},
    { name: 'remarks', label: 'Remarks', type: 'textarea', rows: 3 }
  ]

  return (
    <CrudPage
      title="Attendance"
      service={attendanceService}
      columns={columns}
      formFields={formFields}
      createTitle="Add Attendance Record"
      editTitle="Edit Attendance"
      defaultValues={{ section: 'A', status: 'present' }}
    />
  )
}

export default AdminAttendance

