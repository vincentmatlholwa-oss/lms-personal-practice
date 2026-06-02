import { type ReactNode } from "react"
import { Card, CardContent } from "./ui/card"

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <Card className="border-0 shadow-card">
      <CardContent className="text-center py-16">
        {icon ? (
          <div className="flex items-center justify-center mb-6">{icon}</div>
        ) : null}
        <h3 className="mb-2">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
        ) : null}
        {action ? <div className="flex justify-center">{action}</div> : null}
      </CardContent>
    </Card>
  )
}
