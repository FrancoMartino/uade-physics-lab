import { NavLink, Outlet } from 'react-router'
import { BookOpen, FlaskConical, MoreHorizontal } from 'lucide-react'
import { labs } from '../labs/registry.ts'
import { piLabel, PI_MODES, type PiMode } from '../domain/index.ts'
import { useTp1Session } from '../session/useTp1Session.ts'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function AppShell() {
  const { session, setSession, reset, loadDemo, exportJson, importJson } = useTp1Session()

  function download() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'tp1-sesion.json'
    anchor.click()
    URL.revokeObjectURL(url)
    toast.success('Sesión guardada')
  }

  function onImport(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = typeof reader.result === 'string' ? importJson(reader.result) : false
      if (ok) toast.success('Sesión abierta')
      else toast.error('No se pudo leer esa sesión')
    }
    reader.readAsText(file)
  }

  return (
    <div className="app-shell flex h-svh overflow-hidden bg-background">
      <aside className="no-print hidden h-full w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <NavLink to="/" className="block border-b border-sidebar-border px-5 py-5" end>
          <span className="block font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
            UADE · Física I
          </span>
          <span className="mt-1 block font-serif text-xl font-medium tracking-tight">Mesa de lab</span>
        </NavLink>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-3">
            {labs.map((lab) =>
              lab.status === 'ready' ? (
                <NavLink
                  key={lab.id}
                  to={lab.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/60',
                    )
                  }
                >
                  <FlaskConical className="mt-0.5 size-4 shrink-0" />
                  <span>
                    <strong className="block font-medium">TP{lab.number} · {lab.title}</strong>
                    <em className="mt-0.5 block text-xs not-italic text-muted-foreground">{lab.short}</em>
                  </span>
                </NavLink>
              ) : (
                <span
                  key={lab.id}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/70"
                >
                  <span className="mt-0.5 w-4 shrink-0 text-center font-mono text-[10px]">TP{lab.number}</span>
                  <span>
                    <strong className="block font-medium">{lab.title}</strong>
                    <em className="mt-0.5 block text-xs not-italic">Próximamente · {lab.short}</em>
                  </span>
                </span>
              ),
            )}
            <NavLink
              to="/docs"
              className={({ isActive }) =>
                cn(
                  'flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/60',
                )
              }
            >
              <BookOpen className="mt-0.5 size-4 shrink-0" />
              <span>
                <strong className="block font-medium">Documentación</strong>
                <em className="mt-0.5 block text-xs not-italic text-muted-foreground">Teoría y checklist</em>
              </span>
            </NavLink>
          </nav>
        </ScrollArea>

        <div className="border-t border-sidebar-border p-3">
          <SessionMenu
            pi={session.settings.pi}
            onPi={(pi) =>
              setSession((prev) => ({
                ...prev,
                settings: { ...prev.settings, pi },
              }))
            }
            onDemo={() => {
              loadDemo()
              toast.success('Cargué los datos de ejemplo')
            }}
            onDownload={download}
            onImport={onImport}
            onReset={() => {
              reset()
              toast.success('Sesión en blanco')
            }}
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print flex items-center justify-between gap-2 border-b px-3 py-2 lg:hidden">
          <NavLink to="/" className="min-w-0 truncate font-serif text-lg font-medium">
            Mesa de lab
          </NavLink>
          <div className="flex shrink-0 items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <NavLink to="/labs/tp1">TP1</NavLink>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <NavLink to="/docs">Docs</NavLink>
            </Button>
            <SessionMenu
              pi={session.settings.pi}
              onPi={(pi) =>
                setSession((prev) => ({
                  ...prev,
                  settings: { ...prev.settings, pi },
                }))
              }
              onDemo={() => {
                loadDemo()
                toast.success('Cargué los datos de ejemplo')
              }}
              onDownload={download}
              onImport={onImport}
              onReset={() => {
                reset()
                toast.success('Sesión en blanco')
              }}
            />
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SessionMenu({
  pi,
  onPi,
  onDemo,
  onDownload,
  onImport,
  onReset,
}: {
  pi: PiMode
  onPi: (pi: PiMode) => void
  onDemo: () => void
  onDownload: () => void
  onImport: (file: File | undefined) => void
  onReset: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          Sesión
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>π en las fórmulas</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={pi} onValueChange={(value) => onPi(value as PiMode)}>
          {PI_MODES.map((mode) => (
            <DropdownMenuRadioItem key={mode} value={mode}>
              {piLabel(mode)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDemo}>Probar con datos de ejemplo</DropdownMenuItem>
        <DropdownMenuItem onClick={onDownload}>Guardar sesión (JSON)</DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'application/json'
            input.onchange = () => onImport(input.files?.[0])
            input.click()
          }}
        >
          Abrir sesión guardada
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onReset}>
          Empezar de cero
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
