"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function Footer() {
  const pathname = usePathname()
  
  // Check if we're in climate risk subdomain or if callbackUrl indicates we should be
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setCallbackUrl(params.get('callbackUrl'))
    }
  }, [pathname])
  
  const isClimateRiskManagement = pathname.startsWith("/climate-risk-management") || 
    (callbackUrl?.startsWith("/climate-risk-management") ?? false)

  return (
    <footer className="mt-auto" style={{ backgroundColor: '#0B1F32' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold mb-3" style={{ color: '#ffffff' }}>
              {isClimateRiskManagement ? "Climate Risk Management Platform" : "Climate Management Platform"}
            </h3>
            {!isClimateRiskManagement && (
              <p className="text-sm leading-relaxed" style={{ color: '#7a9197' }}>
                Strategic tools for producing systemic social and economic change on climate through political engagement and targeted intervention in key leverage points.
              </p>
            )}
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold mb-3" style={{ color: '#ffffff' }}>Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={isClimateRiskManagement ? "/climate-risk-management/privacy" : "/privacy"}
                  className="text-sm transition-colors"
                  style={{ color: '#7a9197' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#7a9197'}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href={isClimateRiskManagement ? "/climate-risk-management/terms" : "/terms"}
                  className="text-sm transition-colors"
                  style={{ color: '#7a9197' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#7a9197'}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-3" style={{ color: '#ffffff' }}>Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={isClimateRiskManagement ? "/climate-risk-management/support" : "/support"}
                  className="text-sm transition-colors"
                  style={{ color: '#7a9197' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#7a9197'}
                >
                  Support Requests
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-sm" style={{ color: '#7a9197' }}>
            © {new Date().getFullYear()} New Day Climate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
