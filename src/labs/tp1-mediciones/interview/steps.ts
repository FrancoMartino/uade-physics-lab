import type { LengthTool, Tp1Session } from '../../../session/tp1.ts'

export type DiagramKind = 'solid' | 'stepped' | 'tube'

export type Choice = {
  id: string
  label: string
  detail: string
}

export type InterviewStep =
  | {
      id: string
      phase: string
      title: string
      why: string
      kind: 'text'
      placeholder: string
      optional?: boolean
    }
  | {
      id: string
      phase: string
      title: string
      why: string
      kind: 'choice'
      options: Choice[]
    }
  | {
      id: string
      phase: string
      title: string
      why: string
      kind: 'measure'
      body: 1 | 2 | 3
      role: 'length' | 'probeta' | 'mass'
      field: string
      unitLabel: string
      diagram?: DiagramKind
      highlight?: string
    }
  | {
      id: string
      phase: string
      title: string
      why: string
      kind: 'result'
      body: 1 | 2 | 3
    }
  | {
      id: string
      phase: string
      title: string
      why: string
      kind: 'graph'
    }
  | {
      id: string
      phase: string
      title: string
      why: string
      kind: 'write'
      textKey:
        | 'definicionDirecta'
        | 'definicionIndirecta'
        | 'formulaGeneral'
        | 'formulaCuerpo3'
        | 'formulaDensidad'
        | 'exactitud'
        | 'ventajasFormula'
        | 'ventajasProbeta'
        | 'propiedadIntensiva'
      docsTo?: string
      optional?: boolean
    }

const TOOLS: { id: LengthTool; label: string; detail: string }[] = [
  {
    id: 'caliper-005',
    label: 'Calibre de 0,05 mm',
    detail: 'El más común. El error de todos los largos va a ser 0,05 mm.',
  },
  {
    id: 'caliper-002',
    label: 'Calibre de 0,02 mm',
    detail: 'Más fino. El error de todos los largos va a ser 0,02 mm.',
  },
  {
    id: 'micrometer-001',
    label: 'Micrómetro de 0,01 mm',
    detail: 'Tornillo micrométrico. Error 0,01 mm en todos los largos.',
  },
  {
    id: 'custom',
    label: 'Otro',
    detail: 'Te voy a pedir el error y si leés en mm o en cm.',
  },
]

export function interviewSteps(session: Tp1Session): InterviewStep[] {
  const hole = session.body2Kind === 'steppedHole'
  const lengthUnit = session.settings.lengthUnit
  const custom = session.settings.lengthTool === 'custom'

  const steps: InterviewStep[] = [
    {
      id: 'who',
      phase: 'Antes de medir',
      kind: 'text',
      title: '¿Quiénes están en el grupo?',
      why: 'Va en el encabezado del informe. Apellido y nombre alcanza.',
      placeholder: 'García, Ana; Pérez, Luis',
      optional: true,
    },
    {
      id: 'when',
      phase: 'Antes de medir',
      kind: 'text',
      title: '¿Qué día y turno es esta clase?',
      why: 'También va en el encabezado. Si no estás seguro, poné martes 13:30.',
      placeholder: 'Martes 13:30',
      optional: true,
    },
    {
      id: 'tool',
      phase: 'Antes de medir',
      kind: 'choice',
      title: '¿Con qué van a medir los largos (altura, diámetro)?',
      why: 'Elegí el instrumento. Yo uso su división de escala como error de todas esas medidas, para no pedírtelo doce veces.',
      options: TOOLS,
    },
  ]

  if (custom) {
    steps.push(
      {
        id: 'tool-unit',
        phase: 'Antes de medir',
        kind: 'choice',
        title: '¿En qué unidad leen ese instrumento?',
        why: 'El formulario pide cm. Si leés mm, yo convierto.',
        options: [
          { id: 'mm', label: 'Milímetros (mm)', detail: 'Lo habitual en calibre y micrómetro.' },
          { id: 'cm', label: 'Centímetros (cm)', detail: 'Solo si la escala ya está en cm.' },
        ],
      },
      {
        id: 'tool-delta',
        phase: 'Antes de medir',
        kind: 'text',
        title: '¿Cuál es el error de ese instrumento?',
        why: 'La división de escala, en la unidad que acabás de elegir. Ese número se usa en todos los largos.',
        placeholder: '0,05',
      },
    )
  }

  steps.push(
    {
      id: 'probeta',
      phase: 'Antes de medir',
      kind: 'choice',
      title: '¿Cuál es la división más chica de la probeta?',
      why: 'Ese número es el error de cada volumen por agua. No se propaga con π: es lectura directa.',
      options: [
        { id: '0,5', label: '0,5 ml', detail: 'Probeta más fina.' },
        { id: '1', label: '1 ml', detail: 'División de 1 mililitro.' },
        { id: '2', label: '2 ml', detail: 'Probeta más gruesa.' },
      ],
    },
    {
      id: 'balance',
      phase: 'Antes de medir',
      kind: 'choice',
      title: '¿Cuál es el error de la balanza?',
      why: 'Mirá la precisión en la pantalla o en la placa. Lleven la balanza a cero en cada pesaje.',
      options: [
        { id: '0,01', label: '0,01 g', detail: 'Balanza digital típica de laboratorio.' },
        { id: '0,1', label: '0,1 g', detail: 'Si solo da una décima de gramo.' },
        { id: '0,001', label: '0,001 g', detail: 'Si da miligramos.' },
      ],
    },
    {
      id: 'body2',
      phase: 'Antes de medir',
      kind: 'choice',
      title: 'El cuerpo 2, ¿es macizo de dos tramos o tiene un agujero que no lo atraviesa?',
      why: 'Mismas letras (h, d, H, D), distinta fórmula. Si es dos cilindros pegados, es macizo. Si le falta material adentro, es orificio.',
      options: [
        {
          id: 'steppedSolid',
          label: 'Macizo, dos cilindros',
          detail: 'Se suman los dos volúmenes.',
        },
        {
          id: 'steppedHole',
          label: 'Agujero que no pasa de lado a lado',
          detail: 'Al grande se le resta el hueco.',
        },
      ],
    },
    {
      id: 'b1-h',
      phase: 'Cuerpo 1 · cilindro',
      kind: 'measure',
      title: '¿Cuánto mide de alto este cilindro?',
      why: `Es la altura. En el formulario se llama h. Escribí lo que ves en el ${lengthUnit === 'mm' ? 'calibre, en milímetros' : 'instrumento'}. El error ya está puesto (${session.settings.lengthDelta} ${lengthUnit}).`,
      body: 1,
      role: 'length',
      field: 'h',
      unitLabel: lengthUnit,
      diagram: 'solid',
      highlight: 'h',
    },
    {
      id: 'b1-d',
      phase: 'Cuerpo 1 · cilindro',
      kind: 'measure',
      title: '¿Y el diámetro de ese mismo cilindro?',
      why: 'Diámetro: de lado a lado, pasando por el centro. En el formulario es d. No pongas el radio.',
      body: 1,
      role: 'length',
      field: 'd',
      unitLabel: lengthUnit,
      diagram: 'solid',
      highlight: 'd',
    },
    {
      id: 'b1-probeta',
      phase: 'Cuerpo 1 · cilindro',
      kind: 'measure',
      title: 'Al sumergirlo, ¿cuánta agua desplazó en la probeta?',
      why: `Eso es el volumen por desplazamiento, en mililitros. Error: ${session.settings.probetaDelta} ml.`,
      body: 1,
      role: 'probeta',
      field: 'V',
      unitLabel: 'ml',
    },
    {
      id: 'b1-mass',
      phase: 'Cuerpo 1 · cilindro',
      kind: 'measure',
      title: '¿Cuánto pesa este cilindro?',
      why: `Masa en gramos. Cero en la balanza antes de poner la pieza. Error: ${session.settings.massDelta} g.`,
      body: 1,
      role: 'mass',
      field: 'm',
      unitLabel: 'g',
    },
    {
      id: 'b1-result',
      phase: 'Cuerpo 1 · cilindro',
      kind: 'result',
      title: 'Esto es lo que copiás del cuerpo 1',
      why: 'Al formulario va el de derivadas parciales. Extremos es solo para comparar, como pidió el profesor.',
      body: 1,
    },
    {
      id: 'b2-h',
      phase: 'Cuerpo 2 · escalonado',
      kind: 'measure',
      title: hole ? '¿Qué profundidad tiene el agujero?' : '¿Qué altura tiene el cilindro más chico?',
      why: hole
        ? 'En el formulario es h: hasta dónde entra el orificio, no la altura de toda la pieza.'
        : 'En el formulario es h: solo el tramo estrecho.',
      body: 2,
      role: 'length',
      field: 'h',
      unitLabel: lengthUnit,
      diagram: 'stepped',
      highlight: 'h',
    },
    {
      id: 'b2-d',
      phase: 'Cuerpo 2 · escalonado',
      kind: 'measure',
      title: hole ? '¿Qué diámetro tiene ese agujero?' : '¿Qué diámetro tiene ese cilindro chico?',
      why: 'En el formulario es d.',
      body: 2,
      role: 'length',
      field: 'd',
      unitLabel: lengthUnit,
      diagram: 'stepped',
      highlight: 'd',
    },
    {
      id: 'b2-H',
      phase: 'Cuerpo 2 · escalonado',
      kind: 'measure',
      title: hole ? '¿Qué altura tiene la pieza por fuera?' : '¿Qué altura tiene el cilindro más grande?',
      why: 'En el formulario es H (mayúscula). No la confundas con h.',
      body: 2,
      role: 'length',
      field: 'H',
      unitLabel: lengthUnit,
      diagram: 'stepped',
      highlight: 'H',
    },
    {
      id: 'b2-D',
      phase: 'Cuerpo 2 · escalonado',
      kind: 'measure',
      title: hole ? '¿Qué diámetro tiene por fuera?' : '¿Qué diámetro tiene el cilindro grande?',
      why: 'En el formulario es D (mayúscula).',
      body: 2,
      role: 'length',
      field: 'D',
      unitLabel: lengthUnit,
      diagram: 'stepped',
      highlight: 'D',
    },
    {
      id: 'b2-probeta',
      phase: 'Cuerpo 2 · escalonado',
      kind: 'measure',
      title: '¿Cuánta agua desplazó este cuerpo en la probeta?',
      why: 'Otra vez mililitros, lectura directa.',
      body: 2,
      role: 'probeta',
      field: 'V',
      unitLabel: 'ml',
    },
    {
      id: 'b2-mass',
      phase: 'Cuerpo 2 · escalonado',
      kind: 'measure',
      title: '¿Cuánto pesa?',
      why: 'Cero en la balanza otra vez.',
      body: 2,
      role: 'mass',
      field: 'm',
      unitLabel: 'g',
    },
    {
      id: 'b2-result',
      phase: 'Cuerpo 2 · escalonado',
      kind: 'result',
      title: 'Esto es lo que copiás del cuerpo 2',
      why: 'Parciales al formulario. Extremos para la comparación.',
      body: 2,
    },
    {
      id: 'b3-H',
      phase: 'Cuerpo 3 · tubo',
      kind: 'measure',
      title: '¿Qué altura tiene el tubo (o la arandela)?',
      why: 'En el formulario es H. El grosor si es una arandela chata.',
      body: 3,
      role: 'length',
      field: 'H',
      unitLabel: lengthUnit,
      diagram: 'tube',
      highlight: 'H',
    },
    {
      id: 'b3-Di',
      phase: 'Cuerpo 3 · tubo',
      kind: 'measure',
      title: '¿Qué diámetro tiene el agujero de adentro?',
      why: 'Diámetro interior, Di. Tiene que ser más chico que el de afuera.',
      body: 3,
      role: 'length',
      field: 'Di',
      unitLabel: lengthUnit,
      diagram: 'tube',
      highlight: 'Di',
    },
    {
      id: 'b3-De',
      phase: 'Cuerpo 3 · tubo',
      kind: 'measure',
      title: '¿Qué diámetro tiene por fuera?',
      why: 'Diámetro exterior, De.',
      body: 3,
      role: 'length',
      field: 'De',
      unitLabel: lengthUnit,
      diagram: 'tube',
      highlight: 'De',
    },
    {
      id: 'b3-probeta',
      phase: 'Cuerpo 3 · tubo',
      kind: 'measure',
      title: '¿Cuánta agua desplazó?',
      why: 'Volumen por probeta, en ml.',
      body: 3,
      role: 'probeta',
      field: 'V',
      unitLabel: 'ml',
    },
    {
      id: 'b3-mass',
      phase: 'Cuerpo 3 · tubo',
      kind: 'measure',
      title: '¿Cuánto pesa el tubo?',
      why: 'Última masa. Cero en la balanza.',
      body: 3,
      role: 'mass',
      field: 'm',
      unitLabel: 'g',
    },
    {
      id: 'b3-result',
      phase: 'Cuerpo 3 · tubo',
      kind: 'result',
      title: 'Esto es lo que copiás del cuerpo 3',
      why: 'Acá también hay que dibujar el tubo en el informe. El diagrama de la pregunta sirve de modelo.',
      body: 3,
    },
    {
      id: 'graph',
      phase: 'Gráfico',
      kind: 'graph',
      title: 'Masa en función del volumen',
      why: 'Eje X: volumen por fórmula (ml). Eje Y: masa (g). Incluye (0,0). La pendiente es la densidad.',
    },
    {
      id: 'def-directa',
      phase: 'Para escribir',
      kind: 'write',
      title: 'En una frase: ¿qué es una medición directa, mirando el error absoluto?',
      why: 'El informe lo pide con tus palabras. Pista: el instrumento te da el valor y el error.',
      textKey: 'definicionDirecta',
      docsTo: '/docs/medicion-directa-indirecta',
      optional: true,
    },
    {
      id: 'def-indirecta',
      phase: 'Para escribir',
      kind: 'write',
      title: '¿Y una medición indirecta?',
      why: 'Pista: sale de una fórmula; el error se propaga. Volumen y densidad lo son.',
      textKey: 'definicionIndirecta',
      docsTo: '/docs/medicion-directa-indirecta',
      optional: true,
    },
    {
      id: 'formula-general',
      phase: 'Para escribir',
      kind: 'write',
      title: 'Anotá la fórmula general de propagación (3 variables)',
      why: 'El informe pide Δf con derivadas parciales. Abajo está la forma; escribila con tus símbolos.',
      textKey: 'formulaGeneral',
      docsTo: '/docs/propagacion-parciales',
      optional: true,
    },
    {
      id: 'formula-cuerpo3',
      phase: 'Para escribir',
      kind: 'write',
      title: '¿Cómo queda ΔV del cuerpo 3 (tubo)?',
      why: 'H, Di y De. Cuidado: ∂V/∂Di es negativo, por eso va en valor absoluto.',
      textKey: 'formulaCuerpo3',
      docsTo: '/docs/propagacion-parciales',
      optional: true,
    },
    {
      id: 'def-intensiva',
      phase: 'Para escribir',
      kind: 'write',
      title: '¿Qué es una propiedad intensiva?',
      why: 'La densidad lo es: no depende de si el pedazo es grande o chico.',
      textKey: 'propiedadIntensiva',
      docsTo: '/docs/densidad',
      optional: true,
    },
    {
      id: 'formula-densidad',
      phase: 'Para escribir',
      kind: 'write',
      title: '¿Cómo se propaga el error de ρ = m/V?',
      why: 'Dos aportes: el de la masa y el del volumen (el de la fórmula, no el de la probeta).',
      textKey: 'formulaDensidad',
      docsTo: '/docs/densidad',
      optional: true,
    },
    {
      id: 'disc-exactitud',
      phase: 'Para escribir',
      kind: 'write',
      title: '¿Qué método fue más preciso, fórmula o probeta? ¿Y más exacto?',
      why: 'Mirá los Er%. Precisión = error relativo chico. Exactitud = cerca de 2,7 g/cm³.',
      textKey: 'exactitud',
      docsTo: '/docs/precision-exactitud',
      optional: true,
    },
    {
      id: 'disc-formula',
      phase: 'Para escribir',
      kind: 'write',
      title: '¿Qué ventaja y qué desventaja tiene medir el volumen con la fórmula del cilindro?',
      why: 'Pensá en precisión del calibre vs asumir que la pieza es un cilindro perfecto.',
      textKey: 'ventajasFormula',
      optional: true,
    },
    {
      id: 'disc-probeta',
      phase: 'Para escribir',
      kind: 'write',
      title: '¿Y la probeta?',
      why: 'No importa la forma, pero la división suele ser más grosera y hay menisco / burbujas.',
      textKey: 'ventajasProbeta',
      optional: true,
    },
  )

  return steps
}

export const PHASE_LABEL: Record<string, string> = {
  'Antes de medir': 'Preparación',
  'Cuerpo 1 · cilindro': 'Cuerpo 1',
  'Cuerpo 2 · escalonado': 'Cuerpo 2',
  'Cuerpo 3 · tubo': 'Cuerpo 3',
  Gráfico: 'Gráfico',
  'Para escribir': 'A escribir',
}

export function uniquePhases(steps: InterviewStep[]): string[] {
  const phases: string[] = []
  for (const step of steps) {
    if (!phases.includes(step.phase)) phases.push(step.phase)
  }
  return phases
}

export function indexByStepId(steps: InterviewStep[], id: string): number {
  const found = steps.findIndex((step) => step.id === id)
  return found === -1 ? 0 : found
}
