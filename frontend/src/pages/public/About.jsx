import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const About = () => {
  const { language } = useLanguage()
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get().then(r => r.data.data)
  })

  const schoolName = language === 'bn'
    ? (settings?.schoolName?.bn || 'চিলাহাটি মার্চেন্টস হাই স্কুল')
    : (settings?.schoolName?.en || 'Chilahati Merchants High School')

  const principalName = language === 'bn'
    ? (settings?.principal?.bn || 'ডা. আহমেদ হাসান')
    : (settings?.principal?.en || 'Dr. Ahmed Hasan')

  const address = language === 'bn'
    ? (settings?.address?.bn || 'চিলাহাটি, নীলফামারী, বাংলাদেশ')
    : (settings?.address?.en || 'Chilahati, Nilphamari, Bangladesh')

  const principalsMessage = language === 'bn'
    ? "সুপ্রিয় শিক্ষার্থী ও অভিভাবকবৃন্দ, চিলাহাটি মার্চেন্টস হাই স্কুলে আপনাদের স্বাগতম। শিক্ষা হলো সর্বোচ্চ শক্তিশালী হাতিয়ার। আমাদের প্রতিষ্ঠান গত ৩৫ বছর ধরে গুণগত শিক্ষা এবং সুশিক্ষা নিশ্চিত করতে বদ্ধপরিকর।"
    : "Dear Students, Parents, and Guardians, Welcome to Chilahati Merchants High School. Education is the most powerful weapon which you can use to change the world. Our institution has been committed to providing quality education that fosters intellectual curiosity, critical thinking, and moral integrity."

  const milestones = [
    { year: settings?.established || '1985', title: 'Founded', description: `${schoolName} was established` },
    { year: '1995', title: 'ISO Certified', description: 'Achieved ISO 9001 certification' },
    { year: '2005', title: 'Digital Classroom', description: 'Introduced digital classrooms and smart boards' },
    { year: '2015', title: 'Expanded Campus', description: 'New science labs and library building' },
    { year: '2020', title: 'Online Learning', description: 'Launched comprehensive e-learning platform' },
    { year: '2026', title: 'Modern Era', description: 'Continued excellence in education' }
  ]

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {schoolName} has been providing quality education since {settings?.established || '1985'}, fostering academic excellence and character development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                {settings?.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-48 h-48 object-contain" />
                ) : (
                  <div className="text-4xl font-bold text-primary">CMHS</div>
                )}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card glass>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{language === 'bn' ? 'আমাদের লক্ষ্য' : 'Our Mission'}</h2>
                <p className="text-gray-700 mb-4">
                  To provide accessible, high-quality education that empowers students to become
                  lifelong learners, responsible citizens, and leaders in their communities.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{language === 'bn' ? 'আমাদের দৃষ্টিভঙ্গি' : 'Our Vision'}</h3>
                <p className="text-gray-700">
                  To be a leading educational institution that cultivates intellectual excellence,
                  ethical character, and global citizenship.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{language === 'bn' ? 'আমাদের পরিক্রমা' : 'Our Journey'}</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year + index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}
                >
                  <div className="md:w-1/2">
                    <Card className="p-6">
                      <div className="text-3xl font-bold text-primary mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </Card>
                  </div>
                  <div className="md:w/2 flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {milestone.year.slice(-2)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card glass>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{language === 'bn' ? 'ক্যাম্পাস পরিচিতি' : 'Campus Location'}</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-primary mt-0.5 flex-shrink-0" size={20} />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-primary flex-shrink-0" size={20} />
                  <span>{settings?.phone || '+880 171 123 4567'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-primary flex-shrink-0" size={20} />
                  <span>{settings?.email || 'info@cmhs.edu.bd'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiClock className="text-primary flex-shrink-0" size={20} />
                  <span>Sunday - Thursday: 8:00 AM - 4:00 PM</span>
                </div>
              </div>
            </Card>

            <Card glass>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{language === 'bn' ? 'প্রধান শিক্ষকের বাণী' : "Principal's Message"}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{principalsMessage}</p>
              <p className="font-medium text-gray-900">— {principalName}, Principal</p>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
