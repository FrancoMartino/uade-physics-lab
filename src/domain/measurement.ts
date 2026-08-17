import { decimalPlacesForDelta, roundErrorUp, roundToSigFigs, roundValueToDelta } from './rounding.ts'

export type Expressed = {
  rawValue: number
  rawDelta: number
  value: number
  delta: number
  decimals: number
  relative: number
  percent: number
  percentRounded: number
}

export function express(rawValue: number, rawDelta: number): Expressed {
  const delta = roundErrorUp(Math.abs(rawDelta))
  const value = roundValueToDelta(rawValue, delta)
  const decimals = decimalPlacesForDelta(delta)
  const relative = rawValue === 0 ? Number.POSITIVE_INFINITY : Math.abs(rawDelta / rawValue)
  const percent = relative * 100
  const percentRounded = Number.isFinite(percent) ? roundToSigFigs(percent, 2) : percent
  return {
    rawValue,
    rawDelta: Math.abs(rawDelta),
    value,
    delta,
    decimals,
    relative,
    percent,
    percentRounded,
  }
}

export function percentDifference(a: number, b: number): number {
  if (b === 0) return a === 0 ? 0 : Number.POSITIVE_INFINITY
  return (Math.abs(a - b) / Math.abs(b)) * 100
}

export const ALUMINUM_DENSITY_G_CM3 = 2.7

export function errorVsReference(calculated: number, reference: number): number {
  if (reference === 0) return Number.POSITIVE_INFINITY
  return (Math.abs(calculated - reference) / Math.abs(reference)) * 100
}
