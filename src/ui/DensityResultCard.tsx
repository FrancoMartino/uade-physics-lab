import { formatCopyLine, formatDecimal, formatScientific, type Expressed } from '../domain/index.ts'
import type { CompareResult } from '../domain/index.ts'
import { CopyButton } from './CopyButton.tsx'
import { DocsLink } from './DocsLink.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type DensityCardProps = {
  form: Expressed
  compared: CompareResult
  massG: number
  aluminumPercent?: number | null
  compact: boolean
}

export function DensityResultCard({ form, compared, massG, aluminumPercent, compact }: DensityCardProps) {
  const copy = formatCopyLine('ρ', form.value, form.delta, 'g/cm³')
  return (
    <Card>
      <CardHeader className="gap-3">
        <CardDescription>Para el formulario · derivadas parciales</CardDescription>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="font-mono text-lg font-medium break-words sm:text-xl">
            ρ = {formatDecimal(form.value, form.decimals)} g/cm³ ± {formatDecimal(form.delta, form.decimals)} g/cm³
          </CardTitle>
          <CopyButton text={copy} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          m = {formatScientific(massG, 3)} g · Er% ={' '}
          {formatDecimal(form.percentRounded, form.percentRounded >= 10 ? 0 : 1)}%
          {aluminumPercent !== null && aluminumPercent !== undefined
            ? ` · vs Al 2,7 g/cm³ = ${formatDecimal(aluminumPercent, aluminumPercent >= 10 ? 0 : 1)}%`
            : null}
          <DocsLink to="/docs/densidad" />
        </p>
        {!compact ? (
          <details className="rounded-md border bg-muted/40 px-3 py-2">
            <summary className="cursor-pointer text-foreground">Desarrollo</summary>
            <table className="mt-3 w-full text-left text-foreground">
              <thead>
                <tr>
                  <th className="pb-1 font-medium">Variable</th>
                  <th className="pb-1 font-medium">|∂ρ/∂x| Δx</th>
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
          </details>
        ) : null}
      </CardContent>
    </Card>
  )
}
