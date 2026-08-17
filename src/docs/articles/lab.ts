import type { DocArticle } from '../types.ts'

export const labArticles: DocArticle[] = [
  {
    id: 'glosario',
    title: 'Glosario rápido',
    section: 'Laboratorio',
    tags: ['glosario', 'definiciones'],
    body: `- **Medición directa:** el instrumento da M0 y ΔM.
- **Medición indirecta:** M0 sale de una fórmula; ΔM se propaga.
- **Valor representativo M0:** el centro del intervalo.
- **Error absoluto ΔM:** semianchura. Misma unidad que M0.
- **Error relativo ε:** ΔM/M0.
- **ε% / Er%:** ε·100%. O, contra Al, |calc − 2,7|/2,7·100%.
- **Expresión adecuada:** Δ con 1 cifra significativa hacia arriba; M0 a esa decimal.
- **Precisión:** Δ chico respecto de M0.
- **Exactitud:** cerca del valor de referencia.
- **Propiedad intensiva:** no depende de la cantidad (densidad).
- **Al formulario:** derivadas parciales. Extremos solo para comparar.
`,
  },
  {
    id: 'checklist-prelab',
    title: 'Checklist pre-lab',
    section: 'Laboratorio',
    tags: ['checklist', 'lab', 'unidades', 'balanza'],
    body: `Antes de medir:

1. Notebook con esta app (\`npm run dev\` o la URL de Pages) y JSON de sesión de respaldo.
2. Saber leer calibre y micrómetro (videos en Instrumentos).
3. Anotar la **división de escala** de calibre, micrómetro, probeta y balanza. Eso es Δ, salvo que el ayudante diga otra cosa.
4. Decidir π: máquina, 3,14 o 3,1416 (selector de la barra).
5. Plan: medir en mm, informar en cm. No convertir a mano dos veces.
6. Tarear la balanza en cada pesaje.
7. Una medición por variable.
8. Cuerpo 3: Di < De.
9. Copiar al formulario **solo parciales**.
10. Incluir (0,0) en el gráfico; masa en Y, volumen en X.
11. Escribir definiciones con sus palabras, no pegar Docs.

Si ρ ≈ 2700: cargaron mm como cm.
`,
  },
  {
    id: 'como-usar',
    title: 'Cómo usar esta calculadora',
    section: 'Laboratorio',
    tags: ['app', 'uso', 'copiar', 'json'],
    body: `Te voy a preguntar, de a una:

1. Quiénes son y el turno.
2. Con qué miden (calibre / micrómetro). El error de todos los largos queda fijo.
3. División de la probeta y de la balanza.
4. Cómo es el cuerpo 2 (macizo o con agujero).
5. Cada medida en castellano, con el dibujo de qué lado pedir. Escribí lo que ves; si el calibre está en mm, yo lo paso a cm.
6. Después de cada cuerpo, el número para copiar al formulario (derivadas parciales).
7. El gráfico masa–volumen.
8. Las frases del informe, si quieren escribirlas ahora.
9. Imprimir.

Enter o Continuar. Atrás si te equivocaste. Las definiciones se pueden saltear.

**Probar con datos de ejemplo** está en el menú **Sesión** (barra lateral, o el menú del celular).
`,
  },
]
