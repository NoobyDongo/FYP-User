"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email("Enter your email."),
  password: z.string().min(1, {
    message: "Enter your password",
  }),
})

export default function useSigninForm(callback?: (values: z.infer<typeof formSchema>) => void) {
  

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    callback?.(values)
  }

  return [form, onSubmit]
}