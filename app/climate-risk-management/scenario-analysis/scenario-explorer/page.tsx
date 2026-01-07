"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ClimateRiskManagementSidebar from "@/components/ClimateRiskManagementSidebar"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import * as XLSX from 'xlsx'

// Graph type options
const graphOptions = [
  { id: 'ebitda', label: 'EBITDA Growth by Service Line' },
  { id: 'ebitda-table', label: 'EBITDA per Year (Table)' },
  { id: 'profitability', label: 'Profitability' },
  { id: 'liquidity', label: 'Liquidity' },
  { id: 'solvency', label: 'Solvency' },
  { id: 'operating-efficiency', label: 'Operating Efficiency' },
  { id: 'employee-health', label: 'Employee Health Risk' },
]

// EBITDA baseline data with CAGR rates
const ebitdaBaseline = [
  { serviceLine: 'On-Street', code: 'ON', baseline2024: 22.44, cagr: 9.91 },
  { serviceLine: 'Off-Street', code: 'OFF', baseline2024: 4.59, cagr: 15.23 },
  { serviceLine: 'Congestion Charging & LEZ', code: 'LEZ', baseline2024: 2.55, cagr: 29.55 },
  { serviceLine: 'Other Urban', code: 'OTH', baseline2024: 3.06, cagr: 14.27 },
  { serviceLine: 'Road User Charging (Tolling)', code: 'TOL', baseline2024: 5.61, cagr: 24.83 },
  { serviceLine: 'Intelligent Traffic Systems', code: 'Systems', baseline2024: 1.53, cagr: 23.78 },
  { serviceLine: 'Mowiz Truck', code: 'M-TRK', baseline2024: 3.57, cagr: 20.15 },
  { serviceLine: 'Road Safety', code: 'SAFE', baseline2024: 7.14, cagr: 19.91 },
  { serviceLine: 'SaaS Data-Centric Solutions', code: 'DATA', baseline2024: 0.26, cagr: 35.41 },
  { serviceLine: 'Mowiz App', code: 'M-APP', baseline2024: 0.26, cagr: 35.41 },
]

// Policy impact database: How each slider position affects each service line's CAGR
const policyImpacts = {
  'combustion-phaseout': {
    0: { // Very Low
      'On-Street': 0, 'Off-Street': 0, 'Congestion Charging & LEZ': 0, 'Other Urban': 0,
      'Road User Charging (Tolling)': 0, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': 0, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    },
    1: { // Low
      'On-Street': -1.8, 'Off-Street': -1.8, 'Congestion Charging & LEZ': 0, 'Other Urban': 0,
      'Road User Charging (Tolling)': -1.8, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': -1.8, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    },
    2: { // Medium
      'On-Street': -3.6, 'Off-Street': -3.6, 'Congestion Charging & LEZ': 0, 'Other Urban': 0,
      'Road User Charging (Tolling)': -3.6, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': -3.6, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    },
    3: { // High
      'On-Street': -5.4, 'Off-Street': -5.4, 'Congestion Charging & LEZ': 0, 'Other Urban': 0,
      'Road User Charging (Tolling)': -5.4, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': -5.4, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    },
    4: { // Very High
      'On-Street': -7.1, 'Off-Street': -7.1, 'Congestion Charging & LEZ': 0, 'Other Urban': 0,
      'Road User Charging (Tolling)': -7.1, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': -7.1, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    }
  },
  'traffic-mgmt': {
    0: { // Very Low: -10% LEZ growth
      'On-Street': 0, 'Off-Street': 0, 'Congestion Charging & LEZ': -10, 'Other Urban': 0,
      'Road User Charging (Tolling)': 0, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': 0, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    },
    1: { // Low: -5% LEZ growth
      'On-Street': 0, 'Off-Street': 0, 'Congestion Charging & LEZ': -5, 'Other Urban': 0,
      'Road User Charging (Tolling)': 0, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': 0, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    },
    2: { // Medium: LEZ growth matches the existing forecast (baseline)
      'On-Street': 0, 'Off-Street': 0, 'Congestion Charging & LEZ': 0, 'Other Urban': 0,
      'Road User Charging (Tolling)': 0, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': 0, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    },
    3: { // High: +5% LEZ growth
      'On-Street': 0, 'Off-Street': 0, 'Congestion Charging & LEZ': 5, 'Other Urban': 0,
      'Road User Charging (Tolling)': 0, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': 0, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    },
    4: { // Very High: +10% LEZ growth
      'On-Street': 0, 'Off-Street': 0, 'Congestion Charging & LEZ': 10, 'Other Urban': 0,
      'Road User Charging (Tolling)': 0, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': 0, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    }
  },
  'operating-deterioration': {
    0: { // Very Low: 0%
      'On-Street': 0, 'Off-Street': 0, 'Congestion Charging & LEZ': 0, 'Other Urban': 0,
      'Road User Charging (Tolling)': 0, 'Intelligent Traffic Systems': 0, 'Mowiz Truck': 0,
      'Road Safety': 0, 'SaaS Data-Centric Solutions': 0, 'Mowiz App': 0
    },
    1: { // Low: -0.25%
      'On-Street': -0.25, 'Off-Street': -0.25, 'Congestion Charging & LEZ': -0.25, 'Other Urban': -0.25,
      'Road User Charging (Tolling)': -0.25, 'Intelligent Traffic Systems': -0.25, 'Mowiz Truck': -0.25,
      'Road Safety': -0.25, 'SaaS Data-Centric Solutions': -0.25, 'Mowiz App': -0.25
    },
    2: { // Medium: -0.5%
      'On-Street': -0.5, 'Off-Street': -0.5, 'Congestion Charging & LEZ': -0.5, 'Other Urban': -0.5,
      'Road User Charging (Tolling)': -0.5, 'Intelligent Traffic Systems': -0.5, 'Mowiz Truck': -0.5,
      'Road Safety': -0.5, 'SaaS Data-Centric Solutions': -0.5, 'Mowiz App': -0.5
    },
    3: { // High: -0.75%
      'On-Street': -0.75, 'Off-Street': -0.75, 'Congestion Charging & LEZ': -0.75, 'Other Urban': -0.75,
      'Road User Charging (Tolling)': -0.75, 'Intelligent Traffic Systems': -0.75, 'Mowiz Truck': -0.75,
      'Road Safety': -0.75, 'SaaS Data-Centric Solutions': -0.75, 'Mowiz App': -0.75
    },
    4: { // Very High: -1%
      'On-Street': -1, 'Off-Street': -1, 'Congestion Charging & LEZ': -1, 'Other Urban': -1,
      'Road User Charging (Tolling)': -1, 'Intelligent Traffic Systems': -1, 'Mowiz Truck': -1,
      'Road Safety': -1, 'SaaS Data-Centric Solutions': -1, 'Mowiz App': -1
    }
  }
}

// Calculate EBITDA for a given year using CAGR
const calculateEBITDA = (baseline: number, cagr: number, yearsFromBaseline: number): number => {
  return baseline * Math.pow(1 + (cagr / 100), yearsFromBaseline)
}

// Generate EBITDA projection table data with policy impacts
const generateEBITDATable = (sliderValues: Record<string, number> = {}) => {
  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]
  
  const tableData = ebitdaBaseline.map(service => {
    const row: any = {
      serviceLine: service.serviceLine,
      code: service.code,
      cagr: service.cagr // This is just for reference, we'll store year-specific CAGRs
    }
    
    // Calculate year-by-year with proper compounding
    let previousYearEBITDA = service.baseline2024
    
    years.forEach((year, yearIdx) => {
      // Calculate effective CAGR for THIS specific year by adding ALL active policy impacts
      let effectiveCAGR = service.cagr
      
      // Loop through all policies and climate impacts and apply their impacts for this year
      Object.keys(policyImpacts).forEach(policyId => {
        const policyLevel = sliderValues[policyId] ?? 0
        const allSliders = [...policySliders, ...climateSliders]
        const policy = allSliders.find(p => p.id === policyId)
        const policyStartYear = policy?.startYear ?? 2024
        
        // Only apply impact if we're at or past the policy start year
        if (year >= policyStartYear) {
          const policyData = policyImpacts[policyId as keyof typeof policyImpacts]
          if (policyData && typeof policyData === 'object') {
            const levelData = (policyData as any)[policyLevel]
            if (levelData && typeof levelData === 'object') {
              const impact = (levelData as any)[service.serviceLine] || 0
              effectiveCAGR += impact
            }
          }
        }
      })
      
      // Store the effective CAGR for this year
      row[`cagr${year}`] = effectiveCAGR
      
      // Calculate EBITDA for this year: Previous year × (1 + this year's CAGR / 100)
      if (yearIdx === 0) {
        // 2024 is the baseline
        row[`year${year}`] = service.baseline2024
        previousYearEBITDA = service.baseline2024
      } else {
        // Year N = Year N-1 × (1 + CAGR_N / 100)
        const currentYearEBITDA = previousYearEBITDA * (1 + effectiveCAGR / 100)
        row[`year${year}`] = currentYearEBITDA
        previousYearEBITDA = currentYearEBITDA
      }
    })
    
    return row
  })
  
  // Add total row
  const totalRow: any = {
    serviceLine: 'Total',
    code: 'TOTAL',
    cagr: null
  }
  
  years.forEach(year => {
    totalRow[`year${year}`] = tableData.reduce((sum, row) => sum + row[`year${year}`], 0)
  })
  
  return { tableData, totalRow, years }
}

// Slider level options (discrete positions)
const sliderLevels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'] as const
type SliderLevel = typeof sliderLevels[number]

// Policy slider configuration with assumptions
const policySliders = [
  { 
    id: 'combustion-phaseout', 
    label: 'Combustion Engine Phase Out',
    description: 'Restrictions on combustion engine vehicle production and sales, transitioning to zero-emission vehicles.',
    assumptions: 'Percentage of combustion engine production/sales restricted per year. Fleet turnover: 7 years (14% renewed annually). Of vehicles retired: 50% replaced with zero-emission vehicles, 50% not replaced.',
    startYear: 2026,
    levelDefinitions: {
      0: { label: 'None', percentage: 0, description: 'No restrictions on combustion engine sales' },
      1: { label: 'Low', percentage: 25, description: '25% of new vehicle sales must be zero-emission' },
      2: { label: 'Medium', percentage: 50, description: '50% of new vehicle sales must be zero-emission' },
      3: { label: 'High', percentage: 75, description: '75% of new vehicle sales must be zero-emission' },
      4: { label: 'Very High', percentage: 100, description: '100% of new vehicle sales must be zero-emission' }
    },
    fleetAssumptions: {
      turnoverYears: 7,
      annualRenewalRate: 14,
      zeroEmissionReplacementRate: 50,
      notReplacedRate: 50
    }
  },
  { 
    id: 'traffic-mgmt', 
    label: 'LEZ and Congestion Charging',
    description: 'Low Emission Zones and congestion charging schemes to manage urban traffic and reduce emissions.',
    assumptions: 'Implementation of urban access restrictions and pricing mechanisms to discourage high-emission vehicle use.',
    startYear: 2025,
    defaultValue: 2 // Medium matches baseline scenario
  },
  { 
    id: 'ev-promotion', 
    label: 'EV Promotion',
    description: 'Incentives and subsidies for electric vehicle adoption.',
    assumptions: 'Includes purchase incentives, tax benefits, and charging infrastructure development.',
    startYear: 2024
  },
  { 
    id: 'active-transport', 
    label: 'Active Transport',
    description: 'Infrastructure for walking, cycling, and other non-motorized transport.',
    assumptions: 'Requires urban planning changes and dedicated infrastructure investment.',
    startYear: 2025
  },
  { 
    id: 'carbon-pricing', 
    label: 'Carbon Pricing',
    description: 'Tax or fee on carbon emissions from transportation and fuel use.',
    assumptions: 'Price increases annually to incentivize emissions reduction.',
    startYear: 2026
  },
  { 
    id: 'public-transport', 
    label: 'Public Transport',
    description: 'Expansion and improvement of public transportation networks.',
    assumptions: 'Includes new routes, frequency improvements, and fleet modernization.',
    startYear: 2025
  },
  { 
    id: 'autonomous-vehicles', 
    label: 'Autonomous Vehicles',
    description: 'Support for autonomous and shared mobility services.',
    assumptions: 'Technology adoption curve assumes gradual regulatory approval.',
    startYear: 2027
  },
  { 
    id: 'alternative-fuels', 
    label: 'Alternative Fuels',
    description: 'Promotion of hydrogen, biofuels, and other alternative fuel sources.',
    assumptions: 'Requires fuel production infrastructure and vehicle compatibility.',
    startYear: 2026
  },
]

// Climate slider configuration
const climateSliders = [
  { 
    id: 'operating-deterioration', 
    label: 'Deterioration of our Operating Environment',
    description: 'Climate-driven deterioration affecting business operations, infrastructure, and service delivery.',
    assumptions: 'Uniform impact across all service lines. Reflects cumulative effects of temperature rise, extreme weather, and environmental changes.',
    startYear: 2026,
    defaultValue: 0 // Very Low (0% impact)
  },
]

// Generate chart data from the same EBITDA calculation used by the table
const generateChartData = (timeFrame: '5year' | '10year', sliderValues: Record<string, number> = {}) => {
  const { tableData, years: allYears } = generateEBITDATable(sliderValues)
  const endYear = timeFrame === '5year' ? 2030 : 2035
  const years = allYears.filter(year => year <= endYear)
  
  // Transform table data into chart format
  return years.map(year => {
    const chartRow: any = { year }
    
    // Map each service line to its chart data key
    const serviceLineMapping: Record<string, string> = {
      'On-Street': 'urbanON',
      'Off-Street': 'urbanOFF',
      'Congestion Charging & LEZ': 'urbanLEZ',
      'Other Urban': 'urbanOTH',
      'Road User Charging (Tolling)': 'interurbanTOL',
      'Intelligent Traffic Systems': 'interurbanSystems',
      'Mowiz Truck': 'interurbanMTRK',
      'Road Safety': 'safetyOSAFE',
      'SaaS Data-Centric Solutions': 'safetyODATA',
      'Mowiz App': 'safetyOMAPP'
    }
    
    tableData.forEach(row => {
      const chartKey = serviceLineMapping[row.serviceLine]
      if (chartKey) {
        chartRow[chartKey] = row[`year${year}`]
      }
    })
    
    return chartRow
  })
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
  const [rightGraph, setRightGraph] = useState('ebitda-table')
  const [timeFrame, setTimeFrame] = useState<'5year' | '10year'>('10year')
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
    // Initialize both policy and climate sliders
    const allSliders = [...policySliders, ...climateSliders]
    return allSliders.reduce((acc, slider) => ({ 
      ...acc, 
      [slider.id]: ('defaultValue' in slider && slider.defaultValue !== undefined) ? slider.defaultValue : 0 
    }), {})
  })
  const [chartData, setChartData] = useState(() => generateChartData(timeFrame, sliderValues))
  const [selectedSliderForAssumptions, setSelectedSliderForAssumptions] = useState<string | null>(null)

  // Recalculate chart data when timeframe or slider values change
  useEffect(() => {
    setChartData(generateChartData(timeFrame, sliderValues))
  }, [timeFrame, sliderValues])

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
      [slider.id]: ('defaultValue' in slider && slider.defaultValue !== undefined) ? slider.defaultValue : 0
    }), {})
    setSliderValues(prev => ({ ...prev, ...resetValues }))
  }

  const resetClimateSliders = () => {
    const resetValues = climateSliders.reduce((acc, slider) => ({ 
      ...acc, 
      [slider.id]: ('defaultValue' in slider && slider.defaultValue !== undefined) ? slider.defaultValue : 0
    }), {})
    setSliderValues(prev => ({ ...prev, ...resetValues }))
  }

  const exportToExcel = () => {
    const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]
    const wb = XLSX.utils.book_new()
    const data: any[][] = []
    let row = 0
    
    // Helper to convert column index to Excel letter (0=A, 1=B, etc.)
    const colToLetter = (col: number): string => {
      let letter = ''
      while (col >= 0) {
        letter = String.fromCharCode((col % 26) + 65) + letter
        col = Math.floor(col / 26) - 1
      }
      return letter
    }
    
    // STEP 1: Build all sections with placeholders, track row numbers
    let netAdjustedEbitdaStartRow = 0
    let netAdjustedCAGRStartRow = 0
    let baselineCAGRStartRow = 0
    const policyCAGRStartRows: number[] = []
    
    // Section 1: NET ADJUSTED CAGR AND EBITDA
    data[row++] = ['NET ADJUSTED CAGR AND EBITDA']
    data[row++] = []
    data[row++] = []
    data[row] = ['Service Line']
    years.forEach(year => {
      data[row].push(`${year} EBITDA`, `${year} CAGR`)
    })
    row++
    
    netAdjustedEbitdaStartRow = row
    ebitdaBaseline.forEach((service) => {
      const serviceRow: any[] = [service.serviceLine]
      years.forEach(() => {
        serviceRow.push('PLACEHOLDER_EBITDA', 'PLACEHOLDER_CAGR') // Will fill with formulas later
      })
      data[row++] = serviceRow
    })
    
    const ebitdaTotalRow = row
    data[row] = ['Total']
    years.forEach(() => {
      data[row].push('PLACEHOLDER_TOTAL', '-')
    })
    row++
    
    // Section 2: NET ADJUSTED CAGR
    row += 2
    data[row++] = ['NET ADJUSTED CAGR']
    data[row++] = []
    data[row++] = []
    data[row] = ['Service Line']
    years.forEach(year => data[row].push(`${year} CAGR`))
    row++
    
    netAdjustedCAGRStartRow = row
    ebitdaBaseline.forEach(() => {
      const serviceRow: any[] = [ebitdaBaseline[0].serviceLine] // Placeholder
      years.forEach(() => serviceRow.push('PLACEHOLDER_NET_CAGR'))
      data[row++] = serviceRow
    })
    
    // Section 3: BASELINE CAGR
    row += 2
    data[row++] = ['BASELINE CAGR']
    data[row++] = []
    data[row++] = []
    data[row] = ['Service Line']
    years.forEach(year => data[row].push(`${year} CAGR`))
    row++
    
    baselineCAGRStartRow = row
    ebitdaBaseline.forEach(service => {
      const serviceRow: any[] = [service.serviceLine]
      years.forEach(() => serviceRow.push(service.cagr)) // Static values
      data[row++] = serviceRow
    })
    
    // Section 4+: Individual Policy and Climate Sections
    const allSliders = [...policySliders, ...climateSliders]
    allSliders.forEach((policy) => {
      row += 2
      data[row++] = [policy.label.toUpperCase()]
      data[row++] = ['Current slider setting:', sliderLevels[sliderValues[policy.id]]]
      data[row++] = ['Impacts of this slider setting on CAGR of various service lines']
      data[row++] = []
      data[row] = ['Service Line']
      years.forEach(year => data[row].push(`${year} CAGR`))
      row++
      
      policyCAGRStartRows.push(row) // Track the start row for this policy's data
      
      ebitdaBaseline.forEach(service => {
        const serviceRow: any[] = [service.serviceLine]
        years.forEach(year => {
          const policyLevel = sliderValues[policy.id] ?? 0
          const policyStartYear = policy.startYear ?? 2024
          let impact = 0
          
          if (year >= policyStartYear) {
            const policyData = policyImpacts[policy.id as keyof typeof policyImpacts]
            if (policyData && typeof policyData === 'object') {
              const levelData = (policyData as any)[policyLevel]
              if (levelData && typeof levelData === 'object') {
                impact = (levelData as any)[service.serviceLine] || 0
              }
            }
          }
          serviceRow.push(impact) // Static impact values
        })
        data[row++] = serviceRow
      })
    })
    
    // STEP 2: Now fill in formulas with correct row references
    // Fill NET ADJUSTED CAGR formulas (Baseline + all policies + all climate)
    ebitdaBaseline.forEach((service, serviceIdx) => {
      const netCAGRRow = netAdjustedCAGRStartRow + serviceIdx
      data[netCAGRRow][0] = service.serviceLine // Update service name
      
      years.forEach((year, yearIdx) => {
        const yearCol = colToLetter(1 + yearIdx)
        const baselineRow = baselineCAGRStartRow + serviceIdx
        
        // Formula: Baseline + Policy1 + Policy2 + Climate1 + ...
        // Excel is 1-indexed, so add 1 to all row numbers
        let formula = `${yearCol}${baselineRow + 1}`
        
        allSliders.forEach((policy, policyIdx) => {
          const policyDataRow = policyCAGRStartRows[policyIdx] + serviceIdx
          formula += `+${yearCol}${policyDataRow + 1}`
        })
        
        data[netCAGRRow][1 + yearIdx] = { f: formula }
      })
    })
    
    // Fill Section 1 EBITDA and CAGR values
    ebitdaBaseline.forEach((service, serviceIdx) => {
      const ebitdaRow = netAdjustedEbitdaStartRow + serviceIdx
      
      years.forEach((year, yearIdx) => {
        const ebitdaCol = colToLetter(1 + (yearIdx * 2))
        const cagrCol = colToLetter(2 + (yearIdx * 2))
        const netCAGRCol = colToLetter(1 + yearIdx)
        const netCAGRRow = netAdjustedCAGRStartRow + serviceIdx
        
        // EBITDA Formula: Each year = Previous year * (1 + This year's CAGR/100)
        let ebitdaFormula
        if (yearIdx === 0) {
          // 2024 = baseline
          ebitdaFormula = service.baseline2024
        } else {
          // 2025+ = Previous year EBITDA * (1 + This year's CAGR/100)
          const prevEbitdaCol = colToLetter(1 + ((yearIdx - 1) * 2))
          ebitdaFormula = { f: `${prevEbitdaCol}${ebitdaRow + 1}*(1+${cagrCol}${ebitdaRow + 1}/100)` }
        }
        
        data[ebitdaRow][1 + (yearIdx * 2)] = ebitdaFormula
        // CAGR Reference to NET ADJUSTED CAGR section
        data[ebitdaRow][2 + (yearIdx * 2)] = { f: `${netCAGRCol}${netCAGRRow + 1}` }
      })
    })
    
    // Fill Total row formulas
    years.forEach((year, yearIdx) => {
      const ebitdaCol = colToLetter(1 + (yearIdx * 2))
      data[ebitdaTotalRow][1 + (yearIdx * 2)] = { f: `SUM(${ebitdaCol}${netAdjustedEbitdaStartRow+1}:${ebitdaCol}${ebitdaTotalRow})` }
    })
    
    const ws = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'EBITDA Calculation')
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `EBITDA_Scenario_Export_${timestamp}.xlsx`
    
    // Write file
    XLSX.writeFile(wb, filename)
  }

  const openAssumptions = (sliderId: string) => {
    setSelectedSliderForAssumptions(sliderId)
  }

  const closeAssumptions = () => {
    setSelectedSliderForAssumptions(null)
  }

  const selectedSlider = selectedSliderForAssumptions 
    ? [...policySliders, ...climateSliders].find(s => s.id === selectedSliderForAssumptions)
    : null

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4" style={{ height: '50vh' }}>
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
                  <button
                    onClick={exportToExcel}
                    className="text-xs px-3 py-1 rounded border transition-colors font-medium"
                    style={{ backgroundColor: '#10b981', color: '#ffffff', borderColor: '#10b981' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    title="Export detailed calculation breakdown to Excel"
                  >
                    📊 Export to Excel
                  </button>
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
                        domain={[0, timeFrame === '5year' ? 160 : 400]}
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
                {leftGraph === 'ebitda-table' && (() => {
                  const { tableData, totalRow, years } = generateEBITDATable(sliderValues)
                  return (
                    <div 
                      className="h-full border rounded" 
                      style={{ 
                        borderColor: '#d4dfe0',
                        overflow: 'auto',
                        scrollbarWidth: 'thin', // For Firefox
                        scrollbarColor: '#163E64 #e5e7eb' // For Firefox
                      }}
                    >
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          width: 12px;
                          height: 12px;
                        }
                        div::-webkit-scrollbar-track {
                          background: #e5e7eb;
                          border-radius: 6px;
                        }
                        div::-webkit-scrollbar-thumb {
                          background: #163E64;
                          border-radius: 6px;
                        }
                        div::-webkit-scrollbar-thumb:hover {
                          background: #0B1F32;
                        }
                      `}</style>
                      <table className="text-xs border-collapse" style={{ minWidth: '1400px' }}>
                        <thead className="sticky top-0 bg-white" style={{ zIndex: 10 }}>
                          <tr>
                            <th rowSpan={2} className="border px-2 py-0.5 text-left font-semibold text-[10px] whitespace-nowrap sticky left-0" style={{ backgroundColor: '#163E64', color: '#ffffff', zIndex: 20 }}>Service Line</th>
                            {years.map(year => (
                              <th key={year} colSpan={2} className="border px-1 py-0.5 text-center font-semibold text-[10px]" style={{ backgroundColor: '#163E64', color: '#ffffff' }}>
                                {year}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            {years.map(year => (
                              <>
                                <th key={`${year}-ebitda`} className="border px-1 py-0.5 text-center font-semibold text-[9px]" style={{ backgroundColor: '#163E64', color: '#ffffff' }}>EBITDA</th>
                                <th key={`${year}-cagr`} className="border px-1 py-0.5 text-center font-semibold text-[9px]" style={{ backgroundColor: '#163E64', color: '#ffffff' }}>CAGR</th>
                              </>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="border px-2 py-0.5 text-left font-medium text-[10px] whitespace-nowrap sticky left-0" style={{ color: '#163E64', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb', zIndex: 5 }}>{row.serviceLine}</td>
                              {years.map(year => (
                                <>
                                  <td key={`${year}-ebitda`} className="border px-1 py-0.5 text-right font-mono text-[10px]">
                                    €{row[`year${year}`].toFixed(2)}
                                  </td>
                                  <td key={`${year}-cagr`} className="border px-1 py-0.5 text-right text-[10px]">
                                    {row[`cagr${year}`].toFixed(2)}%
                                  </td>
                                </>
                              ))}
                            </tr>
                          ))}
                          <tr className="font-bold" style={{ backgroundColor: '#E8F0F2' }}>
                            <td className="border px-2 py-0.5 text-left text-[10px] whitespace-nowrap sticky left-0" style={{ color: '#0B1F32', backgroundColor: '#E8F0F2', zIndex: 5 }}>{totalRow.serviceLine}</td>
                            {years.map(year => (
                              <>
                                <td key={`${year}-ebitda`} className="border px-1 py-0.5 text-right font-mono text-[10px]" style={{ color: '#0B1F32' }}>
                                  €{totalRow[`year${year}`].toFixed(2)}
                                </td>
                                <td key={`${year}-cagr`} className="border px-1 py-0.5 text-right text-[10px]" style={{ color: '#0B1F32' }}>
                                  -
                                </td>
                              </>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                })()}
                {leftGraph !== 'ebitda' && leftGraph !== 'ebitda-table' && (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Chart data coming soon...
                  </div>
                )}
              </div>
            </div>

            {/* Right Graph */}
            <div className="flex flex-col bg-gray-50 rounded-lg p-4 border" style={{ borderColor: '#d4dfe0' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
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
                {rightGraph === 'ebitda' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 11 }}
                        label={{ value: 'Year', position: 'insideBottom', offset: -10, fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, timeFrame === '5year' ? 160 : 400]}
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
                {rightGraph === 'ebitda-table' && (() => {
                  const { tableData, totalRow, years } = generateEBITDATable(sliderValues)
                  return (
                    <div 
                      className="h-full border rounded" 
                      style={{ 
                        borderColor: '#d4dfe0',
                        overflow: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#163E64 #e5e7eb'
                      }}
                    >
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          width: 12px;
                          height: 12px;
                        }
                        div::-webkit-scrollbar-track {
                          background: #e5e7eb;
                          border-radius: 6px;
                        }
                        div::-webkit-scrollbar-thumb {
                          background: #163E64;
                          border-radius: 6px;
                        }
                        div::-webkit-scrollbar-thumb:hover {
                          background: #0B1F32;
                        }
                      `}</style>
                      <table className="text-xs border-collapse" style={{ minWidth: '1400px' }}>
                        <thead className="sticky top-0 bg-white" style={{ zIndex: 10 }}>
                          <tr>
                            <th rowSpan={2} className="border px-2 py-0.5 text-left font-semibold text-[10px] whitespace-nowrap sticky left-0" style={{ backgroundColor: '#163E64', color: '#ffffff', zIndex: 20 }}>Service Line</th>
                            {years.map(year => (
                              <th key={year} colSpan={2} className="border px-1 py-0.5 text-center font-semibold text-[10px]" style={{ backgroundColor: '#163E64', color: '#ffffff' }}>
                                {year}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            {years.map(year => (
                              <>
                                <th key={`${year}-ebitda`} className="border px-1 py-0.5 text-center font-semibold text-[9px]" style={{ backgroundColor: '#163E64', color: '#ffffff' }}>EBITDA</th>
                                <th key={`${year}-cagr`} className="border px-1 py-0.5 text-center font-semibold text-[9px]" style={{ backgroundColor: '#163E64', color: '#ffffff' }}>CAGR</th>
                              </>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="border px-2 py-0.5 text-left font-medium text-[10px] whitespace-nowrap sticky left-0" style={{ color: '#163E64', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb', zIndex: 5 }}>{row.serviceLine}</td>
                              {years.map(year => (
                                <>
                                  <td key={`${year}-ebitda`} className="border px-1 py-0.5 text-right font-mono text-[10px]">
                                    €{row[`year${year}`].toFixed(2)}
                                  </td>
                                  <td key={`${year}-cagr`} className="border px-1 py-0.5 text-right text-[10px]">
                                    {row[`cagr${year}`].toFixed(2)}%
                                  </td>
                                </>
                              ))}
                            </tr>
                          ))}
                          <tr className="font-bold" style={{ backgroundColor: '#E8F0F2' }}>
                            <td className="border px-2 py-0.5 text-left text-[10px] whitespace-nowrap sticky left-0" style={{ color: '#0B1F32', backgroundColor: '#E8F0F2', zIndex: 5 }}>{totalRow.serviceLine}</td>
                            {years.map(year => (
                              <>
                                <td key={`${year}-ebitda`} className="border px-1 py-0.5 text-right font-mono text-[10px]" style={{ color: '#0B1F32' }}>
                                  €{totalRow[`year${year}`].toFixed(2)}
                                </td>
                                <td key={`${year}-cagr`} className="border px-1 py-0.5 text-right text-[10px]" style={{ color: '#0B1F32' }}>
                                  -
                                </td>
                              </>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                })()}
                {rightGraph !== 'ebitda' && rightGraph !== 'ebitda-table' && (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Chart data coming soon...
                  </div>
                )}
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

              <div className="space-y-3">
                {policySliders.map(slider => (
                  <div key={slider.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium" style={{ color: '#163E64' }}>
                          {slider.label}
                        </label>
                        <button
                          onClick={() => openAssumptions(slider.id)}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                          title="View assumptions"
                        >
                          ⋮
                        </button>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: '#163E64' }}>
                        {sliderLevels[sliderValues[slider.id]]}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={4}
                        step={1}
                        value={sliderValues[slider.id]}
                        onChange={(e) => handleSliderChange(slider.id, parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #FF5B35 0%, #FF5B35 ${(sliderValues[slider.id] / 4) * 100}%, #d4dfe0 ${(sliderValues[slider.id] / 4) * 100}%, #d4dfe0 100%)`
                        }}
                      />
                      <div className="flex justify-between mt-1 text-[10px]" style={{ color: '#6C757D' }}>
                        {sliderLevels.map((level, index) => (
                          <span key={level} className={sliderValues[slider.id] === index ? 'font-semibold' : ''}>
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Climate/Environmental Conditions */}
            <div className="bg-gray-50 rounded-lg p-4 border overflow-y-auto" style={{ borderColor: '#d4dfe0' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: '#0B1F32' }}>Climate & Environmental Conditions</h3>
                <button
                  onClick={resetClimateSliders}
                  className="text-xs px-3 py-1 rounded transition-colors"
                  style={{ backgroundColor: '#163E64', color: '#ffffff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0B1F32'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#163E64'}
                >
                  Reset All
                </button>
              </div>
              
              <div className="space-y-3">
                {climateSliders.map(slider => (
                  <div key={slider.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium" style={{ color: '#163E64' }}>
                          {slider.label}
                        </label>
                        <button
                          onClick={() => openAssumptions(slider.id)}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                          title="View assumptions"
                        >
                          ⋮
                        </button>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: '#163E64' }}>
                        {sliderLevels[sliderValues[slider.id]]}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={4}
                        step={1}
                        value={sliderValues[slider.id]}
                        onChange={(e) => handleSliderChange(slider.id, parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #FF5B35 0%, #FF5B35 ${(sliderValues[slider.id] / 4) * 100}%, #d4dfe0 ${(sliderValues[slider.id] / 4) * 100}%, #d4dfe0 100%)`
                        }}
                      />
                      <div className="flex justify-between mt-1 text-[10px]" style={{ color: '#6C757D' }}>
                        {sliderLevels.map((level, index) => (
                          <span key={level} className={sliderValues[slider.id] === index ? 'font-semibold' : ''}>
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Assumptions Popup Panel - Slides up from bottom */}
        {selectedSliderForAssumptions && selectedSlider && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={closeAssumptions}
            />
            
            {/* Popup Panel */}
            <div 
              className="fixed bottom-0 left-0 right-0 bg-white border-t-2 shadow-2xl z-50 animate-slide-up"
              style={{ 
                borderColor: '#163E64',
                maxHeight: '60vh',
                animation: 'slideUp 0.3s ease-out'
              }}
            >
              <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#0B1F32' }}>
                      {selectedSlider.label}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      {selectedSlider.description}
                    </p>
                  </div>
                  <button
                    onClick={closeAssumptions}
                    className="text-2xl text-gray-400 hover:text-gray-600 ml-4"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Level Definitions and Settings */}
                  <div className="space-y-4">
                    {/* Level Definitions - only for Combustion Engine Phase Out */}
                    {'levelDefinitions' in selectedSlider && selectedSlider.levelDefinitions && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3" style={{ color: '#163E64' }}>
                          Policy Level Definitions
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(selectedSlider.levelDefinitions).map(([key, level]: [string, any]) => (
                            <div 
                              key={key} 
                              className={`p-2 rounded border ${sliderValues[selectedSlider.id] === parseInt(key) ? 'bg-orange-50' : 'bg-white'}`}
                              style={{ borderColor: sliderValues[selectedSlider.id] === parseInt(key) ? '#FF5B35' : '#d4dfe0' }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold" style={{ color: '#163E64' }}>
                                  {level.label}
                                </span>
                                <span className="text-sm font-bold" style={{ color: '#FF5B35' }}>
                                  {level.percentage}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {level.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold mb-2" style={{ color: '#163E64' }}>
                        Implementation Start Year
                      </h3>
                      <input
                        type="number"
                        min={2024}
                        max={2035}
                        defaultValue={selectedSlider.startYear}
                        className="w-32 px-3 py-2 border rounded text-sm"
                        style={{ borderColor: '#d4dfe0' }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Year when policy implementation begins
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2" style={{ color: '#163E64' }}>
                        Current Setting
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold" style={{ color: '#FF5B35' }}>
                          {sliderLevels[sliderValues[selectedSlider.id]]}
                        </span>
                        {'levelDefinitions' in selectedSlider && selectedSlider.levelDefinitions && (
                          <span className="text-sm font-semibold" style={{ color: '#163E64' }}>
                            ({(selectedSlider.levelDefinitions as any)[sliderValues[selectedSlider.id]]?.percentage}% Phase Out)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Fleet Assumptions or General Info */}
                  <div className="space-y-4">
                    {/* Fleet Assumptions - only for Combustion Engine Phase Out */}
                    {'fleetAssumptions' in selectedSlider && selectedSlider.fleetAssumptions && (
                      <div className="bg-blue-50 rounded-lg p-4 border" style={{ borderColor: '#4682B4' }}>
                        <h3 className="text-sm font-semibold mb-3" style={{ color: '#163E64' }}>
                          Fleet Turnover Assumptions
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start gap-2">
                            <span className="font-bold min-w-[120px]" style={{ color: '#163E64' }}>
                              Turnover Period:
                            </span>
                            <span className="text-gray-700">
                              {selectedSlider.fleetAssumptions?.turnoverYears} years
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-bold min-w-[120px]" style={{ color: '#163E64' }}>
                              Annual Renewal:
                            </span>
                            <span className="text-gray-700">
                              {selectedSlider.fleetAssumptions?.annualRenewalRate}% of fleet per year
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-bold min-w-[120px]" style={{ color: '#163E64' }}>
                              ZEV Replacement:
                            </span>
                            <span className="text-gray-700">
                              {selectedSlider.fleetAssumptions?.zeroEmissionReplacementRate}% replaced with zero-emission vehicles
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-bold min-w-[120px]" style={{ color: '#163E64' }}>
                              Not Replaced:
                            </span>
                            <span className="text-gray-700">
                              {selectedSlider.fleetAssumptions?.notReplacedRate}% not replaced (fleet reduction)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* General Impact Info - for all policies */}
                    <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: '#d4dfe0' }}>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#163E64' }}>
                        Revenue Impact Overview
                      </h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>• Urban services: Moderate to High impact</p>
                        <p>• Interurban services: Low to Moderate impact</p>
                        <p>• Safety & Operations: Moderate impact</p>
                        <p>• Implementation timeline: 3-5 years</p>
                        <p>• Adoption curve: S-curve trajectory</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add animation CSS */}
            <style jsx>{`
              @keyframes slideUp {
                from {
                  transform: translateY(100%);
                }
                to {
                  transform: translateY(0);
                }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  )
}
