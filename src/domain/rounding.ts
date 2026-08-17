/** Round half away from zero for positive lab values (5 goes up). */
export function roundHalfUp(value: number, decimals: number): number {
  if (decimals < 0) {
    const factor = 10 ** -decimals
    const scaled = value / factor
    const shifted = scaled >= 0 ? Math.floor(scaled + 0.5 + Number.EPSILON) : Math.ceil(scaled - 0.5 - Number.EPSILON)
    return shifted * factor
  }
  const factor = 10 ** decimals
  const scaled = value * factor
  const shifted = scaled >= 0 ? Math.floor(scaled + 0.5 + Number.EPSILON) : Math.ceil(scaled - 0.5 - Number.EPSILON)
  return Number((shifted / factor).toFixed(decimals))
}

export function orderOfMagnitude(value: number): number {
  const abs = Math.abs(value)
  if (abs === 0) return 0
  return Math.floor(Math.log10(abs))
}

/**
 * Round an absolute error up to 1 significant figure.
 * Matches the class: 0.543 → 0.6 (never claim a tighter error by rounding down).
 */
export function roundErrorUp(delta: number): number {
  const abs = Math.abs(delta)
  if (abs === 0) return 0
  const exp = orderOfMagnitude(abs)
  const factor = 10 ** exp
  const significand = abs / factor
  let rounded = Math.ceil(significand - 1e-12)
  let usedExp = exp
  if (rounded >= 10) {
    rounded = 1
    usedExp = exp + 1
  }
  const result = Math.sign(delta) * rounded * 10 ** usedExp
  const decimals = Math.max(0, -usedExp)
  return Number(result.toFixed(decimals))
}

export function decimalPlacesForDelta(delta: number): number {
  if (delta === 0) return 0
  return Math.max(0, -orderOfMagnitude(delta))
}

/** Round `value` to the same precision as an already-rounded `delta`. */
export function roundValueToDelta(value: number, delta: number): number {
  const decimals = decimalPlacesForDelta(delta)
  return roundHalfUp(value, decimals)
}

export function roundToSigFigs(value: number, sigFigs: number): number {
  const abs = Math.abs(value)
  if (abs === 0) return 0
  const exp = orderOfMagnitude(abs)
  const decimals = sigFigs - 1 - exp
  return roundHalfUp(value, decimals)
}
