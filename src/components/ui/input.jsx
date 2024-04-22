import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, disabled, type, start, end, ...props }, ref) => {
  return (
    <div className={cn(
      "group flex items-center h-9 gap-3 w-full rounded-md",
      "border border-input",
      " bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
      disabled? "text-muted-foreground" : "", className
    )} >
      {start}
      <input
        type={type}
        className={cn(
          "disabled:cursor-not-allowed disabled:opacity-50", 
          "size-full bg-transparent outline-none",
          "bg-clip-text"
        )}
        ref={ref}
        disabled={disabled}
        {...props} />
      {end}
    </div >
  );
})
Input.displayName = "Input"

export { Input }
