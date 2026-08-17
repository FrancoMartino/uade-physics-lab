import type { Components } from 'react-markdown'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { articleById, articles, sections } from './registry.ts'
import { matchesQuery } from './search.ts'
import { VelocityExample } from './VelocityExample.tsx'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="my-4 max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-border bg-muted/50 px-2 py-1.5 text-left">{children}</th>,
  td: ({ children }) => <td className="border border-border px-2 py-1.5 text-left">{children}</td>,
  a: ({ href, children }) => (
    <a href={href} className="text-primary underline underline-offset-4" target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      {children}
    </a>
  ),
}

function DocsIndex({
  query,
  onQuery,
  currentId,
}: {
  query: string
  onQuery: (value: string) => void
  currentId: string | undefined
}) {
  const filtered = useMemo(
    () =>
      articles.filter(
        (article) =>
          matchesQuery(article.title, query) ||
          matchesQuery(article.body, query) ||
          article.tags.some((tag) => matchesQuery(tag, query)),
      ),
    [query],
  )

  return (
    <div className="min-w-0">
      <label className="mb-3 block text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Buscar
        <Input
          className="mt-1.5"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="cifras, ΔV, calibre…"
        />
      </label>
      <nav className="max-h-[min(22rem,50vh)] space-y-4 overflow-y-auto overscroll-contain pr-1 lg:max-h-[calc(100svh-12rem)]">
        {sections.map((section) => {
          const items = filtered.filter((article) => article.section === section)
          if (items.length === 0) return null
          return (
            <div key={section}>
              <p className="mb-1 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                {section}
              </p>
              <div className="flex flex-col gap-0.5">
                {items.map((article) => (
                  <Link
                    key={article.id}
                    to={`/docs/${article.id}`}
                    className={cn(
                      'rounded-md px-2 py-1.5 text-sm leading-snug hover:bg-accent',
                      currentId === article.id && 'bg-accent font-medium',
                    )}
                  >
                    {article.title}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </nav>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        No están transcritas la Guía de ejercicios ni la clase de MRU; siguen en <code>/ref</code>.
      </p>
    </div>
  )
}

export function DocsPage() {
  const { articleId } = useParams()
  const [query, setQuery] = useState('')
  const current = articleId ? articleById(articleId) : articles[0]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-start">
      <aside className="no-print w-full shrink-0 lg:sticky lg:top-4 lg:w-64">
        <details className="docs-toc rounded-xl border bg-card px-4 py-3 lg:border-0 lg:bg-transparent lg:p-0" open>
          <summary className="cursor-pointer text-sm font-medium lg:hidden">Artículos</summary>
          <div className="mt-3 lg:mt-0">
            <DocsIndex query={query} onQuery={setQuery} currentId={current?.id} />
          </div>
        </details>
      </aside>
      <article className="docs-prose min-w-0 flex-1">
        {current ? (
          <>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              {current.section}
            </p>
            <h1>{current.title}</h1>
            <Markdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}
            >
              {current.body}
            </Markdown>
            {current.widget === 'velocity' ? <VelocityExample /> : null}
          </>
        ) : (
          <p>No hay artículos para esa búsqueda.</p>
        )}
      </article>
    </div>
  )
}
