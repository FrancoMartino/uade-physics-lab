import { createContext } from 'react'
import type { Tp1Session } from './tp1.ts'

export type SessionContextValue = {
  session: Tp1Session
  setSession: (updater: Tp1Session | ((prev: Tp1Session) => Tp1Session)) => void
  reset: () => void
  loadDemo: () => void
  exportJson: () => string
  importJson: (raw: string) => boolean
}

export const SessionContext = createContext<SessionContextValue | null>(null)
