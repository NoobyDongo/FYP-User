import { search } from '@/lib/record'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

function createToken(obj) {
    return jwt.sign(obj, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
    })
}

export async function POST(req) {
    const { email, password } = await req.json()

    if (!email || !password)
        return NextResponse.json({ status: 400, message: 'Invalid request' })

    const searchPromise = new Promise((resolve, reject) => {
        let request = {
            criteriaList: [
                {
                    filterKey: "password",
                    value: password,
                    operation: "eq",
                    dataOption: "all"
                },
                {
                    filterKey: "email",
                    value: email,
                    operation: "eq",
                    dataOption: "all"
                }
            ],
            page: 0,
            size: 1
        }

        search({
            table: "customer",
            body: request,
            success: (data) => {
                if (data.content.length < 1) {
                    resolve(false);
                }
                else if (data.content[0].email && data.content[0].password) {
                    resolve(data.content[0]);
                }
            },
            error: () => {
                reject("Error occurred during search.");
            }
        })
    });

    try {
        const result = await searchPromise;
        if (result) {
            const token = createToken(result)
            const res = NextResponse.json({ status: 200, data: true })
            res.cookies.set('user-auth', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: Number(process.env.JWT_EXPIRES_IN),
                path: '/',
            })
            return res
        } else
            return NextResponse.json({ status: 200, data: false })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ status: 500, data: error })
    }
}