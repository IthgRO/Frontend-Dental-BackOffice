import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import i18n from './config/i18n'
import { queryClient } from './config/queryClient'
import { AppRoutes } from './routes'
import { CalendarProvider } from './context/CalendarContext'
import { DoctorsProvider } from './context/DoctorsContext'
import { EventsProvider } from './context/EventsContext'

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EventsProvider>
            <DoctorsProvider>
              <CalendarProvider>
                <AppRoutes />
                <Toaster position="top-right" />
              </CalendarProvider>
            </DoctorsProvider>
          </EventsProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default App
