"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters long.")
        .max(30, "Password must be less than 30 characters long.")
        .refine(password => /[A-Z]/.test(password), "Password must contain at least one capital letter.")
        .refine(password => /\d/.test(password), "Password must contain at least one number."),
    confirm: z.string(),
}).refine((data) => data.confirm === data.password, {
    message: "Passwords must match.",
    path: ["confirm"],
});

export function usePasswordForm(callback: (values: z.infer<typeof formSchema>) => void) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirm: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        callback?.(values)
    }

    return [form, onSubmit]
}