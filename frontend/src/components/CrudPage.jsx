import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiEdit3, FiTrash2, FiPlus } from 'react-icons/fi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Card from './ui/Card'
import Button from './ui/Button'
import Modal from './ui/Modal'
import Table from './ui/Table'
import SearchBar from './ui/SearchBar'
import Pagination from './ui/Pagination'

const getNestedValue = (obj, path) => {
  if (!obj || !path) return ''
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj)
}

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const deepObj = keys.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== 'object') acc[key] = {}
    return acc[key]
  }, obj)
  deepObj[lastKey] = value
  return { ...obj }
}

const Form = ({ fields, initialValues, onSubmit, loading, onCancel }) => {
  const [formData, setFormData] = useState(initialValues || {})

  const handleChange = (name, value) => {
    setFormData(prev => setNestedValue({ ...prev }, name, value))
  }

  const handleSubmit = (e) => {
    onSubmit(e, formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => {
        const rawVal = getNestedValue(formData, field.name)
        const value = rawVal !== '' ? rawVal : (field.default !== undefined ? field.default : '')

        if (field.type === 'select') {
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <select
                name={field.name}
                value={String(value)}
                onChange={(e) => {
                  let val = e.target.value
                  if (val === 'true') val = true
                  if (val === 'false') val = false
                  handleChange(field.name, val)
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="">{field.placeholder || 'Select...'}</option>
                {field.options?.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
                ))}
              </select>
            </div>
          )
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name={field.name}
                value={value || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                rows={field.rows || 3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-y"
                placeholder={field.placeholder}
              />
            </div>
          )
        }

        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type || 'text'}
              name={field.name}
              value={value || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder={field.placeholder}
            />
          </div>
        )
      })}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

const CrudPage = ({
  title,
  service,
  columns = [],
  formFields = [],
  fields, // fallback for legacy prop
  createTitle = 'Create New',
  editTitle = 'Edit',
  enableCreate = true,
  enableEdit = true,
  enableDelete = true,
  defaultValues = {},
  onSaveSuccess
}) => {
  const actualFormFields = formFields.length > 0 ? formFields : (fields || [])
  const actualColumns = columns.length > 0 ? columns : actualFormFields.map(f => ({
    key: f.name,
    label: f.label,
    render: (val, item) => {
      const nested = getNestedValue(item, f.name)
      if (typeof nested === 'object' && nested !== null) {
        return nested.en || nested.bn || JSON.stringify(nested)
      }
      return String(nested || val || '')
    }
  }))

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const queryClient = useQueryClient()

  const queryKey = `${title.toLowerCase().replace(/\s+/g, '-')}-${currentPage}-${searchQuery}`

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn: () => {
      const params = { page: currentPage, limit: 20 }
      if (searchQuery) params.search = searchQuery
      return service.getAll(params).then(r => r.data)
    },
    keepPreviousData: true
  })

  const createMutation = useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      queryClient.invalidateQueries()
      setModalOpen(false)
      setEditingItem(null)
      onSaveSuccess?.()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries()
      setModalOpen(false)
      setEditingItem(null)
      onSaveSuccess?.()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: service.remove,
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })

  const handleSubmit = async (e, formData) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem._id, data: formData })
      } else {
        await createMutation.mutateAsync(formData)
      }
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      try {
        await deleteMutation.mutateAsync(item._id)
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingItem(null)
  }

  const formInitialValues = editingItem || defaultValues

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          {title}
        </motion.h1>
        {enableCreate && (
          <Button variant="primary" icon={<FiPlus size={18} />} onClick={openCreateModal}>
            Add New
          </Button>
        )}
      </div>

      <Card>
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Failed to load data</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <Table
              columns={[
                ...actualColumns,
                (enableEdit || enableDelete) && {
                  key: 'actions',
                  label: 'Actions',
                  align: 'center',
                  render: (_, item) => (
                    <div className="flex items-center justify-center gap-2">
                      {enableEdit && (
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit3 size={16} />
                        </button>
                      )}
                      {enableDelete && (
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  )
                }
              ].filter(Boolean)}
              data={data?.data || []}
            />
            {data?.pagination && (
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                total={data.pagination.total}
                onPageChange={setCurrentPage}
                pageSize={data.pagination.limit}
              />
            )}
          </>
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingItem ? `${editTitle}: ${editingItem.name?.en || editingItem.title?.en || ''}` : createTitle}
        size="lg"
      >
        <Form
          fields={actualFormFields}
          initialValues={formInitialValues}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  )
}

export default CrudPage
