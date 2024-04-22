'use client'
import { cn } from "@/lib/utils";
import React from "react";
import usePageLoader from "@/lib/page-loader";
import { CustomCarousel } from "../../client/custom-carousel";
import NextImage from "@/components/next-image";
import { ProductDisplay } from "@/client/product-display";
import { TypeMenu } from "@/client/type-menu";

const titles = ["", "", ""]


export default function Home() {
  usePageLoader()

  const container = React.useRef(null)
  const scale = React.useRef(1)
  const width = React.useRef(0)
  const items = React.useRef(Array.from({ length: titles.length }).map(() => React.createRef()));

  React.useEffect(() => {
    items.current = Array.from({ length: titles.length }).map(() => React.createRef());
  }, []);

  const [sections, setSections] = React.useState(null)

  React.useEffect(() => {
    setSections(null)
    const fetchData = async () => {
      const response = await fetch('http://localhost/api/home');
      const data = await response.json();
      setSections(data)
    }
    fetchData()
  }, [])

  React.useEffect(() => {
    const resetChildResize = async () => {
      //console.log(items)
      await Promise.all(
        items.current.map(item =>
          typeof item.current?.resetResize === 'function'
            ? item.current.resetResize()
            : Promise.resolve()
        )
      );
    }
    const handleChildResize = async () => {
      //console.log(items)
      await Promise.all(
        items.current.map(item =>
          typeof item.current?.handleResize === 'function'
            ? item.current.handleResize()
            : Promise.resolve()
        )
      );
    }
    const handleResize = () => {
      let resize = false
      let current = 1
      if (window.innerWidth >= 1536) {
        current = 1.75
      } else if (window.innerWidth >= 1024) {
        current = 1.6
      } else if (window.innerWidth >= 768) {
        current = 1.45
      } else if (window.innerWidth >= 640) {
        current = 1.3
      }

      if (current != scale.current) {
        scale.current = current
        container.current.style.setProperty('--block-scale', current)
        resize = true
      }

      if (resize)
        handleChildResize()
      else
        resetChildResize()


      width.current = window.innerWidth
    }
    handleResize()
    window.addEventListener('openMenu', handleChildResize)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('openMenu', handleChildResize)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const loading = !Boolean(sections)

  return (
    <>
      <div className="w-full sticky top-[76px] -translate-y-[23px] h-3 z-[9] bg-accent shadow-md"></div>

      <div className="w-screen overflow-y-hidden hide-scrollbar select-none outline-none">
        <div className={cn(
          'flex flex-col md:flex-row scroll-x1',
          '[--duration:20s] [--start:-15%] [--end:15%]',
          'md:[--duration:40s] md:[--start:-125%] md:[--end:125%]',
          'w-full aspect-video justify-center gap-x-12',
          '[--h:calc(100vh-64px-80px-48px)] h-[var(--h)]',
          '[&>*]:flex-grow-[1] [&>*]:aspect-video [&>*]:flex-shrink [&>*]:md:flex-shrink-0'
        )}>
          <div className="translate-x-[15%] md:translate-x-0">
            <NextImage priority fill quality={50} size={100} className="dark:invert saturate-0 size-full" imageClassName='object-contain' src="/banner1.png" />
          </div>
          <div className="">
            <NextImage priority fill quality={50} size={100} className="dark:invert saturate-0 size-full" imageClassName='object-contain' src="/banner2.png" />
          </div>
          <div className="-translate-x-[15%] md:translate-x-0">
            <NextImage priority fill quality={50} size={100} className="dark:invert saturate-0 size-full" imageClassName='object-contain' src="/banner3.png" />
          </div>
        </div>
      </div>


      

      <TypeMenu />
      <div className="w-full sticky top-[152px] -translate-y-[43px] h-3 z-[9] bg-accent shadow-md"></div>

      <main className="relative w-screen pb-5 mt-12">

        <div className="flex flex-col gap-12 sm:my-24 w-full">
          <div className={'flex flex-col gap-12 sm:gap-24 [--block-scale:1] sm:[--block-scale:1.3] md:[--block-scale:1.45] lg:[--block-scale:1.6] 2xl:[--block-scale:1.75]'} ref={container}>
            {items.current.map((ref, index) =>
              <div key={index} className={cn(loading ? "after:opacity-0 after:delay-0" : 'after:opacity-100 after:delay-1000',
                'after:backdrop-saturate-[10] after:backdrop-brightness-95 after:backdrop-contrast-[1.15]',
                'after:rounded-md after:top-[56px]',
                'after:pointer-events-none',
                "p-3 rounded-md relative after after:transition-opacity duration-500")
              }>
                <CustomCarousel
                  ref={ref}
                  title={sections ? sections[index].title : titles[index]}
                  media={sections ? sections[index].data : Array.from({ length: 30 }).map(() => ({}))}
                  scale={scale}
                  loading={loading}
                  className=''
                  render={({ media, size, index }) => (
                    <ProductDisplay className={cn('bg-background rounded-md', loading ? "" : "saturate-[0.1]")} key={index} media={media} size={size} loading={loading} />
                  )}
                />
              </div>
            )}
          </div>
        </div>

      </main >
    </>

  );
}