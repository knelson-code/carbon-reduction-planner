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
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold mb-2">Total Organizations</h3>
            <p className="text-3xl font-bold text-blue-500">0</p>
            <p className="text-sm text-gray-600 mt-2">Create your first organization to get started</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-lg font-semibold mb-2">Active Reduction Tactics</h3>
            <p className="text-3xl font-bold text-green-500">0</p>
            <p className="text-sm text-gray-600 mt-2">No tactics configured yet</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <h3 className="text-lg font-semibold mb-2">Baseline Emissions</h3>
            <p className="text-3xl font-bold text-orange-500">0 tCO₂e</p>
            <p className="text-sm text-gray-600 mt-2">Set your baseline to track progress</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-md p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🎉 Your app is ready!</h2>
          <p className="text-lg mb-4">
            You&apos;ve successfully built a full-stack CO₂ Reduction Planning application with:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <span className="mr-2">✅</span> User authentication & secure login
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Database with Prisma ORM
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Modern UI with Tailwind CSS
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> Next.js 14 App Router
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span> TypeScript for type safety
            </li>
          </ul>
          <div className="bg-white/20 rounded-lg p-4">
            <p className="font-semibold mb-2">Next Steps:</p>
            <p className="text-sm">
              The full emission tracking and planning features are ready to be built! 
              You have the complete database schema for organizations, emission scopes, 
              categories, and reduction tactics. Now you can add pages to create and manage 
              these resources, plus add Chart.js visualizations for emissions forecasting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
