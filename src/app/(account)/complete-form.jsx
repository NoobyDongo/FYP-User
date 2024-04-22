"use client";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import React from "react";
import { AccountForm } from "@/components/account-form";
import TimerButton from "@/components/timer-button";
import NProgress from 'nprogress';
import { useDecryption } from "@/lib/encrypt";
import { PasswordInput } from "@/components/password-input";
import useCustomRouter from "@/lib/custom-router";
import sleep from "@/lib/sleep";
import { usePasswordForm } from "./password-form";
import { create } from "@/lib/record";
import { useExistingEmailChecker } from "./existing-email-checker";
import signin from "@/lib/signin";

function PasswordForm(stage, callback) {
    const submit = React.useRef();
    const [form, onSubmit] = usePasswordForm(callback);

    return [(<Form {...form} key={1}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
            <FormField
                control={form.control}
                name="password"

                render={({ field }) => (
                    <FormItem>
                        <FormControl className="h-14 text-md">
                            <PasswordInput placeholder="Password" disabled={stage > 0} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                    <FormItem>
                        <FormControl className="h-14 text-md">
                            <PasswordInput placeholder="Confirm" disabled={stage > 0} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            <button className="hidden" ref={submit} type="submit">Submit</button>
            <div className="lg:space-y-3">
                <FormDescription>
                    A strong password consists of <strong>letters</strong>, <strong>numbers</strong>, and <strong>symbols</strong>.
                </FormDescription>
                <FormDescription>
                    it should also be at least <strong>8</strong> characters long.
                </FormDescription>
            </div>
        </form>
    </Form>), submit];
}
function useWarning(defaultMsg, defaultIcon) {
    let timeout;
    return (callback, msg = defaultMsg, icon = defaultIcon, delay = 3000) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            NProgress.start()
            toast(msg, { icon });
            if (callback)
                setTimeout(() => {
                    callback?.();
                }, delay);
        }, 200);
    };
}
export function CompleteForm({ secret = "defaultV#Key", fallbackPage = '/signin', register = false, stages }) {
    const [stage, setStage] = React.useState(0);
    const [user, setUser] = React.useState(false);
    const decipher = useDecryption(secret);
    const router = useCustomRouter();
    const checkExistingEmail = useExistingEmailChecker({ signin: register, register: !register });

    const warn = useWarning("Broken token, please retry form the start.", '😢');

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        let email = params.get('email');
        if (token) {
            try {
                let obj = JSON.parse(decipher(token));
                console.log("foirst", obj);
                if (obj.email && ((obj.fname && obj.lname) || obj.nname)) {
                    checkExistingEmail(obj.email).then((res) => {
                        if (register ? !res : res) {
                            if (!register && res.password !== obj.password) {
                                warn(() => router.push(fallbackPage + (obj.email ? "?email=" + obj.email : "")),
                                    "This token is no longer valid. Please get a new one.", '⚠️', 3000
                                );
                                return
                            }
                            setUser(obj);
                        }
                    });
                } else {
                    warn(() => router.push(fallbackPage + (obj.email ? "?email=" + obj.email : "")));
                }
            } catch (e) {
                //bad token
                console.log(e);

                warn(() => router.push(fallbackPage + (email ? "?email=" + email : "")));

            }
        } else {
            warn(() => router.push("/signin"), "Missing token, sending you to sigin.", '🤨');
        }
    }, []);

    const count = React.useRef(0);

    const handleFormSubmit = React.useCallback(async (values) => {
        if (!register) {
            if (count.current < 1 && values.password === user.password) {
                toast("Your new password is 99.99% simular to your previous one. Please consider changing it.", { icon: "⚠️" });
                count.current++;
                return;
            }
            if (count.current === 1 && values.password === user.password) {
                toast("Are you sure about using an old password?", { icon: "⚠️" });
                count.current++;
                return;
            }
        }
        let obj = {
            ...user,
            username: user.nname ? user.nname : user.fname + user.lname,
            password: values.password
        };
        console.log(obj);
        checkExistingEmail(user.email).then((res) => {
            if (register ? !res : res) {
                create({
                    table: "customer",
                    body: obj,
                    success: async (data) => {
                        let res = await signin(obj);
                        console.log("singin", res)
                        setStage(1);
                        NProgress.start();
                        toast(register ?
                            "Welcome to V#! Let's start from the home page" :
                            `${count.current > 1 ? "Sure thing, old password it is!" : "Password reset successful!"} Redirecting you to home page...`
                            , { icon: "🎉" });
                        sleep(1000);
                        router.push("/");
                    },
                    error: () => {
                        toast("Something went wrong...", { icon: "🎉" });
                    }
                });
            }
        });
    }, [user]);

    const [content, submit] = PasswordForm(stage, handleFormSubmit);

    const hasUser = Boolean(user);

    return (
        <AccountForm
            title={hasUser ? stages[stage].title : "Checking..."}
            description={hasUser ? stages[stage].description : "Please wait a moment"}
            content={hasUser ? content : null}
            footer={hasUser ? <>
                <TimerButton
                    loading={stage > 0}
                    timeout={0}
                    onClick={() => submit.current.click()}
                    variant="default"
                >
                    {stage > 0 ? "Redirecting you to home page" : "Next"}
                </TimerButton>
            </> : null} />
    );
}
