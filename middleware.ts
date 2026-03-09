import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET || 'fallback-secret-for-development',
  })
  const { pathname } = req.nextUrl

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/reset-password')

  if (isAuthRoute) {
    if (token) {
      const role = (token.role as string)?.toLowerCase() || 'user'
      if (role === 'agent' || role === 'owners') {
        return NextResponse.redirect(new URL('/agent/dashboard', req.url))
      } else if (role === 'vendor') {
        return NextResponse.redirect(new URL('/vendor/advertisements', req.url))
      }
      return NextResponse.redirect(new URL('/user/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', encodeURI(pathname))
    return NextResponse.redirect(url)
  } else {
    // Role based protection
    const role = (token.role as string)?.toLowerCase() || 'user'

    if (
      pathname.startsWith('/agent') &&
      role !== 'agent' &&
      role !== 'owners'
    ) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (pathname.startsWith('/vendor') && role !== 'vendor') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // '/login',
    // '/register',
    // '/forgot-password',
    // '/verify',
    // '/reset-password',
    // '/user/:path*',
    // '/agent/:path*',
    // '/vendor/:path*'
  ],
}
