import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

// ============================================================================
// BOARD API — shared collaborative whiteboard state for client pages on the
// static marketing site (e.g. https://newdayclimate.com/board). NO user
// accounts: each "room" has one shared passphrase. Everyone with the
// passphrase reads/writes the same board, so multiple people can edit
// concurrently across devices.
//
// Unlike /api/client-room (which stores one opaque `data` blob and last
// writer wins for the whole page), this endpoint merges per-object: each
// save sends only the objects/notes that changed, and the server keeps
// whichever version of each object/note is newest, so two people editing
// different sticky notes at once don't stomp on each other.
//
// To add a new board room: add one entry to BOARD_ROOMS below. That's it —
// the row in the Board table is created automatically on first save.
// ============================================================================

const BOARD_ROOMS: Record<string, string> = {
  demo: "risk",
}

// Any well-formed room name that is NOT listed above unlocks with the master
// passphrase, so Keith can spin up a board per client just by sharing
// /board/?room=<name> — no code change or deploy. List a room in BOARD_ROOMS
// only when it needs its own passphrase.
const DEFAULT_BOARD_PASS = "risk"
const ROOM_NAME_RE = /^[a-z0-9-]{1,32}$/

function roomPass(room: string): string | null {
  if (!ROOM_NAME_RE.test(room)) return null
  return BOARD_ROOMS[room] ?? DEFAULT_BOARD_PASS
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

// Keep saved blobs sane.
const MAX_OPS_BYTES = 300_000
const MAX_OBJECTS_BYTES = 1_500_000

type BoardObject = {
  updatedAt: number
  deleted?: boolean
  [key: string]: unknown
}
type ObjectsMap = Record<string, BoardObject>
type NotesMap = Record<string, string>
type NotesStampsMap = Record<string, number>

// Thrown inside the transaction when the merged objects blob would exceed
// MAX_OBJECTS_BYTES, so the write can be rolled back and reported as 413.
class BoardTooLargeError extends Error {}

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
  const expected = roomPass(room)
  if (!expected || pass !== expected) return null
  return room
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

// Preflight for cross-origin POSTs with a JSON body
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

// GET /api/board?room=demo&pass=...&since=... → { objects, notes, notesUpdatedAt, updatedAt }
export async function GET(request: NextRequest) {
  const headers = corsHeaders(request)
  try {
    const params = request.nextUrl.searchParams
    const room = checkAccess(params.get("room"), params.get("pass"))
    if (!room) {
      return NextResponse.json({ error: "Invalid room or passphrase" }, { status: 401, headers })
    }

    const record = await prisma.board.findUnique({ where: { room } })
    // Cheap change-polling: caller sends the updatedAt it already has; if
    // nothing is newer we skip the payload so pages can poll every few seconds.
    const since = params.get("since")
    if (since && record?.updatedAt && record.updatedAt.toISOString() === since) {
      return NextResponse.json({ unchanged: true, updatedAt: since }, { headers })
    }
    return NextResponse.json(
      {
        objects: (record?.objects as ObjectsMap | null) ?? {},
        notes: (record?.notes as NotesMap | null) ?? {},
        notesUpdatedAt: (record?.notesUpdatedAt as NotesStampsMap | null) ?? {},
        updatedAt: record?.updatedAt ?? null,
      },
      { headers }
    )
  } catch (error) {
    console.error("board GET error:", error)
    return NextResponse.json({ error: "Failed to load" }, { status: 500, headers })
  }
}

// POST /api/board  body: { room, pass, ops?, notes?, notesUpdatedAt? }
// Per-object last-write-wins merge: only the changed objects/notes need to be
// sent, and whichever version (incoming vs already-stored) has the larger
// numeric updatedAt wins, key by key.
export async function POST(request: NextRequest) {
  const headers = corsHeaders(request)
  try {
    const body = await request.json()
    const room = checkAccess(body?.room, body?.pass)
    if (!room) {
      return NextResponse.json({ error: "Invalid room or passphrase" }, { status: 401, headers })
    }

    const ops = body?.ops
    if (ops !== undefined && !isPlainObject(ops)) {
      return NextResponse.json({ error: "ops must be an object" }, { status: 400, headers })
    }
    if (ops !== undefined && JSON.stringify(ops).length > MAX_OPS_BYTES) {
      return NextResponse.json({ error: "ops payload too large" }, { status: 413, headers })
    }

    const notes = body?.notes
    if (notes !== undefined && !isPlainObject(notes)) {
      return NextResponse.json({ error: "notes must be an object" }, { status: 400, headers })
    }
    const notesUpdatedAt = body?.notesUpdatedAt
    if (notesUpdatedAt !== undefined && !isPlainObject(notesUpdatedAt)) {
      return NextResponse.json({ error: "notesUpdatedAt must be an object" }, { status: 400, headers })
    }

    // Read-merge-write inside a single interactive transaction so two
    // concurrent saves can't both read the same base row and silently drop
    // each other's changes (lost update).
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.board.findUnique({ where: { room } })

      const existingObjects: ObjectsMap = (existing?.objects as ObjectsMap | null) ?? {}
      const existingNotes: NotesMap = (existing?.notes as NotesMap | null) ?? {}
      const existingNotesStamps: NotesStampsMap =
        (existing?.notesUpdatedAt as NotesStampsMap | null) ?? {}

      // Client clocks decide last-write-wins, so a device with a fast clock
      // could stamp far-future times and make its edits unbeatable. Clamp
      // incoming stamps to server-now plus a small slack.
      const maxStamp = Date.now() + 5_000

      const merged: ObjectsMap = { ...existingObjects }
      if (ops) {
        for (const [id, incomingRaw] of Object.entries(ops as Record<string, unknown>)) {
          if (!isPlainObject(incomingRaw)) continue
          const incoming = incomingRaw as BoardObject
          const incomingUpdatedAt = Math.min(
            typeof incoming.updatedAt === "number" ? incoming.updatedAt : -1,
            maxStamp
          )
          incoming.updatedAt = incomingUpdatedAt
          const existingUpdatedAt = merged[id]?.updatedAt ?? -1
          if (incomingUpdatedAt >= existingUpdatedAt) {
            merged[id] = incoming.deleted
              ? { deleted: true, updatedAt: incomingUpdatedAt } // tombstone: strip other fields
              : incoming
          }
        }
      }

      const mergedNotes: NotesMap = { ...existingNotes }
      const mergedNotesStamps: NotesStampsMap = { ...existingNotesStamps }
      if (notes) {
        for (const [key, value] of Object.entries(notes as Record<string, unknown>)) {
          if (typeof value !== "string") continue
          const incomingStampRaw = (notesUpdatedAt as Record<string, unknown> | undefined)?.[key]
          if (typeof incomingStampRaw !== "number") continue
          const incomingStamp = Math.min(incomingStampRaw, maxStamp)
          const existingStamp = mergedNotesStamps[key] ?? -1
          if (incomingStamp > existingStamp) {
            mergedNotes[key] = value
            mergedNotesStamps[key] = incomingStamp
          }
        }
      }

      if (JSON.stringify(merged).length > MAX_OBJECTS_BYTES) {
        throw new BoardTooLargeError("Board objects exceed size limit")
      }

      const mergedJson = merged as unknown as Prisma.InputJsonValue

      const row = await tx.board.upsert({
        where: { room },
        update: { objects: mergedJson, notes: mergedNotes, notesUpdatedAt: mergedNotesStamps },
        create: {
          room,
          passphrase: roomPass(room) ?? "",
          objects: mergedJson,
          notes: mergedNotes,
          notesUpdatedAt: mergedNotesStamps,
        },
      })

      return { row, merged, mergedNotes, mergedNotesStamps }
    })

    return NextResponse.json(
      {
        ok: true,
        updatedAt: result.row.updatedAt,
        objects: result.merged,
        notes: result.mergedNotes,
        notesUpdatedAt: result.mergedNotesStamps,
      },
      { headers }
    )
  } catch (error) {
    if (error instanceof BoardTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413, headers })
    }
    console.error("board POST error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500, headers })
  }
}
