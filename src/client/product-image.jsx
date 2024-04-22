'use client';
import React from "react";
import { cn } from "@/lib/utils";
import NextImage from '../components/next-image';

export function ProductImage({ id, name, size = 50, className, style, ...others }) {
    return (
        <NextImage {...others}
            className={cn('rounded-md ', className)}
            src={`http://localhost:3000/api/image/product/${id}/${name}`} width={size} height={size} />

    );
}
