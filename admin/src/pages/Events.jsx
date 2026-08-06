import CrudPage from '../components/CrudPage'
import { eventService } from '../services'

const AdminEvents = () => {
  const columns = [
    { key: 'title', label: 'Title', render: (value) => value?.en || value?.bn || '' },
    { key: 'date', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'startTime', label: 'Start' },
    { key: 'endTime', label: 'End' },
    { key: 'location', label: 'Location', render: (value) => value?.en || value?.bn || '—' },
    { key: 'category', label: 'Category' },
    { key: 'isActive', label: 'Active', render: (value) => value ? '✓' : '—' }
  ]

  const formFields = [
    { name: 'title.bn', label: 'Title (বাংলা)', type: 'text', placeholder: 'শিরোনাম', required: true },
    { name: 'title.en', label: 'Title (English)', type: 'text', placeholder: 'Title', required: true },
    { name: 'description.bn', label: 'Description (BN)', type: 'textarea', rows: 4 },
    { name: 'description.en', label: 'Description (EN)', type: 'textarea', rows: 4 },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'startTime', label: 'Start Time', type: 'text', placeholder: '08:00' },
    { name: 'endTime', label: 'End Time', type: 'text', placeholder: '10:00' },
    { name: 'location.bn', label: 'Location (BN)', type: 'text', placeholder: 'অবস্থান' },
    { name: 'location.en', label: 'Location (EN)', type: 'text', placeholder: 'Location' },
    { name: 'category', label: 'Category', type: 'select', options: [
      {value: 'cultural', label: 'Cultural'},
      {value: 'sports', label: 'Sports'},
      {value: 'academic', label: 'Academic'},
      {value: 'admin', label: 'Admin'}
    ]},
    { name: 'image', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    { name: 'isActive', label: 'Active', type: 'select', options: [{value: 'true', label: 'Yes'}, {value: 'false', label: 'No'}] }
  ]

  return (
    <CrudPage
      title="Events"
      service={eventService}
      columns={columns}
      formFields={formFields}
      createTitle="Add New Event"
      editTitle="Edit Event"
      defaultValues={{ isActive: 'true' }}
    />
  )
}

export default AdminEvents

