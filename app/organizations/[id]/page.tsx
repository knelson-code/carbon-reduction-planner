"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Organization {
  id: string
  name: string
  baseYear: number
}

interface EmissionCategory {
  id: string
  name: string
  key: string
  baseline: number
  scopeId: string
}

export default function OrganizationDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orgId = params?.id as string

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"scope1" | "scope2" | "scope3">("scope1")
  
  // Emission categories by scope
  const [scope1Total, setScope1Total] = useState(0)
  const [scope2Total, setScope2Total] = useState(0)
  const [scope3Total, setScope3Total] = useState(0)

  const scope1Categories = [
    { key: "stationary_combustion", name: "Stationary Combustion (boilers, furnaces)", value: 0 },
    { key: "mobile_combustion", name: "Mobile Combustion (owned vehicles)", value: 0 },
    { key: "fugitive_emissions", name: "Fugitive Emissions (equipment leaks)", value: 0 },
    { key: "process_emissions", name: "Process Emissions (physical/chemical)", value: 0 },
  ]

  const scope2Categories = [
    { key: "purchased_electricity", name: "Purchased Electricity", value: 0 },
    { key: "purchased_heat_steam", name: "Purchased Heat/Steam/Cooling", value: 0 },
  ]

  const scope3Categories = [
    { key: "purchased_goods", name: "Purchased Goods & Services", value: 0 },
    { key: "capital_goods", name: "Capital Goods", value: 0 },
    { key: "business_travel", name: "Business Travel", value: 0 },
    { key: "employee_commuting", name: "Employee Commuting", value: 0 },
    { key: "waste_generated", name: "Waste Generated in Operations", value: 0 },
    { key: "use_sold_products", name: "Use of Sold Products", value: 0 },
  ]

  const [emissions, setEmissions] = useState({
    scope1: scope1Categories,
    scope2: scope2Categories,
    scope3: scope3Categories,
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session && orgId) {
      fetchOrganization()
    }
  }, [session, orgId])

  useEffect(() => {
    // Calculate totals
    setScope1Total(emissions.scope1.reduce((sum, cat) => sum + cat.value, 0))
    setScope2Total(emissions.scope2.reduce((sum, cat) => sum + cat.value, 0))
    setScope3Total(emissions.scope3.reduce((sum, cat) => sum + cat.value, 0))
  }, [emissions])

  const fetchOrganization = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgId}`)
      if (response.ok) {
        const data = await response.json()
        setOrganization(data)
      }
    } catch (error) {
      console.error("Error fetching organization:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmissionChange = (scope: "scope1" | "scope2" | "scope3", index: number, value: number) => {
    setEmissions(prev => ({
      ...prev,
      [scope]: prev[scope].map((cat, i) => i === index ? { ...cat, value } : cat)
    }))
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!session || !organization) {
    return null
  }

  const totalEmissions = scope1Total + scope2Total + scope3Total
  const target42 = totalEmissions * 0.58
  const target90 = totalEmissions * 0.10

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/organizations" className="text-orange-500 hover:text-orange-600 font-semibold">
            ← Back to Organizations
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{organization.name}</h1>
          <p className="text-gray-600">Base Year: {organization.baseYear}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Scope 1</h3>
            <p className="text-2xl font-bold text-blue-500">{scope1Total.toFixed(0)} tCO₂e</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Scope 2</h3>
            <p className="text-2xl font-bold text-orange-500">{scope2Total.toFixed(0)} tCO₂e</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-teal-500">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Scope 3</h3>
            <p className="text-2xl font-bold text-teal-500">{scope3Total.toFixed(0)} tCO₂e</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total</h3>
            <p className="text-2xl font-bold text-green-500">{totalEmissions.toFixed(0)} tCO₂e</p>
          </div>
        </div>

        {/* Targets */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-md p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🎯 Reduction Targets</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-90">42% Reduction Target</p>
              <p className="text-3xl font-bold">{target42.toFixed(0)} tCO₂e</p>
            </div>
            <div>
              <p className="text-sm opacity-90">90% Reduction Target</p>
              <p className="text-3xl font-bold">{target90.toFixed(0)} tCO₂e</p>
            </div>
          </div>
        </div>

        {/* Emission Input */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Baseline Emissions Input</h2>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab("scope1")}
              className={`px-6 py-3 font-semibold ${
                activeTab === "scope1"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Scope 1 ({scope1Total.toFixed(0)} tCO₂e)
            </button>
            <button
              onClick={() => setActiveTab("scope2")}
              className={`px-6 py-3 font-semibold ${
                activeTab === "scope2"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Scope 2 ({scope2Total.toFixed(0)} tCO₂e)
            </button>
            <button
              onClick={() => setActiveTab("scope3")}
              className={`px-6 py-3 font-semibold ${
                activeTab === "scope3"
                  ? "text-teal-500 border-b-2 border-teal-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Scope 3 ({scope3Total.toFixed(0)} tCO₂e)
            </button>
          </div>

          {/* Input Forms */}
          <div className="space-y-3">
            {emissions[activeTab].map((category, index) => (
              <div key={category.key} className="flex items-center gap-4">
                <label className="flex-1 text-sm text-gray-700">{category.name}</label>
                <input
                  type="number"
                  value={category.value}
                  onChange={(e) => handleEmissionChange(activeTab, index, parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0"
                />
                <span className="text-sm text-gray-600 w-12">tCO₂e</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-900">
            <strong>Next Steps:</strong> Enter your baseline emissions above. Reduction tactics and visualization features are coming soon! The database is ready to store all your planning data.
          </p>
        </div>
      </div>
    </div>
  )
}
