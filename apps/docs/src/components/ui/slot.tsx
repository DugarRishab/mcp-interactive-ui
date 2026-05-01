import * as React from "react"

import { cn } from "@/lib/utils"

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (!children) return null

    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ref,
        className: cn(props.className, (children.props as { className?: string }).className),
      } as React.HTMLAttributes<HTMLElement>)
    }

    return <>{children}</>
  }
)
Slot.displayName = "Slot"

export { Slot }
