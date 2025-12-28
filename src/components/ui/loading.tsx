import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  return (
    <Loader2
      className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    />
  )
}

interface LoadingProps {
  text?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Loading({ text = "Laden...", size = "md", className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)} role="status">
      <LoadingSpinner size={size} />
      <p className="text-muted-foreground text-sm">{text}</p>
      <span className="sr-only">{text}</span>
    </div>
  )
}

interface InlineLoadingProps {
  text?: string
  className?: string
}

export function InlineLoading({ text = "Laden...", className }: InlineLoadingProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} role="status">
      <LoadingSpinner size="sm" />
      <span className="text-sm text-muted-foreground">{text}</span>
      <span className="sr-only">{text}</span>
    </div>
  )
}
