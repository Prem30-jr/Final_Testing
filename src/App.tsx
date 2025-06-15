import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import AuthWrapper from "@/components/auth/AuthWrapper"
import Header from "@/components/layout/Header"
import BottomNavigation from "@/components/layout/BottomNavigation"
import Index from "@/pages/Index"
import Generate from "@/pages/Generate"
import Scan from "@/pages/Scan"
import Transactions from "@/pages/Transactions"
import Profile from "@/pages/Profile"
import Activity from "@/pages/Activity"
import SplitBill from "@/pages/SplitBill"
import Auth from "@/pages/Auth"
import NotFound from "@/pages/NotFound"
import NetworkStatus from "@/components/NetworkStatus"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <NetworkStatus />
        <AuthWrapper>
          <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl">
            <Header />
            <main className="flex-1 pb-20 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/split-bill" element={<SplitBill />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <BottomNavigation />
          </div>
        </AuthWrapper>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
