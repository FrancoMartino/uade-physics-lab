import { describe, expect, it } from 'vitest'
import { matchesQuery, normalizeSearch } from './search.ts'

describe('docs search', () => {
  it('ignores accents', () => {
    expect(normalizeSearch('Error')).toBe('error')
    expect(matchesQuery('propagación de errores', 'propagacion')).toBe(true)
    expect(matchesQuery('Cifras significativas', 'CIFRAS')).toBe(true)
  })
})
