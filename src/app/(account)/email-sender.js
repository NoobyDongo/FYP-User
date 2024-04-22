"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import React from "react";
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import sendEmail from "@/lib/send-email";
import sleep from "@/lib/sleep";

export function useEmailSender({ start, end, reset, checker, purpose = "" }) {
    const [sent, setSent] = React.useState(false);

    const _sendEmail = React.useCallback(async (data, count = "an") => {
        let res

        const promise = () => new Promise(async (resolve, reject) => {
            start?.();
            let res = await sendEmail(data);
            end?.();
            if (res.status === 200)
                resolve(res);
            else
                reject(res);
        });

        const t = () => new Promise((resolve, reject) => toast.promise(promise, {
            loading: `Sending you ${count} email...`,
            success: (data) => {
                resolve(data)
                return `We have sent you ${count} email${purpose ? " " : ""}${purpose}.`
            },
            error: (err) => {
                reject(err)
                return "Something went wrong..."
            },
        }))

        res = await t().catch(err => err);

        return res;
    }, []);

    const resend = () => {
        if (checker)
            checker(() => _sendEmail(sent, "another"));
        else
            _sendEmail(sent, "another");
    };

    const change = React.useCallback(() => {
        reset?.();
        setSent(false);
    }, [reset])

    let component = <div className="flex items-center h-fit gap-3">
        <div className="w-[15px]">
            to
        </div>
        <div className="flex flex-shrink bg-muted h-10 py-2 px-3 items-center max-w-[calc(100%-15px-52px-24px)] rounded-full text-sm text-foreground">
            <EnvelopeClosedIcon className="inline mr-2 size-4 flex-shrink-0" />
            <div className="text-ellipsis flex-shrink overflow-hidden font-medium opacity-75">
                {sent.to}
            </div>
        </div>
        <Button onClick={change} variant="link" className="mr-3 p-0 rounded-full h-fit w-[52px]">
            Change
        </Button>
    </div>

    return [sent, setSent, _sendEmail, resend, component];
}
