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

// Generate revenue projection data from actual year-by-year values
const generateRevenueData = (timeFrame: '5year' | '10year') => {
  const startYear = 2024
  const endYear = timeFrame === '5year' ? 2030 : 2035
  
  const years = []
  for (let year = startYear; year <= endYear; year++) {
    if (revenueDataByYear[year]) {
      years.push({
        year,
        ...revenueDataByYear[year]
      })
    }
  }
  
  return years
}

// Color palette matching the revenue projection table
const serviceLineColors = {
  urbanON: '#1B3A5C',      // Dark Navy Blue
  urbanOFF: '#4682B4',     // Steel Blue
  urbanLEZ: '#87CEEB',     // Sky Blue
  urbanOTH: '#AFEEEE',     // Pale Cyan
  interurbanTOL: '#556B2F', // Forest/Olive Green
  interurbanSystems: '#4CBB17', // Kelly Green
  interurbanMTRK: '#CCFF00', // Lime/Electric Green
  safetyOSAFE: '#8B008B',  // Deep Magenta
  safetyODATA: '#FF1493',  // Bright Pink
  safetyOMAPP: '#FFB6C1',  // Pastel Pink
}

// Actual year-by-year revenue data from the table (in millions €)
const revenueDataByYear: Record<number, Record<string, number>> = {
  2024: { urbanON: 22.4, urbanOFF: 4.6, urbanLEZ: 2.6, urbanOTH: 3.1, interurbanTOL: 5.6, interurbanSystems: 1.5, interurbanMTRK: 3.6, safetyOSAFE: 7.1, safetyODATA: 0.3, safetyOMAPP: 0.1 },
  2025: { urbanON: 24.3, urbanOFF: 5.2, urbanLEZ: 3.2, urbanOTH: 3.5, interurbanTOL: 7.5, interurbanSystems: 1.9, interurbanMTRK: 4.4, safetyOSAFE: 8.8, safetyODATA: 0.7, safetyOMAPP: 0.2 },
  2026: { urbanON: 26.1, urbanOFF: 6.0, urbanLEZ: 4.0, urbanOTH: 3.9, interurbanTOL: 9.9, interurbanSystems: 2.4, interurbanMTRK: 5.4, safetyOSAFE: 10.9, safetyODATA: 1.1, safetyOMAPP: 0.3 },
  2027: { urbanON: 28.1, urbanOFF: 6.8, urbanLEZ: 5.1, urbanOTH: 4.3, interurbanTOL: 12.9, interurbanSystems: 2.9, interurbanMTRK: 6.4, safetyOSAFE: 13.1, safetyODATA: 1.7, safetyOMAPP: 0.5 },
  2028: { urbanON: 30.2, urbanOFF: 7.7, urbanLEZ: 6.5, urbanOTH: 4.8, interurbanTOL: 16.4, interurbanSystems: 3.5, interurbanMTRK: 7.5, safetyOSAFE: 15.6, safetyODATA: 2.6, safetyOMAPP: 0.9 },
  2029: { urbanON: 32.5, urbanOFF: 8.8, urbanLEZ: 8.2, urbanOTH: 5.4, interurbanTOL: 20.3, interurbanSystems: 4.2, interurbanMTRK: 8.6, safetyOSAFE: 18.2, safetyODATA: 4.0, safetyOMAPP: 1.7 },
  2030: { urbanON: 39.3, urbanOFF: 10.5, urbanLEZ: 11.8, urbanOTH: 6.6, interurbanTOL: 21.0, interurbanSystems: 5.2, interurbanMTRK: 10.5, safetyOSAFE: 21.0, safetyODATA: 3.9, safetyOMAPP: 1.3 },
  2031: { urbanON: 46.0, urbanOFF: 12.3, urbanLEZ: 13.8, urbanOTH: 7.7, interurbanTOL: 24.5, interurbanSystems: 6.1, interurbanMTRK: 12.3, safetyOSAFE: 24.5, safetyODATA: 4.6, safetyOMAPP: 1.5 },
  2032: { urbanON: 53.8, urbanOFF: 14.4, urbanLEZ: 16.1, urbanOTH: 9.0, interurbanTOL: 28.7, interurbanSystems: 7.2, interurbanMTRK: 14.4, safetyOSAFE: 28.7, safetyODATA: 5.4, safetyOMAPP: 1.8 },
  2033: { urbanON: 63.0, urbanOFF: 16.8, urbanLEZ: 18.9, urbanOTH: 10.5, interurbanTOL: 33.6, interurbanSystems: 8.4, interurbanMTRK: 16.8, safetyOSAFE: 33.6, safetyODATA: 6.3, safetyOMAPP: 2.1 },
  2034: { urbanON: 73.7, urbanOFF: 19.7, urbanLEZ: 22.1, urbanOTH: 12.3, interurbanTOL: 39.3, interurbanSystems: 9.8, interurbanMTRK: 19.7, safetyOSAFE: 39.3, safetyODATA: 7.4, safetyOMAPP: 2.5 },
  2035: { urbanON: 86.3, urbanOFF: 23.0, urbanLEZ: 25.9, urbanOTH: 14.4, interurbanTOL: 46.0, interurbanSystems: 11.5, interurbanMTRK: 23.0, safetyOSAFE: 46.0, safetyODATA: 8.6, safetyOMAPP: 2.9 },
}

export default function ScenarioExplorerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [leftGraph, setLeftGraph] = useState('ebitda')
  const [rightGraph, setRightGraph] = useState('profitability')
  const [timeFrame, setTimeFrame] = useState<'5year' | '10year'>('10year')
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(
    policySliders.reduce((acc, slider) => ({ ...acc, [slider.id]: slider.defaultValue }), {})
  )
  const [chartData, setChartData] = useState(generateRevenueData(timeFrame))

  // Recalculate chart data when timeframe changes
  useEffect(() => {
    setChartData(generateRevenueData(timeFrame))
  }, [timeFrame])

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
                <div className="flex items-center gap-3">
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
                  <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as '5year' | '10year')}
                    className="text-xs px-2 py-1 rounded border"
                    style={{ backgroundColor: '#ffffff', color: '#163E64', borderColor: '#d4dfe0' }}
                  >
                    <option value="5year">5 Years (2024-2030)</option>
                    <option value="10year">10 Years (2024-2035)</option>
                  </select>
                </div>
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
                        label={{ value: 'Revenue (Million €)', angle: -90, position: 'insideLeft', fontSize: 12 }}
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
                        wrapperStyle={{ fontSize: '10px' }}
                        iconType="square"
                      />
                      {/* Urban services */}
                      <Area type="monotone" dataKey="urbanON" stackId="1" stroke={serviceLineColors.urbanON} fill={serviceLineColors.urbanON} name="Urban ON" />
                      <Area type="monotone" dataKey="urbanOFF" stackId="1" stroke={serviceLineColors.urbanOFF} fill={serviceLineColors.urbanOFF} name="Urban OFF" />
                      <Area type="monotone" dataKey="urbanLEZ" stackId="1" stroke={serviceLineColors.urbanLEZ} fill={serviceLineColors.urbanLEZ} name="Urban LEZ" />
                      <Area type="monotone" dataKey="urbanOTH" stackId="1" stroke={serviceLineColors.urbanOTH} fill={serviceLineColors.urbanOTH} name="Urban OTH" />
                      {/* Interurban services */}
                      <Area type="monotone" dataKey="interurbanTOL" stackId="1" stroke={serviceLineColors.interurbanTOL} fill={serviceLineColors.interurbanTOL} name="Interurban TOL" />
                      <Area type="monotone" dataKey="interurbanSystems" stackId="1" stroke={serviceLineColors.interurbanSystems} fill={serviceLineColors.interurbanSystems} name="Interurban Systems" />
                      <Area type="monotone" dataKey="interurbanMTRK" stackId="1" stroke={serviceLineColors.interurbanMTRK} fill={serviceLineColors.interurbanMTRK} name="Interurban M-TRK" />
                      {/* Safety & Operations services */}
                      <Area type="monotone" dataKey="safetyOSAFE" stackId="1" stroke={serviceLineColors.safetyOSAFE} fill={serviceLineColors.safetyOSAFE} name="Safety SAFE" />
                      <Area type="monotone" dataKey="safetyODATA" stackId="1" stroke={serviceLineColors.safetyODATA} fill={serviceLineColors.safetyODATA} name="Safety DATA" />
                      <Area type="monotone" dataKey="safetyOMAPP" stackId="1" stroke={serviceLineColors.safetyOMAPP} fill={serviceLineColors.safetyOMAPP} name="Safety M-APP" />
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
