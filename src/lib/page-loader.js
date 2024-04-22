'use client'
import { usePathname } from "next/navigation";
import nProgress from "nprogress";
import React from "react";

export default function usePageLoader() {
    const pathname = usePathname()

    React.useEffect(() => {
        nProgress.done();
        return () => {
            nProgress.start();
        };
    }, [pathname]);
}