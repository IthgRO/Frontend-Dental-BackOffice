import React, { createContext, useContext, useState, useCallback } from 'react';
import { subDays, addDays } from 'date-fns';
import { Event } from '../types';

interface EventsContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
}

const PATIENT_NAMES = [
  'Rafli Jainudin', 'Sekar Nandita', 'Angkasa Pura', 
  'Lembayung Senja', 'Daniswara', 'John Doe'
];

const APPOINTMENT_TYPES = ['Scaling', 'General Checkup', 'Extraction', 'Bleaching'];
const APPOINTMENT_STATUSES = ['Scheduled', 'Finished', 'Encounter', 'Registered'];
const APPOINTMENT_COLORS = ['appointment-pink', 'appointment-green', 'appointment-blue'];

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomEvents = (count = 10): Event[] => {
  const events: Event[] = [];
  const startRange = subDays(new Date(), 7).getTime();
  const endRange = addDays(new Date(), 7).getTime();

  for (let i = 0; i < count; i++) {
    const randomTime = Math.floor(Math.random() * (endRange - startRange)) + startRange;
    const randomDate = new Date(randomTime);
    const startHour = 9 + Math.floor(Math.random() * 8);
    const startMinute = Math.floor(Math.random() * 4) * 15;
    
    const start = new Date(randomDate);
    start.setHours(startHour, startMinute, 0);
    
    const durationMinutes = pickRandom([30, 60]);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    events.push({
      id: String(i + 1),
      title: pickRandom(PATIENT_NAMES),
      start,
      end,
      doctorId: `doc${Math.floor(Math.random() * 3) + 1}`,
      extendedProps: {
        patient: pickRandom(PATIENT_NAMES),
        type: pickRandom(APPOINTMENT_TYPES),
        status: pickRandom(APPOINTMENT_STATUSES),
      },
      className: [pickRandom(APPOINTMENT_COLORS)],
    });
  }

  return events;
};

interface EventsProviderProps {
  children: React.ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(() => generateRandomEvents(12));

  const addEvent = useCallback((event: Event) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const updateEvent = useCallback((id: string, updatedEvent: Partial<Event>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEventsContext must be used within an EventsProvider');
  }
  return context;
};

export default EventsContext;