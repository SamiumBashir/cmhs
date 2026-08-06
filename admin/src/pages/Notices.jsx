import CrudPage from '../components/CrudPage'
import { noticeService } from '../services'
import Badge from '../components/ui/Badge'

const AdminNotices = () => {
  const columns = [
    { key: 'title', label: 'Title', render: (value) => value?.en || value?.bn || '' },
    { key: 'category', label: 'Category', render: (value) => <Badge variant={value === 'urgent' ? 'danger' : 'primary'} size="sm">{value || 'general'}</Badge> },
    { key: 'publishDate', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'isPinned', label: 'Pinned', render: (value) => value ? '✓' : '—' },
    { key: 'isUrgent', label: 'Urgent', render: (value) => value ? '✓' : '—' }
  ]

  const formFields = [
    { name: 'title.bn', label: 'Title (বাংলা)', type: 'text', placeholder: 'শিরোনাম', required: true },
    { name: 'title.en', label: 'Title (English)', type: 'text', placeholder: 'Title', required: true },
    { name: 'content.bn', label: 'Content (বাংলা)', type: 'textarea', placeholder: 'বিসয়বস্তু', rows: 4, required: true },
    { name: 'content.en', label: 'Content (English)', type: 'textarea', placeholder: 'Content', rows: 4, required: true },
    { name: 'category', label: 'Category', type: 'select', options: [
      {value: 'general', label: 'General'},
      {value: 'academic', label: 'Academic'},
      {value: 'admission', label: 'Admission'},
      {value: 'exam', label: 'Examination'},
      {value: 'result', label: 'Result'},
      {value: 'event', label: 'Event'},
      {value: 'holiday', label: 'Holiday'},
      {value: 'admin', label: 'Admin'},
      {value: 'urgent', label: 'Urgent'}
    ]},
    { name: 'isPinned', label: 'Pinned', type: 'select', options: [{value: 'true', label: 'Yes'}, {value: 'false', label: 'No'}] },
    { name: 'isUrgent', label: 'Urgent', type: 'select', options: [{value: 'true', label: 'Yes'}, {value: 'false', label: 'No'}] }
  ]

  return (
    <CrudPage
      title="Notices"
      service={noticeService}
      columns={columns}
      formFields={formFields}
      createTitle="Create New Notice"
      editTitle="Edit Notice"
      defaultValues={{ category: 'general', isPinned: 'false', isUrgent: 'false' }}
    />
  )
}

export default AdminNotices

