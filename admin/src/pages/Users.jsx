import { FiShield, FiUsers, FiBriefcase, FiClipboard } from 'react-icons/fi'
import StatCard from '../components/ui/StatCard'
import CrudPage from '../components/CrudPage'
import { adminService } from '../services'

const AdminUsers = () => {
  const columns = [
    { key: 'name', label: 'Name', render: (val) => typeof val === 'object' ? val?.en || val?.bn || '' : val },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (val) => <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{val}</span> }
  ]

  const formFields = [
    { name: 'name.en', label: 'Name (English)', type: 'text', required: true },
    { name: 'name.bn', label: 'Name (বাংলা)', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password' },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'editor', label: 'Editor' }
      ],
      default: 'admin'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      default: 'active'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Super Admins" value="1" icon={<FiShield size={24} />} color="primary" />
        <StatCard title="Admins" value="2" icon={<FiUsers size={24} />} color="secondary" />
        <StatCard title="Editors" value="3" icon={<FiBriefcase size={24} />} color="accent" />
        <StatCard title="Moderators" value="1" icon={<FiClipboard size={24} />} color="primary" />
      </div>

      <CrudPage
        title="Admin User Management"
        service={adminService}
        columns={columns}
        formFields={formFields}
        createTitle="Add New Admin User"
        editTitle="Edit User"
      />
    </div>
  )
}

export default AdminUsers
