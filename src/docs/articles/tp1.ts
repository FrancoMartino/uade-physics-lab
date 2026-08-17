import type { DocArticle } from '../types.ts'

export const tp1Articles: DocArticle[] = [
  {
    id: 'tp1-procedimiento',
    title: 'TP1: objetivos y procedimiento',
    section: 'TP1',
    tags: ['tp1', 'objetivos', 'probeta', 'aluminio', 'formulario'],
    body: `**Objetivo 1.** Volumen de tres cuerpos por fórmula y por desplazamiento de agua, con error absoluto propagado.

**Objetivo 2.** Densidad del material (aluminio) por $m/V$ y por gráfico masa–volumen.

## Reglas del formulario (no negociables)

- Una sola medición de cada variable + error del instrumento.
- $h$ y $d$ en **cm**; volumen en **ml**.
- Masa en **g** con notación científica; densidad en **g/cm³**.
- Llevar la balanza a **cero** en cada pesaje.
- Tabla 2 usa el volumen **por fórmula**, no el de la probeta.
- Los tres cuerpos son del mismo material (Al). Densidad de referencia: $2{,}7\\,g/cm^3$.

## Probeta

Se mide el volumen por desplazamiento. El error es el de la división de la probeta (o el que indiquen). No se propaga con π: es medición directa del volumen.

## Qué pide el informe, además de números

- Definiciones de medición directa e indirecta.
- Fórmula general de propagación a 3 variables.
- Diagrama del cuerpo 3 y su ΔV.
- Discusión: exactitud de los métodos; ventajas y desventajas de fórmula vs probeta.
- Definición de propiedad intensiva.
- Fórmula de Δρ.
- Ecuación de la línea de tendencia, densidad gráfica y Er% vs Al.
`,
  },
  {
    id: 'instrumentos',
    title: 'Calibre, micrómetro y otros',
    section: 'TP1',
    tags: ['calibre', 'micrometro', 'instrumento', 'video', 'probeta', 'balanza'],
    body: `En el lab aprenden a leer:

- **Calibre** (vernier): [video](https://youtu.be/SDUl-PyoaWg)
- **Tornillo micrométrico**: [video](https://youtu.be/0L1XEroRyLY)

Otros que muestra la guía: micrómetro de profundidad, calibre de profundidad, calibre de altura.

El error absoluto de una medición directa es el del instrumento. Esta app **no adivina** si usan la división o la mitad: lo escriben ustedes. Hay presets (0,05 mm, 0,02 mm, 0,01 mm) para rellenar Δ vacíos.

La calculadora acepta mm y convierte a cm. Si mezclan mm como cm, ρ sale cerca de 2700 g/cm³ y aparece una alerta.
`,
  },
  {
    id: 'geometrias-tp1',
    title: 'Geometrías y fórmulas de V y ΔV',
    section: 'TP1',
    tags: ['cilindro', 'tubo', 'escalonado', 'volumen', 'parciales'],
    body: `## Cuerpo 1 · cilindro macizo

Variables: $h$, $d$.

$$
V = \\frac{\\pi d^{2} h}{4}
$$

$$
\\Delta V = \\frac{\\pi d h}{2}\\Delta d + \\frac{\\pi d^{2}}{4}\\Delta h
$$

## Cuerpo 2 · escalonado

Macizo (suma):

$$
V = \\frac{\\pi}{4}(d^{2} h + D^{2} H)
$$

Si la pieza es un **orificio parcial**, se resta: $V = \\pi/4\\,(D^{2}H - d^{2}h)$. El interruptor está en la pantalla de volumen.

## Cuerpo 3 · tubo / arandela

Variables: $H$, $D_i$, $D_e$.

$$
V = \\frac{\\pi}{4}(D_e^{2} - D_i^{2}) H
$$

$$
\\Delta V = \\frac{\\pi D_e H}{2}\\Delta D_e + \\frac{\\pi D_i H}{2}\\Delta D_i + \\frac{\\pi}{4}(D_e^{2}-D_i^{2})\\Delta H
$$

$D_i$ más grande **achica** $V$: en extremos, $V_\\mathrm{max}$ usa $D_e+$, $D_i-$, $H+$.

Unidades de cálculo internas: cm y ml. $1\\,cm^3 = 1\\,ml$.
`,
  },
  {
    id: 'densidad',
    title: 'Densidad: m/V, gráfico y Er% vs Al',
    section: 'TP1',
    tags: ['densidad', 'intensiva', 'grafico', 'aluminio', 'er%'],
    body: `La densidad es **intensiva**: no depende de cuánta materia hay (un trozo chico y uno grande del mismo material tienen la misma ρ).

$$
\\rho = \\frac{m}{V} \\qquad \\Delta\\rho = \\frac{\\Delta m}{V} + \\frac{m}{V^{2}}\\Delta V
$$

$V$ y $\\Delta V$ salen de la **fórmula** (parciales).

## Gráfico

Eje X: volumen (ml). Eje Y: masa (g). Incluir **(0,0)**. La app ajusta $Y = aX + b$ (el origen es un punto más, no se fuerza la ordenada a cero). La **pendiente** $a$ es la densidad, con unidad g/cm³ (porque ml = cm³). Informar también $b$.

Er% contra el aluminio:

$$
\\mathrm{Er\\%} = \\frac{|\\rho_\\mathrm{calc} - 2{,}7|}{2{,}7}\\cdot 100\\%
$$
`,
  },
  {
    id: 'excel-tendencia',
    title: 'Línea de tendencia (Excel y esta app)',
    section: 'TP1',
    tags: ['excel', 'tendencia', 'grafico', 'cardozo'],
    body: `Tutorial de Julián Cardozo, para si el profesor pide el gráfico en Excel además del de la app.

1. Libro nuevo.
2. Cargar X e Y. Si la ordenada al origen debe ser cero, incluir **(0;0)**. En este TP se incluye (0,0) y se deja la ordenada libre.
3. Gráfico de **dispersión**.
4. Revisar que las variables estén en el eje correcto: volumen en X, masa en Y.
5. Agregar línea de tendencia (lineal) y mostrar ecuación.
6. Informar la pendiente **con unidades**. Acá: g/cm³.

La calculadora hace el mismo ajuste (mínimos cuadrados) y muestra $R^2$ para la discusión.
`,
  },
]
