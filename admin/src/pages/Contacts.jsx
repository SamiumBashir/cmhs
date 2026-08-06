import CrudPage from '../components/CrudPage'
import { contactService } from '../services'
import Badge from '../components/ui/Badge'

const AdminContacts = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'subject', label: 'Subject' },
    { key: 'status', label: 'Status', render: (value) => <Badge variant={value === 'replied' ? 'success' : value === 'read' ? 'info' : 'warning'}>{value || 'new'}</Badge> },
    { key: 'createdAt', label: 'Date', render: (value) => new Date(value).toLocaleDateString() }
  ]

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+880 1XXXXXXXXX' },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Subject' },
    { name: 'message', label: 'Message', type: 'textarea', rows: 4, required: true },
    { name: 'status', label: 'Status', type: 'select', options: [
      {value: 'new', label: 'New'},
      {value: 'read', label: 'Read'},
      {value: 'replied', label: 'Replied'}
    ]}
  ]

  return (
    <CrudPage
      title="Contacts"
      service={contactService}
      columns={columns}
      formFields={formFields}
      createTitle="Add Contact Message"
      editTitle="Edit Message"
      defaultValues={{ status: 'new' }}
    />
  )
}

export default AdminContacts

