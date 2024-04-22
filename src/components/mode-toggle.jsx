"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ModeToggle({ className, textMode = false }) {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      {!textMode && <DropdownMenuTrigger asChild className='bg-transparent size-10'>
        <Button variant="outline" size="icon" className={className}>
          <SunIcon className="w-[1.2rem] h-[1.2rem] transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute w-[1.2rem] h-[1.2rem] transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>}
      {textMode && <DropdownMenuTrigger asChild className='bg-transparent'>
        <Button variant="ghost" className={className}>
          <div className="text-xs">
            <span className="dark:hidden">Light Mode On</span>
            <span className="dark:block hidden">Dark Mode On</span>
          </div>
          <div className="relative ml-3">
            <SunIcon className="transition-all rotate-0 scale-100 size-[1] dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="top-0 absolute transition-all rotate-90 scale-0 size-[1] dark:rotate-0 dark:scale-100" />
          </div>
        </Button>
      </DropdownMenuTrigger>}
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
