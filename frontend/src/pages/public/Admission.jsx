import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiClock, FiUpload, FiCheck, FiClock as FiPending } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { admissionService } from '../../services'

const Admission = () => {
  const [formData, setFormData] = useState({
    studentName: { bn: '', en: '' },
    fatherName: { bn: '', en: '' },
    motherName: { bn: '', en: '' },
    dateOfBirth: '',
    gender: 'male',
    class: '',
    section: 'A',
    group: '',
    address: { bn: '', en: '' },
    phone: '',
    email: '',
    status: 'pending'
  })
  const [errors, setErrors] = useState({})
  const [submittedData, setSubmittedData] = useState(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data) => admissionService.create({ ...data, status: 'pending' }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['admissions'])
      setSubmittedData(res?.data?.data || formData)
    }
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleNameChange = (field, lang, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!formData.studentName.bn) newErrors.studentName = 'Bengali name is required'
    if (!formData.studentName.en) newErrors.studentName = 'English name is required'
    if (!formData.class) newErrors.class = 'Class is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await mutation.mutateAsync({ ...formData, status: 'pending' })
  }

  if (submittedData) {
    return (
      <div className="py-20 bg-gradient-to-br from-primary/5 to-white min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-20 h-20 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
          >
            <FiPending className="text-amber-600 animate-pulse" size={38} />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-semibold mb-6">
            <span>⏳ Status: Pending Approval</span>
          </div>

          <Card className="max-w-md mx-auto text-left mb-8 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4 flex items-center justify-between">
              <span>Application Summary</span>
              <span className="text-xs text-amber-600 font-normal">Pending Review</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Student Name:</span>
                <span className="font-semibold text-gray-900">{submittedData.studentName?.en || submittedData.studentName?.bn || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Class:</span>
                <span className="font-medium text-gray-800">Class {submittedData.class}</span>
              </div>
              {submittedData.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-mono text-gray-800">{submittedData.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Submitted On:</span>
                <span className="text-gray-700">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="pt-3 border-t text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                📌 Your application has been successfully saved to the <strong>Admin Panel</strong> under Admissions. It will remain in <strong>Pending</strong> status until verified and approved by the school administration.
              </div>
            </div>
          </Card>

          <Button variant="primary" onClick={() => setSubmittedData(null)}>
            Submit Another Application
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Admission Application</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Welcome to Chilahati Merchants High School. Fill out the application form below. All submitted applications go directly to the Admin Panel for verification and approval.
            </p>
          </motion.div>

          <Card className="max-w-4xl mx-auto shadow-xl">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Online Application Form</h2>
              <span className="text-xs px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">Initial Status: Pending Approval</span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name (English) *</label>
                  <Input
                    placeholder="Enter student's full name"
                    value={formData.studentName.en}
                    onChange={(e) => handleNameChange('studentName', 'en', e.target.value)}
                    error={errors.studentName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name (বাংলা) *</label>
                  <Input
                    placeholder="শিক্ষার্থীর পূর্ণ নাম"
                    value={formData.studentName.bn}
                    onChange={(e) => handleNameChange('studentName', 'bn', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Applying For *</label>
                  <Select
                    value={formData.class}
                    onChange={(e) => handleChange('class', e.target.value)}
                    options={[
                      { value: 'play_group', label: 'Play Group' },
                      { value: 'nursery', label: 'Nursery' },
                      { value: 'kg', label: 'KG' },
                      { value: '1', label: 'Class 1' },
                      { value: '2', label: 'Class 2' },
                      { value: '3', label: 'Class 3' },
                      { value: '4', label: 'Class 4' },
                      { value: '5', label: 'Class 5' },
                      { value: '6', label: 'Class 6' },
                      { value: '7', label: 'Class 7' },
                      { value: '8', label: 'Class 8' },
                      { value: '9', label: 'Class 9' },
                      { value: '10', label: 'Class 10' }
                    ]}
                    placeholder="Select a class"
                  />
                  {errors.class && <p className="text-sm text-red-500 mt-1">{errors.class}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <Select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                    placeholder="Select gender"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name (English)</label>
                  <Input
                    placeholder="Enter father's full name"
                    value={formData.fatherName.en}
                    onChange={(e) => handleNameChange('fatherName', 'en', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name (বাংলা)</label>
                  <Input
                    placeholder="বাবার পূর্ণ নাম"
                    value={formData.fatherName.bn}
                    onChange={(e) => handleNameChange('fatherName', 'bn', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name (English)</label>
                  <Input
                    placeholder="Enter mother's full name"
                    value={formData.motherName.en}
                    onChange={(e) => handleNameChange('motherName', 'en', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name (বাংলা)</label>
                  <Input
                    placeholder="মায়ের পূর্ণ নাম"
                    value={formData.motherName.bn}
                    onChange={(e) => handleNameChange('motherName', 'bn', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+880 1XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group (Class 9-10)</label>
                <Select
                  value={formData.group}
                  onChange={(e) => handleChange('group', e.target.value)}
                  options={[
                    { value: 'science', label: 'Science' },
                    { value: 'commerce', label: 'Commerce' },
                    { value: 'arts', label: 'Arts' }
                  ]}
                  placeholder="Select group"
                />
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Submitting Application...' : 'Submit Admission Application'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </>
  )
}

export default Admission
