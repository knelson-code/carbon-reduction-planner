import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch activity completion status and data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const activityId = searchParams.get("activityId")

    if (!activityId) {
      return NextResponse.json(
        { error: "Activity ID is required" },
        { status: 400 }
      )
    }

    const activity = await prisma.activityCompletion.findUnique({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: activityId,
        },
      },
    })

    return NextResponse.json({
      isCompleted: activity?.isCompleted || false,
      data: activity?.data || null,
    })
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    )
  }
}

// POST - Save or update activity completion status and data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { activityId, isCompleted, data } = body

    if (!activityId) {
      return NextResponse.json(
        { error: "Activity ID is required" },
        { status: 400 }
      )
    }

    const activity = await prisma.activityCompletion.upsert({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: activityId,
        },
      },
      update: {
        isCompleted: isCompleted ?? false,
        data: data || null,
      },
      create: {
        userId: session.user.id,
        activityId: activityId,
        isCompleted: isCompleted ?? false,
        data: data || null,
      },
    })

    return NextResponse.json({
      success: true,
      activity,
    })
  } catch (error) {
    console.error("Error saving activity:", error)
    return NextResponse.json(
      { error: "Failed to save activity" },
      { status: 500 }
    )
  }
}
