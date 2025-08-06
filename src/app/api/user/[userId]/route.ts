import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebaseAdmin'

// Next.js route handlers can receive a context object as the 2nd argument
export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = context.params
    if (!userId) {
      console.error('Unauthorized access attempt without userId')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Using Admin SDK
    const userDoc = await db.doc(`users/${userId}`).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userDoc.data())
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
