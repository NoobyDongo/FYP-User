import * as React from "react"

import { cn } from "@/lib/utils"

const OutlinedInput = React.forwardRef(({ className, type, label, onChange, ...props }, ref) => {
  
    const [hasValue, setHasValue] = React.useState(false)

  const handleChange = (e) => {
    onChange?.(e)
    setHasValue(e.target.value?.length > 0)
  }

  return (
    <div className={cn(
      "group relative flex border border-input h-9 w-full rounded-md  bg-transparent text-sm shadow-sm transition-colors placeholder:text-muted-foreground",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring ",
      "disabled:cursor-not-allowed disabled:opacity-50 bg-[inherit]", className
    )}>
      <input
        type={type}
        onChange={handleChange}
        className={cn(
          "bg-transparent outline-none size-full px-3"
        )}
        ref={ref}
        {...props} />
      <label className={cn(
        "absolute whitespace-nowrap pointer-events-none top-1/2 left-2 px-1 translate-y-[-50%] transition-all text-muted-foreground bg-[inherit] ",
        hasValue ? "text-xs text-ring top-[-3px]" :
          "group-focus-within:text-xs group-focus-within:text-ring group-focus-within:top-[-3px]"


      )}>{label}</label>


    </div>
  );
})
OutlinedInput.displayName = "OutlinedInput"

export default OutlinedInput