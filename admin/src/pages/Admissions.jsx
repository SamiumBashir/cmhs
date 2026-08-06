import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiCheckCircle, FiXCircle, FiClock, FiUser, FiPhone, FiMail, FiBookOpen } from 'react-icons/fi'
import CrudPage from '../components/CrudPage'
import { admissionService } from '../services'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const AdminAdmissions = () => {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'pending', 'approved', 'rejected'

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => admissionService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus })
  }

  const columns = [
    {
      key: 'studentName',
      label: 'Student Name',
      render: (value, item) => (
        <div>
          <div className="font-semibold text-gray-900">{value?.en || value?.bn || 'N/A'}</div>
          {value?.bn && value?.en && <div className="text-xs text-gray-500">{value.bn}</div>}
        </div>
      )
    },
    {
      key: 'class',
      label: 'Class & Group',
      render: (value, item) => (
        <div>
          <span className="font-medium text-gray-800">Class {value}</span>
          {item.group && <span className="ml-1 text-xs text-gray-500">({item.group})</span>}
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Contact Phone',
      render: (val) => val ? <span className="font-mono text-xs">{val}</span> : <span className="text-gray-400">N/A</span>
    },
    {
      key: 'status',
      label: 'Approval Status',
      render: (value) => {
        if (value === 'approved') {
          return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Approved</span>
        }
        if (value === 'rejected') {
          return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">✕ Rejected</span>
        }
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-max">⏳ Pending</span>
      }
    },
    {
      key: 'createdAt',
      label: 'Application Date',
      render: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      key: '_id',
      label: 'Quick Action',
      render: (_, item) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {item.status !== 'approved' && (
            <button
              onClick={() => handleStatusChange(item._id, 'approved')}
              disabled={updateStatusMutation.isPending}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
              title="Approve Admission"
            >
              <FiCheckCircle size={12} /> Approve
            </button>
          )}
          {item.status !== 'rejected' && (
            <button
              onClick={() => handleStatusChange(item._id, 'rejected')}
              disabled={updateStatusMutation.isPending}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
              title="Reject Application"
            >
              <FiXCircle size={12} /> Reject
            </button>
          )}
          {item.status !== 'pending' && (
            <button
              onClick={() => handleStatusChange(item._id, 'pending')}
              disabled={updateStatusMutation.isPending}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-medium transition-colors"
              title="Set to Pending"
            >
              Set Pending
            </button>
          )}
        </div>
      )
    }
  ]

  const formFields = [
    { name: 'studentName.en', label: 'Student Name (English)', type: 'text', placeholder: 'Full Name', required: true },
    { name: 'studentName.bn', label: 'Student Name (বাংলা)', type: 'text', placeholder: 'শিক্ষার্থীর নাম', required: true },
    { name: 'fatherName.en', label: 'Father\'s Name (EN)', type: 'text', placeholder: 'Father\'s Name' },
    { name: 'fatherName.bn', label: 'Father\'s Name (BN)', type: 'text', placeholder: 'বাবার নাম' },
    { name: 'motherName.en', label: 'Mother\'s Name (EN)', type: 'text', placeholder: 'Mother\'s Name' },
    { name: 'motherName.bn', label: 'Mother\'s Name (BN)', type: 'text', placeholder: 'মায়ের নাম' },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
    { name: 'gender', label: 'Gender', type: 'select', options: [{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}] },
    { name: 'class', label: 'Class', type: 'select', required: true, options: ['play_group', 'nursery', 'kg', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(c => ({value: c, label: `Class ${c}`})) },
    { name: 'section', label: 'Section', type: 'select', options: ['A', 'B', 'C', 'D'].map(s => ({value: s, label: `Section ${s}`})) },
    { name: 'group', label: 'Group (Class 9-10)', type: 'select', options: [{value: 'science', label: 'Science'}, {value: 'commerce', label: 'Commerce'}, {value: 'arts', label: 'Arts'}] },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+880 1XXXXXXXXX' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'example@email.com' },
    { name: 'status', label: 'Application Status', type: 'select', required: true, options: [{value: 'pending', label: '⏳ Pending'}, {value: 'approved', label: '✓ Approved'}, {value: 'rejected', label: '✕ Rejected'}] }
  ]

  return (
    <CrudPage
      title="Admissions Management"
      service={admissionService}
      columns={columns}
      formFields={formFields}
      createTitle="Add New Admission Form"
      editTitle="Edit Admission Form Details"
      defaultValues={{ status: 'pending', section: 'A' }}
    />
  )
}

export default AdminAdmissions
