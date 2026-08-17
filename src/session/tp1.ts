import type { LengthUnit, MassUnit, PiMode } from '../domain/index.ts'

export type LengthField = {
  value: string
  delta: string
  unit: LengthUnit
}

export type MassField = {
  value: string
  delta: string
  unit: MassUnit
}

export type VolumeField = {
  value: string
  delta: string
}

export type Body2Kind = 'steppedSolid' | 'steppedHole'

export type LengthTool = 'caliper-005' | 'caliper-002' | 'micrometer-001' | 'custom'

export type Tp1Texts = {
  definicionDirecta: string
  definicionIndirecta: string
  formulaGeneral: string
  formulaCuerpo3: string
  formulaDensidad: string
  exactitud: string
  ventajasFormula: string
  ventajasProbeta: string
  propiedadIntensiva: string
}

export type Tp1Settings = {
  pi: PiMode
  compact: boolean
  wizardIndex: number
  wizardStepId: string
  lengthTool: LengthTool
  lengthUnit: LengthUnit
  lengthDelta: string
  probetaDelta: string
  massDelta: string
  massUnit: MassUnit
}

export type Tp1Session = {
  version: 1
  header: {
    names: string
    dayShift: string
  }
  settings: Tp1Settings
  body2Kind: Body2Kind
  bodies: {
    1: { h: LengthField; d: LengthField }
    2: { h: LengthField; d: LengthField; H: LengthField; D: LengthField }
    3: { H: LengthField; Di: LengthField; De: LengthField }
  }
  probeta: {
    1: VolumeField
    2: VolumeField
    3: VolumeField
  }
  masses: {
    1: MassField
    2: MassField
    3: MassField
  }
  texts: Tp1Texts
}

export const LENGTH_TOOLS: Record<LengthTool, { label: string; delta: string; unit: LengthUnit; detail: string }> = {
  'caliper-005': {
    label: 'Calibre de 0,05 mm',
    delta: '0,05',
    unit: 'mm',
    detail: 'El error de cada largo queda en 0,05 mm. Vas a leer en milímetros.',
  },
  'caliper-002': {
    label: 'Calibre de 0,02 mm',
    delta: '0,02',
    unit: 'mm',
    detail: 'El error de cada largo queda en 0,02 mm. Vas a leer en milímetros.',
  },
  'micrometer-001': {
    label: 'Micrómetro de 0,01 mm',
    delta: '0,01',
    unit: 'mm',
    detail: 'El error de cada largo queda en 0,01 mm. Vas a leer en milímetros.',
  },
  custom: {
    label: 'Otro instrumento',
    delta: '',
    unit: 'mm',
    detail: 'Después te pido el error y la unidad.',
  },
}

const emptyLength = (unit: LengthUnit = 'mm', delta = ''): LengthField => ({
  value: '',
  delta,
  unit,
})

const emptyMass = (delta = ''): MassField => ({
  value: '',
  delta,
  unit: 'g',
})

const emptyVolume = (delta = ''): VolumeField => ({
  value: '',
  delta,
})

export const emptyTexts = (): Tp1Texts => ({
  definicionDirecta: '',
  definicionIndirecta: '',
  formulaGeneral: '',
  formulaCuerpo3: '',
  formulaDensidad: '',
  exactitud: '',
  ventajasFormula: '',
  ventajasProbeta: '',
  propiedadIntensiva: '',
})

export const defaultSettings = (): Tp1Settings => ({
  pi: 'machine',
  compact: false,
  wizardIndex: 0,
  wizardStepId: 'who',
  lengthTool: 'caliper-005',
  lengthUnit: 'mm',
  lengthDelta: '0,05',
  probetaDelta: '0,5',
  massDelta: '0,01',
  massUnit: 'g',
})

export function emptySession(): Tp1Session {
  const settings = defaultSettings()
  return {
    version: 1,
    header: { names: '', dayShift: '' },
    settings,
    body2Kind: 'steppedSolid',
    bodies: {
      1: { h: emptyLength(settings.lengthUnit, settings.lengthDelta), d: emptyLength(settings.lengthUnit, settings.lengthDelta) },
      2: {
        h: emptyLength(settings.lengthUnit, settings.lengthDelta),
        d: emptyLength(settings.lengthUnit, settings.lengthDelta),
        H: emptyLength(settings.lengthUnit, settings.lengthDelta),
        D: emptyLength(settings.lengthUnit, settings.lengthDelta),
      },
      3: {
        H: emptyLength(settings.lengthUnit, settings.lengthDelta),
        Di: emptyLength(settings.lengthUnit, settings.lengthDelta),
        De: emptyLength(settings.lengthUnit, settings.lengthDelta),
      },
    },
    probeta: {
      1: emptyVolume(settings.probetaDelta),
      2: emptyVolume(settings.probetaDelta),
      3: emptyVolume(settings.probetaDelta),
    },
    masses: {
      1: emptyMass(settings.massDelta),
      2: emptyMass(settings.massDelta),
      3: emptyMass(settings.massDelta),
    },
    texts: emptyTexts(),
  }
}

export function applyInstruments(session: Tp1Session): Tp1Session {
  const { lengthUnit, lengthDelta, massDelta, massUnit, probetaDelta } = session.settings
  const L = (field: LengthField): LengthField => ({ ...field, unit: lengthUnit, delta: lengthDelta })
  const M = (field: MassField): MassField => ({ ...field, unit: massUnit, delta: massDelta })
  const P = (field: VolumeField): VolumeField => ({ ...field, delta: probetaDelta })
  return {
    ...session,
    bodies: {
      1: { h: L(session.bodies[1].h), d: L(session.bodies[1].d) },
      2: {
        h: L(session.bodies[2].h),
        d: L(session.bodies[2].d),
        H: L(session.bodies[2].H),
        D: L(session.bodies[2].D),
      },
      3: { H: L(session.bodies[3].H), Di: L(session.bodies[3].Di), De: L(session.bodies[3].De) },
    },
    masses: { 1: M(session.masses[1]), 2: M(session.masses[2]), 3: M(session.masses[3]) },
    probeta: { 1: P(session.probeta[1]), 2: P(session.probeta[2]), 3: P(session.probeta[3]) },
  }
}

export function demoAluminumSession(): Tp1Session {
  const base = applyInstruments(emptySession())
  const mm = (value: string): LengthField => ({
    value,
    delta: base.settings.lengthDelta,
    unit: 'mm',
  })
  const mass = (value: string): MassField => ({
    value,
    delta: base.settings.massDelta,
    unit: 'g',
  })
  return {
    ...base,
    header: {
      names: 'Datos de prueba (Al ~ 2,7 g/cm³)',
      dayShift: 'Martes 13:30',
    },
    bodies: {
      1: { h: mm('50,0'), d: mm('20,00') },
      2: { h: mm('20,0'), d: mm('15,00'), H: mm('30,0'), D: mm('25,00') },
      3: { H: mm('20,0'), Di: mm('10,00'), De: mm('30,00') },
    },
    probeta: {
      1: { value: '15,7', delta: base.settings.probetaDelta },
      2: { value: '18,2', delta: base.settings.probetaDelta },
      3: { value: '12,6', delta: base.settings.probetaDelta },
    },
    masses: {
      1: mass('42,41'),
      2: mass('49,25'),
      3: mass('33,93'),
    },
  }
}

export const STORAGE_KEY = 'uade-physics-lab.tp1.v1'

export function serializeSession(session: Tp1Session): string {
  return JSON.stringify(session, null, 2)
}

export function parseSession(raw: string): Tp1Session | null {
  try {
    const data = JSON.parse(raw) as Partial<Tp1Session>
    if (!data.bodies || !data.masses) return null
    const blank = emptySession()
    return applyInstruments({
      ...blank,
      ...data,
      version: 1,
      header: { ...blank.header, ...data.header },
      settings: { ...blank.settings, ...data.settings },
      texts: { ...blank.texts, ...data.texts },
      bodies: {
        1: { ...blank.bodies[1], ...data.bodies[1] },
        2: { ...blank.bodies[2], ...data.bodies[2] },
        3: { ...blank.bodies[3], ...data.bodies[3] },
      },
      masses: { ...blank.masses, ...data.masses },
      probeta: { ...blank.probeta, ...data.probeta },
    })
  } catch {
    return null
  }
}

export function loadSession(): Tp1Session {
  if (typeof localStorage === 'undefined') return emptySession()
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return emptySession()
  return parseSession(raw) ?? emptySession()
}

export function saveSession(session: Tp1Session): void {
  localStorage.setItem(STORAGE_KEY, serializeSession(session))
}
