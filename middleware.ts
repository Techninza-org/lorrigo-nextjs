import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('user')?.value;
  const isAuthenticated = !!currentUser;
  const unauthenticatedPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const authenticatedRoutes = [
    '/dashboard',
    '/new',
    '/orders',
    '/settings',
    '/track',
    '/rate-calc',
    '/print',
    '/admin',
    '/finance',
  ];

  const { pathname } = request.nextUrl;

  if (!isAuthenticated && !unauthenticatedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && !authenticatedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|\\.png$).*)'],
};
