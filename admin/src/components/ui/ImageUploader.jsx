import { useState, useRef } from 'react'
import { FiUploadCloud, FiImage, FiX, FiCheck, FiLink, FiFolder, FiSearch } from 'react-icons/fi'
import { mediaService } from '../../services'
import Modal from './Modal'
import LoadingSpinner from './LoadingSpinner'

const ImageUploader = ({ label, value, onChange, folder = 'school-management/cms', placeholder = 'Upload image' }) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [showLibraryModal, setShowLibraryModal] = useState(false)
  const [libraryAssets, setLibraryAssets] = useState([])
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
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

    if (file.size > 15 * 1024 * 1024) {
      setError('File size must be less than 15MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      formData.append('name', file.name)

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

  const openLibraryModal = async () => {
    setShowLibraryModal(true)
    setLoadingAssets(true)
    try {
      // First try fetching directly from Cloudinary assets API
      const cRes = await mediaService.getCloudinaryAssets({ limit: 50 }).catch(() => null)
      if (cRes?.data?.data?.length) {
        setLibraryAssets(cRes.data.data.map(item => ({
          _id: item.public_id,
          name: item.public_id.split('/').pop(),
          url: item.url,
          source: 'cloudinary'
        })))
      } else {
        // Fallback to media records from database
        const mRes = await mediaService.getAll({ limit: 50 })
        setLibraryAssets(mRes.data?.data || [])
      }
    } catch (err) {
      console.warn('Could not load library assets:', err)
    } finally {
      setLoadingAssets(false)
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

  const isCloudinaryUrl = value && value.includes('cloudinary.com')

  const filteredAssets = libraryAssets.filter(item =>
    (item.name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (item.url || '').toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openLibraryModal}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <FiFolder size={12} />
              Browse Cloudinary
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <FiLink size={12} />
              {showUrlInput ? 'Upload File' : 'Paste Link'}
            </button>
          </div>
        </div>
      )}

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/... or image link"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      ) : value ? (
        <div className="relative group border border-gray-200 rounded-xl p-2.5 bg-gray-50 flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center relative">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{value.split('/').pop() || 'Image'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                <FiCheck size={12} /> Ready
              </span>
              {isCloudinaryUrl && (
                <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-medium">
                  Cloudinary ⚡
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-xs font-medium px-2.5"
              title="Replace image"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              title="Remove Image"
            >
              <FiX size={16} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
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
                {uploading ? 'Uploading to Cloudinary...' : 'Click to select picture from computer'}
              </p>
              <p className="text-xs text-gray-500">Cloud-optimized image upload (PNG, JPG, WEBP - Max 15MB)</p>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}

      {/* Cloudinary / Media Library Modal */}
      {showLibraryModal && (
        <Modal
          isOpen={showLibraryModal}
          onClose={() => setShowLibraryModal(false)}
          title="Select Image from Cloudinary Library"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
              <FiSearch className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search images..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-transparent text-sm w-full outline-none"
              />
            </div>

            {loadingAssets ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="md" />
              </div>
            ) : filteredAssets.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset._id || asset.url}
                    type="button"
                    onClick={() => {
                      onChange(asset.url)
                      setShowLibraryModal(false)
                    }}
                    className="group border border-gray-200 hover:border-primary rounded-lg overflow-hidden flex flex-col items-center bg-white hover:shadow-md transition-all text-left"
                  >
                    <div className="aspect-square w-full bg-gray-100 overflow-hidden flex items-center justify-center">
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-1.5 w-full bg-white">
                      <p className="text-[11px] font-medium text-gray-800 truncate">{asset.name || 'Image'}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                No images found in library. Upload an image above to start.
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ImageUploader

