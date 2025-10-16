import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Generate random 8-character alphanumeric code
function generatePurchaseCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// GET - Fetch user's purchases
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        purchases: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ purchases: user.purchases })
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new purchase
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { itemType, itemName, pointsCost } = body

    if (!itemType || !itemName || !pointsCost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has enough points
    if (user.score < pointsCost) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 })
    }

    // Generate unique purchase code
    let purchaseCode = generatePurchaseCode()
    let codeExists = await prisma.purchase.findUnique({ where: { purchaseCode } })
    
    // Keep generating until we get a unique code
    while (codeExists) {
      purchaseCode = generatePurchaseCode()
      codeExists = await prisma.purchase.findUnique({ where: { purchaseCode } })
    }

    // Create purchase and deduct points in a transaction
    const purchase = await prisma.$transaction(async (tx: any) => {
      // Deduct points
      await tx.user.update({
        where: { id: user.id },
        data: { score: user.score - pointsCost }
      })

      // Create purchase record
      return await tx.purchase.create({
        data: {
          userId: user.id,
          itemType,
          itemName,
          pointsCost,
          purchaseCode
        }
      })
    })

    return NextResponse.json({ purchase })
  } catch (error) {
    console.error('Error creating purchase:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Mark a purchase as utilized
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { purchaseId } = body

    if (!purchaseId) {
      return NextResponse.json({ error: 'Missing purchase ID' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify purchase belongs to user
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId }
    })

    if (!purchase || purchase.userId !== user.id) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    // Mark as utilized
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        isUtilized: true,
        utilizedAt: new Date()
      }
    })

    return NextResponse.json({ purchase: updatedPurchase })
  } catch (error) {
    console.error('Error updating purchase:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
