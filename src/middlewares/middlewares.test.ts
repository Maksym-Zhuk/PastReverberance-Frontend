// @vitest-environment node
import { SignJWT } from 'jose';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authMiddleware from './auth.middleware';
import { guestMiddleware } from './guest.middleware';

const secret = new TextEncoder().encode('test-secret');
const sign = (expiresInSec: number) =>
  new SignJWT({ sub: '1' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSec)
    .sign(secret);

const request = (path: string, cookies: Record<string, string> = {}) =>
  new NextRequest(`http://localhost:3000${path}`, {
    headers: {
      cookie: Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; '),
    },
  });

const isRedirectTo = (res: Response | undefined, path: string) =>
  res?.status === 307 &&
  new URL(res.headers.get('location')!).pathname === path;
const isPassThrough = (res: Response | undefined) =>
  res?.headers.get('x-middleware-next') === '1';

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('redirects to login without an access token', async () => {
    const res = await authMiddleware(request('/'));
    expect(isRedirectTo(res, '/auth/login')).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('lets a valid token through without refreshing', async () => {
    const res = await authMiddleware(
      request('/', { accessToken: await sign(60) }),
    );
    expect(isPassThrough(res)).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('refreshes an expired token and sets the new cookie', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ accessToken: 'new-token' }), {
        status: 200,
      }),
    );
    const res = await authMiddleware(
      request('/', { accessToken: await sign(-60), refreshToken: 'r' }),
    );

    expect(fetch).toHaveBeenCalledWith(
      'http://api.test/auth/refresh',
      expect.objectContaining({
        method: 'POST',
        headers: { Cookie: 'refreshToken=r' },
      }),
    );
    expect(isPassThrough(res)).toBe(true);
    expect(res!.cookies.get('accessToken')).toMatchObject({
      value: 'new-token',
      httpOnly: true,
    });
  });

  it('redirects to login when refresh is rejected', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 401 }));
    const res = await authMiddleware(
      request('/', { accessToken: await sign(-60), refreshToken: 'bad' }),
    );
    expect(isRedirectTo(res, '/auth/login')).toBe(true);
  });

  it('redirects to login when refresh returns no token', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 200 }));
    const res = await authMiddleware(
      request('/', { accessToken: await sign(-60), refreshToken: 'r' }),
    );
    expect(isRedirectTo(res, '/auth/login')).toBe(true);
  });

  it('redirects without calling refresh when the refresh cookie is missing', async () => {
    const res = await authMiddleware(
      request('/', { accessToken: await sign(-60) }),
    );
    expect(isRedirectTo(res, '/auth/login')).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('treats a malformed token as invalid', async () => {
    const res = await authMiddleware(request('/', { accessToken: 'garbage' }));
    expect(isRedirectTo(res, '/auth/login')).toBe(true);
  });
});

describe('guestMiddleware', () => {
  it('redirects logged-in users away from /auth/*', async () => {
    const res = await guestMiddleware(
      request('/auth/login', { accessToken: await sign(60) }),
    );
    expect(isRedirectTo(res, '/')).toBe(true);
  });

  it('lets guests and users with bad tokens see /auth/*', async () => {
    expect(isPassThrough(await guestMiddleware(request('/auth/login')))).toBe(
      true,
    );
    const res = await guestMiddleware(
      request('/auth/login', { accessToken: await sign(-60) }),
    );
    expect(isPassThrough(res)).toBe(true);
  });
});
