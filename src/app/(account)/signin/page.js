"use client"
import useSigninForm from "./form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import { PersonIcon } from '@radix-ui/react-icons';
import { AccountForm } from "@/components/account-form"
import usePageLoader from "@/lib/page-loader"
import CreateAccountButton from "@/components/create-account-button"
import { PasswordInput } from "@/components/password-input"
import LinkButton from "@/components/link-button"
import { toast } from "sonner"
import useCustomRouter from "@/lib/custom-router"
import TimerButton from "@/components/timer-button"
import sleep from "@/lib/sleep"

function SigninForm(button) {
    const router = useCustomRouter()

    const handleSubmit = async (values) => {
        button.current.setLoading(true)
        await sleep(1000)

        const response = await fetch('/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });

        const data = await response.json();


        if (response.ok) {
            if (data.data) {
                router.push("/")
                toast("Welcome Back!", { icon: "👋" })
            } else {
                toast("Invalid username or password.", { icon: "❌" })
                button.current.setLoading(false)
            }
        } else {
            toast("Something went wrong...", { icon: "⚠️" })
            button.current.setLoading(false)
        }

    }
    const [form, onSubmit] = useSigninForm(handleSubmit)
    const submit = React.useRef()

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        if (email) {
            form.setValue('email', email);
        }
    }, []);

    let email = form?.getValues?.()?.email

    const theForm = (
        <Form className='lg:mt-auto' {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl className="text-md h-14 bg-background">
                                <Input placeholder="Email" start={
                                    <PersonIcon></PersonIcon>
                                } {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl className="text-md h-14">
                                <PasswordInput placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />

                            <LinkButton href={`/forgotpassword${email ? `?email=${email}` : ''}`} type="button" className="p-0 mt-3">
                                Forgot password?
                            </LinkButton>
                        </FormItem>
                    )}
                />
                <button className="hidden" ref={submit} type="submit">Submit</button>
            </form>
        </Form>
    )

    return [theForm, submit, form]
}

export default function Page() {
    usePageLoader()

    const button = React.useRef()
    const [content, submit, form] = SigninForm(button)

    const router = useCustomRouter()

    let timeout

    React.useEffect(() => {
        let prom = new Promise((resolve, reject) => {
            fetch('/api/verify', { cache: "no-store" })
                .then(response => response.json())
                .then(data => {
                    resolve(data.data)
                })
                .catch(error => reject(error));
        })

        if (timeout)
            clearTimeout(timeout)
        timeout = setTimeout(() => {
            toast.promise(prom, {
                loading: 'Checking your session...',
                success: async (data) => {
                    await sleep(1000)
                    if (data) {
                        router.push("/")
                        return "You are already signed in."
                    } else
                        return "You are connected to our server."
                },
                error: (error) => {
                    console.error(error)
                }
            })
        }, 50)
    }, [])

    return (
        <AccountForm
            title="Sign in"
            description="Continue shopping with your account"
            content={content}
            footer={[
                <CreateAccountButton key={1} email={form.getValues().email} />,
                <TimerButton
                    key={2}
                    timeout={0}
                    ref={button}
                    onClick={() => submit.current.click()}
                    variant="default"
                    className=""
                >
                    Sign in
                </TimerButton>
            ]}
        />
    )
}