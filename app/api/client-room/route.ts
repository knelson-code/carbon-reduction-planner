import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ============================================================================
// CLIENT ROOM API — shared state for client pages on the static marketing site
// (e.g. https://newdayclimate.com/pm). NO user accounts: each "room" has one
// shared passphrase. Everyone with the passphrase reads/writes the same state,
// so Keith and the client see the same board across devices.
//
// To add a new client page: add one entry to ROOMS below. That's it —
// the row in the ClientRoom table is created automatically on first save.
// ============================================================================

const ROOMS: Record<string, string> = {
  papelmatic: "pm",
  arpol: "ar",
  pmtc: "pm", // Papelmatic proposal room (newdayclimate.com/pmtc) — temp passphrase, to be upgraded
  as: "as", // Ungated workshop room (newdayclimate.com/as). The page is unlisted and
            // ships this passphrase in its source on purpose: no login, link = access.
}

// Origins allowed to call this API from the browser (the static marketing site).
const ALLOWED_ORIGINS = [
  "https://newdayclimate.com",
  "https://www.newdayclimate.com",
  "https://newdayclimatesolutions.com",
  "https://www.newdayclimatesolutions.com",
  "http://localhost:3000",
  "http://localhost:8080",
]

// Keep saved blobs sane (the page state is small JSON — stars, notes, tables).
const MAX_DATA_BYTES = 200_000

function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin") || ""
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  }
}

function checkAccess(room: string | null, pass: string | null): string | null {
  if (!room || !pass) return null
  const expected = ROOMS[room]
  if (!expected || pass !== expected) return null
  return room
}

// Preflight for cross-origin POSTs with a JSON body
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

// GET /api/client-room?room=papelmatic&pass=... → { data, updatedAt }
export async function GET(request: NextRequest) {
  const headers = corsHeaders(request)
  try {
    const params = request.nextUrl.searchParams
    const room = checkAccess(params.get("room"), params.get("pass"))
    if (!room) {
      return NextResponse.json({ error: "Invalid room or passphrase" }, { status: 401, headers })
    }

    const record = await prisma.clientRoom.findUnique({ where: { room } })
    // Cheap change-polling: caller sends the updatedAt it already has; if
    // nothing is newer we skip the payload so pages can poll every few seconds.
    const since = params.get("since")
    if (since && record?.updatedAt && record.updatedAt.toISOString() === since) {
      return NextResponse.json({ unchanged: true, updatedAt: since }, { headers })
    }
    return NextResponse.json(
      { data: record?.data ?? null, updatedAt: record?.updatedAt ?? null },
      { headers }
    )
  } catch (error) {
    console.error("client-room GET error:", error)
    return NextResponse.json({ error: "Failed to load" }, { status: 500, headers })
  }
}

// POST /api/client-room  body: { room, pass, data } → upsert shared state
export async function POST(request: NextRequest) {
  const headers = corsHeaders(request)
  try {
    const body = await request.json()
    const room = checkAccess(body?.room, body?.pass)
    if (!room) {
      return NextResponse.json({ error: "Invalid room or passphrase" }, { status: 401, headers })
    }

    const data = body?.data
    if (data === undefined) {
      return NextResponse.json({ error: "Missing data" }, { status: 400, headers })
    }
    if (JSON.stringify(data).length > MAX_DATA_BYTES) {
      return NextResponse.json({ error: "Data too large" }, { status: 413, headers })
    }

    const record = await prisma.clientRoom.upsert({
      where: { room },
      update: { data },
      create: { room, passphrase: ROOMS[room], data },
    })
    return NextResponse.json({ ok: true, updatedAt: record.updatedAt }, { headers })
  } catch (error) {
    console.error("client-room POST error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500, headers })
  }
}
