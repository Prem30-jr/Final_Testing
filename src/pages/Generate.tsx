"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Download, Copy, IndianRupee } from "lucide-react"
import QRGenerator from "@/components/QRGenerator"
import { toast } from "sonner"

const Generate = () => {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [qrGenerated, setQrGenerated] = useState(false)

  const handleGenerateQR = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    setQrGenerated(true)
    toast.success("QR Code generated successfully!")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "OFF PAY - Payment Request",
        text: `Pay ₹${amount} ${note ? `for ${note}` : ""}`,
        url: window.location.href,
      })
    } else {
      toast.info("Share feature not supported on this device")
    }
  }

  const quickAmounts = [100, 200, 500, 1000]

  return (
    <div className="p-4 space-y-6">
      {/* Amount Input Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            <IndianRupee className="w-5 h-5 mr-2 text-green-600" />
            Request Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold text-center h-14 mt-2 border-2 focus:border-blue-500"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="h-10 text-sm font-medium hover:bg-blue-50 hover:border-blue-300"
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="note" className="text-sm font-medium text-gray-700">
              Note (Optional)
            </Label>
            <Input
              id="note"
              placeholder="What's this payment for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button
            onClick={handleGenerateQR}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            disabled={!amount || Number.parseFloat(amount) <= 0}
          >
            Generate QR Code
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {qrGenerated && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment QR Code</h3>
              <p className="text-sm text-gray-600">Show this QR code to receive ₹{amount}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-inner mb-4">
              <QRGenerator amount={Number.parseFloat(amount)} note={note} className="mx-auto" />
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">₹{amount}</p>
                {note && <p className="text-sm text-gray-600 mt-1">{note}</p>}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 h-10">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("QR code copied!")}
                  className="flex-1 h-10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("QR code downloaded!")}
                  className="flex-1 h-10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Keep your phone steady while showing the QR code</li>
            <li>• Make sure the amount is correct before generating</li>
            <li>• Add a note to help identify the payment</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default Generate
