import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
    return NextResponse.redirect(new URL('/commands/list', request.url));
}

export const config = {
    matcher: '/commands',
};
