import CrudPage from '../components/CrudPage'
import { teacherService } from '../services'

const AdminTeachers = () => {
  const columns = [
    { key: 'name', label: 'Name', render: (value) => value?.en || value?.bn || '' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subjects', render: (value) => Array.isArray(value) ? value.join(', ') : value },
    { key: 'qualification', label: 'Qualification' },
    { key: 'status', label: 'Status', render: (value) => <span className={`px-2 py-1 rounded-full text-xs ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value}</span> }
  ]

  const formFields = [
    { name: 'name.bn', label: 'Name (বাংলা)', type: 'text', placeholder: 'নাম', required: true },
    { name: 'name.en', label: 'Name (English)', type: 'text', placeholder: 'Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+880 1XXXXXXXXX' },
    { name: 'subject', label: 'Subjects', type: 'text', placeholder: 'e.g. English, Mathematics' },
    { name: 'qualification', label: 'Qualification', type: 'text', placeholder: 'M.Sc., B.Ed.' },
    { name: 'experience', label: 'Experience (years)', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: [{value: 'active', label: 'Active'}, {value: 'inactive', label: 'Inactive'}] }
  ]

  return (
    <CrudPage
      title="Teachers"
      service={teacherService}
      columns={columns}
      formFields={formFields}
      createTitle="Add New Teacher"
      editTitle="Edit Teacher"
      defaultValues={{ status: 'active' }}
    />
  )
}

export default AdminTeachers

