import { motion } from 'framer-motion'
import { FiHome, FiUsers, FiBook, FiAward, FiCalendar } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'

const PrincipalMessage = () => {
  const milestones = [
    { year: '1985', title: 'Established', description: 'Chilahati Merchants High School was founded with a vision to provide quality education.' },
    { year: '1995', title: 'First Batch', description: 'First batch of students completed their Secondary Education Examination with 100% pass rate.' },
    { year: '2005', title: 'Infrastructure', description: 'New multi-story academic building and library were constructed.' },
    { year: '2015', title: 'Digital Revolution', description: 'Introduction of computer labs and digital classrooms.' },
    { year: '2020', title: 'Expansion', description: 'New science labs and sports facilities inaugurated.' },
    { year: '2024', title: 'Today', description: 'Continuing the legacy of excellence with modern teaching methodologies.' }
  ]

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Principal's Message</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">Welcome to Chilahati Merchants High School</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-square rounded-xl overflow-hidden shadow-xl"
          >
            <img
              src="/images/principal.svg"
            />
          </motion.div>
          <div className="text-center mt-4">
            <h3 className="font-bold text-lg text-gray-900">Mr. Ahmed Hasan</h3>
            <p className="text-primary">Principal</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Dear Students, Parents, and Guardians,
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Education is the most powerful weapon which you can use to change the world.
              At Chilahati Merchants High School, we are committed to providing quality
              education that fosters intellectual curiosity, critical thinking, and moral
              integrity.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our institution has been a beacon of learning in the Chilahati region for
              over three decades. We believe in nurturing each student's unique potential
              and preparing them for success in an ever-changing world.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We are proud to offer a comprehensive curriculum that combines modern
              pedagogy with traditional values, ensuring our students are well-rounded
              individuals ready to contribute meaningfully to society.
            </p>
            <p className="mt-6 text-gray-600 leading-relaxed">
              Welcome to our school community.
            </p>
            <p className="text-right font-semibold text-gray-900 mt-4">— Mr. Ahmed Hasan, Principal</p>
          </Card>
        </div>
      </div>

      <Card title="Our Journey" glass>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {milestones.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4"
            >
              <div className="text-2xl font-bold text-primary">{item.year}</div>
              <h4 className="font-semibold text-gray-900 mt-2">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Students" value="1,200+" icon={<FiUsers size={28} />} color="primary" />
        <StatCard title="Teachers" value="45+" icon={<FiBook size={28} />} color="secondary" />
        <StatCard title="Programs" value="25+" icon={<FiAward size={28} />} color="accent" />
        <StatCard title="Years" value="35+" icon={<FiCalendar size={28} />} color="primary" />
      </div>
    </div>
  )
}

export default PrincipalMessage
