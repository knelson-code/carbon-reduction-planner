"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"

interface Category {
  id: string
  label: string
  isEditable: boolean
  stars: number
}

export default function DefiningObjectivesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [categories, setCategories] = useState<Category[]>([
    { id: 'legal', label: 'Legal compliance', isEditable: false, stars: 0 },
    { id: 'money', label: 'Save money / increasing efficiency', isEditable: false, stars: 0 },
    { id: 'sales', label: 'Improve sales / Increase business value', isEditable: false, stars: 0 },
    { id: 'planet', label: 'Save the planet', isEditable: false, stars: 0 },
    { id: 'esg', label: 'Win ESG points: (CDP, Ecovadis, etc.)', isEditable: false, stars: 0 },
    { id: 'reputation', label: 'Maintain our reputation and social license', isEditable: false, stars: 0 },
    { id: 'risks', label: 'Be prepared for climate risks', isEditable: false, stars: 0 },
    { id: 'justice', label: 'Fight for climate justice', isEditable: false, stars: 0 },
    { id: 'other1', label: 'Other', isEditable: true, stars: 0 },
    { id: 'other2', label: 'Other', isEditable: true, stars: 0 },
    { id: 'other3', label: 'Other', isEditable: true, stars: 0 },
  ])
  
  const [availableStars, setAvailableStars] = useState(10)
  const [draggedStar, setDraggedStar] = useState<{ from: string | null, index: number }>({ from: null, index: -1 })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleDragStart = (e: React.DragEvent, from: string | null, index: number) => {
    setDraggedStar({ from, index })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault()
    
    if (draggedStar.from === null) {
      // Moving from available stars pool
      if (availableStars > 0) {
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId ? { ...cat, stars: cat.stars + 1 } : cat
        ))
        setAvailableStars(prev => prev - 1)
      }
    } else {
      // Moving from another category
      setCategories(prev => prev.map(cat => {
        if (cat.id === draggedStar.from) {
          return { ...cat, stars: cat.stars - 1 }
        }
        if (cat.id === categoryId) {
          return { ...cat, stars: cat.stars + 1 }
        }
        return cat
      }))
    }
    
    setDraggedStar({ from: null, index: -1 })
  }

  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault()
    
    if (draggedStar.from !== null) {
      // Return star to available pool
      setCategories(prev => prev.map(cat => 
        cat.id === draggedStar.from ? { ...cat, stars: cat.stars - 1 } : cat
      ))
      setAvailableStars(prev => prev + 1)
    }
    
    setDraggedStar({ from: null, index: -1 })
  }

  const handleLabelEdit = (id: string, newLabel: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, label: newLabel } : cat
    ))
  }

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
      
      <div className="flex-1" style={{ backgroundColor: '#0B1F32' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-8 text-center" style={{ color: '#ffffff' }}>
            What are you trying to achieve with through your action on climate?
          </h1>

          {/* Activity Area */}
          <div className="flex gap-12 items-start">
            {/* Categories with Stars */}
            <div className="flex-1 space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category.id)}
                >
                  {/* Category Label */}
                  {category.isEditable ? (
                    <input
                      type="text"
                      value={category.label}
                      onChange={(e) => handleLabelEdit(category.id, e.target.value)}
                      className="w-96 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: '#4B5563',
                        color: '#ffffff',
                        borderColor: '#4B5563',
                        borderWidth: '1px',
                      }}
                      placeholder="Enter custom goal..."
                    />
                  ) : (
                    <div
                      className="w-96 px-3 py-2 rounded text-sm"
                      style={{
                        backgroundColor: '#4B5563',
                        color: '#ffffff',
                      }}
                    >
                      {category.label}
                    </div>
                  )}

                  {/* Stars for this category */}
                  <div className="flex gap-2">
                    {Array.from({ length: category.stars }).map((_, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, category.id, index)}
                        className="w-10 h-10 rounded-full flex items-center justify-center cursor-move"
                        style={{
                          backgroundColor: '#ffffff',
                          border: '2px solid #163E64',
                        }}
                      >
                        <span style={{ color: '#FF5B35', fontSize: '24px' }}>★</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Available Stars Pool */}
            <div
              className="flex flex-col gap-2 flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={handleDropToAvailable}
            >
              {Array.from({ length: availableStars }).map((_, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, null, index)}
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-move"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #163E64',
                  }}
                >
                  <span style={{ color: '#FF5B35', fontSize: '24px' }}>★</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 rounded" style={{ backgroundColor: '#163E64' }}>
            <p className="text-sm" style={{ color: '#ffffff' }}>
              <strong>Instructions:</strong> Drag stars from the right side to prioritize your goals. 
              The more stars you assign to a category, the higher priority it is for your organization. 
              You can also drag stars between categories or back to the pool on the right.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
