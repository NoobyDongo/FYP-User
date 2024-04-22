"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema1_1 = z.object({
  fname: z.string().min(1, {
    message: "Enter your first name.",
  }),
  lname: z.string().min(1, {
    message: "Enter your last name.",
  }),
})
export function useStageOneForm(callback: (values: z.infer<typeof formSchema1_1>) => void) {
  const form = useForm<z.infer<typeof formSchema1_1>>({
    resolver: zodResolver(formSchema1_1),
    defaultValues: {
      fname: "",
      lname: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema1_1>) {
    callback?.(values)
  }

  return [form, onSubmit]
}

const formSchema1_2 = z.object({
  nname: z.string().min(1, {
    message: "Enter your nickname.",
  }),
})
export function useStageOneFormN(callback: (values: z.infer<typeof formSchema1_2>) => void) {
  const form = useForm<z.infer<typeof formSchema1_2>>({
    resolver: zodResolver(formSchema1_2),
    defaultValues: {
      nname: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema1_2>) {
    callback?.(values)
  }

  return [form, onSubmit]
}


const formSchema2 = z.object({
  email: z.string().email("Enter an email address."),
  phone: z.string()
    .regex(/^\d{4}\d{4}$/, "Enter a HK phone number, eg: 6811 1123.")
    .optional()
    .or(z.literal('')),
})
export function useStageTwoForm(callback: (values: z.infer<typeof formSchema2>) => void) {
  const form = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      email: "",
      phone: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema2>) {
    callback?.(values)
  }

  return [form, onSubmit]
}