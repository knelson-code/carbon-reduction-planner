"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {session.user?.name || session.user?.email}!
          </h1>
          <p className="text-gray-600">
            Your CO₂ Reduction Planning Dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderColor: '#0B1F32' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#0B1F32' }}>Total Organizations</h3>
            <p className="text-3xl font-bold" style={{ color: '#0B1F32' }}>0</p>
            <p className="text-sm mt-2" style={{ color: '#5a6c6f' }}>Create your first organization to get started</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderColor: '#10b981' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#0B1F32' }}>Active Reduction Tactics</h3>
            <p className="text-3xl font-bold" style={{ color: '#10b981' }}>0</p>
            <p className="text-sm mt-2" style={{ color: '#5a6c6f' }}>No tactics configured yet</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderColor: '#FF5B35' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#0B1F32' }}>Baseline Emissions</h3>
            <p className="text-3xl font-bold" style={{ color: '#FF5B35' }}>0 tCO₂e</p>
            <p className="text-sm mt-2" style={{ color: '#5a6c6f' }}>Set your baseline to track progress</p>
          </div>
        </div>

      </div>
    </div>
  )
}
