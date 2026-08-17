import { TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function AlertList({ alerts }: { alerts: string[] }) {
  if (alerts.length === 0) return null
  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Alert key={alert} variant="destructive">
          <TriangleAlert />
          <AlertTitle>Revisá esta medida</AlertTitle>
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
