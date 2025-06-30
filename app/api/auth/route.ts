import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (email === 'a@gmail.com' && password === 'a') {
      const token = 'demo-token-' + Date.now()
      
      const user = {
        id: 1,
        email: email,
        name: 'Admin User',
        role: 'admin'
      }

      return NextResponse.json({
        message: 'Login successful',
        token: token,
        user: user
      })
    }

    if (password === 'b') {
      const token = 'demo-token-' + Date.now()
      
      const user = {
        id: 2,
        email: email,
        name: email.split('@')[0],
        role: 'user'
      }

      return NextResponse.json({
        message: 'Login successful',
        token: token,
        user: user
      })
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}