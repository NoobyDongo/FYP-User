'use client'
import { Button } from "@/components/ui/button"
import useCustomRouter from "@/lib/custom-router"

export default function CreateAccountButton({email}) {
    const router = useCustomRouter()
    return (
        <Button
            onClick={() => router.push(`/register${email? `?email=${email}`: ''}`)}
            variant="ghost"
            className="px-3 translate-x-[-12px] lg:translate-x-0"
        >
            Create account
        </Button>
    )
}