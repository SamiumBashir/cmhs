import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiUsers, FiBook, FiAward, FiUserCheck, FiCalendar } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import { useQuery } from '@tanstack/react-query'
import { homepageService, noticeService, eventService, galleryService, settingsService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const Home = () => {
  const { language } = useLanguage()

  const { data: homepageData, isLoading: homepageLoading } = useQuery({
    queryKey: ['homepage'],
    queryFn: () => homepageService.get().then(r => r.data.data)
  })

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get().then(r => r.data.data)
  })

  const { data: noticesData, isLoading: noticesLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: () => noticeService.getAll({ limit: 5 }).then(r => r.data.data)
  })

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getAll({ limit: 3 }).then(r => r.data.data)
  })

  const { data: galleryData, isLoading: galleryLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => galleryService.getAll({ limit: 6 }).then(r => r.data.data)
  })

  const notices = noticesData || []
  const events = eventsData || []
  const galleryItems = galleryData || []

  const schoolName = language === 'bn'
    ? (settings?.schoolName?.bn || 'চিলাহাটি মার্চেন্টস হাই স্কুল')
    : (settings?.schoolName?.en || 'Chilahati Merchants High School')

  const getTitle = (obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    return language === 'bn' ? (obj.bn || obj.en || '') : (obj.en || obj.bn || '')
  }

  const getContent = (obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    return language === 'bn' ? (obj.bn || obj.en || '') : (obj.en || obj.bn || '')
  }

  const heroSlide = homepageData?.heroSlides?.[0]
  const heroTitle = heroSlide ? getTitle(heroSlide.title) : schoolName
  const heroSubtitle = heroSlide ? getTitle(heroSlide.subtitle) : (language === 'bn'
    ? 'মানসম্মত শিক্ষা, মানবিক মূল্যবোধ এবং সর্বাঙ্গীন সমৃদ্ধির প্রত্যয়ে আমাদের নিরন্তর পথচলা।'
    : 'Empowering students with quality education, holistic development, and a commitment to excellence.')

  const dynamicStats = homepageData?.statistics?.length > 0
    ? homepageData.statistics.map(s => ({
        label: getTitle(s.label),
        value: s.value,
        icon: <FiUsers size={28} />
      }))
    : [
        { label: language === 'bn' ? 'শিক্ষার্থী' : 'Students', value: '1,200+', icon: <FiUsers size={28} /> },
        { label: language === 'bn' ? 'শিক্ষক' : 'Teachers', value: '45+', icon: <FiUserCheck size={28} /> },
        { label: language === 'bn' ? 'কার্যক্রম' : 'Programs', value: '25+', icon: <FiBook size={28} /> },
        { label: language === 'bn' ? 'প্রতিষ্ঠাকাল' : 'Established', value: settings?.established || '1985', icon: <FiAward size={28} /> }
      ]


  return (
    <>
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative py-20">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {settingsLoading || homepageLoading ? (
              <div className="h-12 w-80 bg-gray-200 rounded animate-pulse mb-4" />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {heroTitle}
              </h1>
            )}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              {heroSubtitle}
            </p>
            <div className="flex gap-4">
              <Link to="/admission">
                <Button variant="primary" size="lg">{language === 'bn' ? 'ভর্তির আবেদন করুন' : 'Apply for Admission'}</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">{language === 'bn' ? 'আরও জানুন' : 'Learn More'}</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {dynamicStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <StatCard
                  title={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color={index % 4 === 0 ? 'primary' : index % 4 === 1 ? 'secondary' : index % 4 === 2 ? 'accent' : 'primary'}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card title={language === 'bn' ? 'সর্বশেষ নোটিশ' : 'Latest Notices'} glass>
                <div className="space-y-3">
                  {noticesLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                    ))
                  ) : notices.length > 0 ? (
                    notices.slice(0, 5).map((notice) => (
                      <Link
                        key={notice._id}
                        to={`/notice`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <h4 className="font-medium text-gray-900 line-clamp-1">
                          {getTitle(notice.title)}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {getContent(notice.content).substring(0, 80)}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm py-4">No notices available.</p>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card title={language === 'bn' ? 'আসন্ন ইভেন্টসমূহ' : 'Upcoming Events'} glass>
                <div className="space-y-4">
                  {eventsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                    ))
                  ) : events.length > 0 ? (
                    events.slice(0, 4).map((event) => (
                      <div key={event._id} className="flex gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FiCalendar className="text-primary" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{getTitle(event.title)}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm py-4">No upcoming events.</p>
                  )}
                </div>
                <Link to="/events" className="block text-center mt-4 text-sm text-primary hover:text-primary/80 font-medium">
                  {language === 'bn' ? 'সব ইভেন্ট দেখুন' : 'View All Events'}
                </Link>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
              <Card title={language === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery'} glass>
                <div className="grid grid-cols-2 gap-3">
                  {galleryLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
                    ))
                  ) : galleryItems.length > 0 ? (
                    galleryItems.slice(0, 6).map((item) => (
                      <motion.div
                        key={item._id}
                        whileHover={{ scale: 1.05 }}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={item.image}
                          alt={getTitle(item.title)}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm py-4 col-span-2">No photos available.</p>
                  )}
                </div>
                <Link to="/gallery" className="block text-center mt-4 text-sm text-primary hover:text-primary/80 font-medium">
                  {language === 'bn' ? 'সম্পূর্ণ গ্যালারি দেখুন' : 'View Full Gallery'}
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'bn' ? 'আগামীর নেতৃত্ব গড়ে তোলাই আমাদের লক্ষ্য' : 'Shaping the Leaders of Tomorrow'}
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join our community of learners who are passionate about academic excellence,
              creative thinking, and character development.
            </p>
            <Link to="/admission">
              <Button variant="accent" size="lg">
                {language === 'bn' ? 'আজই শুরু করুন' : 'Start Your Journey Today'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Home
