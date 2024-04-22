'use client'

import React from "react"
import usePageLoader from "@/lib/page-loader"
import { CompleteForm } from "../../complete-form"

const stages = [
    { title: 'Reset password', description: "Make a new password to replace the old one" },
    { title: 'Ready to go!', description: "Let's shop!" },
]

export default function Haha() {
    usePageLoader()

    return (
        <CompleteForm
            stages={stages}
            secret={"resetV#password"}
            fallbackPage="/forgotpassword"
            register={false}
        />
    )
}