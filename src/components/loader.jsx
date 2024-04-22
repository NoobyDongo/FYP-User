import { Fade } from "@mui/material";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export default function Loader({ className, variant = 'rect', loading, timeout, children }) {
    return (
        <div className="relative">
            <Fade in={!loading} timeout={timeout}>
                <div>
                    {children}
                </div>
            </Fade>
            <Fade in={loading} timeout={timeout} unmountOnExit appear={false}>
                <div>
                    <Skeleton className={cn(className, 'top-[-1px] left-[-1px] absolute w-[calc(100%+2px)] h-[calc(100%+2px)]')} variant={variant}/>
                </div>
            </Fade>
        </div>
    );
}