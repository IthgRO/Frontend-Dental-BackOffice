import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Calendar as FullCalendarCore } from '@fullcalendar/core'
import CalendarHeader from './CalendarHeader'
import { renderEventContent } from './EventContent'
import { CreateAppointmentModal, AppointmentModal } from './AppointmentModal'
import { useCalendarContext } from '@/context/CalendarContext'

const Calendar = () => {
  const calendarRef = useRef<FullCalendarCore | null>(null)
  const {
    view,
    currentDate,
    selectedDoctor,
    filteredEvents,
    handleEventClick,
    handleDateClick,
    handleEventDrop,
    setCurrentDate,
  } = useCalendarContext()

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.changeView(view)
    }
  }, [view])

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <CalendarHeader calendarRef={calendarRef} />

      <div className="flex-1 overflow-auto">
        <FullCalendar
          ref={ref => {
            if (ref) {
              calendarRef.current = ref.getApi()
            }
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={false}
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          slotDuration="00:15:00"
          slotLabelInterval="01:00:00"
          allDaySlot={false}
          expandRows={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={false}
          events={filteredEvents}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventDrop={handleEventDrop}
          height="auto"
          datesSet={arg => setCurrentDate(arg.start)}
        />
      </div>

      <AppointmentModal />
      <CreateAppointmentModal />
    </motion.div>
  )
}

export default Calendar
