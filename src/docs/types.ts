export type DocSection =
  | 'Materia'
  | 'Magnitudes'
  | 'Errores'
  | 'TP1'
  | 'Laboratorio'

export type DocArticle = {
  id: string
  title: string
  section: DocSection
  tags: string[]
  body: string
  widget?: 'velocity'
}
