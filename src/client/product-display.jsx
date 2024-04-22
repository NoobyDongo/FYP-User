'use client';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import Loader from "@/components/loader";
import NextImage from "@/components/next-image";
import { updateCartEvent, useCart } from "@/client/cart-context";
import { QuantitySelector } from "@/client/quantity-selector";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ProductDisplay({ className, media: item, size, loading = true }) {

  const { get, cart, cartList, addItem, removeItem, setQuantity: _setQuantity } = useCart();
  const [inCart, setInCart] = React.useState(false);
  const [quantity, __setQuantity] = React.useState(cart[item.id]?.quantity || 1);

  const setQuantity = (value) => {
    if (value === 0) {
      removeItem(item);
      return;
    }
    if (value)
      _setQuantity(item.id, value);
    __setQuantity(value);
    window.dispatchEvent(updateCartEvent(item.id, value));
  };

  React.useEffect(() => {
    if (cart[item?.id]) {
      const handle = (e) => {
        __setQuantity(e.detail);
      };
      window.addEventListener(`updateCart${item.id}`, handle);
      return () => window.removeEventListener(`updateCart${item.id}`, handle);
    }
  }, [cart[item.id]]);

  React.useEffect(() => {
    setInCart(cart[item.id]);
  }, [cart[item.id]]);

  const addToCart = () => {
    //setInCart(item)
    addItem(item);
  };

  const removeFromCart = () => {
    //setInCart(false)
    removeItem(item);
  };

  return (
    <div className={cn("flex flex-col flex-grow flex-shrink-0 gap-1.5 sm:gap-3", className)}
      style={{
        width: `calc(${size}px*var(--block-scale))`,
      }}>

      <HoverCard openDelay={200} closeDelay={10}>
        <HoverCardTrigger asChild>
          <div style={{
            width: '100%',
          }} className="flex-shrink-0 rounded-md aspect-square">
            <NextImage
              fill
              style={{
                height: `100%`,
                width: `100%`
              }}
              sizes={`${size * 1.4}px`}
              className='rounded-md w-full aspect-square'
              imageClassName='object-cover bg-background'
              src={loading ? "" : (item.id && item.images?.[0]?.name) ?
                `http://localhost:3000/api/image/product/${item.id}/${item.images[0].name}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png"}
              alt='card' />
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="top" className="p-0" style={{
          width: `calc(${size}px*var(--block-scale))`,
          height: `calc(${size}px*var(--block-scale))`,
        }}>
          <ScrollArea className="p-2 sm:p-3 overflow-hidden size-full">
            <div className="flex flex-col space-y-1 sm:space-y-3 font-medium text-[8px] sm:text-xs">
              <div className="flex gap-3">
                <p>From</p>
                <p className="font-bold">{item.origin.name}</p>
              </div>
              <Separator className='w-full' />
              <div>
                <p>{item.desc}</p>
              </div>
            </div>
            <ScrollBar />
          </ScrollArea>
        </HoverCardContent>
      </HoverCard>
      <Loader loading={loading}>
        <p className="h-6 sm:h-8 font-medium text-[8px] sm:text-xs twoline-ellipsis">
          {item.name || "product name placeholder for loading purposes, it will be changed as soon as loading finishes"}
        </p>
      </Loader>
      <Loader loading={loading}>
        <p className="font-black text-[8px] sm:text-xs">${parseFloat(item.price || 999).toFixed(2)}</p>
      </Loader>


      {inCart && <QuantitySelector min={0} max={15}
        value={quantity} onChange={setQuantity} />}

      {!inCart && <Loader className='invisible' loading={loading}>
        <Button variant='outline'
          disabled={loading}
          onClick={addToCart}
          className="w-full h-5 sm:h-8 text-[8px] sm:text-xs"
        >
          Add to cart
        </Button>
      </Loader>}


    </div>
  );
}
