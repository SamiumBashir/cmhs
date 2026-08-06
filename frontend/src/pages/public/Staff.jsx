import { motion } from 'framer-motion'
import { FiPhone, FiMail, FiUsers } from 'react-icons/fi'
import Avatar from '../../components/ui/Avatar'
import Card from '../../components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { staffService } from '../../services'

const Staff = () => {
  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffService.getAll({ limit: 30 }).then(r => r.data.data)
  })

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Staff</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our support staff work diligently behind the scenes to ensure the smooth
            operation of our school and provide the best possible environment for learning.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff?.map((person, index) => (
              <motion.div
                key={person._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="text-center p-6" hover>
                  <Avatar
                    src={person.avatar}
                    name={person.name?.en || person.name?.bn || 'Staff'}
                    size="lg"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mt-4">
                    {person.name?.en || person.name?.bn}
                  </h3>
                  <p className="text-primary font-medium mt-1">{person.role || 'Staff Member'}</p>
                  <p className="text-gray-600 text-sm mt-1">{person.department}</p>
                  <div className="mt-4 space-y-2">
                    {person.email && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <FiMail size={14} />
                        <span>{person.email}</span>
                      </div>
                    )}
                    {person.phone && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <FiPhone size={14} />
                        <span>{person.phone}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Staff




