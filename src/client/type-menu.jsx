'use client';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import React from "react";
import { searchForFilters } from "@/lib/record";
import sleep from "@/lib/sleep";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import useCustomRouter from "../lib/custom-router";
import { useSearchParams } from "next/navigation";

let tags = [
  { name: "Food" },
  { name: "Drinks" },
  { name: "Books" },
  { name: "Clothes" },
  { name: "Daily" },
  { name: "Ale" },
  { name: "Food" },
  { name: "Drinks" },
  { name: "Books" },
  { name: "Clothes" },
  { name: "Daily" },
  { name: "Ale" },
  { name: "Food" },
  { name: "Drinks" },
  { name: "Books" },
  { name: "Clothes" },
  { name: "Daily" },
];
export function TypeMenu({ className }) {
  const [types, setTypes] = React.useState([]);

  React.useEffect(() => {
    searchForFilters({
      table: 'producttype',
      page: 0,
      size: 50,
      success: async (data) => {
        await sleep(1000);
        setTypes(data.content);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }, []);

  return (
    <div className={cn("w-screen my-3 sticky top-16 bg-background z-10")}>
      <ScrollArea className="flex items-center">
        <div className={cn(types.length <= 0 ? "" : "", "h-14 transition-[padding] duration-500 items-center flex space-x-3")}>

          <TypeButton loading={types.length <= 0} type="All" />

          {(types.length > 0 ? types : tags).map((e, i) => <TypeButton key={i} loading={types.length <= 0} type={e.name} />
          )}

        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>

  );
}

function ServerSideButton({ className, type, ...props }) {
  const router = useCustomRouter();
  const searchParam = useSearchParams()
  const active = searchParam.get('type') === type || (searchParam.get('type') === null && type === "All");

  return (
    <Button onClick={() => {
      if (type === "All")
        router.push(`/search?`,);
      else
        router.push(`/search?type=${type}`,);
    }} variant="ghost" className={cn(
      "flex items-center text-xs px-3 py-2 h-6 rounded-full text-nowrap",
      active ? 'bg-foreground text-background' : 'bg-background text-foreground',
      className
    )} {...props}>
      {type}
    </Button>
  )
}

function TypeButton({ className, type, loading }) {
  return (
    <Loader className="rounded-full" loading={loading}>
      <React.Suspense fallback={
        <Button variant="ghost" className={cn(
          "flex items-center text-xs px-3 py-2 h-6 rounded-full text-nowrap bg-background text-foreground",
          className
        )}>
          {type}
        </Button>}>
        <ServerSideButton type={type} className={className}/>
      </React.Suspense>
    </Loader>
  );
}
