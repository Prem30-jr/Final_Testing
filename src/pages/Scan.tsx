"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Upload, Flashlight, RotateCcw } from "lucide-react"
import QRScanner from "@/components/QRScanner"
import { toast } from "sonner"

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [flashOn, setFlashOn] = useState(false)

  const handleScanResult = (data: any) => {
    setScannedData(data)
    setIsScanning(false)
    toast.success("QR Code scanned successfully!")
  }

  const handlePayment = () => {
    if (!paymentAmount || Number.parseFloat(paymentAmount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    toast.success(`Payment of ₹${paymentAmount} initiated!`)
    // Reset state
    setScannedData(null)
    setPaymentAmount("")
  }

  const startScanning = () => {
    setIsScanning(true)
    setScannedData(null)
  }

  return (
    <div className="p-4 space-y-6">
      {!isScanning && !scannedData && (
        <>
          {/* Scan Options */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-blue-600" />
                Scan & Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={startScanning}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold text-lg"
              >
                <Camera className="w-6 h-6 mr-3" />
                Start Camera Scan
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload QR Image
              </Button>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Coffee Shop", amount: "₹45", time: "2 hours ago" },
                  { name: "Grocery Store", amount: "₹120", time: "1 day ago" },
                  { name: "Restaurant", amount: "₹350", time: "2 days ago" },
                ].map((scan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{scan.name}</p>
                      <p className="text-sm text-gray-500">{scan.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{scan.amount}</p>
                      <Button variant="ghost" size="sm" className="text-blue-600 h-6 p-0">
                        Scan Again
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Scanner Interface */}
      {isScanning && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="relative">
              <QRScanner onScanResult={handleScanResult} />

              {/* Scanner Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFlashOn(!flashOn)}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <Flashlight className={`w-4 h-4 ${flashOn ? "text-yellow-400" : ""}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsScanning(false)}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  Cancel
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Point your camera at the QR code to scan</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Confirmation */}
      {scannedData && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Confirm Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Merchant</span>
                <span className="text-sm text-green-600">Verified ✓</span>
              </div>
              <p className="font-semibold text-green-800">{scannedData.merchantName || "Unknown Merchant"}</p>
            </div>

            <div>
              <Label htmlFor="payment-amount" className="text-sm font-medium text-gray-700">
                Amount (₹)
              </Label>
              <Input
                id="payment-amount"
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="text-xl font-bold text-center h-12 mt-2 border-2 focus:border-green-500"
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setScannedData(null)} className="flex-1 h-12">
                <RotateCcw className="w-4 h-4 mr-2" />
                Scan Again
              </Button>
              <Button
                onClick={handlePayment}
                disabled={!paymentAmount || Number.parseFloat(paymentAmount) <= 0}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold"
              >
                Pay ₹{paymentAmount || "0"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-amber-800 mb-2">🔒 Security Tips</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Always verify merchant details before paying</li>
            <li>• Double-check the amount before confirming</li>
            <li>• Only scan QR codes from trusted sources</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default Scan
