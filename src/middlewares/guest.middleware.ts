import { verifyToken } from '@/lib/jwtTokenControl';
import { NextRequest, NextResponse } from 'next/server';

export async function guestMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/auth/')) {
    const token = req.cookies.get('accessToken')?.value;

    if (token) {
      const decodedToken = await verifyToken(token);

      if (decodedToken) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  return NextResponse.next();
}
