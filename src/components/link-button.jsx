'use client'

import { Button } from "@/components/ui/button"
import useCustomRouter from "@/lib/custom-router"

export default function LinkButton({ onClick, href, children, ...props }) {
    const router = useCustomRouter()
    return (
        <Button variant='link' onClick={(e) => {
            onClick?.(e)
            if (href)
                router.push(href)
        }} {...props}>
            {children}
        </Button>
    )
}