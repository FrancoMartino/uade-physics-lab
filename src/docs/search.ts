export function normalizeSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function matchesQuery(haystack: string, query: string): boolean {
  const q = normalizeSearch(query).trim()
  if (q === '') return true
  return normalizeSearch(haystack).includes(q)
}
