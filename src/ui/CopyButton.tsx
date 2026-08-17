import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copiado')
    } catch {
      toast.error('No se pudo copiar')
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => void copy()}>
      {label}
    </Button>
  )
}
