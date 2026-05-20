import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const protectedRoutes = ['/cart', '/checkout', '/account'];
const publicAuthRoutes = ['/login', '/signup'];
const authApiRoutes = ['/api/auth'];
const apiRoutes = ['/api'];
const staticPatterns = [
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  /\.\w+$/,
];

function isStaticAsset(pathname: string): boolean {
  return staticPatterns.some((pattern) => {
    if (typeof pattern === 'string') {
      return pathname.startsWith(pattern);
    }
    return pattern.test(pathname);
  });
}

function isAuthApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/auth');
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function isPublicAuthRoute(pathname: string): boolean {
  return publicAuthRoutes.some((route) => pathname === route);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (isAuthApiRoute(pathname)) {
    return NextResponse.next();
  }

  const session = await auth();

  if (isPublicAuthRoute(pathname)) {
    if (session?.user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname)) {
    if (!session?.user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
