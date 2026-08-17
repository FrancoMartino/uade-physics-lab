import { useContext } from 'react'
import { SessionContext, type SessionContextValue } from './session-context.ts'

export function useTp1Session(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useTp1Session must be used within SessionProvider')
  return ctx
}
