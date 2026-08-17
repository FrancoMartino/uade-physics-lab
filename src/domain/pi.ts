export const PI_MODES = ['machine', 'approx314', 'approx31416'] as const

export type PiMode = (typeof PI_MODES)[number]

export function piValue(mode: PiMode): number {
  if (mode === 'approx314') return 3.14
  if (mode === 'approx31416') return 3.1416
  return Math.PI
}

export function piLabel(mode: PiMode): string {
  if (mode === 'approx314') return '3,14'
  if (mode === 'approx31416') return '3,1416'
  return 'π'
}
