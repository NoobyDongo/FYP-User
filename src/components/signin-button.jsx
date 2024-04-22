'use client'
import { Button } from "@/components/ui/button"
import useCustomRouter from "@/lib/custom-router"

export default function SigninButton() {
    const router = useCustomRouter()
    return (
        <Button
            onClick={() => router.push('/signin')}
            variant="ghost"
            className="px-3 translate-x-[-12px] lg:translate-x-0"
        >
            Sign in
        </Button>
    )
}