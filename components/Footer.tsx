import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">CO₂ Reduction Planner</h3>
            <p className="text-sm text-gray-600">
              A privacy-first tool to help organizations plan and track their carbon emission reduction efforts.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/support" 
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  Password Recovery
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:keith.nelson@newdayinternationalconsulting.com" 
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  keith.nelson@newdayinternationalconsulting.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} New Day Climate. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            A doing business name of New Day International Consulting
          </p>
        </div>
      </div>
    </footer>
  )
}
