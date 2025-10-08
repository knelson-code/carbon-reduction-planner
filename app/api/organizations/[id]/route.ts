import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session.user as any).id
    const { id } = await params
    const organization = await prisma.organization.findFirst({
      where: {
        id: id,
        userId: userId
      }
    })

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(organization)
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 }
    )
  }
}
