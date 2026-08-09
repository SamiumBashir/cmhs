import { motion } from 'framer-motion'
import { FiBookOpen, FiUsers, FiAward, FiCalendar } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'
import { classService, subjectService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const Academic = () => {
  const { language } = useLanguage()

  const { data: classesData, isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getAll({ limit: 50 }).then(r => r.data.data)
  })

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAll({ limit: 50 }).then(r => r.data.data)
  })

  const getTitle = (obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    return language === 'bn' ? (obj.bn || obj.en || '') : (obj.en || obj.bn || '')
  }

  const classesList = (classesData && classesData.length > 0)
    ? classesData.map(c => c.name ? getTitle(c.name) : (c.class || `Class ${c.name}`))
    : ['Play Group', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']

  const subjectsList = (subjectsData && subjectsData.length > 0)
    ? subjectsData.map(s => s.name ? getTitle(s.name) : s.code)
    : ['Bangla', 'English', 'Mathematics', 'Science', 'Social Studies', 'ICT', 'Physical Education', 'Religious Education']

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{language === 'bn' ? 'শিক্ষা কার্যক্রম' : 'Academics'}</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {language === 'bn'
                ? 'আমাদের সমন্বিত শিক্ষাক্রম শিক্ষার্থীদের চিন্তাশীলতা, সৃজনশীলতা ও নৈতিকতা বৃদ্ধিতে সহায়ক।'
                : 'Our comprehensive academic program is designed to foster critical thinking, creativity, and a lifelong love of learning.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card glass className="text-center p-6">
              <div className="text-primary text-3xl mb-3 flex justify-center"><FiBookOpen /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{language === 'bn' ? 'শিক্ষাক্রম' : 'Curriculum'}</h3>
              <p className="text-sm text-gray-600">{language === 'bn' ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড' : 'Comprehensive Bangladesh Curriculum'}</p>
            </Card>
            <Card glass className="text-center p-6">
              <div className="text-primary text-3xl mb-3 flex justify-center"><FiUsers /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{language === 'bn' ? 'শিক্ষকবৃন্দ' : 'Teachers'}</h3>
              <p className="text-sm text-gray-600">{language === 'bn' ? 'অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী' : 'Highly qualified educators'}</p>
            </Card>
            <Card glass className="text-center p-6">
              <div className="text-primary text-3xl mb-3 flex justify-center"><FiAward /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{language === 'bn' ? 'সাফল্য' : 'Achievements'}</h3>
              <p className="text-sm text-gray-600">{language === 'bn' ? 'বোর্ড পরীক্ষায় কৃতিত্বপূর্ণ ফলাফল' : 'Outstanding Board Results'}</p>
            </Card>
            <Card glass className="text-center p-6">
              <div className="text-primary text-3xl mb-3 flex justify-center"><FiCalendar /></div>
              <h3 className="font-semibold text-gray-900 mb-2">{language === 'bn' ? 'সময়সূচী' : 'Routine'}</h3>
              <p className="text-sm text-gray-600">{language === 'bn' ? 'নিয়মানুগ ও পরিকল্পিত রুটিন' : 'Well-structured schedule'}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{language === 'bn' ? 'শ্রেণীসমূহ' : 'Classes Offered'}</h2>
          {classesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {classesList.map((cls, index) => (
                <motion.div
                  key={cls + index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="text-center p-4 hover:shadow-xl transition-shadow">
                    <h3 className="font-semibold text-gray-900">{cls}</h3>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{language === 'bn' ? 'বিষয়সমূহ' : 'Subjects'}</h2>
          {subjectsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subjectsList.map((subject, index) => (
                <motion.div
                  key={subject + index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="bg-white px-6 py-4 rounded-lg shadow-sm text-center">
                    <span className="font-medium text-gray-800">{subject}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join?</h2>
          <p className="text-gray-600 mb-6">Experience our academic excellence firsthand.</p>
          <Link to="/admission">
            <Button variant="primary" size="lg">Apply Now</Button>
          </Link>
        </div>
      </section>
    </>
  )
}

export default Academic




