import { motion } from 'framer-motion'
import { FiCheck, FiHome, FiBook, FiUsers, FiDroplet, FiShield, FiWifi } from 'react-icons/fi'
import Card from '../../components/ui/Card'

const facilities = [
  {
    icon: <FiHome size={32} />,
    title: { en: 'Modern Classrooms', bn: 'আধুনিক ক্লাসরুম' },
    description: { en: 'Well-ventilated classrooms with modern furniture and digital boards.', bn: 'আধুনিক মেবল ও ডিজিটাল বোর্ড সহ সুনির্দোল বায়ুমণ্ডলীয় ক্লাসরুম।' }
  },
  {
    icon: <FiBook size={32} />,
    title: { en: 'Digital Library', bn: 'ডিজিটাল লাইব্রেরি' },
    description: { en: 'Extensive collection of books, journals, and digital resources.', bn: 'বইয়ের অভাবসম্পন্ন সংগ্রহ এবং ডিজিটাল সম্পদ।' }
  },
  {
    icon: <FiUsers size={32} />,
    title: { en: 'Computer Lab', bn: 'কম্পিউটার ল্যাব' },
    description: { en: 'State-of-the-art computer lab with high-speed internet.', bn: 'হাই-স্পিড ইন্টারনেট সহ আধুনিক কম্পিউটার ল্যাব।' }
  },
  {
    icon: <FiDroplet size={32} />,
    title: { en: 'Science Lab', bn: '�ৈজ্ঞানিক গবেষণালয়' },
    description: { en: 'Fully equipped physics, chemistry, and biology laboratories.', bn: 'পূর্ণ সজ্জতা ফিজিক্স, রাসায়নিক এবং জীববিজ্ঞান গবেষণালয়।' }
  },
  {
    icon: <FiShield size={32} />,
    title: { en: 'Sports Complex', bn: 'খেলাধুলা জটিল' },
    description: { en: 'Multi-purpose playground with cricket, football, and basketball courts.', bn: 'ক্রিকেট, ফুটবল এবং বাস্কেটবল কোর্টসহ বহুউদ্দেশ্যীয় মাঠ।' }
  },
  {
    icon: <FiWifi size={32} />,
    title: { en: 'Wi-Fi Campus', bn: 'ওয়াই-ফাই শিক্ষাপাঠ বিশ্ববিদ্যালয়' },
    description: { en: 'High-speed Wi-Fi available across the entire campus.', bn: 'পুরো শিক্ষাপাঠ বিশ্ববিদ্যালয়জুড়ে হাই-স্পিড ওয়াই-ফাই উপলব্ধ।' }
  }
]

const Features = () => {
  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Facilities</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          We provide state-of-the-art facilities to support the holistic development of our students.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full text-center p-6" hover>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {facility.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {facility.title.en}
              </h3>
              <p className="text-gray-600 text-sm">
                {facility.description.en}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card title="Infrastructure Highlights" glass>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FiCheck className="text-primary" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Transport</h4>
              <p className="text-sm text-gray-600">Safe bus service for all areas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FiCheck className="text-primary" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Cafeteria</h4>
              <p className="text-sm text-gray-600">Hygienic food service</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FiCheck className="text-primary" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Auditorium</h4>
              <p className="text-sm text-gray-600">Multipurpose event hall</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Features
