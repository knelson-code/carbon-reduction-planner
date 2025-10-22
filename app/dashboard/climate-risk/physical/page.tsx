'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PhysicalRiskPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Dice roll data - outcomes 2-12 (two dice)
  const [regularRolls, setRegularRolls] = useState<number[]>(Array(11).fill(0)) // indices 0-10 represent rolls 2-12
  const [climateRolls, setClimateRolls] = useState<number[]>(Array(11).fill(0))
  const [regularTotal, setRegularTotal] = useState(0)
  const [climateTotal, setClimateTotal] = useState(0)
  const [climateEnabled, setClimateEnabled] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Enable climate dice after enough regular rolls
  useEffect(() => {
    if (regularTotal >= 100 && !climateEnabled) {
      setClimateEnabled(true)
    }
  }, [regularTotal, climateEnabled])

  if (status === 'loading' || !session || !isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-[#0B1F32]">Loading...</div>
      </div>
    )
  }

  // Simulate rolling two regular dice
  const rollRegularDice = () => {
    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    const sum = die1 + die2
    return sum // returns 2-12
  }

  // Simulate rolling two loaded dice (shifted higher by 1-2)
  const rollClimateDice = () => {
    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    let sum = die1 + die2
    
    // Add climate shift - 50% chance to add 1, 30% chance to add 2
    const shift = Math.random()
    if (shift < 0.5) sum += 1
    else if (shift < 0.8) sum += 2
    
    return Math.min(sum, 12) // cap at 12 for display
  }

  const handleRollRegular = (times: number) => {
    const newRolls = [...regularRolls]
    for (let i = 0; i < times; i++) {
      const roll = rollRegularDice()
      newRolls[roll - 2]++ // convert roll value (2-12) to index (0-10)
    }
    setRegularRolls(newRolls)
    setRegularTotal(regularTotal + times)
  }

  const handleRollClimate = (times: number) => {
    if (!climateEnabled) {
      alert('Please roll the regular dice first to establish a baseline')
      return
    }
    const newRolls = [...climateRolls]
    for (let i = 0; i < times; i++) {
      const roll = rollClimateDice()
      newRolls[roll - 2]++
    }
    setClimateRolls(newRolls)
    setClimateTotal(times) // Set to match regular total, not add
  }

  const handleReset = () => {
    setRegularRolls(Array(11).fill(0))
    setClimateRolls(Array(11).fill(0))
    setRegularTotal(0)
    setClimateTotal(0)
    setClimateEnabled(false)
  }

  const handleComplete = async () => {
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: 'climate-risk-physical',
          completed: true,
        }),
      })

      await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: 50 }),
      })

      window.dispatchEvent(new Event('scoreUpdated'))
      setIsCompleted(true)

      // Play completion sound
      const audio = new Audio('/completion-sound.mp3')
      audio.volume = 0.24
      audio.play().catch(err => console.log('Audio play failed:', err))
    } catch (error) {
      console.error('Error marking activity complete:', error)
    }
  }

  // Calculate percentages for display
  const getPercentages = (rolls: number[], total: number) => {
    return rolls.map(count => total > 0 ? (count / total) * 100 : 0)
  }

  const regularPercentages = getPercentages(regularRolls, regularTotal)
  const climatePercentages = getPercentages(climateRolls, climateTotal)

  // Find max percentage for scaling
  const maxPercentage = Math.max(...regularPercentages, ...climatePercentages, 1)

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar - Dark Navy */}
      <div className="w-full bg-[#0B1F32] py-6 px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/dashboard/climate-risk')}
            className="text-[#FF5B35] hover:underline mb-3 text-sm"
          >
            ← Back to Climate and Risk Overview
          </button>
          <h1 className="text-3xl font-bold text-white">
            Understanding Climate and Probabilities
          </h1>
          <p className="text-white text-lg mt-2">
            Roll the dice to see how climate change shifts risk distributions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 pb-12">
        
        {/* Instructions Box */}
        <div className="bg-white border-2 border-[#0B1F32] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#0B1F32] mb-3">How it works:</h2>
          <p className="text-[#0B1F32] leading-relaxed">
            Roll the regular dice (current climate), then click to roll the climate dice the same number of times. 
            Notice how extreme events (11-12) become much more common with climate change.
          </p>
        </div>

        {/* Control Buttons */}
        <div className="bg-[#f5f5f5] border border-[#0B1F32] rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
            <button
              onClick={() => handleRollRegular(1)}
              className="px-6 py-3 bg-[#0B1F32] text-white rounded hover:opacity-90 transition-opacity font-semibold"
            >
              Roll 1×
            </button>
            <button
              onClick={() => handleRollRegular(100)}
              className="px-6 py-3 bg-[#0B1F32] text-white rounded hover:opacity-90 transition-opacity font-semibold"
            >
              Roll 100×
            </button>
            <button
              onClick={() => handleRollRegular(500)}
              className="px-6 py-3 bg-[#0B1F32] text-white rounded hover:opacity-90 transition-opacity font-semibold"
            >
              Roll 500×
            </button>
            <button
              onClick={() => {
                if (climateEnabled) {
                  handleRollClimate(regularTotal)
                } else {
                  alert('Roll the regular dice first to establish a baseline (at least 100 rolls)')
                }
              }}
              className={`px-6 py-3 rounded font-semibold transition-opacity ${
                climateEnabled 
                  ? 'bg-[#FF5B35] text-white hover:opacity-90' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!climateEnabled}
            >
              Now roll the climate dice the same number of times
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-500 text-white rounded hover:opacity-90 transition-opacity font-semibold"
            >
              Reset
            </button>
          </div>
          <div className="text-center text-sm text-[#0B1F32]">
            <span className="font-semibold">Current Climate: {regularTotal} rolls</span>
            <span className="mx-4">|</span>
            <span className="font-semibold text-[#FF5B35]">Future Climate: {climateTotal} rolls</span>
          </div>
        </div>

        {/* Probability Distribution Chart */}
        <div className="bg-white border-2 border-[#0B1F32] rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#0B1F32] mb-2 text-center">
            Probability Distribution Comparison
          </h2>
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#0B1F32]"></div>
              <span className="text-sm text-[#0B1F32]">Current Climate ({regularTotal} rolls)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#FF5B35]"></div>
              <span className="text-sm text-[#FF5B35]">Future Climate ({climateTotal} rolls)</span>
            </div>
          </div>

          {/* Chart Area */}
          <div className="relative h-64 border-l-2 border-b-2 border-gray-400 mt-4 ml-8">
            {/* Y-axis labels */}
            <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-xs text-gray-600">
              <span>{Math.round(maxPercentage)}%</span>
              <span>{Math.round(maxPercentage * 0.75)}%</span>
              <span>{Math.round(maxPercentage * 0.5)}%</span>
              <span>{Math.round(maxPercentage * 0.25)}%</span>
              <span>0%</span>
            </div>

            {/* Line overlay - draw connecting lines */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
              {/* Regular dice line (navy) */}
              {regularTotal > 0 && (
                <polyline
                  points={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((roll, index) => {
                    const x = ((index + 0.5) / 11) * 100
                    const regularHeight = maxPercentage > 0 ? (regularPercentages[index] / maxPercentage) * 100 : 0
                    const y = 100 - regularHeight
                    return `${x}%,${y}%`
                  }).join(' ')}
                  fill="none"
                  stroke="#0B1F32"
                  strokeWidth="2"
                />
              )}
              {/* Climate dice line (orange) */}
              {climateTotal > 0 && (
                <polyline
                  points={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((roll, index) => {
                    const x = ((index + 0.5) / 11) * 100
                    const climateHeight = maxPercentage > 0 ? (climatePercentages[index] / maxPercentage) * 100 : 0
                    const y = 100 - climateHeight
                    return `${x}%,${y}%`
                  }).join(' ')}
                  fill="none"
                  stroke="#FF5B35"
                  strokeWidth="2"
                />
              )}
            </svg>

            {/* Bars Container */}
            <div className="h-full flex items-end justify-around gap-2 px-2">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((roll, index) => {
                const regularPct = regularPercentages[index]
                const climatePct = climatePercentages[index]
                const regularHeight = maxPercentage > 0 ? (regularPct / maxPercentage) * 100 : 0
                const climateHeight = maxPercentage > 0 ? (climatePct / maxPercentage) * 100 : 0

                return (
                  <div key={roll} className="flex-1 h-full flex flex-col items-center max-w-[70px]">
                    {/* Bars */}
                    <div className="w-full flex-1 flex items-end justify-center gap-0.5">
                      {/* Regular dice bar */}
                      <div 
                        className="bg-[#0B1F32] w-4 transition-all duration-300 opacity-30"
                        style={{ height: regularHeight > 0 ? `${regularHeight}%` : '0%' }}
                        title={`Regular: ${regularPct.toFixed(1)}%`}
                      />
                      {/* Climate dice bar */}
                      <div 
                        className="bg-[#FF5B35] w-4 transition-all duration-300 opacity-30"
                        style={{ height: climateHeight > 0 ? `${climateHeight}%` : '0%' }}
                        title={`Climate: ${climatePct.toFixed(1)}%`}
                      />
                    </div>
                    {/* X-axis label */}
                    <div className="text-xs font-semibold text-[#0B1F32] mt-2">{roll}</div>
                    {/* Percentages below bars */}
                    <div className="text-[10px] text-gray-600 mt-1 flex gap-1">
                      {regularPct > 0 && <span className="text-[#0B1F32]">{regularPct.toFixed(1)}%</span>}
                      {climatePct > 0 && <span className="text-[#FF5B35]">{climatePct.toFixed(1)}%</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 1/100 Year Flood Zone Marker */}
          {regularTotal > 0 && (
            <div className="mt-6 bg-red-50 border border-red-300 rounded p-4">
              <div className="text-center">
                <span className="text-red-600 font-bold">
                  1/100 Year Flood Zone (11-12):
                </span>
                <span className="ml-3 text-[#0B1F32]">
                  Current Climate: {((regularPercentages[9] + regularPercentages[10])).toFixed(1)}% of events
                </span>
                {climateTotal > 0 && (
                  <span className="ml-3 text-[#FF5B35] font-semibold">
                    | Future Climate: {((climatePercentages[9] + climatePercentages[10])).toFixed(1)}% of events
                  </span>
                )}
              </div>
              {climateTotal > 0 && (
                <p className="text-center text-sm text-gray-700 mt-2">
                  Notice this rare event becomes much more common
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mark Complete Button */}
        <div className="flex justify-center">
          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className={`px-8 py-4 rounded font-semibold text-lg transition-opacity ${
              isCompleted
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#0B1F32] text-white hover:opacity-90'
            }`}
          >
            {isCompleted ? '✓ Activity Completed' : 'Mark this activity as complete'}
          </button>
        </div>
      </div>
    </div>
  )
}
