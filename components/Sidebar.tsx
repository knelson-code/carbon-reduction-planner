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
    name: "Understanding Climate Risk",
    href: "/dashboard/climate-risk",
    icon: "Risk",
    subItems: [
      { name: "Risk Assessment", href: "/dashboard/climate-risk/assessment" },
      { name: "Adaptation Planning", href: "/dashboard/climate-risk/adaptation" },
      { name: "Vulnerability Analysis", href: "/dashboard/climate-risk/vulnerability" },
    ],
  },
  {
    name: "Energy Transition Strategy",
    href: "/dashboard/transition-strategy",
    icon: "Strategy",
    subItems: [
      { name: "Understand Your Role", href: "/dashboard/transition-strategy/pathways" },
      { name: "Speed the Transition", href: "/dashboard/transition-strategy/targets" },
      { name: "Decide Your Actions", href: "/dashboard/transition-strategy/progress" },
    ],
  },
  {
    name: "Systemic Impact",
    href: "/dashboard/impact-strategy",
    icon: "Impact",
    subItems: [
      { name: "Impact Assessment", href: "/dashboard/impact-strategy/assessment" },
      { name: "Stakeholder Engagement", href: "/dashboard/impact-strategy/stakeholders" },
      { name: "Reporting", href: "/dashboard/impact-strategy/reporting" },
    ],
  },
  {
    name: "CO₂ Management",
    href: "/dashboard/co2-management",
    icon: "CO2",
    subItems: [
      { name: "Emissions Tracking", href: "/dashboard/co2-management/emissions" },
      { name: "Reduction Tactics", href: "/dashboard/co2-management/tactics" },
      { name: "Scope 1/2/3", href: "/dashboard/co2-management/scopes" },
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
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
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
                className={`flex items-center cursor-pointer transition-colors ${
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
                onClick={() => {
                  if (item.subItems && isExpanded) {
                    toggleItem(item.name)
                  }
                }}
              >
                <Link
                  href={item.href}
                  className="flex items-center w-full"
                  onClick={(e) => {
                    if (item.subItems && isExpanded) {
                      e.preventDefault()
                    }
                  }}
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
                    <>
                      <span
                        className="font-semibold text-sm whitespace-nowrap"
                        style={{ color: isActive(item.href) ? "#163E64" : "#6C757D" }}
                      >
                        {item.name}
                      </span>
                      {item.subItems && (
                        <span className="ml-auto text-gray-400">
                          {expandedItems.includes(item.name) ? "▼" : "▶"}
                        </span>
                      )}
                    </>
                  )}
                </Link>
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
