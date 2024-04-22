'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

export function QuantitySelector({ className, min = 1, max = 15, onChange: _setQuantity, value: quantity }) {

  const setQuantity = (value) => {
    let val = parseQuantity(value, min, max);
    //__setQuantity(val)
    _setQuantity(val);
  };

  const onChange = (e) => {
    if (!e.target.value && e.target.value !== 0)
      _setQuantity('');


    //__setQuantity('')
    else
      setQuantity(parseQuantity(e.target.value, min, max));
  };
  const onBlur = () => {
    if (!quantity && quantity !== 0)
      setQuantity(min);

    else
      setQuantity(quantity);
  };

  const removeItem = () => {
    setQuantity(parseQuantity(quantity - 1, min, max));
  };

  const addItem = () => {
    setQuantity(parseQuantity(quantity + 1, min, max));
  };

  return (
    <Input
      value={quantity}
      onBlur={onBlur}
      onChange={onChange}
      className={cn("h-8 p-0 text-center", className)}

      start={<Button
        className="p-0 h-full aspect-square"
        variant="icon"
        disabled={quantity === min}
        onClick={removeItem}
      >
        -
      </Button>}

      end={<Button
        variant="icon"
        className="p-0 h-full aspect-square"
        disabled={quantity === max}
        onClick={addItem}
      >
        +
      </Button>} />
  );
}
function parseQuantity(value, min = 1, max = 15) {
  return Math.max(Math.min(isNaN(parseInt(value)) ? min : parseInt(value), max), min);
}
