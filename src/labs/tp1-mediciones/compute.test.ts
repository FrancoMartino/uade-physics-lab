import { describe, expect, it } from 'vitest'
import { demoAluminumSession } from '../../session/tp1.ts'
import { computeTp1, formatLengthCm } from './compute.ts'
import { ALUMINUM_DENSITY_G_CM3 } from '../../domain/measurement.ts'
import { interviewSteps } from './interview/steps.ts'

describe('TP1 demo session', () => {
  it('yields aluminum-like densities', () => {
    const computed = computeTp1(demoAluminumSession())
    expect(computed.volumes[1].complete).toBe(true)
    expect(computed.densities[1].form?.rawValue).toBeCloseTo(ALUMINUM_DENSITY_G_CM3, 1)
    expect(computed.densities[2].form?.rawValue).toBeCloseTo(ALUMINUM_DENSITY_G_CM3, 1)
    expect(computed.densities[3].form?.rawValue).toBeCloseTo(ALUMINUM_DENSITY_G_CM3, 1)
    expect(computed.fit?.slope).toBeCloseTo(ALUMINUM_DENSITY_G_CM3, 1)
    expect(computed.densities[1].aluminumPercent).not.toBeNull()
    expect(computed.densities[1].aluminumPercent!).toBeLessThan(5)
  })

  it('expresses demo heights in cm for the official form', () => {
    const computed = computeTp1(demoAluminumSession())
    expect(formatLengthCm(computed.volumes[1].parsed.h)).toBe('5,000 ± 0,005 cm')
  })

  it('warns when the hole is deeper than the piece', () => {
    const session = demoAluminumSession()
    session.body2Kind = 'steppedHole'
    session.bodies[2] = {
      h: { value: '40,0', delta: '0,05', unit: 'mm' },
      d: { value: '10,00', delta: '0,05', unit: 'mm' },
      H: { value: '20,0', delta: '0,05', unit: 'mm' },
      D: { value: '25,00', delta: '0,05', unit: 'mm' },
    }
    const computed = computeTp1(session)
    expect(computed.volumes[2].alerts.some((alert) => alert.includes('h > H'))).toBe(true)
  })

  it('keeps the custom-instrument steps after the tool question', () => {
    const session = demoAluminumSession()
    session.settings.lengthTool = 'custom'
    const steps = interviewSteps(session)
    const toolIndex = steps.findIndex((step) => step.id === 'tool')
    expect(steps[toolIndex + 1]?.id).toBe('tool-unit')
    expect(steps[toolIndex + 2]?.id).toBe('tool-delta')
  })
})
