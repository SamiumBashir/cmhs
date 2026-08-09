import { useState, useRef } from 'react'
import { FiUploadCloud, FiImage, FiX, FiCheck, FiLink } from 'react-icons/fi'
import { mediaService } from '../../services'

const ImageUploader = ({ label, value, onChange, placeholder = 'Upload image' }) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processAndUploadFile(file)
  }

  const processAndUploadFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await mediaService.upload(formData)
      const uploadedUrl = response.data?.url || response.data?.data?.url

      if (uploadedUrl) {
        let fullUrl = uploadedUrl
        if (!uploadedUrl.startsWith('http')) {
          const rawHost = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'
          const cleanHost = rawHost.replace(/\/api\/?$/, '')
          fullUrl = uploadedUrl.startsWith('/') ? `${cleanHost}${uploadedUrl}` : `${cleanHost}/${uploadedUrl}`
        }
        onChange(fullUrl)
      } else {
        setError('Upload succeeded but no URL was returned.')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) processAndUploadFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <FiLink size={12} />
            {showUrlInput ? 'Upload File' : 'Paste URL'}
          </button>
        </div>
      )}

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      ) : value ? (
        <div className="relative group border border-gray-200 rounded-xl p-2 bg-gray-50 flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{value.split('/').pop() || 'Image'}</p>
            <p className="text-[11px] text-green-600 font-medium flex items-center gap-1 mt-0.5">
              <FiCheck size={12} /> Image Ready
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Remove Image"
          >
            <FiX size={16} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-primary/5 ${
            uploading ? 'opacity-60 pointer-events-none' : ''
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiUploadCloud size={20} />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {uploading ? 'Uploading picture...' : 'Click to select picture from computer'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP or GIF (Max 10MB)</p>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
    </div>
  )
}

export default ImageUploader
