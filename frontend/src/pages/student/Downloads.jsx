import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiFileText, FiDownload, FiFilter, FiSearch } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import SearchBar from '../../components/ui/SearchBar'

const documents = [
  { id: 1, title: 'Admission Form 2024', category: 'Admission', size: '1.2 MB', type: 'PDF', date: '2024-01-15' },
  { id: 2, title: 'Class 9 Syllabus', category: 'Academic', size: '3.5 MB', type: 'PDF', date: '2024-01-10' },
  { id: 3, title: 'Half Yearly Question Paper', category: 'Exam', size: '2.1 MB', type: 'PDF', date: '2024-03-20' },
  { id: 4, title: 'Fee Payment Receipt', category: 'Fees', size: '0.8 MB', type: 'PDF', date: '2024-01-15' },
  { id: 5, title: 'School Calendar 2024-25', category: 'Academic', size: '1.5 MB', type: 'PDF', date: '2024-06-01' },
  { id: 6, title: 'Annual Report 2023', category: 'General', size: '5.2 MB', type: 'PDF', date: '2023-12-31' }
]

const Downloads = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = ['', 'Admission', 'Academic', 'Exam', 'Fees', 'General']

  const filteredDocs = documents.filter(doc => {
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (selectedCategory && doc.category !== selectedCategory) return false
    return true
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Downloads</h1>

      <div className="flex gap-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search documents..."
          className="max-w-md flex-1"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat || 'All Categories'}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col" hover>
              <div className="p-6 flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <FiFileText className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">{doc.title}</h3>
                <div className="text-center space-y-1 mb-4">
                  <Badge variant="info" size="sm">{doc.category}</Badge>
                  <p className="text-sm text-gray-500">{doc.size} • {doc.type}</p>
                  <p className="text-xs text-gray-400">{new Date(doc.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiDownload size={16} />
                  Download
                </motion.button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Downloads



