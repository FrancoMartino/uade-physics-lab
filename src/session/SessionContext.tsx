import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  demoAluminumSession,
  emptySession,
  loadSession,
  parseSession,
  saveSession,
  serializeSession,
  type Tp1Session,
} from './tp1.ts'
import { SessionContext, type SessionContextValue } from './session-context.ts'

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Tp1Session>(() => loadSession())

  useEffect(() => {
    saveSession(session)
  }, [session])

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      setSession: (updater) => {
        setSessionState((prev) => (typeof updater === 'function' ? updater(prev) : updater))
      },
      reset: () => setSessionState(emptySession()),
      loadDemo: () => setSessionState(demoAluminumSession()),
      exportJson: () => serializeSession(session),
      importJson: (raw) => {
        const parsed = parseSession(raw)
        if (!parsed) return false
        setSessionState(parsed)
        return true
      },
    }),
    [session],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
