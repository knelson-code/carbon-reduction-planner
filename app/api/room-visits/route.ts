import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ============================================================================
// ROOM VISITS — read back who opened a client-room link, and when.
//
// The client-room API writes one RoomVisit row per page load. This endpoint is
// how you read them. It exists because Vercel's runtime logs expire (~1 day on
// Hobby, ~7 on Pro) and cannot be queried after the fact, so "did the client
// ever open the link we sent in August?" had no answer by September.
//
//   curl "https://risk-software.newdayclimate.com/api/room-visits?room=az&pass=az"
//   curl "...&room=t1&pass=t1&days=30&limit=200"
//
// AUTH: the room's own passphrase, same as the client-room API. That keeps each
// board's visit history behind the same secret as the board itself. There is no
// all-rooms view on purpose — one leaked workshop passphrase should not expose
// every other client's visit history.
// ============================================================================

const ROOMS: Record<string, string> = {
  papelmatic: "pm",
  arpol: "ar",
  pmtc: "pm",
  as: "as",
  az: "az",
  t1: "t1",
}

const ALLOWED_ORIGINS = [
  "https://newdayclimate.com",
  "https://www.newdayclimate.com",
  "https://newdayclimatesolutions.com",
  "https://www.newdayclimatesolutions.com",
  "http://localhost:3000",
  "http://localhost:8080",
]

function corsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin")
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    // Visit history is a record about people, not page content: never let a search
    // engine or an AI crawler keep a copy.
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store",
  }
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin
  }
  return headers
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

export async function GET(request: NextRequest) {
  const headers = corsHeaders(request)
  try {
    const room = request.nextUrl.searchParams.get("room") ?? ""
    const pass = request.nextUrl.searchParams.get("pass") ?? ""

    if (!ROOMS[room] || ROOMS[room] !== pass) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers })
    }

    // Clamp both, so a typo cannot ask for a million rows.
    const days = Math.min(Math.max(parseInt(request.nextUrl.searchParams.get("days") ?? "90", 10) || 90, 1), 365)
    const limit = Math.min(Math.max(parseInt(request.nextUrl.searchParams.get("limit") ?? "500", 10) || 500, 1), 2000)
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const visits = await prisma.roomVisit.findMany({
      where: { room, at: { gte: since } },
      orderBy: { at: "desc" },
      take: limit,
    })

    // A per-door count is the question actually being asked: "/az" is Keith's own
    // door and "/taller-..." is the one sent to the client, so the split between
    // them is what says whether anyone but Keith opened it.
    const byVia: Record<string, number> = {}
    for (const v of visits) byVia[v.via ?? "?"] = (byVia[v.via ?? "?"] ?? 0) + 1

    return NextResponse.json(
      { room, days, count: visits.length, byVia, visits },
      { headers }
    )
  } catch (error) {
    console.error("room-visits GET error:", error)
    return NextResponse.json({ error: "Failed to load" }, { status: 500, headers })
  }
}
