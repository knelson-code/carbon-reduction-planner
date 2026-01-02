"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ClimateRiskManagementSidebar from "@/components/ClimateRiskManagementSidebar"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Graph type options
const graphOptions = [
  { id: 'ebitda', label: 'EBITDA Growth by Service Line' },
  { id: 'profitability', label: 'Profitability' },
  { id: 'liquidity', label: 'Liquidity' },
  { id: 'solvency', label: 'Solvency' },
  { id: 'operating-efficiency', label: 'Operating Efficiency' },
  { id: 'employee-health', label: 'Employee Health Risk' },
]

// Policy slider configuration
const policySliders = [
  { id: 'ice-controls', label: 'ICE Controls', min: 0, max: 100, defaultValue: 50 },
  { id: 'traffic-mgmt', label: 'Traffic Management', min: 0, max: 100, defaultValue: 50 },
  { id: 'ev-promotion', label: 'EV Promotion', min: 0, max: 100, defaultValue: 50 },
  { id: 'active-transport', label: 'Active Transport', min: 0, max: 100, defaultValue: 50 },
  { id: 'carbon-pricing', label: 'Carbon Pricing', min: 0, max: 100, defaultValue: 50 },
  { id: 'public-transport', label: 'Public Transport', min: 0, max: 100, defaultValue: 50 },
  { id: 'autonomous-vehicles', label: 'Autonomous Vehicles', min: 0, max: 100, defaultValue: 50 },
  { id: 'alternative-fuels', label: 'Alternative Fuels', min: 0, max: 100, defaultValue: 50 },
]

// Generate sample data for EBITDA growth - will be replaced with real calculation
const generateEBITDAData = (sliderValues: Record<string, number>) => {
  const years = []
  const currentYear = new Date().getFullYear()
  
  // Base growth factors influenced by policies
  const policyImpact = Object.values(sliderValues).reduce((sum, val) => sum + val, 0) / (100 * Object.keys(sliderValues).length)
  
  for (let year = currentYear; year <= currentYear + 30; year++) {
    const timeProgress = (year - currentYear) / 30
    const growthMultiplier = 1 + (timeProgress * policyImpact * 0.5)
    
    years.push({
      year,
      consulting: Math.round(50 + (timeProgress * 30 * growthMultiplier)),
      technology: Math.round(80 + (timeProgress * 50 * growthMultiplier)),
      training: Math.round(40 + (timeProgress * 25 * growthMultiplier)),
      research: Math.round(30 + (timeProgress * 20 * growthMultiplier)),
      advisory: Math.round(60 + (timeProgress * 35 * growthMultiplier)),
    })
  }
  
  return years
}

// Color palette for service lines (similar to En-ROADS aesthetic)
const serviceLineColors = {
  consulting: '#8B4513',
  technology: '#FF6B35',
  training: '#4A90E2',
  research: '#50C878',
  advisory: '#9B59B6',
}

export default function ScenarioExplorerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [leftGraph, setLeftGraph] = useState('ebitda')
  const [rightGraph, setRightGraph] = useState('profitability')
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(
    policySliders.reduce((acc, slider) => ({ ...acc, [slider.id]: slider.defaultValue }), {})
  )
  const [chartData, setChartData] = useState(generateEBITDAData(sliderValues))

  // Recalculate chart data when sliders change
  useEffect(() => {
    setChartData(generateEBITDAData(sliderValues))
  }, [sliderValues])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/climate-risk-management/scenario-analysis/scenario-explorer")
    }
  }, [status, router])

  const handleSliderChange = (id: string, value: number) => {
    setSliderValues(prev => ({ ...prev, [id]: value }))
  }

  const resetSliders = () => {
    const resetValues = policySliders.reduce((acc, slider) => ({ 
      ...acc, 
      [slider.id]: slider.defaultValue 
    }), {})
    setSliderValues(resetValues)
  }

  if (status === "loading") {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><div className="text-lg text-gray-600">Loading...</div></div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-92px)]">
      <ClimateRiskManagementSidebar />
      <div className="flex-1 bg-white">
        <div className="h-full flex flex-col">
          {/* Top Section: Two Graphs Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border-b" style={{ height: '50vh', borderColor: '#d4dfe0' }}>
            {/* Left Graph */}
            <div className="flex flex-col bg-gray-50 rounded-lg p-4 border" style={{ borderColor: '#d4dfe0' }}>
              <div className="flex items-center justify-between mb-3">
                <select
                  value={leftGraph}
                  onChange={(e) => setLeftGraph(e.target.value)}
                  className="text-sm font-semibold px-3 py-1.5 rounded border"
                  style={{ backgroundColor: '#ffffff', color: '#0B1F32', borderColor: '#d4dfe0' }}
                >
                  {graphOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>
              
              <div className="flex-1">
                {leftGraph === 'ebitda' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 11 }}
                        label={{ value: 'Year', position: 'insideBottom', offset: -10, fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        label={{ value: 'EBITDA (Million €)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #d4dfe0',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px' }}
                        iconType="square"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="consulting" 
                        stackId="1" 
                        stroke={serviceLineColors.consulting} 
                        fill={serviceLineColors.consulting}
                        name="Consulting"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="technology" 
                        stackId="1" 
                        stroke={serviceLineColors.technology} 
                        fill={serviceLineColors.technology}
                        name="Technology"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="training" 
                        stackId="1" 
                        stroke={serviceLineColors.training} 
                        fill={serviceLineColors.training}
                        name="Training"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="research" 
                        stackId="1" 
                        stroke={serviceLineColors.research} 
                        fill={serviceLineColors.research}
                        name="Research"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="advisory" 
                        stackId="1" 
                        stroke={serviceLineColors.advisory} 
                        fill={serviceLineColors.advisory}
                        name="Advisory"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                {leftGraph !== 'ebitda' && (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Chart data coming soon...
                  </div>
                )}
              </div>
            </div>

            {/* Right Graph */}
            <div className="flex flex-col bg-gray-50 rounded-lg p-4 border" style={{ borderColor: '#d4dfe0' }}>
              <div className="flex items-center justify-between mb-3">
                <select
                  value={rightGraph}
                  onChange={(e) => setRightGraph(e.target.value)}
                  className="text-sm font-semibold px-3 py-1.5 rounded border"
                  style={{ backgroundColor: '#ffffff', color: '#0B1F32', borderColor: '#d4dfe0' }}
                >
                  {graphOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>
              
              <div className="flex items-center justify-center flex-1 text-gray-400 text-sm">
                Chart data coming soon...
              </div>
            </div>
          </div>

          {/* Bottom Section: Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4" style={{ height: '50vh' }}>
            {/* Left: Public Policy Sliders */}
            <div className="bg-gray-50 rounded-lg p-4 border overflow-y-auto" style={{ borderColor: '#d4dfe0' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: '#0B1F32' }}>Public Policies</h3>
                <button
                  onClick={resetSliders}
                  className="text-xs px-3 py-1 rounded transition-colors"
                  style={{ backgroundColor: '#163E64', color: '#ffffff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0B1F32'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#163E64'}
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-4">
                {policySliders.map(slider => (
                  <div key={slider.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium" style={{ color: '#163E64' }}>
                        {slider.label}
                      </label>
                      <span className="text-xs font-mono" style={{ color: '#6C757D' }}>
                        {sliderValues[slider.id]}%
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={slider.min}
                        max={slider.max}
                        value={sliderValues[slider.id]}
                        onChange={(e) => handleSliderChange(slider.id, parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #FF5B35 0%, #FF5B35 ${sliderValues[slider.id]}%, #d4dfe0 ${sliderValues[slider.id]}%, #d4dfe0 100%)`
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs" style={{ color: '#6C757D' }}>status quo</span>
                        <span className="text-xs" style={{ color: '#6C757D' }}>highly aggressive</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Climate/Environmental Conditions Placeholder */}
            <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: '#d4dfe0' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: '#0B1F32' }}>Climate & Environmental Conditions</h3>
              <div className="flex items-center justify-center h-[calc(100%-2rem)] border-2 border-dashed rounded" style={{ borderColor: '#d4dfe0' }}>
                <p className="text-sm text-gray-400">Climate sliders coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
