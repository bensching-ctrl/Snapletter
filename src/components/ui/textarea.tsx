import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  isValid?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isValid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        data-valid={isValid || undefined}
        className={cn(
          "border-input/80 placeholder:text-muted-foreground/70 hover:border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-lg border bg-background px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isValid && "border-green-500 dark:border-green-600 focus-visible:border-green-500 focus-visible:ring-green-500/20",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
