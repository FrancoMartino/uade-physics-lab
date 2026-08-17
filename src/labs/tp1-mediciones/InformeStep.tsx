import { Link } from 'react-router'
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ALUMINUM_DENSITY_G_CM3, formatDecimal, formatScientific, roundToSigFigs } from '../../domain/index.ts'
import type { Expressed } from '../../domain/index.ts'
import { TubeDiagram } from '../../ui/diagrams.tsx'
import { Formula } from '../../ui/Formula.tsx'
import { useTp1Session } from '../../session/useTp1Session.ts'
import { useTp1Computed } from './useTp1Computed.ts'
import {
  DENSITY_ERROR_LATEX,
  GENERAL_ERROR_LATEX,
  formatLengthCm,
  volumeErrorLatex,
  type VolumeComputation,
} from './compute.ts'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

function cell(value: string) {
  return value.trim() === '' ? '—' : value
}

export function InformeStep() {
  const { session, setSession } = useTp1Session()
  const computed = useTp1Computed()
  const texts = session.texts
  const tubeModel = computed.volumes[3].model

  const points = [{ x: 0, y: 0 }]
  for (const body of [1, 2, 3] as const) {
    if (computed.densities[body].volumeMl !== null && computed.densities[body].massG !== null) {
      points.push({ x: computed.densities[body].volumeMl!, y: computed.densities[body].massG! })
    }
  }
  const maxX = Math.max(1, ...points.map((p) => p.x))
  const line = computed.fit
    ? [
        { x: 0, y: computed.fit.intercept },
        { x: maxX, y: computed.fit.slope * maxX + computed.fit.intercept },
      ]
    : []

  const missing = [
    !session.header.names && 'integrantes',
    !texts.definicionDirecta && 'definición directa',
    !texts.definicionIndirecta && 'definición indirecta',
    !computed.volumes[1].complete && 'volumen cuerpo 1',
    !computed.volumes[2].complete && 'volumen cuerpo 2',
    !computed.volumes[3].complete && 'volumen cuerpo 3',
  ].filter((item): item is string => Boolean(item))

  function setText(key: keyof typeof texts, value: string) {
    setSession((prev) => ({ ...prev, texts: { ...prev.texts, [key]: value } }))
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="no-print mb-6 flex flex-wrap items-center gap-3">
        <Button asChild variant="outline">
          <Link to="/labs/tp1">Volver a las preguntas</Link>
        </Button>
        <Button type="button" onClick={() => window.print()}>
          Imprimir / guardar PDF
        </Button>
        {missing.length > 0 ? (
          <Alert className="w-full" variant="destructive">
            <AlertTitle>Falta completar</AlertTitle>
            <AlertDescription>{missing.join(', ')}.</AlertDescription>
          </Alert>
        ) : null}
      </div>

      <article className="sheet space-y-6 rounded-xl border bg-card p-6 shadow-sm md:p-10">
        <header className="space-y-2 border-b pb-4">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Informe del trabajo práctico · Física General
          </p>
          <h1 className="font-serif text-3xl font-medium tracking-tight">
            Mediciones indirectas — Propagación de errores
          </h1>
          <p className="text-muted-foreground">Determinación de la densidad de cuerpos sólidos</p>
          <p>
            <strong>Integrantes:</strong> {cell(session.header.names)}
          </p>
          <p>
            <strong>Día y turno:</strong> {cell(session.header.dayShift)}
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">Objetivo 1</h2>
          <p>
            <strong>Medición directa:</strong> {cell(texts.definicionDirecta)}
          </p>
          <p>
            <strong>Medición indirecta:</strong> {cell(texts.definicionIndirecta)}
          </p>
          <p>
            <strong>Propagación (3 variables):</strong> {cell(texts.formulaGeneral)}
          </p>
          <div className="no-print text-sm text-muted-foreground">
            <Formula tex={GENERAL_ERROR_LATEX} display />
          </div>
          <p>
            <strong>ΔV cuerpo 3:</strong> {cell(texts.formulaCuerpo3)}
          </p>
          <div className="no-print space-y-2 text-sm">
            <Formula tex={tubeModel.volumeLatex} display />
            <Formula tex={volumeErrorLatex(tubeModel)} display />
          </div>
          <figure className="mx-auto max-w-sm">
            <TubeDiagram />
            <figcaption className="text-center text-xs text-muted-foreground">
              Diagrama del cuerpo 3 (H, Di, De)
            </figcaption>
          </figure>
        </section>

        <section>
          <h3 className="font-serif text-xl">Tabla 1 · Volumen</h3>
          <p className="mb-2 text-sm text-muted-foreground">
            Largos en cm ± Δ (convertidos). Volumen de fórmula: derivadas parciales. 1 cm³ = 1 ml.
          </p>
          <div className="overflow-x-auto">
            <table className="informe-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Cuerpo 1</th>
                  <th>Cuerpo 2</th>
                  <th>Cuerpo 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>h</th>
                  <td>{formatLengthCm(computed.volumes[1].parsed.h)}</td>
                  <td>{formatLengthCm(computed.volumes[2].parsed.h)}</td>
                  <td>—</td>
                </tr>
                <tr>
                  <th>d</th>
                  <td>{formatLengthCm(computed.volumes[1].parsed.d)}</td>
                  <td>{formatLengthCm(computed.volumes[2].parsed.d)}</td>
                  <td>—</td>
                </tr>
                <tr>
                  <th>H</th>
                  <td>—</td>
                  <td>{formatLengthCm(computed.volumes[2].parsed.H)}</td>
                  <td>{formatLengthCm(computed.volumes[3].parsed.H)}</td>
                </tr>
                <tr>
                  <th>D</th>
                  <td>—</td>
                  <td>{formatLengthCm(computed.volumes[2].parsed.D)}</td>
                  <td>—</td>
                </tr>
                <tr>
                  <th>Di</th>
                  <td>—</td>
                  <td>—</td>
                  <td>{formatLengthCm(computed.volumes[3].parsed.Di)}</td>
                </tr>
                <tr>
                  <th>De</th>
                  <td>—</td>
                  <td>—</td>
                  <td>{formatLengthCm(computed.volumes[3].parsed.De)}</td>
                </tr>
                <tr>
                  <th>V fórmula</th>
                  <td>{volumeCell(computed.volumes[1])}</td>
                  <td>{volumeCell(computed.volumes[2])}</td>
                  <td>{volumeCell(computed.volumes[3])}</td>
                </tr>
                <tr>
                  <th>Er% fórmula</th>
                  <td>{percentCell(computed.volumes[1].form?.percentRounded)}</td>
                  <td>{percentCell(computed.volumes[2].form?.percentRounded)}</td>
                  <td>{percentCell(computed.volumes[3].form?.percentRounded)}</td>
                </tr>
                <tr>
                  <th>V probeta</th>
                  <td>{directCell(computed.probetas[1].form)}</td>
                  <td>{directCell(computed.probetas[2].form)}</td>
                  <td>{directCell(computed.probetas[3].form)}</td>
                </tr>
                <tr>
                  <th>Er% probeta</th>
                  <td>{percentCell(computed.probetas[1].form?.percentRounded)}</td>
                  <td>{percentCell(computed.probetas[2].form?.percentRounded)}</td>
                  <td>{percentCell(computed.probetas[3].form?.percentRounded)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">Discusión</h2>
          <ul className="no-print list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>¿Cuál Er% es menor, fórmula o probeta?</li>
            <li>¿Eso habla de precisión o de exactitud?</li>
            <li>¿Qué ventaja y qué desventaja tiene cada método?</li>
          </ul>
          <Label className="flex w-full flex-col items-start gap-2">
            Exactitud de los métodos
            <Textarea value={texts.exactitud} onChange={(event) => setText('exactitud', event.target.value)} rows={4} />
          </Label>
          <Label className="flex w-full flex-col items-start gap-2">
            Método por fórmula del cilindro
            <Textarea
              value={texts.ventajasFormula}
              onChange={(event) => setText('ventajasFormula', event.target.value)}
              rows={3}
            />
          </Label>
          <Label className="flex w-full flex-col items-start gap-2">
            Método por probeta
            <Textarea
              value={texts.ventajasProbeta}
              onChange={(event) => setText('ventajasProbeta', event.target.value)}
              rows={3}
            />
          </Label>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">Objetivo 2 · Densidad</h2>
          <p>
            <strong>Propiedad intensiva:</strong> {cell(texts.propiedadIntensiva)}
          </p>
          <p>
            <strong>Δρ:</strong> {cell(texts.formulaDensidad)}
          </p>
          <div className="no-print text-sm">
            <Formula tex={DENSITY_ERROR_LATEX} display />
          </div>
          <h3 className="font-serif text-xl">Tabla 2</h3>
          <p className="text-sm text-muted-foreground">V de esta tabla es el de la fórmula, no el de la probeta.</p>
          <div className="overflow-x-auto">
            <table className="informe-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Cuerpo 1</th>
                  <th>Cuerpo 2</th>
                  <th>Cuerpo 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>m</th>
                  <td>{massCell(computed.densities[1].massG)}</td>
                  <td>{massCell(computed.densities[2].massG)}</td>
                  <td>{massCell(computed.densities[3].massG)}</td>
                </tr>
                <tr>
                  <th>V fórmula</th>
                  <td>{directCell(computed.volumes[1].form)}</td>
                  <td>{directCell(computed.volumes[2].form)}</td>
                  <td>{directCell(computed.volumes[3].form)}</td>
                </tr>
                <tr>
                  <th>ρ</th>
                  <td>{directCell(computed.densities[1].form, 'g/cm³')}</td>
                  <td>{directCell(computed.densities[2].form, 'g/cm³')}</td>
                  <td>{directCell(computed.densities[3].form, 'g/cm³')}</td>
                </tr>
                <tr>
                  <th>Er%</th>
                  <td>{percentCell(computed.densities[1].form?.percentRounded)}</td>
                  <td>{percentCell(computed.densities[2].form?.percentRounded)}</td>
                  <td>{percentCell(computed.densities[3].form?.percentRounded)}</td>
                </tr>
                <tr>
                  <th>Er% vs Al 2,7</th>
                  <td>{percentCell(computed.densities[1].aluminumPercent ?? undefined)}</td>
                  <td>{percentCell(computed.densities[2].aluminumPercent ?? undefined)}</td>
                  <td>{percentCell(computed.densities[3].aluminumPercent ?? undefined)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="font-serif text-xl">Método gráfico</h3>
          <div className="mt-3 h-[220px] w-full min-w-0 sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="oklch(0.86 0.015 85)" />
                <XAxis type="number" dataKey="x" name="V" unit=" ml" />
                <YAxis type="number" dataKey="y" name="m" unit=" g" width={48} />
                <Tooltip />
                <Legend />
                <Scatter name="Datos" data={points} fill="oklch(0.55 0.12 50)" />
                {line.length === 2 ? (
                  <Line name="Tendencia" data={line} dataKey="y" stroke="oklch(0.32 0.06 250)" dot={false} />
                ) : null}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {computed.fit ? (
            <p className="mt-3">
              Y = {formatDecimal(computed.fit.slope, 3)} · X + {formatDecimal(computed.fit.intercept, 3)}. Densidad ={' '}
              {formatDecimal(computed.fit.slope, 3)} g/cm³. Er% vs Al {ALUMINUM_DENSITY_G_CM3} g/cm³ ={' '}
              {computed.graphicalPercent !== null
                ? `${formatDecimal(roundToSigFigs(computed.graphicalPercent, 2), 2)}%`
                : '—'}
              . R² = {formatDecimal(computed.fit.r2, 4)}.
            </p>
          ) : (
            <p>—</p>
          )}
        </section>
      </article>
    </section>
  )
}

function volumeCell(volume: VolumeComputation) {
  if (!volume.form) return '—'
  return `${formatDecimal(volume.form.value, volume.form.decimals)} ± ${formatDecimal(volume.form.delta, volume.form.decimals)} ml`
}

function directCell(form: Expressed | null | undefined, unit = 'ml') {
  if (!form) return '—'
  return `${formatDecimal(form.value, form.decimals)} ± ${formatDecimal(form.delta, form.decimals)} ${unit}`
}

function percentCell(value: number | undefined) {
  if (value === undefined) return '—'
  return `${formatDecimal(value, value >= 10 ? 0 : 1)}%`
}

function massCell(massG: number | null) {
  if (massG === null) return '—'
  return `${formatScientific(massG, 3)} g`
}
