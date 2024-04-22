'use client'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Button } from "@/components/ui/button";
import React, { useCallback } from "react";
import '@/styles/navigation.css';
import { Input } from '@/components/ui/input';

import { cn } from "@/lib/utils"
import { BackpackIcon, GearIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons"

import AssistantIcon from '@mui/icons-material/Assistant';;
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import AssistantPhotoOutlinedIcon from '@mui/icons-material/AssistantPhotoOutlined';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import { Separator } from './ui/separator';
import { DrawerDemo } from './drawer-demo';
import { ModeToggle } from './mode-toggle';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Fade } from '@mui/material';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Header } from './header';
import { CartProvider, updateCartEvent, useCart } from '@/client/cart-context';
import useCustomRouter from '@/lib/custom-router';
import nProgress from "nprogress";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { QuantitySelector } from '@/client/quantity-selector';
import { toast } from 'sonner';
import sleep from '@/lib/sleep';
import useSearchForm from '@/client/search-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { ProductImage } from '../client/product-image';

const ShoppingCartItem = React.forwardRef(({ item }, ref) => {
    const { product } = item
    const { setQuantity: __setQuantity, cart, removeItem } = useCart()
    const [quantity, _setQuantity] = React.useState(cart[product.id].quantity)

    const setQuantity = (value) => {
        if (value) {
            __setQuantity(product.id, value)
            window.dispatchEvent(updateCartEvent(product.id, value))
        }
        _setQuantity(value)
    }

    return (
        <div className='bg-card p-3'>
            <div className='flex gap-3' sx={{ width: 1 }}>
                <ProductImage className='flex-shrink-0' id={product.id} name={product.images?.[0]?.name} size={90} />
                <div className='flex flex-col justify-between'>
                    <p className='text-xs twoline-ellipsis'>
                        {product.name}
                    </p>

                    <div className='flex gap-3'>
                        <QuantitySelector className='h-8' min={1} max={15} value={quantity} onChange={setQuantity} />
                        <Button variant='destructive' className="flex-shrink-0 p-1 size-8" onClick={() => removeItem(product)}>
                            <TrashIcon />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
})
ShoppingCartItem.displayName = 'ShoppingCartItem'

function ShoppingCart({ className }) {
    const { cartList, setCart } = useCart()
    const router = useCustomRouter()

    return (

        <Sheet>
            <SheetTrigger asChild>
                <Button className={cn('p-0 relative', className)} variant="outline">
                    <BackpackIcon />
                    {
                        cartList.length > 0 &&
                        <div className='-right-1 -bottom-1 absolute flex justify-center items-center bg-primary rounded-full text-[10px] text-background pointer-events-none size-5'>
                            <p >{`${Math.min(cartList.length, 9)}${cartList.length > 9 ? "+" : ''}`}</p>
                        </div>
                    }
                </Button>

            </SheetTrigger>
            <SheetContent className='flex flex-col'>
                <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                    <SheetDescription>
                        {`You've got ${cartList.length || 'no'} item${cartList.length > 1 ? "s" : ''} in your cart.`}
                    </SheetDescription>
                </SheetHeader>

                {false && <Button onClick={() => console.log(cartList)}>Log</Button>}

                <ScrollArea className='flex-1 rounded-md'>
                    <div className='flex-col space-y-3'>
                        {
                            cartList.map((item, index) => {
                                return (
                                    <ShoppingCartItem item={item} key={item.product.id + index} />
                                )
                            })
                        }
                    </div>
                    <ScrollBar />
                </ScrollArea>



                <SheetFooter className='bottom-0 sticky mt-auto'>
                    <SheetClose asChild>
                        <Button disabled={cartList.length == 0} onClick={() => {
                            router.push('/checkout')
                        }}>Checkout</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

function Searchbar() {
    const router = useCustomRouter()

    const handleSubmit = async (values) => {
        nProgress.start()
        router.push('/search?q=' + values.value)
    }
    const [form, onSubmit] = useSearchForm(handleSubmit)
    const submit = React.useRef()

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        if (email) {
            form.setValue('email', email);
        }
    }, []);

    const theForm = (
        <Form className='lg:mt-auto' {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="bg-background rounded-full h-10" start={
                                    <Button variant='ghost' className="p-0 rounded-full h-full aspect-square" onClick={() => submit.current.click()}>
                                        <MagnifyingGlassIcon className='text-muted-foreground size-5' />
                                    </Button>
                                } placeholder="Search" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <button className="hidden" ref={submit} type="submit">Submit</button>
            </form>
        </Form>
    )

    return theForm
}

function UserCorner({ className }) {

    const [verified, setVerified] = React.useState(false)
    const router = useCustomRouter()

    React.useEffect(() => {
        fetch('/api/verify')
            .then(response => response.json())
            .then(data => setVerified(data.data))
            .catch(error => console.error('Error:', error));
    }, [])

    const handleSignInOut = async () => {

        if (verified) {
            let promise = new Promise((resolve, reject) => {
                fetch('/api/signout')
                    .then(response => response.json())
                    .then(data => {
                        // Handle the response data
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })

            let backup = { ...verified }
            const t = () => new Promise((resolve, reject) => toast.promise(promise, {
                loading: `Signing out...`,
                success: async (data) => {
                    resolve(data)
                    await sleep(1000)
                    setVerified(false)
                    return "See you next time. 👋"
                },
                error: (err) => {
                    reject(err)
                    return "Something went wrong..."
                },
            }))

            let res = await t().then(async () => {
                await sleep(10000)
                toast("We would like you to come back...", {
                    icon: "😟", action: {
                        label: 'Come back',
                        onClick: () => {
                            promise = new Promise(async (resolve, reject) => {
                                fetch('/api/signin', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-key': process.env.EMAIL_SECRET
                                    },
                                    body: JSON.stringify(backup)
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        resolve(data);
                                    })
                                    .catch(error => {
                                        reject(error);
                                    });
                            })

                            let t2 = () => new Promise((resolve, reject) => toast.promise(promise, {
                                loading: `Signing back in...`,
                                success: async (data) => {
                                    await sleep(1000)
                                    resolve(data)
                                    setVerified(data.data)
                                    return 'Welcome back! 🤭'
                                },
                                error: (err) => {
                                    reject(err)
                                    return "Something went wrong..."
                                },
                            }))

                            t2().catch(err => err);
                        },
                    }, cancel: {
                        label: 'No',
                        onClick: () => {
                            toast("Sure, see you next time...", { icon: '😢' })
                        },
                    },
                    onAutoClose: (t) => {
                        toast("Sure, see you next time...", { icon: '😢' })
                    },
                })
            }).catch(err => err);

        } else {
            toast.loading("Redirecting you to sign in page...", { id: 999 })
            setTimeout(() => {
                router.push('/signin')
                setTimeout(() => toast.dismiss(999), 1500)
            }, 500)
        }

    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className={cn('p-0', className, verified ? 'bg-primary' : '')} variant={verified ? 'default' : 'outline'}>
                    <GearIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {verified && 
                        <DropdownMenuItem onClick={() => router.push('/orders')}>
                            <DropdownMenuLabel>Orders</DropdownMenuLabel>
                        </DropdownMenuItem>
                    }
                    <DropdownMenuItem>
                        <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignInOut}>
                        <DropdownMenuLabel>{verified ? "Sign out" : "Sign in"}</DropdownMenuLabel>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        console.log(verified)
                    }}>
                        <DropdownMenuLabel>Check</DropdownMenuLabel>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function TopNavBar({ className, openMenu, allowIcon = true, allowFunctions = true }, ref) {

    return (
        <div className={cn('bg-background transition-all justify-between space-x-3 sticky top-0 w-full h-16 z-20 flex items-center', className)}>
            <div className="flex items-center space-x-3 md:min-w-32 2xl:min-w-52">
                <Header className='pr-1 w-fit' />
            </div>
            <div className="flex flex-grow flex-shrink-0 justify-end items-center space-x-3 min-w-32 2xl:min-w-52">
                <div className="md:block flex-1 hidden ml-auto max-w-[500px]">
                    <Searchbar />
                </div>

                <Button variant="outline" className="md:hidden bg-background p-0 rounded-full aspect-square size-10">
                    <MagnifyingGlassIcon className='text-muted-foreground size-5' />
                </Button>
                <ModeToggle className="bg-background rounded-full aspect-square size-10" />
                <ShoppingCart className="bg-background rounded-full aspect-square size-10" />
                <UserCorner className="bg-background rounded-full aspect-square size-10" />
            </div>
        </div>
    )
}
TopNavBar = React.forwardRef(TopNavBar)



export default function Navigation({ children, allowTopBar = true, allowBackground = true, allowIcon = true, allowFunctions = false }) {
    const scroller = React.useRef({ added: false })
    const topbar = React.useRef(null)
    const scrollArea = React.useRef(null);

    const OpenMenu = useCallback((status) => {
        topbar.current.setOpen(status)
    }, [])

    const handleScroll = useCallback((e) => {
        if (!scroller.current.added && e.target.scrollTop > 30) {
            topbar.current?.setFloating(true)
            scroller.current.added = true
        } else if (scroller.current.added && e.target.scrollTop < 30) {
            topbar.current?.setFloating(false)
            scroller.current.added = false
        }
    }, [])

    React.useEffect(() => {
        if (scrollArea.current) {
            handleScroll({ target: scrollArea.current })
        }
    }, [])

    return (
        <div vaul-drawer-wrapper="">
            <ScrollArea scrollAreaRef={scrollArea} onScroll={handleScroll} className='[&>*>*>*]:px-5 [&>*>*>*]:sm:px-6 [&>*>*>*]:md:px-9 [&>*>*>*]:xl:px-32 [&>*>*>*]:2xl:px-52 w-screen h-screen [&>*>*]:min-h-screen'>

                <div className='bg-background w-screen h-6' />
                <TopNavBar openMenu={OpenMenu} ref={topbar} allowIcon={allowIcon} allowFunctions={allowFunctions} />
                <div className="relative hidden backdrop-brightness-150">
                    <div className="flex px-5 sm:px-10 py-2">
                        <div className="flex-shrink-0 text-xs">This text will float from right to left infinitely.</div>
                    </div>
                </div>

                {children}

                <ScrollBar orientation="vertical" className="z-30 p-[1px!important] w-2" thumbClassName="colorful bg-gradient-to-b" />
            </ScrollArea>
        </div >
    )
}