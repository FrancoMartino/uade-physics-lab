import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from './ui/AppShell.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { Tp1Layout } from './labs/tp1-mediciones/Tp1Layout.tsx'
import { InterviewPage } from './labs/tp1-mediciones/InterviewPage.tsx'

const DocsPage = lazy(async () => {
  const mod = await import('./docs/DocsPage.tsx')
  return { default: mod.DocsPage }
})
const InformeStep = lazy(async () => {
  const mod = await import('./labs/tp1-mediciones/InformeStep.tsx')
  return { default: mod.InformeStep }
})

function Fallback() {
  return <p className="text-sm text-muted-foreground">Cargando…</p>
}

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<Navigate to="/docs/glosario" replace />} />
          <Route path="/docs/:articleId" element={<DocsPage />} />
          <Route path="/labs/tp1" element={<Tp1Layout />}>
            <Route index element={<InterviewPage />} />
            <Route path="informe" element={<InformeStep />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
