"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MenuItem {
  name: string
  href: string
  icon: string
  subItems?: { name: string; href: string }[]
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/climate-risk-management",
    icon: "Home",
  },
  {
    name: "Analyze Risks",
    href: "/climate-risk-management/analyze-risks",
    icon: "Analyze",
    subItems: [
      { name: "Understanding climate risk", href: "/climate-risk-management/analyze-risks/understanding" },
      { name: "Labor productivity loss", href: "/climate-risk-management/analyze-risks/labor-productivity" },
      { name: "Delay in policy implementation", href: "/climate-risk-management/analyze-risks/policy-delay" },
      { name: "Extreme events", href: "/climate-risk-management/analyze-risks/extreme-events" },
      { name: "Operational interruptions", href: "/climate-risk-management/analyze-risks/operational-interruptions" },
      { name: "Decline in resilience of our clients", href: "/climate-risk-management/analyze-risks/client-resilience" },
      { name: "Deterioration of our operational context", href: "/climate-risk-management/analyze-risks/operational-context" },
      { name: "Risks to employees", href: "/climate-risk-management/analyze-risks/employee-risks" },
    ],
  },
  {
    name: "Risks by Location",
    href: "/climate-risk-management/risks-by-location",
    icon: "Location",
    subItems: [
      { name: "Spain", href: "/climate-risk-management/risks-by-location/spain" },
      { name: "India", href: "/climate-risk-management/risks-by-location/india" },
      { name: "Brazil", href: "/climate-risk-management/risks-by-location/brazil" },
      { name: "Global", href: "/climate-risk-management/risks-by-location/global" },
    ],
  },
  {
    name: "Scenario Analysis",
    href: "/climate-risk-management/scenario-analysis",
    icon: "Scenario",
    subItems: [
      { name: "Scenario Explorer", href: "/climate-risk-management/scenario-analysis/scenario-explorer" },
      { name: "Storylines", href: "/climate-risk-management/scenario-analysis/storylines" },
    ],
  },
  {
    name: "Decision Making",
    href: "/climate-risk-management/decision-making",
    icon: "Decision",
    subItems: [
      { name: "Methodology", href: "/climate-risk-management/decision-making/methodology" },
      { name: "Prioritization", href: "/climate-risk-management/decision-making/prioritization" },
      { name: "Recommendations", href: "/climate-risk-management/decision-making/recommendations" },
    ],
  },
]

export default function ClimateRiskManagementSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleItem = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? [] // Close the current item
        : [itemName] // Open only this item (closes any others)
    )
  }

  const isActive = (href: string) => {
    if (href === "/climate-risk-management") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-[92px] bottom-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40"
        style={{
          width: isExpanded ? "240px" : "24px",
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false)
          setExpandedItems([])
        }}
      >
        <nav className="flex flex-col h-full py-4">
          {menuItems.map((item) => (
            <div key={item.name}>
              {/* Main Menu Item */}
              <div
                className={`flex items-center transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 border-l-4"
                    : "hover:bg-gray-50"
                }`}
                style={{
                  borderColor: isActive(item.href) ? "#163E64" : "transparent",
                  paddingLeft: isExpanded ? "16px" : "4px",
                  paddingRight: isExpanded ? "16px" : "4px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                }}
                onMouseEnter={() => {
                  if (item.subItems && isExpanded && !expandedItems.includes(item.name)) {
                    toggleItem(item.name)
                  }
                }}
              >
                <Link
                  href={item.href}
                  className="flex items-center flex-1 cursor-pointer"
                >
                  {!isExpanded && (
                    <div className="flex items-center justify-center w-full">
                      <span
                        className="text-xs font-semibold tracking-wide"
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          color: isActive(item.href) ? "#163E64" : "#4B5563",
                          WebkitFontSmoothing: "antialiased",
                          MozOsxFontSmoothing: "grayscale",
                          textRendering: "optimizeLegibility",
                        }}
                      >
                        {item.icon}
                      </span>
                    </div>
                  )}
                  {isExpanded && (
                    <span
                      className="font-semibold text-sm whitespace-nowrap"
                      style={{ color: isActive(item.href) ? "#163E64" : "#6C757D" }}
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
                {isExpanded && item.subItems && (
                  <button
                    className="ml-auto px-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleItem(item.name)
                    }}
                  >
                    {expandedItems.includes(item.name) ? "▼" : "▶"}
                  </button>
                )}
              </div>

              {/* Sub Items */}
              {isExpanded && item.subItems && expandedItems.includes(item.name) && (
                <div className="bg-gray-50">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`flex items-center pl-12 pr-4 py-2 text-sm transition-colors ${
                        pathname === subItem.href
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Spacer to prevent content from going under sidebar */}
      <div className="w-[24px] flex-shrink-0" />
    </>
  )
}
