'use client';
import { cn } from "@/lib/utils";
import React from "react";

const iconShade = `
dark:block hidden bg-clip-text bg-gradient-to-r text-transparent translate-y-1 translate-x-1 colorful colors
`;
export function Header({className}) {
    return (
        <a href="/" className={cn('flex justify-center items-center gap-0.5 font-black text-4xl', className)}>

            <div className='relative rotate-[-15deg]'>
                <p className={iconShade}>V</p>
                <p className='top-0 left-0 dark:absolute'>
                    V
                </p>
            </div>
            <div className='relative'>
                <div className={iconShade}>
                    #
                </div>
                <div className='top-0 left-0 dark:absolute'>
                    #
                </div>
            </div>
        </a>
    );
}
