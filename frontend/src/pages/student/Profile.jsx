import { useState } from 'react'
import { FiEdit2, FiSave } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Avatar from '../../components/ui/Avatar'

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false)

  const student = {
    name: { en: 'John Doe', bn: 'জন ডো' },
    rollNumber: '20241001',
    class: '10',
    section: 'A',
    dateOfBirth: '2008-05-15',
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+880 171 123 4567',
    email: 'student@student.cmhs.edu',
    parentName: { en: 'Mr. & Mrs. Doe', bn: 'দ ডো পরিবার' },
    parentPhone: '+880 171 123 4568',
    address: { en: '123 School Road, Chilahati', bn: '১২৩ স্কুল রোড, চিলাহাটি' },
    admissionDate: '2023-01-15',
    status: 'active'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Button variant={isEditing ? 'danger' : 'primary'} icon={isEditing ? undefined : <FiEdit2 />} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <Card>
        <div className="flex items-start gap-6">
          <Avatar src={student.avatar} name={student.name.en} size="xl" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name (English)" value={student.name.en} readOnly={!isEditing} />
            <Input label="Full Name (বাংলা)" value={student.name.bn} readOnly={!isEditing} />
            <Input label="Roll Number" value={student.rollNumber} readOnly />
            <Input label="Class" value={`Class ${student.class}`} readOnly />
            <Input label="Section" value={student.section} readOnly />
            <Input label="Date of Birth" value={student.dateOfBirth} readOnly={!isEditing} type="date" />
            <Input label="Gender" value={student.gender} readOnly={!isEditing} />
            <Input label="Blood Group" value={student.bloodGroup} readOnly={!isEditing} />
            <Input label="Phone" value={student.phone} readOnly={!isEditing} />
            <Input label="Email" value={student.email} readOnly={!isEditing} />
            <Input label="Parent/Guardian" value={student.parentName.en} readOnly={!isEditing} />
            <Input label="Parent Phone" value={student.parentPhone} readOnly={!isEditing} />
            <div className="md:col-span-2">
              <Input label="Address (English)" value={student.address.en} readOnly={!isEditing} />
            </div>
            <div className="md:col-span-2">
              <Input label="Address (বাংলা)" value={student.address.bn} readOnly={!isEditing} />
            </div>
            <Input label="Admission Date" value={student.admissionDate} readOnly />
            <Input label="Status" value={student.status} readOnly />
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" icon={<FiSave />}>
              Save Changes
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default StudentProfile

