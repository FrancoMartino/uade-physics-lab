# Laboratorio de Física UADE

Glosario del trabajo práctico de mediciones, errores y densidad. Sin detalles de implementación.

## Language

**Medición directa**:
Una magnitud obtenida con un instrumento, cuyo error absoluto es el del instrumento.
_Avoid_: Medida cruda, lectura

**Medición indirecta**:
Una magnitud calculada con una fórmula a partir de otras mediciones, cuyo error se obtiene por propagación.
_Avoid_: Medida calculada, resultado

**Valor representativo**:
El número central M0 de una medición escrita como M0 ± ΔM.
_Avoid_: Valor verdadero, valor exacto, promedio (salvo que haya varias tomas)

**Error absoluto**:
ΔM, la semianchura del intervalo en el que se confía que está la magnitud. Misma unidad que M0.
_Avoid_: Incerteza (como término distinto), incertidumbre estándar

**Error relativo**:
ε = ΔM / M0, adimensional.
_Avoid_: Precisión (como sinónimo)

**Error relativo porcentual**:
ε% = (ΔM / M0) · 100%. En el TP también se usa |calculado − real| / real · 100% contra el aluminio.
_Avoid_: Er%, error porcentual (como si fueran otra magnitud)

**Expresión adecuada**:
La forma de informar M0 ± ΔM: ΔM con una cifra significativa (redondeada hacia arriba, como en la clase) y M0 alineado a esa decimal.
_Avoid_: Cifras significativas del valor (sin mirar el error)

**Propagación por derivadas parciales**:
ΔM = Σ |∂M/∂xᵢ| Δxᵢ. Es el método que se copia al formulario.
_Avoid_: Diferencial total, linealización (como nombre en el informe)

**Propagación por valores extremos**:
M_max y M_min evaluando la función en los bordes del intervalo; M0 = (max+min)/2 y ΔM = (max−min)/2. Sirve para comparar, no para mezclar con el Δ de parciales.
_Avoid_: Método min-max, barrido

**Precisión**:
Qué tan chica es la dispersión (ΔM) respecto de M0.
_Avoid_: Exactitud (como si fueran lo mismo)

**Exactitud**:
Qué tan cerca está M0 del valor de referencia (acá, densidad del aluminio 2,7 g/cm³).
_Avoid_: Precisión

**Propiedad intensiva**:
Una magnitud que no depende de la cantidad de materia; la densidad lo es.
_Avoid_: Propiedad intrínseca (si el informe pide “intensiva”)
