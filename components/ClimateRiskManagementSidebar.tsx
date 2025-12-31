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
      { name: "The nature of the problem", href: "/climate-risk-management/analyze-risks/nature" },
      { name: "Scientific background", href: "/climate-risk-management/analyze-risks/scientific" },
      { name: "History of the fight against climate change", href: "/climate-risk-management/analyze-risks/history" },
      { name: "Social, cultural, political and economic roots of the problem", href: "/climate-risk-management/analyze-risks/roots" },
      { name: "Psychology of climate change, and willful blindness", href: "/climate-risk-management/analyze-risks/psychology" },
      { name: "Physical risk", href: "/climate-risk-management/analyze-risks/physical" },
      { name: "Transition Risk", href: "/climate-risk-management/analyze-risks/transition" },
      { name: "Legal and reputational risk", href: "/climate-risk-management/analyze-risks/legal" },
      { name: "Systemic risk", href: "/climate-risk-management/analyze-risks/systemic" },
      { name: "Analyzing and assigning value to risks", href: "/climate-risk-management/analyze-risks/analyzing" },
      { name: "Prioritizing risks", href: "/climate-risk-management/analyze-risks/prioritizing" },
    ],
  },
  {
    name: "Risks by Location",
    href: "/climate-risk-management/risks-by-location",
    icon: "Location",
    subItems: [
      { name: "Think about what you're trying to accomplish", href: "/climate-risk-management/risks-by-location/defining-objectives" },
      { name: "Location Point 2", href: "/climate-risk-management/risks-by-location/point-2" },
      { name: "Location Point 3", href: "/climate-risk-management/risks-by-location/point-3" },
      { name: "Location Point 4", href: "/climate-risk-management/risks-by-location/point-4" },
      { name: "Location Point 5", href: "/climate-risk-management/risks-by-location/point-5" },
      { name: "Location Point 6", href: "/climate-risk-management/risks-by-location/point-6" },
      { name: "Location Point 7", href: "/climate-risk-management/risks-by-location/point-7" },
      { name: "Location Point 8", href: "/climate-risk-management/risks-by-location/point-8" },
    ],
  },
  {
    name: "Scenario Analysis",
    href: "/climate-risk-management/scenario-analysis",
    icon: "Scenario",
    subItems: [
      { name: "Theory of Change", href: "/climate-risk-management/scenario-analysis/point-1/theory-of-change" },
      { name: "Scenario Point 2", href: "/climate-risk-management/scenario-analysis/point-2" },
      { name: "Scenario Point 3", href: "/climate-risk-management/scenario-analysis/point-3" },
      { name: "Scenario Point 4", href: "/climate-risk-management/scenario-analysis/point-4" },
      { name: "Scenario Point 5", href: "/climate-risk-management/scenario-analysis/point-5" },
      { name: "Scenario Point 6", href: "/climate-risk-management/scenario-analysis/point-6" },
      { name: "Scenario Point 7", href: "/climate-risk-management/scenario-analysis/point-7" },
      { name: "Scenario Point 8", href: "/climate-risk-management/scenario-analysis/point-8" },
    ],
  },
  {
    name: "Methodology",
    href: "/climate-risk-management/methodology",
    icon: "Method",
    subItems: [
      { name: "Methodology Point 1", href: "/climate-risk-management/methodology/point-1" },
      { name: "Methodology Point 2", href: "/climate-risk-management/methodology/point-2" },
      { name: "Methodology Point 3", href: "/climate-risk-management/methodology/point-3" },
      { name: "Methodology Point 4", href: "/climate-risk-management/methodology/point-4" },
      { name: "Methodology Point 5", href: "/climate-risk-management/methodology/point-5" },
      { name: "Methodology Point 6", href: "/climate-risk-management/methodology/point-6" },
      { name: "Methodology Point 7", href: "/climate-risk-management/methodology/point-7" },
      { name: "Methodology Point 8", href: "/climate-risk-management/methodology/point-8" },
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
