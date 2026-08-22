import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUploadCloud, FiTrash2, FiSearch, FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaService } from '../services'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ImageUploader from '../components/ui/ImageUploader'

const AdminMedia = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [activeView, setActiveView] = useState('all')

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => mediaService.getAll({ limit: 100 }).then(r => r.data.data)
  })

  const { data: cloudinaryItems, isLoading: cLoading } = useQuery({
    queryKey: ['cloudinary-assets'],
    queryFn: () => mediaService.getCloudinaryAssets({ limit: 50 }).then(r => r.data.data).catch(() => [])
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mediaService.remove(id),
    onSuccess: () => queryClient.invalidateQueries()
  })

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const itemsToDisplay = activeView === 'cloudinary' ? (cloudinaryItems || []) : (mediaItems || [])

  const filteredMedia = itemsToDisplay.filter(item =>
    (item.name || item.public_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.url || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-xs text-gray-500">Manage all Cloudinary images and media assets</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeView === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Library Assets ({mediaItems?.length || 0})
          </button>
          <button
            onClick={() => setActiveView('cloudinary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeView === 'cloudinary' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Cloudinary Live ({cloudinaryItems?.length || 0})
          </button>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload to Cloudinary</h2>
        <p className="text-xs text-gray-500 mb-4">
          Drop or select any image to upload directly to Cloudinary storage and library.
        </p>
        <ImageUploader
          label="Select File"
          folder="school-management/media"
          onChange={() => {
            queryClient.invalidateQueries()
          }}
        />
      </Card>

      <div className="flex justify-between items-center gap-4">
        <div className="w-72">
          <Input
            placeholder="Search media..."
            icon={<FiSearch />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="text-sm text-gray-500">{filteredMedia.length} assets found</span>
      </div>

      {isLoading || cLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isCloudinary = item.url?.includes('cloudinary.com')
            const id = item._id || item.public_id
            return (
              <motion.div
                key={id}
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm group relative flex flex-col justify-between"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  <img src={item.url} alt={item.name || item.public_id} className="w-full h-full object-cover" />
                  {isCloudinary && (
                    <span className="absolute top-1.5 left-1.5 bg-blue-600/90 text-white text-[9px] px-1.5 py-0.5 rounded font-semibold backdrop-blur-xs">
                      Cloudinary
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.url, id)}
                      className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors shadow"
                      title="Copy URL"
                    >
                      {copiedId === id ? <FiCheck className="text-green-600" size={14} /> : <FiCopy size={14} />}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors shadow"
                      title="Open in new tab"
                    >
                      <FiExternalLink size={14} />
                    </a>
                  </div>
                </div>
                <div className="p-2.5 bg-white border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-800 truncate">{item.name || item.public_id?.split('/').pop() || 'Media Asset'}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{item.url}</p>
                </div>
                {item._id && (
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(item._id)}
                    className="absolute top-1.5 right-1.5 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-rose-700"
                    title="Delete Media"
                  >
                    <FiTrash2 size={13} />
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card className="p-8 text-center text-gray-500">No media items found in library.</Card>
      )}
    </div>
  )
}

export default AdminMedia

