import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUploadCloud, FiTrash2, FiSearch } from 'react-icons/fi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaService } from '../services'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const AdminMedia = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [newMedia, setNewMedia] = useState({ name: '', url: '', folder: 'general' })

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => mediaService.getAll({ limit: 100 }).then(r => r.data.data)
  })

  const uploadMutation = useMutation({
    mutationFn: (data) => mediaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries()
      setNewMedia({ name: '', url: '', folder: 'general' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mediaService.remove(id),
    onSuccess: () => queryClient.invalidateQueries()
  })

  const filteredMedia = (mediaItems || []).filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Media Asset</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="File Name"
            placeholder="e.g. School Hero Banner"
            value={newMedia.name}
            onChange={(e) => setNewMedia({ ...newMedia, name: e.target.value })}
          />
          <Input
            label="Image / File URL"
            placeholder="https://images.unsplash.com/..."
            value={newMedia.url}
            onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
          />
          <Button
            variant="primary"
            icon={<FiUploadCloud />}
            onClick={() => uploadMutation.mutate(newMedia)}
            disabled={uploadMutation.isPending || !newMedia.name || !newMedia.url}
          >
            Add to Library
          </Button>
        </div>
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
        <span className="text-sm text-gray-500">{filteredMedia.length} assets</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm group relative"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{item.url}</p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(item._id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiTrash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-gray-500">No media items found in library.</Card>
      )}
    </div>
  )
}

export default AdminMedia
