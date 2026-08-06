import CrudPage from '../components/CrudPage'
import { routineService } from '../services'

const AdminRoutines = () => {
  const columns = [
    { key: 'class', label: 'Class' },
    { key: 'section', label: 'Section' },
    { key: 'day', label: 'Day' },
    { key: 'period', label: 'Period' },
    { key: 'subject', label: 'Subject' },
    { key: 'teacher', label: 'Teacher', render: (value) => value?.name?.en || value?.name?.bn || '—' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'room', label: 'Room' }
  ]

  const formFields = [
    { name: 'class', label: 'Class', type: 'text', required: true },
    { name: 'section', label: 'Section', type: 'select', options: Array.from({length: 4}, (_, i) => ({value: String.fromCharCode(65+i), label: String.fromCharCode(65+i)})) },
    { name: 'day', label: 'Day', type: 'select', required: true, options: [
      {value: 'monday', label: 'Monday'},
      {value: 'tuesday', label: 'Tuesday'},
      {value: 'wednesday', label: 'Wednesday'},
      {value: 'thursday', label: 'Thursday'},
      {value: 'friday', label: 'Friday'},
      {value: 'saturday', label: 'Saturday'},
      {value: 'sunday', label: 'Sunday'}
    ]},
    { name: 'period', label: 'Period', type: 'number', required: true },
    { name: 'subject', label: 'Subject', type: 'text', required: true },
    { name: 'teacher', label: 'Teacher', type: 'text', placeholder: 'Teacher ObjectId' },
    { name: 'startTime', label: 'Start Time', type: 'text', placeholder: '08:00' },
    { name: 'endTime', label: 'End Time', type: 'text', placeholder: '09:00' },
    { name: 'room', label: 'Room', type: 'text', placeholder: 'Room 101' },
    { name: 'academicYear', label: 'Academic Year', type: 'text', placeholder: '2024-2025' },
    { name: 'isActive', label: 'Active', type: 'select', options: [{value: 'true', label: 'Yes'}, {value: 'false', label: 'No'}] }
  ]

  return (
    <CrudPage
      title="Routines"
      service={routineService}
      columns={columns}
      formFields={formFields}
      createTitle="Add New Routine"
      editTitle="Edit Routine"
      defaultValues={{ section: 'A', isActive: 'true' }}
    />
  )
}

export default AdminRoutines

