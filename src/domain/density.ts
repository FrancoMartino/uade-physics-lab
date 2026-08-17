import { comparePropagation, type CompareResult, type NamedValue } from './propagation.ts'

export function densityFromMassVolume(massG: number, volumeMl: number): number {
  return massG / volumeMl
}

export function densityPropagation(massG: number, deltaMassG: number, volumeMl: number, deltaVolumeMl: number): CompareResult {
  const variables: NamedValue[] = [
    { key: 'm', value: massG, delta: deltaMassG },
    { key: 'V', value: volumeMl, delta: deltaVolumeMl },
  ]
  return comparePropagation(
    variables,
    ({ m, V }) => m / V,
    ({ m, V }) => ({
      m: 1 / V,
      V: -m / (V * V),
    }),
  )
}
