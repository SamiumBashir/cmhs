import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import { useQuery } from '@tanstack/react-query'
import { galleryService } from '../../services'
import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

const Gallery = () => {
  const { language } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', selectedCategory],
    queryFn: () => {
      const params = { limit: 30 }
      if (selectedCategory) params.category = selectedCategory
      return galleryService.getAll(params).then(r => r.data.data)
    }
  })

  const getTitle = (item) => {
    if (!item?.title) return ''
    if (typeof item.title === 'string') return item.title
    return language === 'bn' ? (item.title.bn || item.title.en || '') : (item.title.en || item.title.bn || '')
  }

  const categories = [
    { value: '', label: language === 'bn' ? 'সকল' : 'All' },
    { value: 'campus', label: 'Campus' },
    { value: 'classroom', label: 'Classroom' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'library', label: 'Library' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'event', label: 'Events' }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{language === 'bn' ? 'গ্যালারি' : 'Gallery'}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our photo gallery showcasing campus life, events, and activities.
          </p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(data || []).map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100"
                onClick={() => setSelectedImage(item)}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={item.image}
                  alt={getTitle(item)}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          showClose={true}
          size="full"
        >
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.image}
                alt={getTitle(selectedImage)}
                className="w-full h-full object-contain rounded-lg"
                style={{ maxHeight: '80vh' }}
              />
              {getTitle(selectedImage) && (
                <h3 className="text-center mt-4 font-semibold text-gray-900">
                  {getTitle(selectedImage)}
                </h3>
              )}
            </div>
          )}
        </Modal>
      </div>
    </section>
  )
}

export default Gallery
