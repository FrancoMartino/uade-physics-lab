export type NamedValue = {
  key: string
  value: number
  delta: number
}

export type Contribution = {
  key: string
  partial: number
  term: number
}

export type PartialsResult = {
  value: number
  delta: number
  contributions: Contribution[]
}

export type ExtremesResult = {
  value: number
  delta: number
  max: number
  min: number
  maxCombo: Record<string, '+' | '-'>
  minCombo: Record<string, '+' | '-'>
}

export type CompareResult = {
  partials: PartialsResult
  extremes: ExtremesResult
  deltaDiffPercent: number
  valueDiffPercent: number
}

export function propagatePartials(
  variables: NamedValue[],
  evaluate: (values: Record<string, number>) => number,
  partials: (values: Record<string, number>) => Record<string, number>,
): PartialsResult {
  const values: Record<string, number> = {}
  for (const variable of variables) {
    values[variable.key] = variable.value
  }
  const value = evaluate(values)
  const grads = partials(values)
  const contributions: Contribution[] = variables.map((variable) => {
    const partial = grads[variable.key] ?? 0
    return {
      key: variable.key,
      partial,
      term: Math.abs(partial) * Math.abs(variable.delta),
    }
  })
  const delta = contributions.reduce((sum, item) => sum + item.term, 0)
  return { value, delta, contributions }
}

export function propagateExtremes(
  variables: NamedValue[],
  evaluate: (values: Record<string, number>) => number,
): ExtremesResult {
  const n = variables.length
  const total = 1 << n
  let max = Number.NEGATIVE_INFINITY
  let min = Number.POSITIVE_INFINITY
  let maxCombo: Record<string, '+' | '-'> = {}
  let minCombo: Record<string, '+' | '-'> = {}

  for (let mask = 0; mask < total; mask++) {
    const values: Record<string, number> = {}
    const combo: Record<string, '+' | '-'> = {}
    for (let i = 0; i < n; i++) {
      const variable = variables[i]
      const plus = (mask & (1 << i)) !== 0
      combo[variable.key] = plus ? '+' : '-'
      values[variable.key] = variable.value + (plus ? variable.delta : -variable.delta)
    }
    const result = evaluate(values)
    if (result > max) {
      max = result
      maxCombo = combo
    }
    if (result < min) {
      min = result
      minCombo = combo
    }
  }

  return {
    max,
    min,
    value: (max + min) / 2,
    delta: (max - min) / 2,
    maxCombo,
    minCombo,
  }
}

export function comparePropagation(
  variables: NamedValue[],
  evaluate: (values: Record<string, number>) => number,
  partials: (values: Record<string, number>) => Record<string, number>,
): CompareResult {
  const partialsResult = propagatePartials(variables, evaluate, partials)
  const extremes = propagateExtremes(variables, evaluate)
  const deltaDiffPercent =
    partialsResult.delta === 0
      ? extremes.delta === 0
        ? 0
        : Number.POSITIVE_INFINITY
      : (Math.abs(extremes.delta - partialsResult.delta) / partialsResult.delta) * 100
  const valueDiffPercent =
    partialsResult.value === 0
      ? extremes.value === 0
        ? 0
        : Number.POSITIVE_INFINITY
      : (Math.abs(extremes.value - partialsResult.value) / Math.abs(partialsResult.value)) * 100
  return { partials: partialsResult, extremes, deltaDiffPercent, valueDiffPercent }
}
