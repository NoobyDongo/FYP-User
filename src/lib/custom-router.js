'use client'
import { useRouter } from "next/navigation"
import nProgress from "nprogress"

export default function useCustomRouter(props) {
    const router = useRouter(props)

    const push = (path, options) => {
        nProgress.start()
        router.push(path, options)
    }

    return {...router, push}

}