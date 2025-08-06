import { NextResponse } from 'next/server'
import { db } from '@/lib/firebaseAdmin'

export async function GET(
  _request: Request, // Underscore prefix indicates unused param
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    if (!userId) {
      console.error('Unauthorized access attempt without userId')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
