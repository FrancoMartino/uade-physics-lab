import { useOutletContext } from 'react-router'
import type { Tp1Computed } from './compute.ts'

export function useTp1Computed(): Tp1Computed {
  return useOutletContext<Tp1Computed>()
}
