"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import { cn } from "@/lib/utils";

export default function LoadingButton({ children, ...props }, ref) {
    const [loading, setLoading] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
        setLoading
    }));

    return (
        <Button {...props} disabled={loading}>
            <div className={cn("transition-[padding]", loading ? 'pr-3' : '')}>
                {children}
            </div>
            <Collapse className="h-4" orientation="horizontal" in={loading}>
                <CircularProgress size={'16px'} color='inherit' className="text-[inherit]" />
            </Collapse>
        </Button>
    );
}
LoadingButton = React.forwardRef(LoadingButton);
