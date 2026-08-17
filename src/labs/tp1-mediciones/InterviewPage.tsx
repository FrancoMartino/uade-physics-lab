import { lazy, Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ArrowRight, BookOpen, NotebookPen } from 'lucide-react'
import {
  applyInstruments,
  LENGTH_TOOLS,
  type LengthField,
  type LengthTool,
  type Tp1Session,
} from '../../session/tp1.ts'
import { geometryById, lengthToCm, parseDecimal, piValue, type LengthUnit } from '../../domain/index.ts'
import { useTp1Session } from '../../session/useTp1Session.ts'
import { AlertList } from '../../ui/AlertList.tsx'
import { DensityResultCard } from '../../ui/DensityResultCard.tsx'
import { DocsLink } from '../../ui/DocsLink.tsx'
import { Formula } from '../../ui/Formula.tsx'
import { SolidCylinderDiagram, SteppedDiagram, TubeDiagram } from '../../ui/diagrams.tsx'
import { VolumeResultCard } from '../../ui/VolumeResultCard.tsx'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  DENSITY_ERROR_LATEX,
  GENERAL_ERROR_LATEX,
  computeTp1,
  volumeErrorLatex,
} from './compute.ts'
import {
  PHASE_LABEL,
  indexByStepId,
  interviewSteps,
  uniquePhases,
  type InterviewStep,
} from './interview/steps.ts'

const GraficoStep = lazy(async () => {
  const mod = await import('./GraficoStep.tsx')
  return { default: mod.GraficoStep }
})

function clampIndex(index: number, length: number): number {
  if (length === 0) return 0
  return Math.min(Math.max(index, 0), length - 1)
}

function lengthField(session: Tp1Session, body: 1 | 2 | 3, field: string): LengthField {
  if (body === 1) return session.bodies[1][field as 'h' | 'd']
  if (body === 2) return session.bodies[2][field as 'h' | 'd' | 'H' | 'D']
  return session.bodies[3][field as 'H' | 'Di' | 'De']
}

function patchLength(session: Tp1Session, body: 1 | 2 | 3, field: string, value: string): Tp1Session {
  const next = { ...lengthField(session, body, field), value }
  if (body === 1) {
    return { ...session, bodies: { ...session.bodies, 1: { ...session.bodies[1], [field]: next } } }
  }
  if (body === 2) {
    return { ...session, bodies: { ...session.bodies, 2: { ...session.bodies[2], [field]: next } } }
  }
  return { ...session, bodies: { ...session.bodies, 3: { ...session.bodies[3], [field]: next } } }
}

function currentValue(session: Tp1Session, step: InterviewStep): string {
  if (step.kind === 'text' && step.id === 'who') return session.header.names
  if (step.kind === 'text' && step.id === 'when') return session.header.dayShift
  if (step.kind === 'text' && step.id === 'tool-delta') return session.settings.lengthDelta
  if (step.kind === 'choice' && step.id === 'tool') return session.settings.lengthTool
  if (step.kind === 'choice' && step.id === 'tool-unit') return session.settings.lengthUnit
  if (step.kind === 'choice' && step.id === 'probeta') return session.settings.probetaDelta
  if (step.kind === 'choice' && step.id === 'balance') return session.settings.massDelta
  if (step.kind === 'choice' && step.id === 'body2') return session.body2Kind
  if (step.kind === 'measure' && step.role === 'length') return lengthField(session, step.body, step.field).value
  if (step.kind === 'measure' && step.role === 'probeta') return session.probeta[step.body].value
  if (step.kind === 'measure' && step.role === 'mass') return session.masses[step.body].value
  if (step.kind === 'write') return session.texts[step.textKey]
  return ''
}

function applyAnswer(session: Tp1Session, step: InterviewStep, value: string): Tp1Session {
  if (step.kind === 'text' && step.id === 'who') {
    return { ...session, header: { ...session.header, names: value } }
  }
  if (step.kind === 'text' && step.id === 'when') {
    return { ...session, header: { ...session.header, dayShift: value } }
  }
  if (step.kind === 'text' && step.id === 'tool-delta') {
    return applyInstruments({ ...session, settings: { ...session.settings, lengthDelta: value } })
  }
  if (step.kind === 'choice' && step.id === 'tool') {
    const tool = value as LengthTool
    const preset = LENGTH_TOOLS[tool]
    return applyInstruments({
      ...session,
      settings: {
        ...session.settings,
        lengthTool: tool,
        lengthDelta: preset.delta || session.settings.lengthDelta,
        lengthUnit: tool === 'custom' ? session.settings.lengthUnit : preset.unit,
      },
    })
  }
  if (step.kind === 'choice' && step.id === 'tool-unit') {
    return applyInstruments({
      ...session,
      settings: { ...session.settings, lengthUnit: value as LengthUnit },
    })
  }
  if (step.kind === 'choice' && step.id === 'probeta') {
    return applyInstruments({
      ...session,
      settings: { ...session.settings, probetaDelta: value },
    })
  }
  if (step.kind === 'choice' && step.id === 'balance') {
    return applyInstruments({
      ...session,
      settings: { ...session.settings, massDelta: value },
    })
  }
  if (step.kind === 'choice' && step.id === 'body2') {
    return { ...session, body2Kind: value === 'steppedHole' ? 'steppedHole' : 'steppedSolid' }
  }
  if (step.kind === 'measure' && step.role === 'length') {
    return patchLength(session, step.body, step.field, value)
  }
  if (step.kind === 'measure' && step.role === 'probeta') {
    return {
      ...session,
      probeta: { ...session.probeta, [step.body]: { ...session.probeta[step.body], value } },
    }
  }
  if (step.kind === 'measure' && step.role === 'mass') {
    return {
      ...session,
      masses: { ...session.masses, [step.body]: { ...session.masses[step.body], value } },
    }
  }
  if (step.kind === 'write') {
    return { ...session, texts: { ...session.texts, [step.textKey]: value } }
  }
  return session
}

function isOptional(step: InterviewStep): boolean {
  return (step.kind === 'text' || step.kind === 'write') && Boolean(step.optional)
}

function stepError(session: Tp1Session, step: InterviewStep, value: string): string | null {
  if (step.kind === 'text' && step.id !== 'tool-delta') {
    if (isOptional(step)) return null
    return value.trim() === '' ? 'Escribí algo para seguir, o salteá este paso.' : null
  }
  if (step.kind === 'text' && step.id === 'tool-delta') {
    const parsed = parseDecimal(value)
    if (parsed === null || parsed <= 0) return 'Poné el error del instrumento, por ejemplo 0,05.'
    return null
  }
  if (step.kind === 'choice') {
    return value === '' ? 'Elegí una opción y después continuá.' : null
  }
  if (step.kind === 'measure') {
    const parsed = parseDecimal(value)
    if (parsed === null) return 'Poné el número que leíste. Sirve coma o punto: 50,0'
    if (parsed <= 0) return 'La medida tiene que ser un número positivo.'
    if (step.role === 'length' && step.body === 2 && session.body2Kind === 'steppedHole') {
      const h = step.field === 'h' ? parsed : parseDecimal(session.bodies[2].h.value)
      const H = step.field === 'H' ? parsed : parseDecimal(session.bodies[2].H.value)
      if (h !== null && H !== null && h > H) {
        return 'El agujero no puede ser más profundo que la pieza (h > H).'
      }
    }
    if (step.role === 'length' && step.field === 'Di') {
      const De = parseDecimal(session.bodies[3].De.value)
      if (De !== null && parsed >= De) return 'El agujero de adentro no puede ser más grande que el diámetro de afuera.'
    }
    if (step.role === 'length' && step.field === 'De') {
      const Di = parseDecimal(session.bodies[3].Di.value)
      if (Di !== null && parsed <= Di) return 'El diámetro de afuera tiene que ser más grande que el de adentro.'
    }
    return null
  }
  return null
}

function conversionLine(session: Tp1Session, step: InterviewStep, value: string): string | null {
  if (step.kind !== 'measure' || step.role !== 'length') return null
  const parsed = parseDecimal(value)
  if (parsed === null) return null
  const unit = session.settings.lengthUnit
  if (unit === 'cm') return `${parsed} cm · el informe ya lo quiere en cm`
  const cm = lengthToCm(parsed, unit)
  return `${value} ${unit} → ${cm} cm en el informe`
}

function resolveIndex(session: Tp1Session, steps: InterviewStep[]): number {
  const byId = steps.findIndex((item) => item.id === session.settings.wizardStepId)
  if (session.settings.wizardStepId === 'who' && session.settings.wizardIndex > 0) {
    return clampIndex(session.settings.wizardIndex, steps.length)
  }
  if (byId !== -1) return byId
  return clampIndex(session.settings.wizardIndex, steps.length)
}

function withStep(session: Tp1Session, steps: InterviewStep[], dest: number): Tp1Session {
  const clamped = clampIndex(dest, steps.length)
  return {
    ...session,
    settings: {
      ...session.settings,
      wizardIndex: clamped,
      wizardStepId: steps[clamped]?.id ?? session.settings.wizardStepId,
    },
  }
}

function choiceLabel(step: InterviewStep, value: string): string {
  if (step.kind !== 'choice') return value
  return step.options.find((option) => option.id === value)?.label ?? value
}

function notebookLine(session: Tp1Session, step: InterviewStep): string | null {
  const value = currentValue(session, step)
  if (step.kind === 'choice') return value ? choiceLabel(step, value) : null
  if (step.kind === 'text' || step.kind === 'measure' || step.kind === 'write') {
    const trimmed = value.trim()
    if (!trimmed) return null
    if (step.kind === 'measure') return `${trimmed} ${step.unitLabel}`
    if (step.kind === 'write') return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed
    return trimmed
  }
  if (step.kind === 'result') return 'Resultado listo para copiar'
  if (step.kind === 'graph') return 'Pendiente = densidad'
  return null
}

function formulaHint(session: Tp1Session, step: InterviewStep): string | null {
  if (step.kind !== 'write') return null
  if (step.textKey === 'formulaGeneral') return GENERAL_ERROR_LATEX
  if (step.textKey === 'formulaDensidad') return DENSITY_ERROR_LATEX
  if (step.textKey === 'formulaCuerpo3') {
    const model = geometryById('tube', piValue(session.settings.pi))
    return `${model.volumeLatex} \\qquad ${volumeErrorLatex(model)}`
  }
  return null
}

function NotebookList({
  phases,
  steps,
  session,
  currentId,
  conversion,
  onJump,
}: {
  phases: string[]
  steps: InterviewStep[]
  session: Tp1Session
  currentId: string
  conversion: string | null
  onJump: (id: string) => void
}) {
  return (
    <div className="space-y-4 px-4 py-3">
      {conversion ? (
        <div className="rounded-md border border-dashed bg-background/70 px-3 py-2">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Conversión</p>
          <p className="font-mono text-sm">{conversion}</p>
        </div>
      ) : null}
      {phases.map((phase) => {
        const items = steps.filter((item) => item.phase === phase)
        const filled = items
          .map((item) => ({ item, line: notebookLine(session, item) }))
          .filter((entry) => entry.line)
        if (filled.length === 0) return null
        return (
          <div key={phase}>
            <p className="mb-1 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              {PHASE_LABEL[phase] ?? phase}
            </p>
            <ul className="space-y-1">
              {filled.map(({ item, line }) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onJump(item.id)}
                    className={cn(
                      'w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent',
                      item.id === currentId && 'bg-accent',
                    )}
                  >
                    <span className="block text-muted-foreground">{item.title}</span>
                    <span className="font-mono">{line}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export function InterviewPage() {
  const { session, setSession } = useTp1Session()
  const steps = useMemo(() => interviewSteps(session), [session])
  const index = resolveIndex(session, steps)
  const step = steps[index]
  const value = currentValue(session, step)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const computed = useMemo(() => computeTp1(session), [session])
  const error = stepError(session, step, value)
  const canNext =
    step.kind === 'result' ||
    step.kind === 'graph' ||
    isOptional(step) ||
    error === null

  const phases = uniquePhases(steps)
  const phaseSteps = steps.filter((item) => item.phase === step.phase)
  const phaseIndex = phaseSteps.findIndex((item) => item.id === step.id)
  const phaseProgress = ((phaseIndex + 1) / phaseSteps.length) * 100

  useEffect(() => {
    setTouched(false)
    inputRef.current?.focus()
  }, [step.id])

  function goRelative(delta: number) {
    setSession((prev) => {
      const nextSteps = interviewSteps(prev)
      const here = indexByStepId(nextSteps, step.id)
      return withStep(prev, nextSteps, here + delta)
    })
  }

  function jumpTo(id: string) {
    setSession((prev) => {
      const nextSteps = interviewSteps(prev)
      return withStep(prev, nextSteps, indexByStepId(nextSteps, id))
    })
  }

  function jumpPhase(phase: string) {
    setSession((prev) => {
      const nextSteps = interviewSteps(prev)
      const dest = nextSteps.findIndex((item) => item.phase === phase)
      return withStep(prev, nextSteps, dest === -1 ? 0 : dest)
    })
  }

  function answer(next: string) {
    setTouched(true)
    setSession((prev) => applyAnswer(prev, step, next))
  }

  function next() {
    setTouched(true)
    if (!canNext) return
    if (index >= steps.length - 1) return
    goRelative(1)
  }

  const bodyAlerts =
    step.kind === 'result'
      ? [
          ...computed.volumes[step.body].alerts,
          ...computed.probetas[step.body].alerts,
          ...computed.densities[step.body].alerts,
        ]
      : []

  const latex = formulaHint(session, step)
  const conversion = conversionLine(session, step, value)
  const showError = Boolean(error) && (touched || (value !== '' && (step.kind === 'measure' || step.kind === 'text')))

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start">
      <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
        <div className="no-print -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {phases.map((phase) => {
            const active = phase === step.phase
            return (
              <button
                key={phase}
                type="button"
                onClick={() => jumpPhase(phase)}
                className={cn(
                  'h-9 shrink-0 rounded-full border px-3 text-xs tracking-wide transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {PHASE_LABEL[phase] ?? phase}
              </button>
            )
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
            <span>
              {step.phase} · paso {phaseIndex + 1} de {phaseSteps.length}
            </span>
            <span>
              {index + 1}/{steps.length}
            </span>
          </div>
          <Progress value={phaseProgress} />
        </div>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="gap-3">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Mesa de trabajo
            </p>
            <CardTitle className="font-serif text-xl font-medium tracking-tight text-pretty sm:text-2xl md:text-3xl">
              {step.title}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">{step.why}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {step.kind === 'measure' && step.diagram === 'solid' ? <SolidCylinderDiagram highlight={step.highlight} /> : null}
            {step.kind === 'measure' && step.diagram === 'stepped' ? <SteppedDiagram highlight={step.highlight} /> : null}
            {step.kind === 'measure' && step.diagram === 'tube' ? <TubeDiagram highlight={step.highlight} /> : null}

            {step.kind === 'text' ? (
              <Input
                ref={inputRef as RefObject<HTMLInputElement>}
                value={value}
                placeholder={step.placeholder}
                className="h-12 text-base"
                onChange={(event) => answer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') next()
                }}
              />
            ) : null}

            {step.kind === 'choice' ? (
              <div className="grid gap-2">
                {step.options.map((option) => {
                  const selected = value === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => answer(option.id)}
                      className={cn(
                        'rounded-lg border px-4 py-3 text-left transition-colors',
                        selected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-card hover:border-primary/40',
                      )}
                    >
                      <strong className="block text-sm">{option.label}</strong>
                      <span className="mt-1 block text-sm text-muted-foreground">{option.detail}</span>
                    </button>
                  )
                })}
                <p className="text-xs text-muted-foreground">Elegí una opción y después dale a Continuar.</p>
              </div>
            ) : null}

            {step.kind === 'measure' ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    ref={inputRef as RefObject<HTMLInputElement>}
                    inputMode="decimal"
                    value={value}
                    placeholder="50,0"
                    className="h-12 font-mono text-lg sm:h-14 sm:text-xl"
                    onChange={(event) => answer(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') next()
                    }}
                  />
                  <Badge variant="secondary" className="h-10 w-fit rounded-md px-3 font-mono text-sm">
                    {step.unitLabel}
                  </Badge>
                </div>
                {conversion ? <p className="font-mono text-sm text-muted-foreground">{conversion}</p> : null}
              </div>
            ) : null}

            {step.kind === 'write' ? (
              <div className="space-y-3">
                {step.docsTo ? <DocsLink to={step.docsTo} /> : null}
                {latex ? <Formula tex={latex} display /> : null}
                <Textarea
                  ref={inputRef as RefObject<HTMLTextAreaElement>}
                  rows={5}
                  value={value}
                  placeholder="Escribilo como se lo explicarías al ayudante. Podés saltear y completarlo en el informe."
                  onChange={(event) => answer(event.target.value)}
                />
              </div>
            ) : null}

            {step.kind === 'result' ? (
              <div className="space-y-4">
                <AlertList alerts={bodyAlerts} />
                <VolumeResultCard symbol="V" unit="ml" computation={computed.volumes[step.body]} compact={false} />
                {computed.probetas[step.body].form ? (
                  <p className="text-sm text-muted-foreground">
                    Probeta:{' '}
                    <span className="font-mono">
                      {computed.probetas[step.body].form!.value} ± {computed.probetas[step.body].form!.delta} ml
                    </span>
                  </p>
                ) : null}
                {(() => {
                  const density = computed.densities[step.body]
                  if (!density.complete || !density.form || !density.compared || density.massG === null) return null
                  return (
                    <DensityResultCard
                      form={density.form}
                      compared={density.compared}
                      massG={density.massG}
                      aluminumPercent={density.aluminumPercent}
                      compact
                    />
                  )
                })()}
              </div>
            ) : null}

            {step.kind === 'graph' ? (
              <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando gráfico…</p>}>
                <GraficoStep embedded />
              </Suspense>
            ) : null}

            {showError ? <p className="text-sm text-destructive">{error}</p> : null}
          </CardContent>
          <CardFooter className="sticky bottom-0 z-10 flex flex-wrap gap-2 border-t bg-card/95 py-4 backdrop-blur-sm lg:static lg:bg-transparent lg:py-6 lg:backdrop-blur-none">
            <Button type="button" variant="outline" disabled={index === 0} onClick={() => goRelative(-1)}>
              <ArrowLeft />
              Atrás
            </Button>
            {index < steps.length - 1 ? (
              <Button type="button" onClick={next} disabled={!canNext}>
                Continuar
                <ArrowRight />
              </Button>
            ) : (
              <Button asChild>
                <Link to="/labs/tp1/informe">Ver informe para imprimir</Link>
              </Button>
            )}
            {isOptional(step) && index < steps.length - 1 ? (
              <Button type="button" variant="ghost" onClick={() => goRelative(1)}>
                Saltear
              </Button>
            ) : null}
          </CardFooter>
        </Card>

        <details className="no-print rounded-xl border bg-card lg:hidden">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium">
            <NotebookPen className="size-4" />
            Bitácora
          </summary>
          <NotebookList
            phases={phases}
            steps={steps}
            session={session}
            currentId={step.id}
            conversion={conversion}
            onJump={jumpTo}
          />
        </details>
      </div>

      <aside className="no-print hidden min-w-0 lg:flex lg:flex-col">
        <div className="sticky top-4 flex max-h-[calc(100svh-2.5rem)] flex-col overflow-hidden rounded-xl border border-l-[3px] border-l-primary bg-card">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <NotebookPen className="size-4 text-primary" />
            <div>
              <p className="font-serif text-sm font-medium">Bitácora</p>
              <p className="text-xs text-muted-foreground">Lo que ya anotaste</p>
            </div>
          </div>
          <ScrollArea className="h-full min-h-0 flex-1">
            <NotebookList
              phases={phases}
              steps={steps}
              session={session}
              currentId={step.id}
              conversion={conversion}
              onJump={jumpTo}
            />
          </ScrollArea>
          <Separator />
          <div className="flex items-center justify-between px-4 py-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/docs/checklist-prelab">
                <BookOpen />
                Docs
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/labs/tp1/informe">Informe</Link>
            </Button>
          </div>
        </div>
      </aside>
    </div>
  )
}
