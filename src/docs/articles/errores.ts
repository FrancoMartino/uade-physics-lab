import type { DocArticle } from '../types.ts'

export const erroresArticles: DocArticle[] = [
  {
    id: 'cifras-significativas',
    title: 'Cifras significativas',
    section: 'Errores',
    tags: ['cifras', 'significativas', 'ceros', 'notacion cientifica'],
    body: `Una medición no es un número exacto: es un intervalo. Las cifras significativas dicen cuánta información hay.

Reglas de la clase:

- Los ceros **en medio** de dígitos distintos de cero sí cuentan. $901\\,cm$ tiene 3; $10{,}609\\,kg$ tiene 5.
- Los ceros **a la izquierda** no cuentan. $0{,}03$ tiene 1; $0{,}0000000000000395$ tiene 3.
- En números mayores que 1, los ceros a la derecha de la coma **sí** cuentan. $2{,}0\\,dm$ tiene 2; $10{,}093\\,cm$ tiene 5.
- En enteros, los ceros a la derecha pueden o no contar: $600\\,kg$ puede ser 1, 2 o 3 cifras. Hace falta la división de escala, o notación científica.

## Actividades de la clase

1. $1{,}35\\,m$ → 3 cifras.
2. $25{,}0^\\circ C$ → 3 cifras.
3. $0{,}0025\\,kg$ → 2 cifras.
4. $3{,}50\\,m/s$ → 3 cifras.
5. $8{,}60\\cdot 10^6$ bacterias → 3 cifras.

En el lab, la **expresión adecuada** manda más que contar cifras del valor: primero se redondea ΔM y después se alinea M0.
`,
  },
  {
    id: 'error-absoluto-relativo',
    title: 'Valor representativo, ΔM, ε y ε%',
    section: 'Errores',
    tags: ['error absoluto', 'error relativo', 'incertidumbre', 'er%'],
    body: `Una magnitud se escribe:

$$
M = M_0 \\pm \\Delta M
$$

$M_0$ es el **valor representativo** (valor medido). $\\Delta M$ es el **error absoluto** (incerteza), con la misma unidad.

Ejemplos de la clase: $T = 23{,}5^\\circ C \\pm 0{,}2^\\circ$; $m = 158\\,g \\pm 1\\,g$; $t = 45\\,min \\pm 1\\,min$.

$$
\\varepsilon = \\frac{\\Delta M}{M_0} \\qquad \\varepsilon\\% = \\frac{\\Delta M}{M_0}\\cdot 100\\%
$$

$L = 4\\,cm \\pm 1\\,cm$ → $\\varepsilon = 0{,}25$ (25%).  
$L = 4{,}5\\,cm \\pm 0{,}1\\,cm$ → $\\varepsilon \\approx 0{,}02$ (2%).

## Problemas típicos

- $Z = 1{,}23452 \\pm 0{,}1$: el valor tiene dígitos que el error no justifica.
- $Z = 1{,}2 \\pm 0{,}001$: el error es más fino que el valor informado.

## Actividades

1. Escritorio entre $142{,}3\\,cm$ y $142{,}6\\,cm$: centro ± semianchura, y ε.
2. Metro con $\\pm 1\\,mm$: distancia mínima para que ε no pase de 1% o 5%.

En el TP, Er% del volumen o la densidad es $\\Delta M / M_0 \\cdot 100\\%$. El Er% contra el aluminio es otra cosa: $|\\rho - 2{,}7|/2{,}7 \\cdot 100\\%$.
`,
  },
  {
    id: 'precision-exactitud',
    title: 'Precisión y exactitud',
    section: 'Errores',
    tags: ['precision', 'exactitud', 'dispersion'],
    body: `Una buena medida pide dos cosas distintas:

- **Exactitud:** $M_0$ cerca del valor de referencia (acá, densidad del aluminio $2{,}7\\,g/cm^3$).
- **Precisión:** dispersión chica respecto de $M_0$ (ΔM chico, Er% chico).

Se puede ser preciso y no exacto (todos los tiros juntos, lejos del centro) o exacto y poco preciso.

En la discusión del TP: comparar Er% de fórmula vs probeta habla sobre todo de **precisión** del método. Comparar ρ con 2,7 g/cm³ habla de **exactitud**.
`,
  },
  {
    id: 'medicion-directa-indirecta',
    title: 'Medición directa e indirecta',
    section: 'Errores',
    tags: ['directa', 'indirecta', 'definicion', 'instrumento'],
    body: `Desde el punto de vista del **error absoluto**:

**Medición directa:** se obtiene con un instrumento. El error absoluto es el del instrumento (división de escala, o el que indique el procedimiento). Ejemplo: leer $h$ con el calibre.

**Medición indirecta:** se calcula con una fórmula a partir de otras mediciones. El error no lo da un aparato: hay que **propagarlo**. Ejemplo: el volumen $V = \\pi d^2 h / 4$, o la densidad $\\rho = m/V$.

El formulario pide que lo definan con sus palabras. No peguen este párrafo: expliquen la diferencia en términos de ΔM.
`,
  },
  {
    id: 'propagacion-extremos',
    title: 'Propagación por valores extremos',
    section: 'Errores',
    tags: ['extremos', 'max', 'min', 'propagacion', 'velocidad'],
    widget: 'velocity',
    body: `Si $M = M(a,b,c,\\ldots)$, con $a\\pm\\Delta a$, etc., se evalúa la función en los bordes:

$$
M_0 = \\frac{M_\\mathrm{max}+M_\\mathrm{min}}{2} \\qquad \\Delta M = \\frac{M_\\mathrm{max}-M_\\mathrm{min}}{2}
$$

Hay que **respetar el signo**. Si aumentar una variable **disminuye** $M$, para el máximo se usa el menos de esa variable.

## Ejemplo de la clase

$L = 350\\,m \\pm 1\\,m$, $t = 9{,}0\\,s \\pm 0{,}1\\,s$, $v = L/t$.

$$
v_\\mathrm{max} = \\frac{351}{8{,}9} \\approx 39{,}438\\,m/s \\qquad v_\\mathrm{min} = \\frac{349}{9{,}1} \\approx 38{,}352\\,m/s
$$

$$
v = 38{,}9\\,m/s \\pm 0{,}6\\,m/s
$$

(El error 0,543 se informa 0,6: se redondea **hacia arriba** a 1 cifra significativa.)

Usen el widget de abajo para verificar el motor de esta app con esos datos.
`,
  },
  {
    id: 'propagacion-parciales',
    title: 'Propagación por derivadas parciales',
    section: 'Errores',
    tags: ['parciales', 'derivadas', 'propagacion', 'formulario'],
    widget: 'velocity',
    body: `Es el método **que se copia al formulario**. Más fino que extremos (la diferencia porcentual de Δ suele ser chica, y por eso el profesor pide compararlos).

$$
\\Delta M = \\left|\\frac{\\partial M}{\\partial a}\\right|\\Delta a + \\left|\\frac{\\partial M}{\\partial b}\\right|\\Delta b + \\cdots
$$

## Mismo ejemplo $v = L/t$

$$
\\Delta v = \\frac{1}{t}\\Delta L + \\frac{L}{t^2}\\Delta t = \\frac{1}{9}(1) + \\frac{350}{81}(0{,}1) \\approx 0{,}543\\,m/s
$$

Se informa $v = 38{,}9\\,m/s \\pm 0{,}6\\,m/s$.

**No mezclar** el $V_0$ de un método con el $\\Delta V$ del otro.

## Densidad del cilindro (actividad de la clase)

$$
\\rho = \\frac{m}{\\pi r^2 L}
$$

con $m = 0{,}029\\,kg \\pm 0{,}005\\,kg$, $r = 8{,}2\\,mm \\pm 0{,}1\\,mm$, $L = 15{,}4\\,mm \\pm 0{,}1\\,mm$. Cuidado con las unidades antes de calcular.
`,
  },
]
