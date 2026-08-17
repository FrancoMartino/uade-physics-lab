import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { SessionProvider } from './session/SessionContext.tsx'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TooltipProvider>
        <SessionProvider>
          <App />
          <Toaster />
        </SessionProvider>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)
