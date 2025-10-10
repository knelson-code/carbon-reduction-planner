"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: '#0B1F32' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold mb-3" style={{ color: '#ffffff' }}>CO₂ Reduction Planner</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#7a9197' }}>
              A privacy-first tool to help organizations plan and track their carbon emission reduction efforts.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold mb-3" style={{ color: '#ffffff' }}>Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy" 
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
                  href="/terms" 
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
                  href="/support" 
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
