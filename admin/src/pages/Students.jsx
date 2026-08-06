import CrudPage from '../components/CrudPage'
import { studentService } from '../services'

const AdminStudents = () => {
  const columns = [
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'name', label: 'Name', render: (value) => value?.en || value?.bn || '' },
    { key: 'class', label: 'Class' },
    { key: 'section', label: 'Section' },
    { key: 'status', label: 'Status', render: (value) => <span className={`px-2 py-1 rounded-full text-xs ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value}</span> }
  ]

  const formFields = [
    { name: 'name', label: 'Name (BN)', type: 'text', placeholder: 'নাম' },
    { name: 'name.en', label: 'Name (EN)', type: 'text', placeholder: 'Name' },
    { name: 'rollNumber', label: 'Roll Number', type: 'text', required: true },
    { name: 'class', label: 'Class', type: 'select', required: true, options: Array.from({length: 10}, (_, i) => ({value: (i+1).toString(), label: `Class ${i+1}`})).concat([{value: 'kg', label: 'KG'}, {value: 'nursery', label: 'Nursery'}]) },
    { name: 'section', label: 'Section', type: 'select', options: Array.from({length: 4}, (_, i) => ({value: String.fromCharCode(65+i), label: String.fromCharCode(65+i)})) },
    { name: 'gender', label: 'Gender', type: 'select', options: [{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}] },
    { name: 'status', label: 'Status', type: 'select', options: [{value: 'active', label: 'Active'}, {value: 'inactive', label: 'Inactive'}, {value: 'graduated', label: 'Graduated'}] }
  ]

  return (
    <CrudPage
      title="Students"
      service={studentService}
      columns={columns}
      formFields={formFields}
      createTitle="Add New Student"
      editTitle="Edit Student"
      defaultValues={{ section: 'A', status: 'active', gender: 'male' }}
    />
  )
}

export default AdminStudents

