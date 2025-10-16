"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Purchase {
  id: string
  itemType: string
  itemName: string
  pointsCost: number
  purchaseCode: string
  isUtilized: boolean
  createdAt: string
}

export default function RedeemPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const purchaseId = searchParams?.get('purchaseId')
  
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRedeeming, setIsRedeeming] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchPurchase = async () => {
      if (!purchaseId) {
        router.push('/store')
        return
      }

      try {
        const response = await fetch('/api/purchases')
        if (response.ok) {
          const data = await response.json()
          const foundPurchase = data.purchases.find((p: Purchase) => p.id === purchaseId)
          if (foundPurchase) {
            if (foundPurchase.isUtilized) {
              // Already redeemed, redirect to store
              router.push('/store')
              return
            }
            setPurchase(foundPurchase)
          } else {
            router.push('/store')
          }
        }
      } catch (error) {
        console.error('Error fetching purchase:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session && purchaseId) {
      fetchPurchase()
    }
  }, [session, purchaseId, router])

  const handleUtilize = async () => {
    if (!purchase) return

    setIsRedeeming(true)
    
    try {
      // Mark as utilized
      const response = await fetch('/api/purchases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId: purchase.id })
      })

      if (response.ok) {
        // Open email client
        const subject = encodeURIComponent(`Redeeming: ${purchase.itemName}`)
        const body = encodeURIComponent(
          `Hello,\n\nI would like to redeem my purchase:\n\nItem: ${purchase.itemName}\nPurchase Code: ${purchase.purchaseCode}\nPurchase Date: ${new Date(purchase.createdAt).toLocaleDateString()}\n\nThank you!`
        )
        
        window.location.href = `mailto:Keith.nelson@newdayinternationalconsulting.com?subject=${subject}&body=${body}`
        
        // Redirect to store after a moment
        setTimeout(() => {
          router.push('/store')
        }, 1000)
      } else {
        alert('Failed to mark purchase as utilized')
        setIsRedeeming(false)
      }
    } catch (error) {
      console.error('Error utilizing purchase:', error)
      alert('Failed to utilize purchase')
      setIsRedeeming(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-[calc(100vh-92px)] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!session || !purchase) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-92px)] bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#0B1F32' }}>
            Redeem Your Purchase
          </h1>
          <p className="text-xl mb-2" style={{ color: '#6C757D' }}>
            Ready to use:
          </p>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#FF5B35' }}>
            {purchase.itemName}
          </h2>
        </div>

        {/* Purchase Code Display */}
        <div 
          className="border-4 rounded-lg p-8 mb-8"
          style={{ borderColor: '#FF5B35', backgroundColor: '#FFF5F3' }}
        >
          <p className="text-sm mb-2" style={{ color: '#6C757D' }}>
            Your Purchase Code
          </p>
          <div className="text-5xl font-bold font-mono mb-4" style={{ color: '#0B1F32' }}>
            {purchase.purchaseCode}
          </div>
          <p className="text-sm" style={{ color: '#6C757D' }}>
            Purchased: {new Date(purchase.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Redeem Button */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleUtilize}
            disabled={isRedeeming}
            className="w-full px-8 py-4 rounded-lg text-xl font-bold transition-opacity hover:opacity-90"
            style={{ 
              backgroundColor: '#FF5B35', 
              color: '#ffffff',
              opacity: isRedeeming ? 0.6 : 1
            }}
          >
            {isRedeeming ? 'Processing...' : 'Utilize Now (Send Email)'}
          </button>
          
          <p className="text-sm" style={{ color: '#6C757D' }}>
            This will send an email to redeem your purchase and mark it as utilized
          </p>
        </div>

        {/* Instructions */}
        <div 
          className="border rounded-lg p-6 text-left mb-8"
          style={{ borderColor: '#0B1F32', backgroundColor: '#f8f9fa' }}
        >
          <h3 className="text-lg font-bold mb-3" style={{ color: '#0B1F32' }}>
            What happens next:
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: '#6C757D' }}>
            <li>• Your email client will open with a pre-filled message</li>
            <li>• Send the email to complete your redemption request</li>
            <li>• We'll respond within 24 hours to schedule or provide access</li>
            <li>• This purchase will be marked as "utilized" after sending</li>
          </ul>
        </div>

        {/* Back Button */}
        <Link
          href="/store"
          className="inline-block px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0B1F32', color: '#ffffff' }}
        >
          Back to Store
        </Link>
      </div>
    </div>
  )
}
