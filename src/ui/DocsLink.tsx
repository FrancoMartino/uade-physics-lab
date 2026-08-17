import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export function DocsLink({ to, children = 'Ver en documentación' }: { to: string; children?: string }) {
  return (
    <Button asChild variant="link" className="h-auto px-0">
      <Link to={to}>{children}</Link>
    </Button>
  )
}
