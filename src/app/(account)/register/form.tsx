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

const formSchema3 = z.object({
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

export function useStageThreeForm(callback: (values: z.infer<typeof formSchema3>) => void) {
  const form = useForm<z.infer<typeof formSchema3>>({
    resolver: zodResolver(formSchema3),
    defaultValues: {
      password: "",
      confirm: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema3>) {
    callback?.(values)
  }

  return [form, onSubmit]
}