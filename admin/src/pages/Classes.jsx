import CrudPage from '../components/CrudPage'
import { classService } from '../services'

const AdminClasses = () => {
  const columns = [
    { key: 'name', label: 'Class Name', render: (val) => typeof val === 'object' ? val?.en || val?.bn || '' : val },
    { key: 'class', label: 'Class Code' },
    { key: 'section', label: 'Section' },
    { key: 'academicYear', label: 'Academic Year' }
  ]

  const formFields = [
    { name: 'name.en', label: 'Class Name (English)', type: 'text', required: true },
    { name: 'name.bn', label: 'Class Name (বাংলা)', type: 'text', required: true },
    { name: 'class', label: 'Class Code (e.g., 10)', type: 'text', required: true },
    { name: 'section', label: 'Section (A/B/C)', type: 'text', required: true },
    { name: 'academicYear', label: 'Academic Year', type: 'text', default: new Date().getFullYear().toString() }
  ]

  return (
    <CrudPage
      title="Class Management"
      service={classService}
      columns={columns}
      formFields={formFields}
      createTitle="Add New Class"
      editTitle="Edit Class"
    />
  )
}

export default AdminClasses
