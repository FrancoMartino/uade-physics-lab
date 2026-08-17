import { useState } from 'react'
import { comparePropagation, express, formatDecimal, parseDecimal, velocityModel } from '../domain/index.ts'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function VelocityExample() {
  const [L, setL] = useState('350')
  const [dL, setDL] = useState('1')
  const [t, setT] = useState('9,0')
  const [dt, setDT] = useState('0,1')

  const model = velocityModel()
  const Lv = parseDecimal(L)
  const dLv = parseDecimal(dL)
  const tv = parseDecimal(t)
  const dtv = parseDecimal(dt)

  const ready = Lv !== null && dLv !== null && tv !== null && dtv !== null && tv !== 0
  const compared = ready
    ? comparePropagation(
        [
          { key: 'L', value: Lv, delta: dLv },
          { key: 't', value: tv, delta: dtv },
        ],
        model.evaluate,
        model.partials,
      )
    : null
  const form = compared ? express(compared.partials.value, compared.partials.delta) : null
  const extremes = compared ? express(compared.extremes.value, compared.extremes.delta) : null

  return (
    <Card className="my-6">
      <CardHeader>
        <CardDescription>Ejemplo de la clase · v = L/t</CardDescription>
        <CardTitle className="font-serif text-xl">Probá los números de la pizarra</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <Label className="flex flex-col items-start gap-1">
            L
            <Input value={L} onChange={(event) => setL(event.target.value)} className="w-24 font-mono" />
          </Label>
          <span className="pb-2 text-muted-foreground">±</span>
          <Label className="flex flex-col items-start gap-1">
            ΔL
            <Input value={dL} onChange={(event) => setDL(event.target.value)} className="w-20 font-mono" />
          </Label>
          <Label className="flex flex-col items-start gap-1">
            t
            <Input value={t} onChange={(event) => setT(event.target.value)} className="w-24 font-mono" />
          </Label>
          <span className="pb-2 text-muted-foreground">±</span>
          <Label className="flex flex-col items-start gap-1">
            Δt
            <Input value={dt} onChange={(event) => setDT(event.target.value)} className="w-20 font-mono" />
          </Label>
        </div>
        {form && extremes && compared ? (
          <p className="font-mono text-sm">
            Parciales: {formatDecimal(form.value, form.decimals)} ± {formatDecimal(form.delta, form.decimals)} ·
            extremos: {formatDecimal(extremes.value, extremes.decimals)} ± {formatDecimal(extremes.delta, extremes.decimals)}{' '}
            · Δ dif. {formatDecimal(compared.deltaDiffPercent, 2)}%
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Datos de la clase: 350 ± 1 m, 9,0 ± 0,1 s → 38,9 ± 0,6 m/s.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
