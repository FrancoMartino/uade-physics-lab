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
import { ALUMINUM_DENSITY_G_CM3, formatDecimal, roundToSigFigs } from '../../domain/index.ts'
import { CopyButton } from '../../ui/CopyButton.tsx'
import { DocsLink } from '../../ui/DocsLink.tsx'
import { useTp1Computed } from './useTp1Computed.ts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function GraficoStep({ embedded = false }: { embedded?: boolean }) {
  const { densities, fit, graphicalPercent } = useTp1Computed()

  const points = [{ x: 0, y: 0, name: '(0,0)' }]
  for (const body of [1, 2, 3] as const) {
    if (densities[body].volumeMl !== null && densities[body].massG !== null) {
      points.push({
        x: densities[body].volumeMl!,
        y: densities[body].massG!,
        name: `Cuerpo ${body}`,
      })
    }
  }

  const maxX = Math.max(1, ...points.map((p) => p.x))
  const line = fit
    ? [
        { x: 0, y: fit.intercept },
        { x: maxX, y: fit.slope * maxX + fit.intercept },
      ]
    : []

  const equation = fit
    ? `Y = ${formatDecimal(fit.slope, 3)} · X + ${formatDecimal(fit.intercept, 3)}`
    : null

  return (
    <div className="space-y-4">
      {embedded ? null : (
        <div>
          <h2 className="font-serif text-2xl">Densidad por método gráfico</h2>
          <p className="mt-2 text-muted-foreground">
            Masa (Y) en función de volumen (X), más el punto (0,0). La pendiente es ρ.{' '}
            <DocsLink to="/docs/excel-tendencia" />
          </p>
        </div>
      )}
      <div className="h-[240px] w-full min-w-0 sm:h-[320px]">
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
      {fit && equation ? (
        <Card>
          <CardHeader className="gap-2">
            <CardDescription>Línea de tendencia</CardDescription>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="font-mono text-lg font-medium">{equation}</CardTitle>
              <CopyButton text={equation} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Densidad (pendiente) = {formatDecimal(fit.slope, 3)} g/cm³ · R² = {formatDecimal(fit.r2, 4)} · Al ={' '}
              {ALUMINUM_DENSITY_G_CM3} g/cm³
            </p>
            {graphicalPercent !== null ? (
              <p>
                Er% vs aluminio = {formatDecimal(roundToSigFigs(graphicalPercent, 2), 2)}%{' '}
                <CopyButton
                  text={`ρ = ${formatDecimal(fit.slope, 3)} g/cm³; Er% = ${formatDecimal(roundToSigFigs(graphicalPercent, 2), 2)}%`}
                />
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Faltan masas y volúmenes de la tabla 2.</p>
      )}
    </div>
  )
}
