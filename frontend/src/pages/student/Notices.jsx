import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiFileText, FiBell, FiDownload, FiFilter } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { useQuery } from '@tanstack/react-query'
import { noticeService } from '../../services'

const StudentNotices = () => {
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['student-notices'],
    queryFn: () => noticeService.getAll({ limit: 50 }).then(r => r.data)
  })

  const notices = data?.data || []

  const categories = [
    { value: '', label: 'All' },
    { value: 'general', label: 'General' },
    { value: 'academic', label: 'Academic' },
    { value: 'exam', label: 'Examination' },
    { value: 'result', label: 'Result' },
    { value: 'event', label: 'Event' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const filteredNotices = selectedCategory
    ? notices.filter(n => n.category === selectedCategory)
    : notices

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {notice.isPinned && (
                        <Badge variant="accent" size="sm">Pinned</Badge>
                      )}
                      <Badge variant={notice.category === 'urgent' ? 'danger' : 'primary'} size="sm">
                        {notice.category || 'General'}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {notice.title?.en || notice.title}
                    </h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {notice.content?.en || notice.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>{new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}</span>
                      {notice.attachments && notice.attachments.length > 0 && (
                        <div className="flex gap-1">
                          {notice.attachments.map((att, i) => (
                            <a key={i} href={att.url} className="flex items-center gap-1 text-primary">
                              <FiDownload size={14} />
                              {att.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredNotices.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <FiBell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No notices found</p>
        </Card>
      )}
    </div>
  )
}

export default StudentNotices



