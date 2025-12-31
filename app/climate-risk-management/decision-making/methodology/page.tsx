"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ClimateRiskManagementSidebar from "@/components/ClimateRiskManagementSidebar"

export default function MethodologyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/climate-risk-management/decision-making/methodology")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><div className="text-lg text-gray-600">Loading...</div></div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-92px)]">
      <ClimateRiskManagementSidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#0B1F32' }}>Methodology</h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border" style={{ borderColor: '#d4dfe0' }}>
            <p className="text-gray-700 leading-relaxed">Content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
