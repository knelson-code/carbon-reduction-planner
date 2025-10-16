"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Purchase {
  id: string
  itemType: string
  itemName: string
  pointsCost: number
  purchaseCode: string
  isUtilized: boolean
  utilizedAt: string | null
  createdAt: string
}

interface StoreItem {
  id: string
  name: string
  subtitle: string
  points: number
  type: string
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: 'review_session',
    name: 'Review Session',
    subtitle: 'One hour video call where you show us what you\'ve done and we give feedback and guidance.',
    points: 500,
    type: 'review_session'
  },
  {
    id: 'climate_web',
    name: 'Access to the Climate Web',
    subtitle: 'The world\'s most complete climate knowledge base',
    points: 500,
    type: 'climate_web_access'
  },
  {
    id: 'climate_risk_class',
    name: 'Climate Risk Class Access',
    subtitle: 'Get access to our comprehensive Climate Risk training course',
    points: 500,
    type: 'climate_risk_class'
  },
  {
    id: 'guidance_map',
    name: 'Map for Understanding and Guiding How All These Components Fit Together',
    subtitle: 'A comprehensive guide to help you navigate and understand the relationships between all climate action components',
    points: 500,
    type: 'guidance_map'
  }
]

export default function StorePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userPoints, setUserPoints] = useState(0)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch user points and purchases
  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          // Fetch points
          const scoreResponse = await fetch('/api/score')
          if (scoreResponse.ok) {
            const scoreData = await scoreResponse.json()
            setUserPoints(scoreData.score)
          }

          // Fetch purchases
          const purchasesResponse = await fetch('/api/purchases')
          if (purchasesResponse.ok) {
            const purchasesData = await purchasesResponse.json()
            setPurchases(purchasesData.purchases)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
  }, [session])

  const handlePurchase = async () => {
    if (!selectedItem) return
    
    setIsPurchasing(true)
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: selectedItem.type,
          itemName: selectedItem.name,
          pointsCost: selectedItem.points
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Navigate to confirmation page with purchase details
        router.push(`/store/confirmation?purchaseId=${data.purchase.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Purchase failed')
      }
    } catch (error) {
      console.error('Error making purchase:', error)
      alert('Purchase failed')
    } finally {
      setIsPurchasing(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-[calc(100vh-92px)] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-92px)] bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0B1F32' }}>
            Use Your Points
          </h1>
          <p className="text-lg" style={{ color: '#6C757D' }}>
            Your Points: <span className="font-bold" style={{ color: '#FF5B35' }}>{userPoints}</span>
          </p>
        </div>

        {/* Store Items */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B1F32' }}>
            Available Items
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {STORE_ITEMS.map((item) => {
              const canAfford = userPoints >= item.points
              const isSelected = selectedItem?.id === item.id
              
              return (
                <div
                  key={item.id}
                  className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
                    isSelected ? 'ring-4 ring-orange-500' : ''
                  }`}
                  style={{
                    borderColor: isSelected ? '#FF5B35' : '#0B1F32',
                    backgroundColor: isSelected ? '#FFF5F3' : '#ffffff',
                    opacity: canAfford ? 1 : 0.6
                  }}
                  onClick={() => canAfford && setSelectedItem(isSelected ? null : item)}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0B1F32' }}>
                    {item.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#6C757D' }}>
                    {item.subtitle}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold" style={{ color: '#FF5B35' }}>
                      {item.points} Points
                    </span>
                    {!canAfford && (
                      <span className="text-sm" style={{ color: '#dc3545' }}>
                        Insufficient Points
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-sm font-semibold" style={{ color: '#FF5B35' }}>
                        Selected ✓
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Purchase Button */}
          {selectedItem && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handlePurchase}
                disabled={isPurchasing}
                className="px-8 py-3 rounded-lg text-lg font-bold transition-opacity"
                style={{
                  backgroundColor: '#FF5B35',
                  color: '#ffffff',
                  opacity: isPurchasing ? 0.6 : 1
                }}
              >
                {isPurchasing ? 'Processing...' : `Purchase ${selectedItem.name}`}
              </button>
            </div>
          )}
        </div>

        {/* Your Purchases Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B1F32' }}>
            Your Purchases
          </h2>
          {purchases.length === 0 ? (
            <p style={{ color: '#6C757D' }}>You haven't made any purchases yet.</p>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                  style={{
                    borderColor: '#0B1F32',
                    backgroundColor: purchase.isUtilized ? '#f8f9fa' : '#ffffff'
                  }}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold" style={{ color: '#0B1F32' }}>
                      {purchase.itemName}
                    </h3>
                    <p className="text-sm" style={{ color: '#6C757D' }}>
                      Purchased: {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm" style={{ color: '#6C757D' }}>
                      Code: <span className="font-mono font-bold">{purchase.purchaseCode}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    {purchase.isUtilized ? (
                      <span 
                        className="text-sm font-semibold px-4 py-2 rounded"
                        style={{ color: '#6C757D', backgroundColor: '#e9ecef' }}
                      >
                        Already Utilized
                      </span>
                    ) : (
                      <Link
                        href={`/store/redeem?purchaseId=${purchase.id}`}
                        className="px-4 py-2 rounded font-semibold transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#FF5B35', color: '#ffffff' }}
                      >
                        Redeem
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
