import { useState } from 'react'
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { routineService } from '../../services'

const TeacherRoutine = () => {
  const [selectedDay, setSelectedDay] = useState('monday')

  const { data } = useQuery({
    queryKey: ['teacher-routine'],
    queryFn: () => routineService.getAll({ teacher: 'teacher-001', limit: 50 }).then(r => r.data)
  })

  const dayRoutine = data?.data?.filter(r => r.day === selectedDay) || []

  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Routine</h1>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day.value}
            onClick={() => setSelectedDay(day.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedDay === day.value
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="space-y-3">
          {dayRoutine.length > 0 ? (
            dayRoutine.sort((a, b) => (a.period || 0) - (b.period || 0)).map((period) => (
              <div key={period._id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">{period.period}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{period.subject}</h3>
                  <p className="text-sm text-gray-500">
                    {period.class} - Section {period.section}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm text-gray-600">
                    {period.startTime} - {period.endTime}
                  </div>
                  <div className="text-xs text-gray-400">{period.room}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-12">No classes scheduled</p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default TeacherRoutine


