import { verifyToken } from '@/lib/jwtTokenControl';
import { NextRequest, NextResponse } from 'next/server';

const toLogin = (req: NextRequest) =>
  NextResponse.redirect(new URL('/auth/login', req.url));

export default async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (token && (await verifyToken(token))) return NextResponse.next();

  // access token missing/expired: try to renew it with the refresh token
  if (!refreshToken) return toLogin(req);

  const refreshResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/auth/refresh`,
    { method: 'POST', headers: { Cookie: `refreshToken=${refreshToken}` } },
  ).catch(() => null);
  if (!refreshResponse?.ok) return toLogin(req);

  const { accessToken } = await refreshResponse.json().catch(() => ({}));
  if (!accessToken) return toLogin(req);

  const res = NextResponse.next();
  res.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60,
  });
  return res;
}
