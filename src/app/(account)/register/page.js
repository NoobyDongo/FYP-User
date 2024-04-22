"use client"
import { useStageOneForm, useStageOneFormN, useStageTwoForm, useStageThreeForm } from "./form"

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
import { AccountForm } from "@/components/account-form"
import { EnvelopeClosedIcon, AlignRightIcon, AlignLeftIcon } from '@radix-ui/react-icons'
import usePageLoader from "@/lib/page-loader"
import TimerButton from "@/components/timer-button"
import NProgress from 'nprogress';
import { useEmailSender } from "../email-sender"

import { cn } from "@/lib/utils"
import { PersonIcon } from '@radix-ui/react-icons';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import NextImage from "@/components/next-image"
import { DialogClose } from "@radix-ui/react-dialog"
import { useEncryption, useDecryption } from "@/lib/encrypt"
import SigninButton from "@/components/signin-button"
import { useExistingEmailChecker } from "../existing-email-checker"

function RegisterForm(stage, callback, button, setStage) {
    const [useNickname, setUseNickname] = React.useState(false)

    const [form, setForm] = React.useState({})
    const [done, setDone] = React.useState(true)
    const submit0 = React.useRef()
    const submit1 = React.useRef()

    const encrypt = useEncryption("welcometoV#")

    const checkEmail = useExistingEmailChecker()

    const handleFormData = React.useCallback((data) => {
        setForm(prev => {
            let _form = ({ ...prev, ...data })
            callback?.(_form)
            return _form
        })
        //console.log(data)
    }, [callback])

    const reset = React.useCallback(() => setStage(1), [])

    const [sent, setSent, _sendEmail, resend, sender] = useEmailSender({
        start: () => {
            NProgress.start();
            button.current.setLoading(true)
        }, end: () => {
            NProgress.done();
            button.current.setLoading(false)
        }, reset, checker: (done) => {
            checkEmail(sent.to).then(res => {
                if (!res)
                    done()
            })
        }, purpose: "with a link to finish your registration"
    })

    React.useEffect(() => {
        setDone(false)
        setTimeout(() => {
            setDone(true)
        }, 500)
        const sendEmail = async () => {
            if (stage === 2) {
                checkEmail(form.email).then(async r => {
                    if (!r) {
                        const objString = JSON.stringify(form);

                        let encrypted = encrypt(objString);
                        console.log('Encrypted:', encrypted, encrypted.length);

                        let data = {
                            to: form.email,
                            subject: "Finish your registration",
                            type: "register",
                            content: [`http://localhost/register/complete?token=${encrypted}&email=${form.email}`]
                        }
                        let res = await _sendEmail(data)
                        if (res.status === 200) {
                            setSent(data)
                        }
                    }
                })
            }
        }
        sendEmail()
    }, [stage])

    const [form0, onSubmit0] = useStageOneForm(handleFormData)
    const [form1, onSubmit1] = useStageOneFormN(handleFormData)
    const [form2, onSubmit2] = useStageTwoForm(handleFormData)


    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        if (email) {
            form2.setValue('email', email);
        }
    }, []);

    const a1 = stage === 0
    const a2 = stage === 1 || (stage === 2 && !sent)
    const a3 = stage === 2 && sent

    const active = [a1, a2, a3]
    const activeIndex = active.indexOf(true);

    const forms = [
        <div key={0}>
            {!useNickname && <Form {...form0}>
                <form onSubmit={form0.handleSubmit(onSubmit0)} className="space-y-6 w-full">
                    <FormField
                        control={form0.control}
                        name="fname"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl className="text-md h-14">
                                    <Input start={
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <AlignLeftIcon />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>First name</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    } placeholder="First name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form0.control}
                        name="lname"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl className="text-md h-14">
                                    <Input start={
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <AlignRightIcon />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Last name</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    } placeholder="Last name" {...field} />
                                </FormControl>
                                <FormMessage />
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="link" className="p-0">What does V# need my name for?</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <div className="p-3 space-y-3">
                                            <h1 className="text-3xl font-semibold">Well...</h1>
                                            <p>
                                                We would like to know your name so we can address you properly.
                                            </p>
                                            <p>
                                                We will also use it to <strong>personalize</strong> your experience on V# by sending emails that includes your name.
                                            </p>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type='submit' onClick={() => {
                                                    setUseNickname(true)
                                                    form0.reset({ fname: "", lname: "" })
                                                }} variant="destructive">No, I want to use a nickname</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button type='submit'>Sure, I understand</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </FormItem>
                        )}
                    />
                    <button className="hidden" ref={submit0} type="submit">Submit</button>
                </form>
            </Form>}
            {useNickname && <Form {...form1}>
                <form onSubmit={form1.handleSubmit(onSubmit1)} className="space-y-6">
                    <FormField
                        control={form1.control}
                        name="nname"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl className="text-md h-14">
                                    <Input start={
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <PersonIcon />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Nickname</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    } placeholder="Nickname" {...field} />
                                </FormControl>
                                <Button onClick={() => {
                                    setUseNickname(false)
                                    form1.reset({ nname: "" })
                                }} variant="link" className="p-0">{"I've changed my mind"}</Button>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button className="hidden" ref={submit0} type="submit">Submit</button>
                </form>
            </Form>}
        </div>,
        <Form {...form2} key={1}>
            <form onSubmit={form2.handleSubmit(onSubmit2)} className="space-y-6">
                <FormField
                    control={form2.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl className="text-md h-14">
                                <Input start={
                                    <EnvelopeClosedIcon />
                                } placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form2.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl className="text-md h-14">
                                <Input start={
                                    <p className="text-muted-foreground select-none whitespace-nowrap">{"+852"}</p>
                                } end={
                                    <NextImage className="select-none w-6 h-4 rounded-sm flex-shrink-0" src="/images/Flag_of_Hong_Kong.webp" width={24} height={16} />
                                } placeholder="Phone (optional)" {...field} className="" />
                            </FormControl>
                            <FormMessage />
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="link" className="p-0">What does V# need my contact for?</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <div className="p-3 space-y-3">
                                        <h1 className="text-3xl font-semibold">Well...</h1>
                                        <p>
                                            As for your email address,
                                            we use it as our primary source of <strong>communication</strong>.
                                            It will also help in <strong>securing</strong> your account.
                                        </p>
                                        <p>
                                            As for your phone number,
                                            you can choose to provide it for more <strong>convinent</strong> delivery services.
                                        </p>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type='submit'>Sure, I understand</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </FormItem>
                    )}
                />
                <button className="hidden" ref={submit1} type="submit">Submit</button>
            </form>
        </Form>,
        sender
    ]

    const theForm = (
        <div className="flex-1 rounded-md flex justify-end">
            {forms.map((_, index) => {
                //if (done && !active[index]) return null
                return (
                    <div className={cn(active[index] ? "flex w-full h-full opacity-100" : `${done ? "h-0" : ""} w-0 overflow-hidden opacity-0`, "duration-1000 box-border  transition-all flex-col flex-shrink-0 bg-inherit")} key={index}>
                        {forms[index]}
                    </div>
                )
            })}
        </div>
    )

    return [theForm, [submit0, submit1, submit1][activeIndex], sent, resend]
}

const stages = [
    { title: 'Start shopping in V#', description: "First, we want to know your name" },
    { title: 'Basic Information', description: "Then, tell us some basic information" },
    { title: 'Verfication sent!', description: "Final step, we've sent you an verfication email, check you inbox in a few seconds" },
]

function StageMenu({ stage = 0 }) {
    return (
        <div className="flex gap-6 w-fit relative items-center mt-auto">
            step:{
                Array.from({ length: stages.length }, (_, i) => (
                    <div key={i} className={cn(stage === i ? 'bg-foreground text-background' : '', 'transition-all duration-500 aspect-square size-10 rounded-full relative flex items-center justify-center text-sm select-none')}>
                        {i + 1}
                    </div>
                ))
            }
        </div>
    )
}

export default function Haha() {
    usePageLoader()

    const [stage, setStage] = React.useState(0)
    const button = React.useRef()

    const handleFormSubmit = React.useCallback(async (values) => {
        if (stage === 0) {
            if (values.nname || (values.fname && values.lname)) {
                setStage(1)
            }
        }
        if (stage === 1) {
            if (values.email) {
                setStage(2)
            }
        }
    }, [stage])


    const [content, submit, sent, resend] = RegisterForm(stage, handleFormSubmit, button, setStage)

    let currentStage = stage === 2 ? sent ? 2 : 1 : stage

    return (
        <AccountForm
            title={stages[currentStage].title}
            description={stages[currentStage].description}
            context={<StageMenu stage={currentStage} />}
            content=
            {content}
            footer={<>
                {true && <>
                    <Button onClick={
                        async () => {
                            const url = `http://localhost:8080/customer/all`
                            fetch(url, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                }
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log('Success:', data);
                                })
                                .catch((err) => {
                                    console.error('Error:', err);
                                });
                        }
                    }>
                        Get All {stage}
                    </Button>
                    <Button variant="destructive" onClick={
                        async () => {
                            Array.from({ length: 10 }).map((_, index) => index).forEach(i => {
                                const step = 9;
                                const url = `http://localhost:8080/customer/remove/${i+step}`
                                fetch(url, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log('Success:', data);
                                    })
                                    .catch((err) => {
                                        console.error('Error:', err);
                                    });
                            })
                        }
                    }>
                        Delete
                    </Button>
                </>}
                {currentStage === 0 && <SigninButton />}
                {currentStage > 0 && <Button
                    onClick={() => setStage(prev => Math.max(0, prev - 1))}
                    variant={currentStage === 2 ? "ghost" : "secondary"}
                    className=""
                    disabled={currentStage === 2}
                >
                    Previous
                </Button>}
                <TimerButton
                    key={2}
                    timeout={sent ? 3 : 0}
                    ref={button}
                    onClick={sent ? resend : () => submit.current.click()}
                    variant="default"
                >
                    {sent ? "Resend Email" : "Go Forward"}
                </TimerButton>
            </>}
        />
    )
}