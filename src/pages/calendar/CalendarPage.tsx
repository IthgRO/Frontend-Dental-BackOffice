import React from 'react'
import { EventsProvider } from '@/context/EventsContext'
import { DoctorsProvider } from '@/context/DoctorsContext'
import { CalendarProvider } from '@/context/CalendarContext'
import Calendar from '@/components/features/calendar/Calendar'

const CalendarPage: React.FC = () => {
  return (
    <EventsProvider>
      <DoctorsProvider>
        <CalendarProvider>
          <div className="h-full flex flex-col overflow-hidden bg-white rounded-lg">
            <Calendar />
          </div>
        </CalendarProvider>
      </DoctorsProvider>
    </EventsProvider>
  )
}

export default CalendarPage
