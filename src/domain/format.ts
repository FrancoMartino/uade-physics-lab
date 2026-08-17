import { decimalPlacesForDelta } from './rounding.ts'

const SUPER: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '-': '⁻',
}

export function formatDecimal(value: number, fractionDigits: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  return sign + abs.toFixed(fractionDigits).replace('.', ',')
}

export function formatAuto(value: number, delta: number): string {
  return formatDecimal(value, decimalPlacesForDelta(delta))
}

export function superscript(exp: number): string {
  return String(exp)
    .split('')
    .map((ch) => SUPER[ch] ?? ch)
    .join('')
}

export function formatScientific(value: number, sigFigs = 3): string {
  if (value === 0) return '0'
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  const exp = Math.floor(Math.log10(abs))
  let mant = abs / 10 ** exp
  const decimals = Math.max(0, sigFigs - 1)
  let rounded = Number(mant.toFixed(decimals))
  let usedExp = exp
  if (rounded >= 10) {
    rounded = rounded / 10
    usedExp += 1
  }
  const mantStr = formatDecimal(rounded, decimals)
  if (usedExp === 0) return `${sign}${mantStr}`
  return `${sign}${mantStr} × 10${superscript(usedExp)}`
}

export function formatMeasurement(value: number, delta: number, unit: string): string {
  const decimals = decimalPlacesForDelta(delta)
  return `(${formatDecimal(value, decimals)} ± ${formatDecimal(delta, decimals)}) ${unit}`
}

export function formatCopyLine(symbol: string, value: number, delta: number, unit: string): string {
  return `${symbol} = ${formatMeasurement(value, delta, unit)}`
}
