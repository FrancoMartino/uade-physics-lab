export const LENGTH_UNITS = ['mm', 'cm', 'm'] as const
export const MASS_UNITS = ['mg', 'g', 'kg'] as const
export const VOLUME_UNITS = ['ml', 'cm3'] as const

export type LengthUnit = (typeof LENGTH_UNITS)[number]
export type MassUnit = (typeof MASS_UNITS)[number]
export type VolumeUnit = (typeof VOLUME_UNITS)[number]

const LENGTH_TO_CM: Record<LengthUnit, number> = {
  mm: 0.1,
  cm: 1,
  m: 100,
}

const MASS_TO_G: Record<MassUnit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
}

export function lengthToCm(value: number, unit: LengthUnit): number {
  return value * LENGTH_TO_CM[unit]
}

export function massToG(value: number, unit: MassUnit): number {
  return value * MASS_TO_G[unit]
}

export function volumeToMl(value: number, _unit: VolumeUnit): number {
  return value
}

export function lengthUnitLabel(unit: LengthUnit): string {
  return unit
}

export function massUnitLabel(unit: MassUnit): string {
  return unit
}

export function volumeUnitLabel(unit: VolumeUnit): string {
  return unit === 'cm3' ? 'cm³' : 'ml'
}
