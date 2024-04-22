'use client';
import Image from "next/image";
import React from "react";
import Fade from "@mui/material/Fade";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function NextImage({ src, alt = "image", actualHeight, actualWidth, height, width, className, imageClassName, timeout = 200, style, ...props }) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div className={cn(className, 'relative select-none')} style={style}>
      {src && <Fade in={Boolean(loaded)} timeout={timeout}>
        <Image style={{
          imageRendering: '-webkit-optimize-contrast'
        }} className={cn('rounded-[inherit] object-cover', imageClassName)} src={src} width={width} height={height} alt={alt} onLoad={() => setLoaded(true)} {...props} />
      </Fade>}
      <Fade in={!Boolean(loaded && src)} timeout={timeout} unmountOnExit appear={false}>
        <div className='rounded-[inherit]'>
          <Skeleton className='top-[-1px] left-[-1px] absolute rounded-[inherit] w-[calc(100%+2px)] h-[calc(100%+2px)]' variant="rect" width={width} height={height} />
        </div>
      </Fade>
    </div>
  );
}
