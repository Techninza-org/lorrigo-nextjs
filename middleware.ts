import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('user')?.value;
  const isAuthenticated = !!currentUser;

  const authenticatedRoutes = ['/dashboard', '/new', '/orders', '/settings', '/track', '/rate-calc', '/invoices'];

  if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup') && !request.nextUrl.pathname.startsWith('/forgot-password')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && !authenticatedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
