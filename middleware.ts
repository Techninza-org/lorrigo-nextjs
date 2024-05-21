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
    '/rate-calc',
    '/print',
    '/admin',
    '/finance',
    '/bulk-sample.csv',
    '/pickup_bulk_sample.csv',
    '/order-bulk-sample.csv',
  ];

  const publicRoutes = [
    '/about',
    '/contact',
    '/track', // Making '/track' accessible to all users
  ];

  const { pathname } = request.nextUrl;

  // Exclude favicon.ico from authentication checks
  if (pathname === '/favicon.ico') {
    return;
  }

  // Allow access to public routes without authentication
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!isAuthenticated && !unauthenticatedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && !authenticatedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|\\.png$).*)'],
};