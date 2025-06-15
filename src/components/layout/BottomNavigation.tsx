"use client"
import { useLocation, useNavigate } from "react-router-dom"
import { Home, QrCode, Scan, CreditCard, User } from "lucide-react"
import { cn } from "@/lib/utils"

const BottomNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/generate", icon: QrCode, label: "Pay" },
    { path: "/scan", icon: Scan, label: "Scan" },
    { path: "/transactions", icon: CreditCard, label: "History" },
    { path: "/profile", icon: User, label: "Profile" },
  ]

  if (location.pathname === "/auth") return null

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1", isActive && "scale-110")} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation
