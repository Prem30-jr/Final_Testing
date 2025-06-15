"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  QrCode,
  Download,
  Share2,
  Copy,
  ArrowLeft,
  CheckCircle2,
  User,
  IndianRupee,
  MessageSquare,
  Smartphone,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useToast } from "@/hooks/use-toast"

type GenerateStep = "form" | "generated" | "shared"

interface PaymentRequest {
  amount: string
  description: string
  recipientName: string
  recipientId: string
}

const Generate = () => {
  const [step, setStep] = useState<GenerateStep>("form")
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>({
    amount: "",
    description: "",
    recipientName: "Your Name", // This would come from user profile
    recipientId: "USER123456", // This would come from user profile
  })
  const [qrValue, setQrValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!paymentRequest.amount || Number.parseFloat(paymentRequest.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate QR generation delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const qrData = {
        type: "payment_request",
        id: paymentRequest.recipientId,
        name: paymentRequest.recipientName,
        amount: Number.parseFloat(paymentRequest.amount),
        description: paymentRequest.description,
        timestamp: Date.now(),
      }

      setQrValue(JSON.stringify(qrData))
      setStep("generated")

      toast({
        title: "QR Code Generated",
        description: "Your payment QR code is ready to share",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `payment-qr-${Date.now()}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }

      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: "Payment Request",
      text: `Pay ₹${paymentRequest.amount} to ${paymentRequest.recipientName}${paymentRequest.description ? ` for ${paymentRequest.description}` : ""}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setStep("shared")
        toast({
          title: "Shared Successfully",
          description: "Payment request has been shared",
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareData.text + "\n" + shareData.url)
      toast({
        title: "Copied to Clipboard",
        description: "Payment details copied to clipboard",
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue)
    toast({
      title: "Copied",
      description: "QR code data copied to clipboard",
    })
  }

  const resetForm = () => {
    setStep("form")
    setPaymentRequest({
      amount: "",
      description: "",
      recipientName: "Your Name",
      recipientId: "USER123456",
    })
    setQrValue("")
  }

  if (step === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Request Payment</h1>
            <div></div>
          </div>

          {/* Form Card */}
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-purple-600" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <IndianRupee className="h-4 w-4 inline mr-1" />
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl font-semibold text-gray-700">
                    ₹
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={paymentRequest.amount}
                    onChange={(e) => setPaymentRequest((prev) => ({ ...prev, amount: e.target.value }))}
                    className="pl-8 text-xl font-semibold h-14"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[50, 100, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setPaymentRequest((prev) => ({ ...prev, amount: amount.toString() }))}
                      className="h-9 text-sm"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Description (Optional)
                </label>
                <Textarea
                  placeholder="What is this payment for?"
                  value={paymentRequest.description}
                  onChange={(e) => setPaymentRequest((prev) => ({ ...prev, description: e.target.value }))}
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* Recipient Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Request From
                </label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{paymentRequest.recipientName}</div>
                    <div className="text-sm text-gray-500">ID: {paymentRequest.recipientId}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!paymentRequest.amount || Number.parseFloat(paymentRequest.amount) <= 0 || isGenerating}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating QR Code...</span>
              </div>
            ) : (
              <>
                <QrCode className="h-5 w-5 mr-2" />
                Generate QR Code
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "generated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => setStep("form")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Payment QR Code</h1>
            <div></div>
          </div>

          {/* QR Code Card */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-purple-600 mb-2">₹{paymentRequest.amount}</div>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                  <QrCode className="h-3 w-3 mr-1" />
                  Ready to Scan
                </Badge>
              </div>

              {/* QR Code */}
              <div ref={qrRef} className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-xl shadow-inner">
                  <QRCodeSVG value={qrValue} size={200} level="M" includeMargin={true} fgColor="#7C3AED" />
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">To</span>
                  <span className="font-semibold">{paymentRequest.recipientName}</span>
                </div>
                {paymentRequest.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">For</span>
                    <span className="font-semibold text-right max-w-[200px] truncate">
                      {paymentRequest.description}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Generated</span>
                  <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">How to use</h4>
                  <p className="text-sm text-blue-700">
                    Share this QR code with the person who needs to pay you. They can scan it with any UPI app to make
                    the payment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleShare}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share QR Code
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleDownload} className="h-12">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleCopy} className="h-12">
                <Copy className="h-4 w-4 mr-2" />
                Copy Data
              </Button>
            </div>

            <Button variant="outline" onClick={resetForm} className="w-full h-12">
              Create New Request
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "shared") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8 mt-16">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Shared!</h1>
            <p className="text-gray-600">Your payment request has been shared successfully</p>
          </div>

          {/* Summary Card */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600 mb-2">₹{paymentRequest.amount}</div>
                <Badge className="bg-green-100 text-green-800">
                  <Share2 className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Request From</span>
                  <span className="font-semibold">{paymentRequest.recipientName}</span>
                </div>
                {paymentRequest.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description</span>
                    <span className="font-semibold text-right max-w-[200px] truncate">
                      {paymentRequest.description}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shared At</span>
                  <span className="font-semibold">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={() => setStep("generated")} variant="outline" className="w-full h-12">
              View QR Code Again
            </Button>

            <Button
              onClick={resetForm}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Create New Request
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Generate
