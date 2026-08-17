export type GeometryId = 'solidCylinder' | 'steppedSolid' | 'steppedHole' | 'tube'

export type GeometryVar = {
  key: string
  symbol: string
  label: string
}

export type GeometryModel = {
  id: GeometryId
  name: string
  variables: GeometryVar[]
  volumeLatex: string
  evaluate: (values: Record<string, number>) => number
  partials: (values: Record<string, number>) => Record<string, number>
}

export function solidCylinder(pi: number): GeometryModel {
  return {
    id: 'solidCylinder',
    name: 'Cilindro macizo',
    variables: [
      { key: 'h', symbol: 'h', label: 'Altura' },
      { key: 'd', symbol: 'd', label: 'Diámetro' },
    ],
    volumeLatex: String.raw`V = \dfrac{\pi d^{2} h}{4}`,
    evaluate: ({ h, d }) => (pi * d * d * h) / 4,
    partials: ({ h, d }) => ({
      h: (pi * d * d) / 4,
      d: (pi * d * h) / 2,
    }),
  }
}

export function steppedSolid(pi: number): GeometryModel {
  return {
    id: 'steppedSolid',
    name: 'Cilindro escalonado (macizo)',
    variables: [
      { key: 'h', symbol: 'h', label: 'Altura del cilindro menor' },
      { key: 'd', symbol: 'd', label: 'Diámetro del cilindro menor' },
      { key: 'H', symbol: 'H', label: 'Altura del cilindro mayor' },
      { key: 'D', symbol: 'D', label: 'Diámetro del cilindro mayor' },
    ],
    volumeLatex: String.raw`V = \dfrac{\pi}{4}(d^{2} h + D^{2} H)`,
    evaluate: ({ h, d, H, D }) => (pi / 4) * (d * d * h + D * D * H),
    partials: ({ h, d, H, D }) => ({
      h: (pi * d * d) / 4,
      d: (pi * d * h) / 2,
      H: (pi * D * D) / 4,
      D: (pi * D * H) / 2,
    }),
  }
}

export function steppedHole(pi: number): GeometryModel {
  return {
    id: 'steppedHole',
    name: 'Cilindro con orificio parcial',
    variables: [
      { key: 'h', symbol: 'h', label: 'Profundidad del orificio' },
      { key: 'd', symbol: 'd', label: 'Diámetro del orificio' },
      { key: 'H', symbol: 'H', label: 'Altura exterior' },
      { key: 'D', symbol: 'D', label: 'Diámetro exterior' },
    ],
    volumeLatex: String.raw`V = \dfrac{\pi}{4}(D^{2} H - d^{2} h)`,
    evaluate: ({ h, d, H, D }) => (pi / 4) * (D * D * H - d * d * h),
    partials: ({ h, d, H, D }) => ({
      h: -(pi * d * d) / 4,
      d: -(pi * d * h) / 2,
      H: (pi * D * D) / 4,
      D: (pi * D * H) / 2,
    }),
  }
}

export function tube(pi: number): GeometryModel {
  return {
    id: 'tube',
    name: 'Tubo / arandela',
    variables: [
      { key: 'H', symbol: 'H', label: 'Altura' },
      { key: 'Di', symbol: 'D_i', label: 'Diámetro interior' },
      { key: 'De', symbol: 'D_e', label: 'Diámetro exterior' },
    ],
    volumeLatex: String.raw`V = \dfrac{\pi}{4}(D_e^{2} - D_i^{2}) H`,
    evaluate: ({ H, Di, De }) => (pi / 4) * (De * De - Di * Di) * H,
    partials: ({ H, Di, De }) => ({
      H: (pi / 4) * (De * De - Di * Di),
      Di: -(pi * Di * H) / 2,
      De: (pi * De * H) / 2,
    }),
  }
}

export function geometryById(id: GeometryId, pi: number): GeometryModel {
  if (id === 'solidCylinder') return solidCylinder(pi)
  if (id === 'steppedSolid') return steppedSolid(pi)
  if (id === 'steppedHole') return steppedHole(pi)
  return tube(pi)
}

export function velocityModel(): GeometryModel {
  return {
    id: 'solidCylinder',
    name: 'Velocidad media',
    variables: [
      { key: 'L', symbol: 'L', label: 'Longitud' },
      { key: 't', symbol: 't', label: 'Tiempo' },
    ],
    volumeLatex: String.raw`v = \dfrac{L}{t}`,
    evaluate: ({ L, t }) => L / t,
    partials: ({ L, t }) => ({
      L: 1 / t,
      t: -L / (t * t),
    }),
  }
}
