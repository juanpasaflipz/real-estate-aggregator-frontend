import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Add a test header to verify middleware is running
  response.headers.set('X-Middleware-Test', 'working')
  
  // Remove any existing CSP headers
  response.headers.delete('Content-Security-Policy')
  
  // Add CSP headers that allow eval in development
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self' data:; connect-src 'self' http://localhost:* https:;"
  )
  
  return response
}

export const config = {
  matcher: '/:path*',
}