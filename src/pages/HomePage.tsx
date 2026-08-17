import { Link } from 'react-router'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function HomePage() {
  return (
    <section className="mx-auto max-w-3xl">
      <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
        Física I · laboratorio
      </p>
      <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-pretty sm:text-4xl md:text-5xl">
        Anotá lo que mediste. Acá sale qué copiar al formulario.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Preguntas en castellano, una por vez. El error del instrumento se aplica solo. Al informe
        van derivadas parciales; extremos quedan al lado para comparar.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/labs/tp1">
            Abrir el TP1
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link to="/docs/checklist-prelab">
            <BookOpen />
            Antes de entrar al lab
          </Link>
        </Button>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Instrumentos</CardTitle>
            <CardDescription>Calibre, probeta y balanza. Un error global para cada uno.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Tres cuerpos</CardTitle>
            <CardDescription>Cilindro, escalonado (o con agujero) y tubo. V en ml, ρ en g/cm³.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Informe</CardTitle>
            <CardDescription>Tablas, gráfico m(V) y campos para las definiciones. Imprimible.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">No rellena las respuestas conceptuales por vos.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
