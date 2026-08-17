export function parseDecimal(input: string): number | null {
  const trimmed = input.trim().replace(/\s/g, '').replace(',', '.')
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null
  }
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}
