'use client'
import React from "react";
import usePageLoader from "@/lib/page-loader";
import { search } from "@/lib/record";
import { toast } from "sonner";
import sleep from "@/lib/sleep";
import { CircularProgress } from "@mui/material";
import { ProductImage } from "@/client/product-image";
import useCustomRouter from "@/lib/custom-router";
import { CheckCircledIcon } from "@radix-ui/react-icons";

export default function HAha() {
    usePageLoader()
    const [orders, setOrders] = React.useState(null)
    const [verified, setVerified] = React.useState(false)
    const router = useCustomRouter()

    let timeout;
    React.useEffect(() => {
        const doThings = async () => {
            let p = new Promise((resolve, reject) => {
                fetch('/api/verify')
                    .then(response => response.json())
                    .then(data => resolve(data.data))
                    .catch(error => reject(error));
            })

            let res = await p.catch(err => err)
            setVerified(res)

            if (!res) {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    toast("You need to login first.", { icon: '🔑' });
                    await sleep(1500)
                    toast("Redirecting you to the login page...", { icon: '🔑' });
                    setTimeout(() => router.push("/signin"), 500)
                }, 100)
                return
            }

            const checkInvoice = new Promise((resolve, reject) => {
                let request = {
                    criteriaList: [
                    ], sort: [{
                        direction: 'desc',
                        property: 'updatedAt'
                    }], page: 0, size: 100
                }
                search({
                    table: 'invoice',
                    body: request,
                    success: (data) => {
                        resolve(data)
                    },
                    error: (data) => {
                        reject(data)
                    }
                })
            })

            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(async () => {
                let t = new Promise((resolve, reject) => toast.promise(checkInvoice, {
                    loading: 'Checking invoice...',
                    success: async (data) => {
                        await sleep(1000)
                        resolve(data)
                        setOrders(data)
                        if (data.content.length > 0) {
                            return "Done."
                        } else {
                            return "There is no invoice yet."
                        }
                    },
                    error: (error) => {
                        console.error(error)
                        reject(error)
                    }
                }))
            }, 100)
        }
        doThings()
    }, [])


    return (
        <>
            {orders != null && orders.content?.length > 0 && <div className="flex flex-col space-y-32 my-12">
                {orders.content.map((order, index) => {
                    let date = new Date(order.updatedAt)
                    let formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                    let totalPrice = order.invoiceProduct.reduce((total, product) => total + product.price * product.quantity, 0);
                    totalPrice = parseFloat(totalPrice.toFixed(2));
                    return (
                        <>
                            <div key={index} className="font-medium space-y-6 px-5 rounded-md">
                                <p className="hidden ">{JSON.stringify(order)}</p>

                                <div className="text-sm w-fit rounded-full flex gap-6">
                                    <p className="font-semibold">ID</p>
                                    <p className="uppercase font-black text-md">{order.secid}</p>
                                </div>

                                <div className="flex gap-6 flex-wrap">
                                    <div className="text-sm w-fit rounded-full p-3 px-6 flex gap-6 bg-green-400 dark:bg-green-700">
                                        <p className="font-semibold">Status:</p>
                                        <p className="font-bold flex items-center gap-3">Paid <CheckCircledIcon /></p>
                                    </div>
                                    <div className="text-sm w-fit rounded-full p-3 px-6 flex gap-6 bg-accent">
                                        <p className="font-semibold">Time:</p>
                                        <p className="font-bold">{formattedDate}</p>
                                    </div >
                                    <div className="text-sm w-fit rounded-full p-3 px-6 flex gap-6 bg-accent">
                                        <p className="font-bold">{`${order.invoiceProduct.length} item${order.invoiceProduct.length > 0 ? "s" : ''}`}</p>
                                    </div >
                                    <div className="text-sm w-fit rounded-full p-3 px-6 flex gap-6 bg-accent">
                                        <p className="uppercase font-bold text-md">{`HKD ${totalPrice}`}</p>
                                    </div >
                                </div >

                                <div className="flex gap-6 px-3 flex-wrap">
                                    {order.invoiceProduct.map((ip, i) => {
                                        return (
                                            <div key={i} className="relative">
                                                <ProductImage id={ip.product.id} name={ip.product.images[0].name} size={90} />
                                                <p className="text-center font-black absolute -bottom-2 -left-2 text-2xl bg-background size-8 rounded-full flex justify-center items-center">{ip.quantity}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    )
                })}
            </div>}

            {orders === null && <div className="fixed left-0 top-0 h-screen w-screen flex justify-center items-center">
                <CircularProgress size={100} />
            </div>}
        </>
    )
}