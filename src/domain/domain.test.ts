import { describe, expect, it } from 'vitest'
import { express } from './measurement.ts'
import { roundErrorUp, roundValueToDelta } from './rounding.ts'
import { comparePropagation } from './propagation.ts'
import { lengthToCm } from './units.ts'
import { steppedHole, tube, velocityModel } from './geometries.ts'
import { densityFromMassVolume, densityPropagation } from './density.ts'
import { linearRegression } from './regression.ts'
import { ALUMINUM_DENSITY_G_CM3 } from './measurement.ts'

describe('rounding', () => {
  it('rounds the class error 0.543 up to 0.6', () => {
    expect(roundErrorUp(0.54328)).toBeCloseTo(0.6, 12)
  })

  it('aligns the class velocity to 38.9', () => {
    expect(roundValueToDelta(38.89492, 0.6)).toBeCloseTo(38.9, 12)
  })
})

describe('class example v = L/t', () => {
  const model = velocityModel()
  const variables = [
    { key: 'L', value: 350, delta: 1 },
    { key: 't', value: 9.0, delta: 0.1 },
  ]

  it('reproduces v = 38.9 ± 0.6 by both methods', () => {
    const compared = comparePropagation(variables, model.evaluate, model.partials)

    expect(compared.partials.value).toBeCloseTo(350 / 9, 10)
    expect(compared.partials.delta).toBeCloseTo(0.5432, 3)

    expect(compared.extremes.max).toBeCloseTo(351 / 8.9, 4)
    expect(compared.extremes.min).toBeCloseTo(349 / 9.1, 4)
    expect(compared.extremes.delta).toBeCloseTo(0.54328, 3)

    const fromPartials = express(compared.partials.value, compared.partials.delta)
    const fromExtremes = express(compared.extremes.value, compared.extremes.delta)

    expect(fromPartials.value).toBe(38.9)
    expect(fromPartials.delta).toBe(0.6)
    expect(fromExtremes.value).toBe(38.9)
    expect(fromExtremes.delta).toBe(0.6)
  })
})

describe('units', () => {
  it('converts 23.4 mm to 2.34 cm', () => {
    expect(lengthToCm(23.4, 'mm')).toBeCloseTo(2.34, 12)
  })
})

describe('tube geometry', () => {
  it('has a negative partial with respect to inner diameter', () => {
    const model = tube(Math.PI)
    const grads = model.partials({ H: 2, Di: 1, De: 3 })
    expect(grads.Di).toBeLessThan(0)
    expect(grads.De).toBeGreaterThan(0)
    expect(grads.H).toBeGreaterThan(0)
  })
})

describe('stepped hole', () => {
  it('subtracts the cavity and has negative partials for the hole', () => {
    const model = steppedHole(Math.PI)
    const values = { h: 1, d: 1, H: 3, D: 3 }
    const volume = model.evaluate(values)
    const solid = (Math.PI / 4) * (9 * 3)
    const hole = (Math.PI / 4) * (1 * 1)
    expect(volume).toBeCloseTo(solid - hole, 10)
    const grads = model.partials(values)
    expect(grads.h).toBeLessThan(0)
    expect(grads.d).toBeLessThan(0)
  })
})

describe('density', () => {
  it('adds mass and volume contributions', () => {
    const compared = densityPropagation(10, 0.1, 5, 0.2)
    expect(compared.partials.value).toBeCloseTo(2, 12)
    expect(compared.partials.delta).toBeCloseTo(0.1 / 5 + (10 * 0.2) / 25, 10)
    expect(compared.partials.contributions).toHaveLength(2)
  })

  it('recovers ~2.7 g/cm³', () => {
    const d = 2
    const h = 5
    const volume = (Math.PI * d * d * h) / 4
    const mass = ALUMINUM_DENSITY_G_CM3 * volume
    expect(densityFromMassVolume(mass, volume)).toBeCloseTo(2.7, 10)
  })
})

describe('linear regression', () => {
  it('fits mass vs volume through (0,0) and three aluminum points', () => {
    const volumes = [0, 5, 10, 15]
    const points = volumes.map((V) => ({ x: V, y: 2.7 * V }))
    const fit = linearRegression(points)
    expect(fit).not.toBeNull()
    expect(fit!.slope).toBeCloseTo(2.7, 10)
    expect(fit!.intercept).toBeCloseTo(0, 10)
    expect(fit!.r2).toBeCloseTo(1, 10)
  })
})
