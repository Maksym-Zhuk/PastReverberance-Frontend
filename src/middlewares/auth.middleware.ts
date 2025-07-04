import { verifyToken } from '@/lib/jwtTokenControl';
import { NextRequest, NextResponse } from 'next/server';

export default async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}`,
      },
      body: JSON.stringify({
        query: `
            mutation{
              refreshToken {
                  accessToken
              }
            }
          `,
      }),
    });
    if (refreshResponse.ok) {
      const result = await refreshResponse.json();

      if (!result.data)
        return NextResponse.redirect(new URL('/auth/login', req.url));

      const accessToken = result.data.refreshToken.accessToken;
      const res = NextResponse.next();
      res.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });
      return res;
    } else {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
}

export const config = {
  matcher: ['/', '/auth/:path*'],
};
