import { NextRequest, NextResponse } from 'next/server';
import { AuthType } from './types/types';

export async function middleware(request: NextRequest) {
  const currentUserToken = request.cookies.get('user')?.value;
  let user: AuthType | null = null;
  if (currentUserToken) {
    try {
      user = JSON.parse(currentUserToken) as AuthType;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
  let isAuthenticated = user !== null;
  let userRole = user?.role;
  let userRank = user?.rank;

  const unauthenticatedPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/admin/login'];
  const authenticatedRoutes = [
    '/dashboard',
    '/new',
    '/orders',
    '/settings',
    '/rate-calc',
    '/print',
    '/finance',
    '/wallet',
    '/pay',

    // public files
    '/bulk-sample.csv',
    '/pickup_bulk_sample.csv',
    '/order-bulk-sample.csv',
    '/client_billing_sample_format.csv',
    '/pincode-sample.csv',
    '/B2B_client_billing_sample_format.csv',
  ];

  const adminRoutes = [
    '/admin',
    '/admin/shipment-listing',
    '/admin/finance',
  ];

  const publicRoutes = [
    '/about',
    '/contact',
    '/track', // Making '/track' accessible to all users
  ];

  const notRank2adminRoutes = [
    '/admin/users/add-user'
  ]

  const { pathname } = request.nextUrl;

  // Exclude favicon.ico from authentication checks
  if (pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Allow access to public routes without authentication
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated && !unauthenticatedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated) {
    // Role-based access control
    if (userRole === 'seller') {
      if (adminRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/access-denied', request.url));
      }
      if (pathname.includes('/login')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else if (userRole === 'admin') {
      if (pathname.includes('/login')) {
        return NextResponse.redirect(new URL('/admin/shipment-listing', request.url));
      }
    }

    // Redirect authenticated users to the appropriate dashboard if they try to access unauthenticated paths
    if (!authenticatedRoutes.some(route => pathname.startsWith(route)) && !adminRoutes.some(route => pathname.startsWith(route))) {
      if (userRole === 'seller') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/shipment-listing', request.url));
      }
    }

    if(userRole === 'admin' && userRank === 2 && notRank2adminRoutes.some(route => pathname.startsWith(route)) ){
      return NextResponse.redirect(new URL('/admin/shipment-listing', request.url));
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|\\.png$).*)'],
};


// import { NextRequest, NextResponse } from 'next/server';
// import { AuthType } from './types/types';

// export async function middleware(request: NextRequest) {
//   const currentUserToken = request.cookies.get('user')?.value;
//   let user: AuthType | null = null;
//   if (currentUserToken) {
//     try {
//       user = JSON.parse(currentUserToken) as AuthType;
//     } catch (error) {
//       console.error('Invalid token:', error);
//     }
//   }
//   let isAuthenticated = user !== null;
//   let userRole = user?.role;

//   const unauthenticatedPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/admin/login'];
//   const authenticatedRoutes = [
//     '/dashboard',
//     '/new',
//     '/orders',
//     '/settings',
//     '/rate-calc',
//     '/print',
//     '/finance',
//     '/bulk-sample.csv',
//     '/pickup_bulk_sample.csv',
//     '/order-bulk-sample.csv',
//   ];

//   const adminRoutes = [
//     '/admin',
//     '/admin/shipment-listing',
//     '/admin/finance',
//   ];

//   const publicRoutes = [
//     '/about',
//     '/contact',
//     '/track', // Making '/track' accessible to all users
//   ];

//   const { pathname } = request.nextUrl;

//   // Exclude favicon.ico from authentication checks
//   if (pathname === '/favicon.ico') {
//     return NextResponse.next();
//   }

//   // Allow access to public routes without authentication
//   if (publicRoutes.some(route => pathname.startsWith(route))) {
//     return NextResponse.next();
//   }

//   // Redirect unauthenticated users to login page
//   if (!isAuthenticated && !unauthenticatedPaths.some(path => pathname.startsWith(path))) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (isAuthenticated) {
//     // Role-based access control
//     if (userRole === 'seller') {
//       if (adminRoutes.some(route => pathname.startsWith(route))) {
//         return NextResponse.redirect(new URL('/access-denied', request.url));
//       }
//       if (pathname === '/login') {
//         return NextResponse.redirect(new URL('/dashboard', request.url));
//       }
//     } else if (userRole === 'admin') {
//       if (authenticatedRoutes.some(route => pathname.startsWith(route))) {
//         return NextResponse.redirect(new URL('/access-denied', request.url));
//       }
//       if (pathname === '/login') {
//         return NextResponse.redirect(new URL('/admin', request.url));
//       }
//     }

//     // Redirect authenticated users to the appropriate dashboard if they try to access unauthenticated paths
//     if (!authenticatedRoutes.some(route => pathname.startsWith(route)) && !adminRoutes.some(route => pathname.startsWith(route))) {
//       if (userRole === 'seller') {
//         return NextResponse.redirect(new URL('/dashboard', request.url));
//       } else if (userRole === 'admin') {
//         return NextResponse.redirect(new URL('/admin/shipment-listing', request.url));
//       }
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|\\.png$).*)'],
// };
