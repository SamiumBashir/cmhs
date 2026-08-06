import CrudPage from '../components/CrudPage'
import { subjectService } from '../services'

const AdminSubjects = () => {
  const columns = [
    { key: 'name', label: 'Subject Name', render: (val) => typeof val === 'object' ? val?.en || val?.bn || '' : val },
    { key: 'code', label: 'Subject Code' },
    { key: 'class', label: 'Class' },
    { key: 'creditHours', label: 'Credit Hours' }
  ]

  const formFields = [
    { name: 'name.en', label: 'Subject Name (English)', type: 'text', required: true },
    { name: 'name.bn', label: 'Subject Name (বাংলা)', type: 'text', required: true },
    { name: 'code', label: 'Subject Code', type: 'text', required: true },
    { name: 'class', label: 'Class', type: 'text', required: true },
    { name: 'creditHours', label: 'Credit Hours', type: 'number', default: 3 }
  ]

  return (
    <CrudPage
      title="Subject Management"
      service={subjectService}
      columns={columns}
      formFields={formFields}
      createTitle="Add New Subject"
      editTitle="Edit Subject"
    />
  )
}

export default AdminSubjects
