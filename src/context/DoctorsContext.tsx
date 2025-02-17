import React, { createContext, useContext, useState } from 'react';
import { Doctor } from '../types';

interface DoctorsContextType {
  doctors: Doctor[];
  selectedDoctor: string;
  setSelectedDoctor: (id: string) => void;
}

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);

const initialDoctors: Doctor[] = [
  { 
    id: 'doc1', 
    name: 'Drg Soap Mactavish', 
    patients: 4,
    avatar: '/api/placeholder/32/32'
  },
  { 
    id: 'doc2', 
    name: "Drg Jerald O'Hara", 
    patients: 1,
    avatar: '/api/placeholder/32/32'
  },
  { 
    id: 'doc3', 
    name: 'Drg Putri Larasati', 
    status: 'NOT AVAILABLE',
    avatar: '/api/placeholder/32/32'
  },
];

interface DoctorsProviderProps {
  children: React.ReactNode;
}

export const DoctorsProvider: React.FC<DoctorsProviderProps> = ({ children }) => {
  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<string>(doctors[0].id);

  return (
    <DoctorsContext.Provider value={{ doctors, selectedDoctor, setSelectedDoctor }}>
      {children}
    </DoctorsContext.Provider>
  );
};

export const useDoctorsContext = () => {
  const context = useContext(DoctorsContext);
  if (context === undefined) {
    throw new Error('useDoctorsContext must be used within a DoctorsProvider');
  }
  return context;
};

export default DoctorsContext;