import { motion } from 'framer-motion'
import { FiDownload, FiFileText } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useQuery } from '@tanstack/react-query'
import { downloadService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const Downloads = () => {
  const { language } = useLanguage()

  const { data: downloadsData, isLoading } = useQuery({
    queryKey: ['downloads'],
    queryFn: () => downloadService.getAll({ limit: 50 }).then(r => r.data.data)
  })

  const downloads = downloadsData || []

  const getTitle = (item) => language === 'bn' ? (item.title?.bn || item.title?.en || item.title) : (item.title?.en || item.title?.bn || item.title)

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{language === 'bn' ? 'ডাউনলোড' : 'Downloads'}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Download important documents, prospectuses, and academic resources.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : downloads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {downloads.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col" hover>
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto text-primary">
                      <FiFileText size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-center text-gray-900 mb-2">{getTitle(item)}</h3>
                    <div className="flex justify-center gap-2 mb-4">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{item.category || 'General'}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{item.fileSize || '1 MB'}</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="block">
                      <Button variant="outline" size="sm" fullWidth icon={<FiDownload size={16} />}>
                        Download
                      </Button>
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-gray-500 max-w-xl mx-auto">No download files available.</Card>
        )}
      </div>
    </section>
  )
}

export default Downloads
