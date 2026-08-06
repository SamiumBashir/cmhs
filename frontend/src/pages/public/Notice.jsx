import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiBell, FiTag, FiEye, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import SearchBar from '../../components/ui/SearchBar'
import { useQuery } from '@tanstack/react-query'
import { noticeService } from '../../services'

const Notice = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['notices', currentPage, selectedCategory, searchQuery],
    queryFn: () => {
      const params = { page: currentPage, limit: 10 }
      if (selectedCategory) params.category = selectedCategory
      if (searchQuery) params.search = searchQuery
      return noticeService.getAll(params).then(r => r.data)
    }
  })

  const notices = data?.data || []
  const pagination = data?.pagination || {}

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'academic', label: 'Academic' },
    { value: 'admission', label: 'Admission' },
    { value: 'exam', label: 'Examination' },
    { value: 'result', label: 'Result' },
    { value: 'event', label: 'Event' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'urgent', label: 'Urgent' }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Notices</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest notices and announcements from the school.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search notices..."
          />
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value)
                setCurrentPage(1)
              }}
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

        <div className="max-w-4xl mx-auto space-y-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </Card>
            ))
          ) : (
            notices.map((notice, index) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={notice.isPinned ? 'border-l-4 border-primary' : ''}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={notice.category === 'urgent' ? 'danger' : 'primary'} size="sm">
                          {notice.category || 'General'}
                        </Badge>
                        {notice.isPinned && (
                          <Badge variant="accent" size="sm">
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <Link to={`/notice/${notice._id}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors">
                          {notice.title?.en || notice.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {notice.content?.en
                          ? notice.content.en.substring(0, 120) + '...'
                          : notice.content?.substring(0, 120) + '...'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={14} />
                          {new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link to={`/notice/${notice._id}`} className="ml-4">
                      <FiEye size={20} className="text-gray-400 hover:text-primary" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage === pagination.totalPages}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Notice




