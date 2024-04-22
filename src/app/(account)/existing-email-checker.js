"use client";
import { toast } from "sonner";
import useCustomRouter from "@/lib/custom-router";
import { searchForOneFilter } from "../../lib/record";

export function useExistingEmailChecker(props = {}) {
    const { signin = true, register = false } = props;
    const router = useCustomRouter();

    let timeout;
    const warn = (msg, icon) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            toast(msg, { icon });
        }, 500);
    };

    return (email) => new Promise((resolve, reject) => {
        searchForOneFilter({
            table: "customer",
            key: "email",
            value: email,
            success: (data) => {
                if (data.content.length > 0) {
                    if (signin) {
                        warn("This email is already registered.", '❌');
                        setTimeout(() => {
                            warn("Let's get you to sign in.", '🤔');
                            setTimeout(() => router.push(`/signin?email=${email}`), 1000);
                        }, 1500);
                    }
                    resolve(data.content[0]);
                } else {
                    if (register) {
                        warn("This email is unregistered.", '❌');
                        setTimeout(() => {
                            warn("Let's get you to register.", '🤔');
                            setTimeout(() => router.push(`/register?email=${email}`), 1000);
                        }, 1500);
                    }
                    resolve(false);
                }
            },
            error: () => {
                warn("Something went wrong...", '⚠️');
                reject(Error("Something went wrong..."));
            }
        });
    });
}
