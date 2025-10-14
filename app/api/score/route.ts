import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/score - Get current user's score
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { score: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ score: user.score })
  } catch (error) {
    console.error('Error fetching score:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/score - Add points to current user's score
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { points } = await request.json()

    if (typeof points !== 'number' || points <= 0) {
      return NextResponse.json({ error: 'Invalid points value' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { score: { increment: points } },
      select: { score: true }
    })

    return NextResponse.json({ score: user.score })
  } catch (error) {
    console.error('Error updating score:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
