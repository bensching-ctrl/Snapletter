import * as React from "react"
import { CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  isValid?: boolean
  showSuccessIcon?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isValid, showSuccessIcon = true, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          ref={ref}
          data-slot="input"
          data-valid={isValid || undefined}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground/70 selection:bg-primary/20 selection:text-foreground dark:bg-input/30 border-input/80 h-10 w-full min-w-0 rounded-lg border bg-background px-4 py-2 text-base shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "hover:border-input focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            isValid && "border-green-500 dark:border-green-600 focus-visible:border-green-500 focus-visible:ring-green-500/20",
            showSuccessIcon && isValid && "pr-10",
            className
          )}
          {...props}
        />
        {isValid && showSuccessIcon && (
          <CheckCircle2
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 dark:text-green-500"
            aria-hidden="true"
          />
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
