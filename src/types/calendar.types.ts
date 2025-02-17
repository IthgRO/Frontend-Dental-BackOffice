import { MutableRefObject } from 'react'
import { Calendar } from '@fullcalendar/core'

export interface Doctor {
  id: string
  name: string
  patients?: number
  status?: string
  avatar?: string
}

export interface Event {
  id: string
  title: string
  start: Date | string
  end: Date | string
  doctorId: string
  extendedProps: {
    patient: string
    type: string
    status: string
    note?: string
  }
  className: string[]
}

export type CalendarViewType = 'timeGridDay' | 'timeGridWeek'

export interface EventClickInfo {
  event: {
    id: string
    title: string
    startStr: string
    endStr: string
    extendedProps: Event['extendedProps']
    classNames: string[]
  }
  jsEvent: MouseEvent
}

export interface DateClickInfo {
  date: Date
  jsEvent: MouseEvent
}

export interface EventDropInfo {
  event: {
    id: string
    start: Date
    end: Date
  }
  oldEvent: {
    id: string
    start: Date
    end: Date
  }
}

export interface EventModalData {
  id: string
  title: string
  start: string
  end: string
  extendedProps: Event['extendedProps']
  className: string[]
}

export type CalendarRefType = MutableRefObject<Calendar | null>

export interface CalendarContextType {
  view: CalendarViewType
  setView: (view: CalendarViewType) => void
  currentDate: Date
  setCurrentDate: (date: Date) => void
  eventModalOpen: boolean
  setEventModalOpen: (open: boolean) => void
  eventModalData: EventModalData | null
  setEventModalData: (data: EventModalData | null) => void
  createModalOpen: boolean
  setCreateModalOpen: (open: boolean) => void
  createModalDate: Date | null
  setCreateModalDate: (date: Date | null) => void
  newPatientName: string
  setNewPatientName: (name: string) => void
  handleEventClick: (info: EventClickInfo) => void
  handleDateClick: (info: DateClickInfo) => void
  handleEventDrop: (info: EventDropInfo) => void
  handleCreateAppointment: () => void
  filteredEvents: Event[]
  doctors: Doctor[]
  selectedDoctor: string
  setSelectedDoctor: (id: string) => void
}

export interface HeaderProps {
  calendarRef: CalendarRefType
}
