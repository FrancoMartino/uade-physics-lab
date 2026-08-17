import { formatCopyLine, formatDecimal, roundToSigFigs } from '../domain/index.ts'
import type { VolumeComputation } from '../labs/tp1-mediciones/compute.ts'
import { formatLengthCm } from '../labs/tp1-mediciones/compute.ts'
import { CopyButton } from './CopyButton.tsx'
import { DocsLink } from './DocsLink.tsx'
import { Formula } from './Formula.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type ResultCardProps = {
  symbol: string
  unit: string
  computation: VolumeComputation
  compact: boolean
}

function comboText(combo: Record<string, '+' | '-'>): string {
  return Object.entries(combo)
    .map(([key, sign]) => `${key}${sign}`)
    .join(', ')
}

export function VolumeResultCard({ symbol, unit, computation, compact }: ResultCardProps) {
  if (!computation.complete || !computation.compared || !computation.form || !computation.extremes) {
    return <p className="text-sm text-muted-foreground">Completá valor y error de cada variable para ver el resultado.</p>
  }

  const form = computation.form
  const extremes = computation.extremes
  const compared = computation.compared
  const copy = formatCopyLine(symbol, form.value, form.delta, unit)
  const deltaDiff = roundToSigFigs(compared.deltaDiffPercent, 2)
  const dimensions = computation.model.variables
    .map((variable) => `${variable.symbol} = ${formatLengthCm(computation.parsed[variable.key])}`)
    .join(' · ')

  return (
    <Card>
      <CardHeader className="gap-3">
        <CardDescription>Para el formulario · derivadas parciales</CardDescription>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="font-mono text-lg font-medium break-words sm:text-xl">
            {symbol} = {formatDecimal(form.value, form.decimals)} {unit} ± {formatDecimal(form.delta, form.decimals)}{' '}
            {unit}
          </CardTitle>
          <CopyButton text={copy} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="font-mono text-foreground/80">{dimensions}</p>
        <p>
          Er% = {formatDecimal(form.percentRounded, form.percentRounded >= 10 ? 0 : 1)}% · crudo{' '}
          {formatDecimal(form.rawValue, 4)} ± {formatDecimal(form.rawDelta, 4)}
        </p>
        <p>
          Extremos: {formatDecimal(extremes.value, extremes.decimals)} ± {formatDecimal(extremes.delta, extremes.decimals)}{' '}
          {unit} · diferencia de Δ = {formatDecimal(deltaDiff, deltaDiff >= 10 ? 0 : 1)}%
          <DocsLink to="/docs/propagacion-parciales" />
        </p>
        {!compact ? (
          <details className="rounded-md border bg-muted/40 px-3 py-2">
            <summary className="cursor-pointer text-foreground">Desarrollo</summary>
            <div className="mt-3 space-y-3">
              <Formula tex={computation.model.volumeLatex} display />
              <table className="w-full text-left text-foreground">
                <thead>
                  <tr>
                    <th className="pb-1 font-medium">Variable</th>
                    <th className="pb-1 font-medium">|∂V/∂x| Δx</th>
                  </tr>
                </thead>
                <tbody>
                  {compared.partials.contributions.map((row) => (
                    <tr key={row.key} className="border-t">
                      <td className="py-1 font-mono">{row.key}</td>
                      <td className="py-1 font-mono">{formatDecimal(row.term, 6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                V<sub>max</sub> con {comboText(compared.extremes.maxCombo)} · V<sub>min</sub> con{' '}
                {comboText(compared.extremes.minCombo)}
              </p>
            </div>
          </details>
        ) : null}
      </CardContent>
    </Card>
  )
}
