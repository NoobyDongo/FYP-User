"use client";
import {
    Card,
    CardContent,
    CardDescription, CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Header } from "@/components/header";
import { ModeToggle } from "@/components/mode-toggle";
import React from "react";
import { cn } from "@/lib/utils";
import { Grow } from "@mui/material";

const formBack = 'before:transform-gpu before:rotate-[0.2deg] before:scale-[1.005] dark:sm:before before:colorful before:bg-gradient-to-br before:z-[-1]';
export function AccountForm({ title, description, content, footer, top, context, appear = false, in:show = true }) {
    return (
        <main className="flex flex-col justify-center items-center sm:px-20 xl:px-56 w-screen h-screen overflow-hidden">

            <Grow in={show} timeout={500} appear={appear}>
                <div className={cn(
                    "relative flex flex-col justify-center items-end w-full h-full",
                    "sm:max-w-[480px] lg:max-w-[830px] xl:max-w-5xl md:w-full pb-3"
                )}>
                    <Card className={cn(
                        "relative sm:justify-evenly border-none sm:h-fit",
                        "bg-background flex flex-col lg:flex-row w-full h-full z-1",
                        "[&>*]:p-6 [&>*]:lg:p-9 rounded-none sm:rounded-md", formBack
                    )}>
                        <CardHeader className='relative flex flex-col lg:flex-1 gap-6 space-y-0 lg:pr-[24px!important]'>
                            <Header className="w-fit text-5xl" />
                            <div className="flex flex-col flex-1">
                                <CardTitle className='mb-6 text-3xl lg:text-4xl'>{title}</CardTitle>
                                <div className="flex flex-col justify-between gap-6 h-full">
                                    <CardDescription className='flex-1 text-md'>{description}</CardDescription>
                                    {context}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='relative lg:flex flex-1 lg:items-end lg:pl-[12px!important] lg:h-full lg:min-h-[364px] overflow-hidden'>
                            <div className="flex flex-col justify-between lg:justify-end mt-auto w-full h-full">
                                <div className="mb-12">
                                    <div className={cn("mb-6 h-12", top ? '' : 'lg:block hidden')}>
                                        {top}
                                    </div>
                                    {content}
                                </div>
                                <div className="flex justify-between lg:justify-end gap-6 mt-auto">
                                    {footer}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="right-0 mt-3">
                        <ModeToggle textMode className='px-3 translate-x-[-12px] lg:translate-x-[-24px]' />
                    </div>
                </div>
            </Grow>
        </main>
    );
}
