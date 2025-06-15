"use client"
import { useNavigate } from "react-router-dom"
import { QrCode, Scan, Send, Users, Eye, EyeOff, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

const Index = () => {
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(true)

  const quickActions = [
    {
      icon: QrCode,
      label: "Pay",
      description: "Generate QR",
      path: "/generate",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Scan,
      label: "Scan",
      description: "Scan QR",
      path: "/scan",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Send,
      label: "Send",
      description: "To Contact",
      path: "/transactions",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Users,
      label: "Split",
      description: "Split Bill",
      path: "/split-bill",
      color: "from-orange-500 to-orange-600",
    },
  ]

  const recentTransactions = [
    { id: 1, name: "Coffee Shop", amount: -45, time: "2 min ago", type: "payment" },
    { id: 2, name: "John Doe", amount: +120, time: "1 hour ago", type: "received" },
    { id: 3, name: "Grocery Store", amount: -89, time: "3 hours ago", type: "payment" },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm opacity-90">Available Balance</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20 p-1"
            >
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
          <div className="text-3xl font-bold mb-2">{showBalance ? "₹2,450.00" : "₹••••••"}</div>
          <div className="text-sm opacity-90">Last updated: Just now</div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.label}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mb-3`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">{action.label}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/transactions")}
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </Button>
        </div>
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`p-4 flex items-center justify-between ${
                  index !== recentTransactions.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "received" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "received" ? "+" : "-"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.name}</p>
                    <p className="text-sm text-gray-500">{transaction.time}</p>
                  </div>
                </div>
                <div className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{Math.abs(transaction.amount)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Promotional Banner */}
      <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Cashback Offer!</h3>
              <p className="text-sm opacity-90">Get 5% cashback on next 3 transactions</p>
            </div>
            <Button variant="secondary" size="sm" className="bg-white text-green-600 hover:bg-gray-100">
              Claim
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Index
