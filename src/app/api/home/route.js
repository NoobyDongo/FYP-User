import { searchForFilters } from "@/lib/record";
import sleep from "@/lib/sleep";
import { NextResponse } from "next/server";

let products = [[], [], []]
let lastUpdatedTime = 0

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
export const dynamic = 'force-dynamic'


export async function GET(req) {

    const response = await fetch('http://localhost:8080/product/lastupdated', { cache: 'no-store' });
    const data = await response.json();

    if (data.time.lastupdatedTime) {
        const newUpdatedTime = new Date(data.time.lastupdatedTime);
        console.log(newUpdatedTime, lastUpdatedTime);
        if (!lastUpdatedTime || lastUpdatedTime.getTime() < newUpdatedTime.getTime()) {
            let promise = new Promise((resolve, reject) => {
                searchForFilters({
                    table: 'product',
                    page: 0,
                    size: 50,
                    success: async (data) => {
                        await sleep(1000)
                        console.log(data.content.length);
                        resolve(data.content);
                    },
                    error: (error) => {
                        console.log(error)
                        reject(error);
                    },
                    options: {
                        cache: 'no-store'
                    }
                })
            });
            try {
                let all = await promise;
                let shuffledArray = shuffle(all);

                let p = [[], [], []]

                // Create three arrays with 10 elements each
                for (let i = 0; i < 15; i++) {
                    p[0].push(shuffledArray[i % shuffledArray.length]);
                    p[1].push(shuffledArray[(i + 15) % shuffledArray.length]);
                    p[2].push(shuffledArray[(i + 30) % shuffledArray.length]);
                }

                products = [
                    {
                        title: "Featured",
                        data: p[0]
                    },
                    {
                        title: "Popular",
                        data: p[1]
                    },
                    {
                        title: "New",
                        data: p[2]
                    }
                ]
            } catch (error) {
                NextResponse.error(error);
            }
        }
        lastUpdatedTime = newUpdatedTime;
    } else {
        NextResponse.error(new Error('Last updated time not found'));
    }

    return NextResponse.json(products);
}