import CrudPage from '../components/CrudPage'
import { staffService } from '../services'

const AdminStaff = () => {
  const columns = [
    { key: 'name', label: 'Name', render: (value) => value?.en || value?.bn || '' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status', render: (value) => <span className={`px-2 py-1 rounded-full text-xs ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value}</span> }
  ]

  const formFields = [
    { name: 'name.bn', label: 'Name (বাংলা)', type: 'text', placeholder: 'নাম', required: true },
    { name: 'name.en', label: 'Name (English)', type: 'text', placeholder: 'Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+880 1XXXXXXXXX' },
    { name: 'role', label: 'Role', type: 'text', required: true, placeholder: 'e.g. Accountant, Security' },
    { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g. Administration, HR' },
    { name: 'status', label: 'Status', type: 'select', options: [{value: 'active', label: 'Active'}, {value: 'inactive', label: 'Inactive'}] }
  ]

  return (
    <CrudPage
      title="Staff"
      service={staffService}
      columns={columns}
      formFields={formFields}
      createTitle="Add New Staff"
      editTitle="Edit Staff"
      defaultValues={{ status: 'active' }}
    />
  )
}

export default AdminStaff

