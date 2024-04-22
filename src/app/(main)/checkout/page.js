'use client'
import usePageLoader from "@/lib/page-loader"

import React from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useCustomRouter from "@/lib/custom-router";
import { useCart } from "@/client/cart-context";
import sleep from "@/lib/sleep";
import { toast } from "sonner";
import { create, search } from "@/lib/record";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CircularProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

const stages = [
    "Payment succeeded!",
    "Your payment is processing.",
    "Your payment was not successful, please try again.",
    "Something went wrong."
]

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PK);

function CheckoutForm({ price, verified }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useCustomRouter()

    const [stage, setStage] = React.useState(-1)
    const [message, setMessage] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (!stripe) {
            return;
        }

        const param = new URLSearchParams(window.location.search);
        const clientSecret = param.get(
            "payment_intent_client_secret"
        );
        const secid = param.get(
            "payment_intent"
        );


        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setStage(0)
                    setMessage(stages[0])

                    const checkInvoice = new Promise((resolve, reject) => {
                        let request = {
                            criteriaList: [
                                {
                                    filterKey: "secid",
                                    value: secid,
                                    operation: "eq",
                                    dataOption: "all"
                                }
                            ], page: 0, size: 1
                        }
                        search({
                            table: 'invoice',
                            body: request,
                            success: (data) => {
                                resolve(data?.content?.length <= 0)
                            },
                            error: (data) => {
                                reject(data)
                            }
                        })
                    })

                    let t = new Promise((resolve, reject) => toast.promise(checkInvoice, {
                        loading: 'Checking invoice...',
                        success: async (data) => {
                            await sleep(1000)
                            resolve(!data)
                            if (data) {
                                return "Invoice not found, creating one... 🧾"
                            } else {
                                return "Invoice already exists."
                            }
                        },
                        error: (error) => {
                            console.error(error)
                            reject(error)
                        }
                    }))

                    let has = await t.catch(err => err)
                    await sleep(1000)

                    let cart = JSON.parse(localStorage.getItem('cart'))

                    if (!has) {
                        const save = new Promise((resolve, reject) => {
                            create({
                                table: 'invoice',
                                body: {
                                    secid: secid,
                                    link: clientSecret,
                                    customer: { id: verified.id },
                                },
                                success: (data) => {
                                    data.invoiceProduct = []
                                    cart.forEach(item =>
                                        create({
                                            table: 'invoiceproduct',
                                            body: {
                                                id: {
                                                    invoice: data.id,
                                                    product: item.product.id
                                                },
                                                invoice: data.id,
                                                product: item.product.id,
                                                quantity: item.quantity,
                                                price: item.product.price,
                                            },
                                            success: (d) => {
                                                data.invoiceProduct.push(d)
                                                resolve(data)
                                            },
                                            error: (err) => reject(err)
                                        }))
                                    resolve(data)
                                    console.log(data)
                                    return data
                                },
                                error: (err) => reject(err)
                            })
                        })
                        let tt = new Promise((resolve, reject) => toast.promise(save, {
                            loading: 'Creating invoice...',
                            success: async (data) => {
                                await sleep(1000)
                                resolve(data)
                                localStorage.removeItem('cart')
                                if (data.id) {
                                    return "Invoice created! and sent to your inbox. 📧"
                                } else {
                                    return "Invoice already exists."
                                }
                            },
                            error: (error) => {
                                console.error(error)
                                reject(error)
                                return "Something went wrong... Please contact support!"
                            }
                        }))
                    }


                    break;
                case "processing":
                    setStage(1)
                    setMessage(stages[1])
                    break;
                case "requires_payment_method":
                    setStage(2)
                    setMessage(stages[2])
                    break;
                default:
                    setStage(3)
                    setMessage(stages[3])
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost/checkout",
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <Card className="min-w-[450px] bg-white text-black">
                <CardHeader >
                    {stage === 0 && <div className="flex justify-center p-5 mb-5">
                        <CheckCircleIcon className="size-40" />
                    </div>}
                    <CardTitle>{stage === 0 ? message : `HKD $${parseFloat(price.toFixed(2))}`}</CardTitle>
                    <CardDescription>{stage === 0 ? "An invoice has been sent to your inbox." : "Payment is required"}</CardDescription>
                </CardHeader>
                {stage !== 0 && <CardContent>
                    <PaymentElement readOnly={stage === 0 || isLoading || !stripe || !elements} id="payment-element" options={paymentElementOptions} />
                    {message && <CardDescription>
                        <div id="payment-message">{message}</div>
                    </CardDescription>}
                </CardContent>}
                <CardFooter className="flex justify-between">
                    {stage == 0 && <Button type="button" className="option text-black" onClick={() => {
                        router.push("/")
                    }}>
                        Return
                    </Button>}
                    {stage !== 0 && <Button className='option text-black' disabled={isLoading || !stripe || !elements} id="submit">
                        <span id="button-text">
                            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                        </span>
                    </Button>}
                </CardFooter>
            </Card>



        </form>

    );
}

export default function Haha() {
    usePageLoader()
    const [clientSecret, setClientSecret] = React.useState("");
    const router = useCustomRouter()
    const [price, setPrice] = React.useState(0)
    const { cartList } = useCart()
    const [verified, setVerified] = React.useState(false)

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

            const urlParams = new URLSearchParams(window.location.search);

            if (cartList.length > 0)
                localStorage.setItem('cart', JSON.stringify(cartList))

            const cs = urlParams.get('payment_intent_client_secret');
            setClientSecret(cs)

            if (!cs && cartList.length <= 0) {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    toast("Your cart is empty.", { icon: '🛒' });
                    await sleep(1500)
                    toast("Redirecting you to home page...", { icon: '🏠' });
                    setTimeout(() => router.push("/"), 500)
                }, 100)
                return
            }

            if (!cs) {
                let p = cartList.reduce((total, item) => total + item.product.price * item.quantity, 0);
                setPrice(p)
                // Create PaymentIntent as soon as the page loads
                fetch("/api/pay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ price: p * 100 }),
                })
                    .then((res) => res.json())
                    .then((data) => setClientSecret(data.clientSecret));
            }
        }

        doThings()

    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="fixed left-0 top-0 h-screen w-screen flex justify-center items-center">
            {!clientSecret &&
                <CircularProgress size={100} />
            }
            {(clientSecret && verified) && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm verified={verified} price={price} />
                </Elements>
            )}
        </div>
    );
}