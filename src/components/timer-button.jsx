"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';

export default function TimerButton({ onClick, timeout = 10, children, loading: forceLoading, ...props }, ref) {
    const [loading, setLoading] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
        setLoading
    }));

    const [disabled, setDisabled] = React.useState(false);
    const [time, setTime] = React.useState(timeout);

    React.useEffect(() => {
        let timer = null;
        if (disabled) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        }
        return () => clearInterval(timer); // Clear the timer if the component is unmounted
    }, [disabled]);

    React.useEffect(() => {
        if (time === 0) {
            setDisabled(false);
            setTime(timeout);
        }
    }, [time, timeout]);

    const handleClick = () => {
        if (!disabled) {
            onClick?.();
            if (timeout > 0)
                setDisabled(true);
        }
    };

    return (
        <Button
            {...props}
            onClick={handleClick}
            disabled={forceLoading || loading || disabled}
        >
            <div style={{ transitionDelay: forceLoading || loading ? 0 : 300 }}
             className={cn("transition-[padding] flex", forceLoading || loading ? 'pr-3' : '')}>
                {children}
                <Collapse orientation="horizontal" in={disabled}>
                    {`(${time}s)`}
                </Collapse>
            </div>
            <Collapse sx={{
                '& .MuiCollapse-wrapperInner':{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }
            }} timeout={300} orientation="horizontal" in={forceLoading || loading}>
                <CircularProgress size={'16px'} color='inherit' className="text-[inherit]" />
            </Collapse>
        </Button>
    );
}
TimerButton = React.forwardRef(TimerButton);
