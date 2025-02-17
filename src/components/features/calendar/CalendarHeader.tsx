import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'
import { useCalendarContext } from '@/context/CalendarContext'
import { HeaderProps } from '@/types'

const CalendarHeader: React.FC<HeaderProps> = ({ calendarRef }) => {
  const { view, setView, currentDate, selectedDoctor, setSelectedDoctor, doctors, filteredEvents } =
    useCalendarContext()

  const handleNav = (dir: 'prev' | 'next' | 'today') => {
    if (!calendarRef.current) return

    if (dir === 'prev') {
      calendarRef.current.prev()
    } else if (dir === 'next') {
      calendarRef.current.next()
    } else {
      calendarRef.current.today()
    }
  }

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center">
        {/* Left section - Calendar Icon and Total */}
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-lg font-medium text-gray-900">{filteredEvents.length}</span>
          <span className="text-sm text-gray-500">total appointments</span>
        </div>

        {/* Center section - Navigation and Date */}
        <div className="flex items-center gap-4 ml-8">
          <button
            onClick={() => handleNav('today')}
            className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
          >
            Today
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav('prev')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleNav('next')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <span className="text-base font-medium text-gray-900">
            {format(currentDate, 'EEE, dd MMM yyyy')}
          </span>
        </div>

        {/* Center-right section - View Toggle */}
        <div className="flex items-center border rounded-lg ml-8 bg-gray-50">
          <button
            onClick={() => setView('timeGridDay')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg ${
              view === 'timeGridDay'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setView('timeGridWeek')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg ${
              view === 'timeGridWeek'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Week
          </button>
        </div>

        {/* Right section - Doctor selector */}
        <div className="flex items-center gap-2 ml-auto">
          <Users className="w-5 h-5 text-gray-400" />
          <select
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value)}
            className="min-w-[200px] px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}

export default CalendarHeader
