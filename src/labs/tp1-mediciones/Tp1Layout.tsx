import { Outlet } from 'react-router'
import { computeTp1 } from './compute.ts'
import { useTp1Session } from '../../session/useTp1Session.ts'

export function Tp1Layout() {
  const { session } = useTp1Session()
  const computed = computeTp1(session)
  return <Outlet context={computed} />
}
