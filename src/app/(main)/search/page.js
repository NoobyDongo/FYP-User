'use client'
import usePageLoader from "@/lib/page-loader";
import { search } from "@/lib/record";
import { ProductDisplay } from "@/client/product-display";
import React from "react";
import nProgress from "nprogress";
import { useSearchParams } from "next/navigation";
import { TypeMenu } from "@/client/type-menu";



function SearchHelper() {
    const [products, setProducts] = React.useState([])
    const searchParam = useSearchParams()

    React.useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const type = queryParams.get('type') || "";
        const q = queryParams.get('q') || "";

        const request = {
            "option": "search",
            "method": "POST",
            "body": {
                "criteriaList": [
                    { "filterKey": "id", "value": q, "operation": "cn", "dataOption": "any" },
                    { "filterKey": "name", "value": q, "operation": "cn", "dataOption": "any" },
                    { "filterKey": "desc", "value": q, "operation": "cn", "dataOption": "any" },
                    { "filterKey": "price", "value": q, "operation": "cn", "dataOption": "any" },
                    { "filterKey": "origin.name", "value": q, "operation": "cn", "dataOption": "any" },
                    { "filterKey": "producttype.name", "value": type || q, "operation": "cn", "dataOption": type ? "all" : "any" }
                ],
                "page": 0,
                "size": 50
            },
            "simple": false
        };

        search({
            table: 'product',
            body: request.body,
            success: (data) => {
                setProducts(data.content)
                nProgress.done()
            },
            error: (err) => {
                console.error(err)
                nProgress.done()
            }
        })
    }, [searchParam])

    return (
        <div className="flex flex-wrap gap-5 mt-20 mb-auto [--block-scale:1]">
            {products.map((product, index) => (
                <ProductDisplay className='flex-shrink-0 flex-grow-0 w-[120px] h-[240px]' size={120} key={index} media={product} loading={false} />
            ))}

        </div>
    )
}

export default function Haha() {
    usePageLoader()

    return (
        <>
            <TypeMenu />
            <React.Suspense>
                <SearchHelper />
            </React.Suspense>
        </>
    )
}