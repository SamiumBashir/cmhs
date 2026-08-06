import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import { FiBell } from 'react-icons/fi'

const mockNotices = [
  { id: 1, title: 'Exam Schedule Published', category: 'exam', date: '2024-01-15', isPinned: true, content: 'The half-yearly examination schedule has been published...' },
  { id: 2, title: 'Holiday Notice', category: 'holiday', date: '2024-01-10', isPinned: false, content: 'School will remain closed on January 20th for annual sports...' }
]

const TeacherNotices = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', category: 'general' })

  const openCreate = () => {
    setEditingNotice(null)
    setFormData({ title: '', content: '', category: 'general' })
    setModalOpen(true)
  }

  const openEdit = (notice) => {
    setEditingNotice(notice)
    setFormData({ title: notice.title, content: notice.content, category: notice.category })
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setModalOpen(false)
    setEditingNotice(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
        <Button variant="primary" icon={<FiPlus size={18} />} onClick={openCreate}>
          New Notice
        </Button>
      </div>

      <Card>
        <div className="space-y-3">
          {mockNotices.map((notice) => (
            <motion.div
              key={notice.id}
              className="p-4 border border-gray-100 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {new Date(notice.date).getDate()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{notice.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{notice.content}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{notice.category}</span>
                <button
                  onClick={() => openEdit(notice)}
                  className="p-1 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                >
                  <FiEdit2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingNotice ? 'Edit Notice' : 'New Notice'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="Notice title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            label="Category"
            type="select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'general', label: 'General' },
              { value: 'academic', label: 'Academic' },
              { value: 'exam', label: 'Exam' },
              { value: 'holiday', label: 'Holiday' },
              { value: 'urgent', label: 'Urgent' }
            ]}
          />
          <Textarea
            label="Content"
            rows={5}
            placeholder="Notice content..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingNotice ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TeacherNotices



