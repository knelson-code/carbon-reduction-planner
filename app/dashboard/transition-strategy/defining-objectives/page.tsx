"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Link from "next/link"

export default function DefiningObjectivesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-92px)]">
      <Sidebar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/dashboard/transition-strategy"
              className="text-sm hover:underline mb-2 inline-block"
              style={{ color: '#163E64' }}
            >
              ← Back to Energy Transition Strategy
            </Link>
            <h1 className="text-3xl font-bold" style={{ color: "#163E64" }}>
              Defining Your Objectives
            </h1>
          </div>

          {/* Content will be added by user */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <p style={{ color: '#163E64' }}>
              Content coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
