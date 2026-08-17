import type { DocArticle } from '../types.ts'

export const magnitudesArticles: DocArticle[] = [
  {
    id: 'magnitudes',
    title: 'Qué es una magnitud y qué es medir',
    section: 'Magnitudes',
    tags: ['magnitud', 'medir', 'escalar', 'vector'],
    body: `Una **magnitud** es toda propiedad factible de ser medida.

**Medir es comparar.** Hace falta:

- la **propiedad** (por ejemplo longitud),
- un **instrumento** (regla, calibre),
- una **unidad** (metro),
- un **patrón** de referencia universal.

## Escalares y vectoriales

**Escalar:** queda determinada con un solo valor. Se simboliza con una letra. Ejemplos: tiempo $t$, masa $m$.

**Vectorial:** hace falta módulo, dirección y sentido. Se simboliza $\\vec{F}$ o $\\mathbf{F}$. Ejemplos: fuerza, velocidad.

Cierre de la clase: no todas las cantidades son iguales. Identificar si es escalar o vectorial es parte de interpretar el problema. Las unidades fundamentales son los pilares; los prefijos acomodan el orden de magnitud.
`,
  },
  {
    id: 'vectores',
    title: 'Vectores: componentes y operaciones',
    section: 'Magnitudes',
    tags: ['vector', 'componentes', 'producto escalar', 'producto vectorial'],
    body: `Un vector en el plano se puede escribir:

- cartesianas: $\\vec{a} = (17;\\,15)$ o $17\\,\\hat{\\imath} + 15\\,\\hat{\\jmath}$
- polar: módulo $22{,}7$ y $\\theta = 41{,}4^\\circ$

Módulo y ángulo:

$$
|\\vec{a}| = \\sqrt{a_x^2 + a_y^2}
$$

$a_x = |\\vec{a}|\\cos\\theta$, $a_y = |\\vec{a}|\\sin\\theta$.

## Operaciones (clase)

Suma: $\\vec{c} = (a_x+b_x)\\,\\hat{\\imath} + (a_y+b_y)\\,\\hat{\\jmath}$.

Resta: análogo con signo menos.

**Producto escalar** (da un número):

$$
\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\alpha = a_x b_x + a_y b_y
$$

**Producto vectorial** (en 3D da un vector perpendicular a los dos).

## Ejemplo de la clase

$\\vec{a} = 4\\,\\hat{\\imath} - 2\\,\\hat{\\jmath}$, $\\vec{b} = -3\\,\\hat{\\imath} + 5\\,\\hat{\\jmath}$.

$$
\\vec{a}\\cdot\\vec{b} = 4(-3) + (-2)(5) = -12-10 = -22
$$

$|\\vec{a}| \\approx 4{,}47$, $|\\vec{b}| \\approx 5{,}83$, $\\theta_a \\approx -26{,}6^\\circ$, $\\theta_b \\approx 121{,}0^\\circ$, $\\alpha \\approx 147{,}6^\\circ$.

$$
4{,}47 \\cdot 5{,}83 \\cdot \\cos(147{,}6^\\circ) \\approx -22
$$
`,
  },
  {
    id: 'si-unidades',
    title: 'SI, prefijos y conversiones',
    section: 'Magnitudes',
    tags: ['si', 'unidades', 'prefijos', 'conversion', 'notacion cientifica'],
    body: `El **Sistema Internacional** parte de unidades fundamentales (longitud: metro; masa: kilogramo; tiempo: segundo) y construye las derivadas: volumen $m^3$, velocidad $m/s$.

Los **prefijos** acomodan la cantidad (μm, mm, cm, km). En el TP1 el formulario pide **cm** y **ml**, aunque el calibre lea **mm**. 1 cm³ = 1 ml.

## Actividades de la clase (para practicar)

1. Bacteria de $2{,}5\\,\\mu m$ a km.
2. Rosario–Córdoba ≈ 400 km a mm.
3. ¿Cuántos segundos equivalen a un año?
4. ¿Cuántos años equivalen a un segundo?

En el tiempo no siempre hay prefijos de a 10; hay que usar 60 s, 60 min, 24 h, 365 d.

Notación científica: $6\\cdot 10^2$ tiene una cifra significativa; $6{,}00\\cdot 10^2$ tiene tres. El formulario pide la masa en notación científica.
`,
  },
]
