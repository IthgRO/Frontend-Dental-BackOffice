import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { X, Calendar, Clock, User, Tag, AlertCircle } from 'lucide-react'
import { useCalendarContext } from '@/context/CalendarContext'

export const AppointmentModal = () => {
  const { eventModalOpen, eventModalData, setEventModalOpen } = useCalendarContext()

  return (
    <AnimatePresence>
      {eventModalOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEventModalOpen(false)}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-lg z-50 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
              <button
                onClick={() => setEventModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">Patient</div>
                  <div className="font-medium">{eventModalData?.extendedProps.patient}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="font-medium">{eventModalData?.extendedProps.type}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-500">Time</div>
                  <div className="font-medium">
                    {format(new Date(eventModalData?.start), 'PPpp')}
                  </div>
                </div>
              </div>

              {eventModalData?.extendedProps.note && (
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-sm text-gray-500">Note</div>
                    <div className="font-medium">{eventModalData.extendedProps.note}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setEventModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export const CreateAppointmentModal = () => {
  const {
    createModalOpen,
    createModalDate,
    newPatientName,
    setNewPatientName,
    setCreateModalOpen,
    handleCreateAppointment,
  } = useCalendarContext()

  return (
    <AnimatePresence>
      {createModalOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCreateModalOpen(false)}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-lg z-50 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">New Appointment</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <input
                  type="text"
                  value={newPatientName}
                  onChange={e => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{createModalDate && format(createModalDate, 'PPpp')}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAppointment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Appointment
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default { AppointmentModal, CreateAppointmentModal }
