import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value;

    // Protect Admin Routes
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
