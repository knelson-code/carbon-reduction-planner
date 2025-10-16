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
    href: "/dashboard",
    icon: "Home",
  },
  {
    name: "Risk",
    href: "/dashboard/climate-risk",
    icon: "Risk",
    subItems: [
      { name: "The nature of the problem", href: "/dashboard/climate-risk/nature" },
      { name: "Scientific background", href: "/dashboard/climate-risk/scientific" },
      { name: "History of the fight against climate change", href: "/dashboard/climate-risk/history" },
      { name: "Social, cultural, political and economic roots of the problem", href: "/dashboard/climate-risk/roots" },
      { name: "Psychology of climate change, and willful blindness", href: "/dashboard/climate-risk/psychology" },
      { name: "Physical risk", href: "/dashboard/climate-risk/physical" },
      { name: "Transition Risk", href: "/dashboard/climate-risk/transition" },
      { name: "Legal and reputational risk", href: "/dashboard/climate-risk/legal" },
      { name: "Systemic risk", href: "/dashboard/climate-risk/systemic" },
      { name: "Analyzing and assigning value to risks", href: "/dashboard/climate-risk/analyzing" },
      { name: "Prioritizing risks", href: "/dashboard/climate-risk/prioritizing" },
    ],
  },
  {
    name: "Transition",
    href: "/dashboard/transition-strategy",
    icon: "Transition",
    subItems: [
      { name: "Think about what you're trying to accomplish", href: "/dashboard/transition-strategy/defining-objectives" },
      { name: "Transition Point 2", href: "/dashboard/transition-strategy/point-2" },
      { name: "Transition Point 3", href: "/dashboard/transition-strategy/point-3" },
      { name: "Transition Point 4", href: "/dashboard/transition-strategy/point-4" },
      { name: "Transition Point 5", href: "/dashboard/transition-strategy/point-5" },
      { name: "Transition Point 6", href: "/dashboard/transition-strategy/point-6" },
      { name: "Transition Point 7", href: "/dashboard/transition-strategy/point-7" },
      { name: "Transition Point 8", href: "/dashboard/transition-strategy/point-8" },
    ],
  },
  {
    name: "Systems",
    href: "/dashboard/impact-strategy",
    icon: "Systems",
    subItems: [
      { name: "Theory of Change", href: "/dashboard/impact-strategy/point-1/theory-of-change" },
      { name: "Systems Point 2", href: "/dashboard/impact-strategy/point-2" },
      { name: "Systems Point 3", href: "/dashboard/impact-strategy/point-3" },
      { name: "Systems Point 4", href: "/dashboard/impact-strategy/point-4" },
      { name: "Systems Point 5", href: "/dashboard/impact-strategy/point-5" },
      { name: "Systems Point 6", href: "/dashboard/impact-strategy/point-6" },
      { name: "Systems Point 7", href: "/dashboard/impact-strategy/point-7" },
      { name: "Systems Point 8", href: "/dashboard/impact-strategy/point-8" },
    ],
  },
  {
    name: "CO₂",
    href: "/dashboard/co2-management",
    icon: "CO₂",
    subItems: [
      { name: "CO₂ Point 1", href: "/dashboard/co2-management/point-1" },
      { name: "CO₂ Point 2", href: "/dashboard/co2-management/point-2" },
      { name: "CO₂ Point 3", href: "/dashboard/co2-management/point-3" },
      { name: "CO₂ Point 4", href: "/dashboard/co2-management/point-4" },
      { name: "CO₂ Point 5", href: "/dashboard/co2-management/point-5" },
      { name: "CO₂ Point 6", href: "/dashboard/co2-management/point-6" },
      { name: "CO₂ Point 7", href: "/dashboard/co2-management/point-7" },
      { name: "CO₂ Point 8", href: "/dashboard/co2-management/point-8" },
    ],
  },
]

export default function Sidebar() {
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
    if (href === "/dashboard") {
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
