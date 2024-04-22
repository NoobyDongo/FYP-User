import { cookies as Cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    const auth = Cookies().get('user-auth');
    try {
        const decoded = jwt.verify(auth.value, process.env.JWT_SECRET);
        return NextResponse.json({ status: 200, data: decoded });
    } catch (err) {
        return NextResponse.json({ status: 200, data: false });
    }
}