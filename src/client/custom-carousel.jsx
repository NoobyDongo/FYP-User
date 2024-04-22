'use client';
import { Button } from "@/components/ui/button";
import React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import NextImage from "@/components/next-image";
import { cn } from "@/lib/utils";
import { Fade } from "@mui/material";
import Loader from "@/components/loader";

const mediaHeight = 90;
const mediaWidth = mediaHeight;
const gap = 18;

const calculateGroups = (media, mediaWidth, gap, containerWidth, scale = 1) => {
  //console.log("calculate:", media, mediaWidth, gap, containerWidth, scale);
  let groups = [], i = 0, size;
  media.forEach(_ => {
    size = (mediaWidth + gap) * scale;
    if ((groups[i] || 0) + size > containerWidth)
      groups[++i] = 0;
    groups[i] = (groups[i] || 0) + size;
  });
  return groups;
};
function findNearestIndex(arr, target) {
  let closest = Infinity;
  let closestIndex = [-1, -1];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      let diff = Math.abs(arr[i][j] - target);
      if (diff < closest) {
        closest = diff;
        closestIndex = [i, j];
      }
    }
  }

  return closestIndex;
}
function CustomCarousel({ title, subtitle, media = [], scale = { current: 1 }, loading = true, render, className }, ref) {
  const content = React.useRef(null);
  const container = React.useRef(null);
  const scroller = React.useRef({
    x: 0, updated: false, reverse: false,
    queue: [[0], [0]], current: 0, lastScale: scale.current
  });

  const setX = (x) => {
    scroller.current.x = x * -1;
    content.current.style.setProperty("--x", `${scroller.current.x}px`);
  };

  const calculateCheckpoints = () => {
    let s = scroller.current, containerWidth = container.current.clientWidth, max = content.current.offsetWidth - containerWidth;
    let groups = calculateGroups(media, mediaWidth, gap, containerWidth, scale.current);
    s.queue[1] = [0, ...new Set(groups.reduce((acc, val, i) => (acc[i] = Math.min(max, (acc[i - 1] || 0) + val), acc), []))];
    s.queue[0] = [...new Set(calculateGroups([...media].reverse(), mediaWidth, gap, containerWidth, scale.current).reduce((acc, val) => (max -= val, max < 0 ? [0, ...acc] : [max, ...acc]), [max]))];
    scroller.current.updated = true;
    //console.log(s, groups, max, containerWidth, content.current.offsetWidth, s.queue);
  };

  React.useEffect(() => {
    scroller.current.current = 0;
    calculateCheckpoints();
    if (!loading)
      setX(0);
  }, [media]);

  const handleResize = () => {
    scroller.current.updated = false;
    let current = content.current.offsetWidth - container.current.clientWidth;

    if (scroller.current.x > current) {
      content.current.classList.add('transition-no');
      if (scroller.current.timeout)
        clearTimeout(scroller.current.timeout);
      setX(current);
      scroller.current.timeout = setTimeout(() => {
        content.current.classList.remove('transition-no');
      }, 200);
    }
  };

  const resetResize = () => {
    scroller.current.updated = false;
    let current = content.current.offsetWidth - container.current.clientWidth;
    let last = Math.ceil(content.current.offsetWidth / container.current.clientWidth) - 1
    if (scroller.current.current >= last) {
      scroller.current.current = last;
      setX(current);
    }
  }

  React.useImperativeHandle(ref, () => ({
    handleResize,
    resetResize
  }));

  let timeout;

  const move = (queue, change) => {
    //console.log(scroller.current.current)

    if (!scroller.current.updated) {
      if (scroller.current.x > 1) {
        scroller.current.current = findNearestIndex(scroller.current.queue, scroller.current.x)[queue];
      }
      calculateCheckpoints();
    }
    scroller.current.current = Math.min(Math.max(0, scroller.current.current + change), scroller.current.queue[queue].length - 1);

    if (scroller.current.current === scroller.current.queue[queue].length - 1) {
      setX(scroller.current.queue[queue][scroller.current.current]);
      if (timeout)
        clearTimeout(timeout);
      timeout = setTimeout(() => {
        content.current.classList.add('reverse');
        scroller.current.reverse = true;
      }, 500 * scale.current);
    } else {
      if (timeout)
        clearTimeout(timeout);
      if (scroller.current.reverse) {
        content.current.classList.add('transition-no');
        content.current.classList.remove('reverse');
        setTimeout(() => {
          content.current.classList.remove('transition-no');
          setTimeout(() => {
            setX(scroller.current.queue[queue][scroller.current.current]);
            scroller.current.reverse = false;
          }, 10);
        }, 10);
      } else
        setX(scroller.current.queue[queue][scroller.current.current]);
    }
  };

  const next = () => move(1, 1);
  const prev = () => move(0, -1);

  return (
    <div
      className={cn("w-full hide-scrollbar overflow-y-visible", loading ? "" : "md:overflow-x-visible", className)}
      ref={container}
    >
      <div className={'flex flex-row justify-between items-end pb-5'}>
        <div>
          <p className='xl:mb-1 font-medium text-muted-foreground text-xs xl:text-sm uppercase'>{subtitle}</p>

          <Fade in={!loading} timeout={500}>
            <p className="font-semibold text-md sm:text-xl lg:text-2xl capitalize">{title}</p>
          </Fade>
        </div>

        <Fade in={!loading && scroller.current.queue[1].length > 0} timeout={500}>
          <div className="flex flex-row items-end gap-3 w-fit h-full">
            {[prev, next].map((_, index) => (
              <Button
                variant="outline"
                className="bg-transparent-sharp p-0 rounded-full size-6 sm:size-9"
                onClick={_}
                key={index}
              >
                {index === 0 && <ArrowLeftIcon className="size-3 sm:size-4" />}
                {index === 1 && <ArrowRightIcon className="size-3 sm:size-4" />}
              </Button>
            ))}
          </div>
        </Fade>

      </div>

      <div ref={content} style={{
        gap: `calc(${gap}px*var(--block-scale))`,
        transitionDuration: `calc(${500}ms*var(--block-scale))`,
        //...(loading && { '--x': `calc(-${mediaWidth + gap}px*2*var(--block-scale))` })
      }} className={`carousel`}
      >
        {media.map((_, index) => {
          return (
            render({ media: _, size: mediaWidth, index })
          );
        })}
      </div>
    </div>
  );
}
CustomCarousel = React.forwardRef(CustomCarousel);
export { CustomCarousel };
