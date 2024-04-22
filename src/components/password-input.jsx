"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { EyeClosedIcon, EyeOpenIcon, LockClosedIcon } from '@radix-ui/react-icons';

function PasswordInput({ disabled, ...props }, ref) {
    const [showPassword, setShowPassword] = React.useState(false);
    return (<Input disabled={disabled} type={showPassword ? "text" : "password"} start={<LockClosedIcon />} end={<Button
        type='button'
        variant='ghost'
        className='p-2'
        disabled={disabled}
        onClick={() => setShowPassword(!showPassword)}
    >
        {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
    </Button>} ref={ref} {...props} />);
}
PasswordInput = React.forwardRef(PasswordInput);
export { PasswordInput };
