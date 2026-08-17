import { erroresArticles } from './articles/errores.ts'
import { labArticles } from './articles/lab.ts'
import { magnitudesArticles } from './articles/magnitudes.ts'
import { materiaArticles } from './articles/materia.ts'
import { tp1Articles } from './articles/tp1.ts'
import type { DocArticle, DocSection } from './types.ts'

export const articles: DocArticle[] = [
  ...labArticles,
  ...materiaArticles,
  ...magnitudesArticles,
  ...erroresArticles,
  ...tp1Articles,
]

export const sections: DocSection[] = ['Laboratorio', 'Materia', 'Magnitudes', 'Errores', 'TP1']

export function articleById(id: string): DocArticle | undefined {
  return articles.find((article) => article.id === id)
}
