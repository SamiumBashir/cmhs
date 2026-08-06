import CrudPage from '../components/CrudPage'
import { curriculumService } from '../services'

const AdminCurriculum = () => {
  const columns = [
    { key: 'class', label: 'Class' },
    { key: 'subject', label: 'Subject' },
    { key: 'teacher', label: 'Teacher', render: (value) => value?.name?.en || value?.name?.bn || '—' },
    { key: 'academicYear', label: 'Academic Year' },
    { key: 'isActive', label: 'Active', render: (value) => value ? '✓' : '—' }
  ]

  const formFields = [
    { name: 'class', label: 'Class', type: 'text', required: true },
    { name: 'subject', label: 'Subject', type: 'text', required: true },
    { name: 'teacher', label: 'Teacher', type: 'text', placeholder: 'Teacher ObjectId' },
    { name: 'academicYear', label: 'Academic Year', type: 'text', required: true, placeholder: '2024-2025' },
    { name: 'syllabus.bn', label: 'Syllabus (BN)', type: 'textarea', rows: 4 },
    { name: 'syllabus.en', label: 'Syllabus (EN)', type: 'textarea', rows: 4 },
    { name: 'isActive', label: 'Active', type: 'select', options: [{value: 'true', label: 'Yes'}, {value: 'false', label: 'No'}] }
  ]

  return (
    <CrudPage
      title="Curriculum"
      service={curriculumService}
      columns={columns}
      formFields={formFields}
      createTitle="Add Curriculum"
      editTitle="Edit Curriculum"
      defaultValues={{ isActive: 'true' }}
    />
  )
}

export default AdminCurriculum

