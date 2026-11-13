import { NextRequest } from 'next/server';
import authMiddleware from './middlewares/auth.middleware';
import { guestMiddleware } from './middlewares/guest.middleware';

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/auth/')) {
    return guestMiddleware(req);
  }

  return authMiddleware(req);
}

// every page except the API proxy, Next internals and files with an extension
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
