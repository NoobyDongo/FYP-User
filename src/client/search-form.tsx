"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  value: z.string().optional(),
})

export default function useSearchForm(callback?: (values: z.infer<typeof formSchema>) => void) {
  
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    callback?.(values)
  }

  return [form, onSubmit]
}