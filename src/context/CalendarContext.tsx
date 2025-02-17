import React, { createContext, useContext, useState, useCallback } from 'react';
import { useEventsContext } from './EventsContext';
import { useDoctorsContext } from './DoctorsContext';
import { Event, EventModalData } from '../types';

interface CalendarContextType {
  view: 'timeGridDay' | 'timeGridWeek';
  setView: (view: 'timeGridDay' | 'timeGridWeek') => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  eventModalOpen: boolean;
  setEventModalOpen: (open: boolean) => void;
  eventModalData: EventModalData | null;
  setEventModalData: (data: EventModalData | null) => void;
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  createModalDate: Date | null;
  setCreateModalDate: (date: Date | null) => void;
  newPatientName: string;
  setNewPatientName: (name: string) => void;
  handleEventClick: (info: any) => void;
  handleDateClick: (info: any) => void;
  handleEventDrop: (info: any) => void;
  handleCreateAppointment: () => void;
  filteredEvents: Event[];
  doctors: { id: string; name: string }[];
  selectedDoctor: string;
  setSelectedDoctor: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

interface CalendarProviderProps {
  children: React.ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [view, setView] = useState<'timeGridDay' | 'timeGridWeek'>('timeGridDay');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventModalData, setEventModalData] = useState<EventModalData | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalDate, setCreateModalDate] = useState<Date | null>(null);
  const [newPatientName, setNewPatientName] = useState('');

  const { events, addEvent } = useEventsContext();
  const { doctors, selectedDoctor, setSelectedDoctor } = useDoctorsContext();

  const filteredEvents = events.filter(e => e.doctorId === selectedDoctor);

  const handleEventClick = useCallback((clickInfo: any) => {
    clickInfo.jsEvent.preventDefault();
    const event = clickInfo.event;
    setEventModalData({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      extendedProps: event.extendedProps,
      className: event.classNames,
    });
    setEventModalOpen(true);
  }, []);

  const handleDateClick = useCallback((arg: any) => {
    setCreateModalDate(arg.date);
    setNewPatientName('');
    setCreateModalOpen(true);
  }, []);

  const handleEventDrop = useCallback((dropInfo: any) => {
    console.log('Event dropped:', dropInfo);
  }, []);

  const handleCreateAppointment = useCallback(() => {
    if (!createModalDate || !newPatientName) return;
    
    const newEvent: Event = {
      id: String(Date.now()),
      title: newPatientName,
      start: createModalDate,
      end: new Date(createModalDate.getTime() + 60 * 60000),
      extendedProps: {
        patient: newPatientName,
        type: 'General Checkup',
        status: 'Scheduled',
      },
      doctorId: selectedDoctor,
      className: ['appointment-blue'],
    };

    addEvent(newEvent);
    setCreateModalOpen(false);
  }, [createModalDate, newPatientName, selectedDoctor, addEvent]);

  return (
    <CalendarContext.Provider
      value={{
        view,
        setView,
        currentDate,
        setCurrentDate,
        selectedDoctor,
        setSelectedDoctor,
        eventModalOpen,
        setEventModalOpen,
        eventModalData,
        setEventModalData,
        createModalOpen,
        setCreateModalOpen,
        createModalDate,
        setCreateModalDate,
        newPatientName,
        setNewPatientName,
        handleEventClick,
        handleDateClick,
        handleEventDrop,
        handleCreateAppointment,
        filteredEvents,
        doctors,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
};

export default CalendarContext;