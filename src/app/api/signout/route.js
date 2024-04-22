import { cookies as Cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req) {
    const cookies = Cookies()
    cookies.delete('user-auth')
    return NextResponse.json({ status: 200, data: true, message: 'Logged out' })
}