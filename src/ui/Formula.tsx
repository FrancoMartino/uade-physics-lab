import katex from 'katex'
import { cn } from '@/lib/utils'

type FormulaProps = {
  tex: string
  display?: boolean
}

export function Formula({ tex, display = false }: FormulaProps) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
  })
  return (
    <span
      className={cn('max-w-full overflow-x-auto', display && 'block py-2')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
