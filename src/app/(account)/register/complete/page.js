"use client"

import React from "react"
import usePageLoader from "@/lib/page-loader"
import { CompleteForm } from "../../complete-form"

const stages = [
    { title: 'Setup password', description: "Create a password to protect your account" },
    { title: 'Welcome to V#!', description: "Let's shop!" },
]

export default function Haha() {
    usePageLoader()

    return (
        <CompleteForm
            secret={"welcometoV#"}
            stages={stages}
            fallbackPage="/register"
            register={true}
        />
    )
}