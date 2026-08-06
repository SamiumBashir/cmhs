import CrudPage from '../components/CrudPage'
import { galleryService } from '../services'

const AdminGallery = () => {
  const columns = [
    { key: 'image', label: 'Image', render: (value) => <img src={value} alt="Gallery" className="w-16 h-16 object-cover rounded-lg" /> },
    { key: 'title', label: 'Title', render: (value) => value?.en || value?.bn || '' },
    { key: 'category', label: 'Category' },
    { key: 'isActive', label: 'Active', render: (value) => value ? '✓' : '—' }
  ]

  const formFields = [
    { name: 'title.bn', label: 'Title (বাংলা)', type: 'text', placeholder: 'শিরোনাম', required: true },
    { name: 'title.en', label: 'Title (English)', type: 'text', placeholder: 'Title', required: true },
    { name: 'image', label: 'Image URL', type: 'text', placeholder: 'https://...', required: true },
    { name: 'category', label: 'Category', type: 'select', options: [
      {value: 'campus', label: 'Campus'},
      {value: 'classroom', label: 'Classroom'},
      {value: 'laboratory', label: 'Laboratory'},
      {value: 'library', label: 'Library'},
      {value: 'sports', label: 'Sports'},
      {value: 'cultural', label: 'Cultural'},
      {value: 'event', label: 'Event'}
    ]},
    { name: 'description.bn', label: 'Description (BN)', type: 'textarea', rows: 3 },
    { name: 'description.en', label: 'Description (EN)', type: 'textarea', rows: 3 },
    { name: 'isActive', label: 'Active', type: 'select', options: [{value: 'true', label: 'Yes'}, {value: 'false', label: 'No'}] }
  ]

  return (
    <CrudPage
      title="Gallery"
      service={galleryService}
      columns={columns}
      formFields={formFields}
      createTitle="Add Gallery Item"
      editTitle="Edit Gallery Item"
      defaultValues={{ isActive: 'true' }}
    />
  )
}

export default AdminGallery

