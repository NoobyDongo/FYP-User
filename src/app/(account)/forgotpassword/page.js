"use client"
import useForgetForm from "./form"
import { toast } from "sonner"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import { AccountForm } from "@/components/account-form"
import TimerButton from "@/components/timer-button"
import NProgress from 'nprogress';
import usePageLoader from "@/lib/page-loader"
import CreateAccountButton from "@/components/create-account-button"
import { useEmailSender } from "../email-sender"
import { useExistingEmailChecker } from "../existing-email-checker"
import { useEncryption } from "@/lib/encrypt"
import useCustomRouter from "@/lib/custom-router"

function ForgetForm(callback) {
    const [form, onSubmit] = useForgetForm(callback)

    const submit = React.useRef()

    const theForm = (
        <Form className='lg:mt-auto' {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl className="text-md h-14">
                                <Input placeholder="example@abc.abc" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <button className="hidden" ref={submit} type="submit">Submit</button>
            </form>
        </Form>
    )

    return [theForm, submit, form]
}

export default function ForgotPage() {
    usePageLoader()
    const encrypt = useEncryption("resetV#password")
    const checkEmail = useExistingEmailChecker({ signin: false, register: true })

    const button = React.useRef()
    const lastPassword = React.useRef()
    const router = useCustomRouter()

    const handleFormSubmit = (values) => {
        console.log("handleFormSubmit", values)
        if (!values) return
        checkEmail(values.email)
            .then(async (r) => {
                if (r) {
                    lastPassword.current = r.password
                    let objString = JSON.stringify(r);
                    let token = encrypt(objString)

                    let data = {
                        to: values.email,
                        subject: "Reset your password",
                        type: "forgetPassword",
                        content: [`http://localhost/forgotpassword/complete?token=${token}&email=${values.email}`]
                    }
                    let res = await _sendEmail(data)
                    if (res.status === 200) {
                        setSent(data)
                    }
                } else {
                    setSent(false)
                }
            })
    }
    const [content, submit, rawForm] = ForgetForm(handleFormSubmit)

    let timeout;
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');

        if (email) {
            rawForm.setValue('email', email);
            if (timeout) clearTimeout(timeout)
            timeout = setTimeout(() => {
                submit.current.click();
            }, 200);
            //submit.current.click();
        }
    }, []);

    const [sent, setSent, _sendEmail, resend, sender] = useEmailSender({
        start: () => {
            NProgress.start();
            button.current?.setLoading(true)
        }, end: () => {
            NProgress.done();
            button.current?.setLoading(false)
        }, reset: () => {
            rawForm.reset()
        }, checker: (done) => {
            checkEmail(rawForm.getValues().email).then(res => {
                if (res) {
                    if (res.password !== lastPassword.current) {
                        toast("Seem like you have already reset your password, sending you to signin.", { icon: '👏' })
                        setTimeout(() => {
                            router.push("/signin")
                        }, 500);
                    } else {
                        done?.()
                    }

                }
            })
        }, purpose: "with a link to reset your password"
    })

    return (
        <AccountForm
            title={sent ? "Email Sent!" : "Forgot Password?"}
            description={sent ?
                <>
                    Email imcomming, check your inbox in a few seconds
                </>
                : "Don't worry. We will send you an email to reset it"}
            content={sent ? sender : content}
            footer={
                [
                    <CreateAccountButton key={1} />,
                    <TimerButton
                        key={2}
                        timeout={sent ? 3 : 0}
                        ref={button}
                        onClick={sent ? resend : () => submit.current.click()}
                        variant="default"
                    >
                        {sent ? "Resend Email" : "Next"}
                    </TimerButton>
                ]}
        />
    )
}