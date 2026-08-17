import {
  ALUMINUM_DENSITY_G_CM3,
  comparePropagation,
  densityPropagation,
  errorVsReference,
  express,
  formatDecimal,
  geometryById,
  lengthToCm,
  linearRegression,
  massToG,
  parseDecimal,
  piValue,
  type CompareResult,
  type Expressed,
  type GeometryModel,
  type LinearFit,
  type NamedValue,
} from '../../domain/index.ts'
import type { LengthField, MassField, Tp1Session, VolumeField } from '../../session/tp1.ts'

export type ParsedLength = {
  valueCm: number
  deltaCm: number
  enteredValue: number
  enteredDelta: number
  unit: LengthField['unit']
}

export type VolumeComputation = {
  complete: boolean
  model: GeometryModel
  compared: CompareResult | null
  form: Expressed | null
  extremes: Expressed | null
  parsed: Record<string, ParsedLength>
  alerts: string[]
}

export type DirectVolumeComputation = {
  complete: boolean
  rawValue: number | null
  rawDelta: number | null
  form: Expressed | null
  alerts: string[]
}

export type DensityComputation = {
  complete: boolean
  compared: CompareResult | null
  form: Expressed | null
  extremes: Expressed | null
  massG: number | null
  volumeMl: number | null
  aluminumPercent: number | null
  alerts: string[]
}

function parseLength(field: LengthField): ParsedLength | null {
  const value = parseDecimal(field.value)
  const delta = parseDecimal(field.delta)
  if (value === null || delta === null) return null
  return {
    valueCm: lengthToCm(value, field.unit),
    deltaCm: lengthToCm(delta, field.unit),
    enteredValue: value,
    enteredDelta: delta,
    unit: field.unit,
  }
}

function lengthAlerts(label: string, parsed: ParsedLength): string[] {
  const alerts: string[] = []
  if (parsed.enteredDelta < 0) alerts.push(`${label}: el error no puede ser negativo.`)
  if (parsed.enteredValue <= 0) alerts.push(`${label}: el valor medido debe ser positivo.`)
  if (parsed.enteredDelta >= parsed.enteredValue && parsed.enteredValue > 0) {
    alerts.push(`${label}: Δ es mayor o igual que el valor. Revisá unidad o lectura.`)
  }
  return alerts
}

function computeGeometryVolume(
  model: GeometryModel,
  fields: Record<string, LengthField>,
): VolumeComputation {
  const parsed: Record<string, ParsedLength> = {}
  const alerts: string[] = []
  let complete = true

  for (const variable of model.variables) {
    const field = fields[variable.key]
    const item = parseLength(field)
    if (!item) {
      complete = false
      continue
    }
    parsed[variable.key] = item
    alerts.push(...lengthAlerts(variable.label, item))
  }

  if (!complete) {
    return { complete: false, model, compared: null, form: null, extremes: null, parsed, alerts }
  }

  const variables: NamedValue[] = model.variables.map((variable) => ({
    key: variable.key,
    value: parsed[variable.key].valueCm,
    delta: parsed[variable.key].deltaCm,
  }))

  const compared = comparePropagation(variables, model.evaluate, model.partials)
  if (compared.partials.value <= 0) {
    alerts.push('El volumen dio menor o igual a 0. Revisá la geometría (¿orificio más grande que el cuerpo?).')
  }

  return {
    complete: true,
    model,
    compared,
    form: express(compared.partials.value, compared.partials.delta),
    extremes: express(compared.extremes.value, compared.extremes.delta),
    parsed,
    alerts,
  }
}

function computeProbeta(field: VolumeField, body: number): DirectVolumeComputation {
  const value = parseDecimal(field.value)
  const delta = parseDecimal(field.delta)
  const alerts: string[] = []
  if (value === null || delta === null) {
    return { complete: false, rawValue: null, rawDelta: null, form: null, alerts }
  }
  if (delta < 0) alerts.push(`Probeta cuerpo ${body}: el error no puede ser negativo.`)
  if (value <= 0) alerts.push(`Probeta cuerpo ${body}: el volumen debe ser positivo.`)
  if (delta >= value && value > 0) {
    alerts.push(`Probeta cuerpo ${body}: Δ es mayor o igual que el valor.`)
  }
  return {
    complete: true,
    rawValue: value,
    rawDelta: delta,
    form: express(value, delta),
    alerts,
  }
}

function computeDensity(mass: MassField, volume: VolumeComputation, body: number): DensityComputation {
  const massValue = parseDecimal(mass.value)
  const massDelta = parseDecimal(mass.delta)
  const alerts: string[] = []
  if (massValue === null || massDelta === null || !volume.complete || !volume.compared) {
    return {
      complete: false,
      compared: null,
      form: null,
      extremes: null,
      massG: massValue === null ? null : massToG(massValue, mass.unit),
      volumeMl: volume.compared?.partials.value ?? null,
      aluminumPercent: null,
      alerts,
    }
  }
  const massG = massToG(massValue, mass.unit)
  const deltaMassG = massToG(massDelta, mass.unit)
  const volumeMl = volume.compared.partials.value
  const deltaVolume = volume.compared.partials.delta
  const compared = densityPropagation(massG, deltaMassG, volumeMl, deltaVolume)
  const density = compared.partials.value
  if (density > 200) {
    alerts.push(
      `Cuerpo ${body}: ρ ≈ ${density.toFixed(0)} g/cm³. ¿Cargaste mm como si fueran cm? Debería rondar 2,7.`,
    )
  } else if (density < 1 || density > 5) {
    alerts.push(
      `Cuerpo ${body}: ρ = ${density.toFixed(2)} g/cm³ queda lejos de 2,7. Revisá unidades o la geometría.`,
    )
  }
  if (massDelta >= massValue && massValue > 0) {
    alerts.push(`Cuerpo ${body}: Δm es mayor o igual que la masa.`)
  }
  return {
    complete: true,
    compared,
    form: express(compared.partials.value, compared.partials.delta),
    extremes: express(compared.extremes.value, compared.extremes.delta),
    massG,
    volumeMl,
    aluminumPercent: errorVsReference(density, ALUMINUM_DENSITY_G_CM3),
    alerts,
  }
}

export type Tp1Computed = {
  volumes: { 1: VolumeComputation; 2: VolumeComputation; 3: VolumeComputation }
  probetas: { 1: DirectVolumeComputation; 2: DirectVolumeComputation; 3: DirectVolumeComputation }
  densities: { 1: DensityComputation; 2: DensityComputation; 3: DensityComputation }
  fit: LinearFit | null
  graphicalPercent: number | null
  alerts: string[]
}

export function computeTp1(session: Tp1Session): Tp1Computed {
  const pi = piValue(session.settings.pi)
  const body2Id = session.body2Kind === 'steppedHole' ? 'steppedHole' : 'steppedSolid'

  const volumes = {
    1: computeGeometryVolume(geometryById('solidCylinder', pi), session.bodies[1]),
    2: computeGeometryVolume(geometryById(body2Id, pi), session.bodies[2]),
    3: computeGeometryVolume(geometryById('tube', pi), session.bodies[3]),
  }

  if (volumes[2].complete && session.body2Kind === 'steppedHole') {
    const h = volumes[2].parsed.h
    const H = volumes[2].parsed.H
    if (h && H && h.valueCm > H.valueCm) {
      volumes[2].alerts.push('Cuerpo 2: el agujero es más profundo que la pieza (h > H). Revisá esas dos alturas.')
    }
  }

  if (volumes[3].complete) {
    const Di = volumes[3].parsed.Di
    const De = volumes[3].parsed.De
    if (Di && De && Di.valueCm >= De.valueCm) {
      volumes[3].alerts.push('Cuerpo 3: Di ≥ De. El diámetro interior no puede ser mayor o igual que el exterior.')
    }
  }

  const probetas = {
    1: computeProbeta(session.probeta[1], 1),
    2: computeProbeta(session.probeta[2], 2),
    3: computeProbeta(session.probeta[3], 3),
  }

  const densities = {
    1: computeDensity(session.masses[1], volumes[1], 1),
    2: computeDensity(session.masses[2], volumes[2], 2),
    3: computeDensity(session.masses[3], volumes[3], 3),
  }

  const points: { x: number; y: number }[] = [{ x: 0, y: 0 }]
  for (const body of [1, 2, 3] as const) {
    if (densities[body].complete && densities[body].volumeMl !== null && densities[body].massG !== null) {
      points.push({ x: densities[body].volumeMl!, y: densities[body].massG! })
    }
  }
  const fit = points.length >= 2 ? linearRegression(points) : null
  const graphicalPercent =
    fit && Number.isFinite(fit.slope) ? errorVsReference(fit.slope, ALUMINUM_DENSITY_G_CM3) : null

  const alerts = [
    ...volumes[1].alerts,
    ...volumes[2].alerts,
    ...volumes[3].alerts,
    ...probetas[1].alerts,
    ...probetas[2].alerts,
    ...probetas[3].alerts,
    ...densities[1].alerts,
    ...densities[2].alerts,
    ...densities[3].alerts,
  ]

  return { volumes, probetas, densities, fit, graphicalPercent, alerts }
}

export function formatLengthCm(parsed: ParsedLength | undefined): string {
  if (!parsed) return '—'
  const expressed = express(parsed.valueCm, parsed.deltaCm)
  return `${formatDecimal(expressed.value, expressed.decimals)} ± ${formatDecimal(expressed.delta, expressed.decimals)} cm`
}

export function conversionHint(parsed: ParsedLength | undefined, symbol: string): string | null {
  if (!parsed || parsed.unit === 'cm') return null
  return `${symbol} = ${parsed.enteredValue} ${parsed.unit} → ${parsed.valueCm} cm`
}

export function volumeErrorLatex(model: GeometryModel): string {
  const terms = model.variables.map(
    (variable) => String.raw`\left|\frac{\partial V}{\partial ${variable.symbol}}\right|\Delta ${variable.symbol}`,
  )
  return String.raw`\Delta V = ${terms.join(' + ')}`
}

export const GENERAL_ERROR_LATEX = String.raw`\Delta f = \sum_i \left|\frac{\partial f}{\partial x_i}\right|\Delta x_i`

export const DENSITY_ERROR_LATEX =
  String.raw`\Delta\rho = \left|\frac{\partial\rho}{\partial m}\right|\Delta m + \left|\frac{\partial\rho}{\partial V}\right|\Delta V`
