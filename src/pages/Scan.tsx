"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, type CameraType } from "react-camera-pro"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Flashlight,
  FlashlightOff,
  ScanLine,
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCredits } from "@/hooks/useCredits"

type ScanStep = "scanning" | "payment" | "verification" | "success" | "failed"

interface PaymentData {
  recipientId: string
  recipientName: string
  amount: number
  description?: string
}

const Scan = () => {
  const [step, setStep] = useState<ScanStep>("scanning")
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [enteredAmount, setEnteredAmount] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const camera = useRef<CameraType>(null)
  const { toast } = useToast()
  const { credits, deductCredits } = useCredits()

  // Generate transaction ID
  useEffect(() => {
    if (step === "verification") {
      setTransactionId(`TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`)
    }
  }, [step])

  const handleQRScan = (data: string) => {
    try {
      // Simulate QR code parsing
      const qrData = JSON.parse(data)
      setPaymentData({
        recipientId: qrData.id || "USER123456",
        recipientName: qrData.name || "John Doe",
        amount: qrData.amount || 0,
        description: qrData.description || "Payment",
      })
      setStep("payment")
    } catch (error) {
      // If not JSON, treat as simple payment request
      setPaymentData({
        recipientId: "USER123456",
        recipientName: "Merchant",
        amount: 0,
        description: "Payment",
      })
      setStep("payment")
    }
  }

  const handlePayment = () => {
    if (!enteredAmount || Number.parseFloat(enteredAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(enteredAmount) > credits) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough credits for this transaction",
        variant: "destructive",
      })
      return
    }

    setStep("verification")
  }

  const handleVerification = async () => {
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your transaction password",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate password verification (in real app, this would be server-side)
      if (password === "1234") {
        // Demo password
        // Deduct credits
        deductCredits(Number.parseFloat(enteredAmount))
        setStep("success")

        toast({
          title: "Payment Successful",
          description: `₹${enteredAmount} sent successfully`,
        })
      } else {
        setStep("failed")
        toast({
          title: "Verification Failed",
          description: "Invalid transaction password",
          variant: "destructive",
        })
      }
    } catch (error) {
      setStep("failed")
      toast({
        title: "Transaction Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetScan = () => {
    setStep("scanning")
    setPaymentData(null)
    setEnteredAmount("")
    setPassword("")
    setShowPassword(false)
    setIsProcessing(false)
    setTransactionId("")
  }

  const goBack = () => {
    if (step === "payment") {
      setStep("scanning")
    } else if (step === "verification") {
      setStep("payment")
    }
  }

  if (step === "scanning") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Scan & Pay</h1>
            <Button variant="ghost" size="icon" onClick={() => setFlashEnabled(!flashEnabled)}>
              {flashEnabled ? <FlashlightOff className="h-5 w-5" /> : <Flashlight className="h-5 w-5" />}
            </Button>
          </div>

          {/* Camera Card */}
          <Card className="mb-6 overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                <Camera
                  ref={camera}
                  aspectRatio={1}
                  numberOfCamerasCallback={() => {}}
                  facingMode="environment"
                  errorMessages={{
                    noCameraAccessible: "No camera device accessible",
                    permissionDenied: "Permission denied",
                    switchCamera: "Switch camera",
                    canvas: "Canvas not supported",
                  }}
                />

                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>

                      {/* Scanning Line Animation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ScanLine className="h-8 w-8 text-blue-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-gray-600 mb-2">Position the QR code within the frame</p>
              <p className="text-sm text-gray-500">The QR code will be scanned automatically</p>
            </CardContent>
          </Card>

          {/* Demo Button */}
          <Button
            onClick={() => handleQRScan('{"id":"DEMO123","name":"Demo Merchant","amount":100}')}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Demo Scan (For Testing)
          </Button>
        </div>
      </div>
    )
  }

  if (step === "payment") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Payment Details</h1>
            <div></div>
          </div>

          {/* Recipient Card */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{paymentData?.recipientName}</h3>
                  <p className="text-sm text-gray-500">ID: {paymentData?.recipientId}</p>
                </div>
              </div>

              {paymentData?.description && <p className="text-sm text-gray-600 mb-4">{paymentData.description}</p>}
            </CardContent>
          </Card>

          {/* Amount Input */}
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Enter Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl font-semibold text-gray-700">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  value={enteredAmount}
                  onChange={(e) => setEnteredAmount(e.target.value)}
                  className="pl-8 text-2xl font-semibold h-14 text-center"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[100, 200, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setEnteredAmount(amount.toString())}
                    className="h-10"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Balance Info */}
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Balance</span>
                <span className="font-semibold text-green-700">₹{credits.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={!enteredAmount || Number.parseFloat(enteredAmount) <= 0}
          >
            Proceed to Pay ₹{enteredAmount || "0"}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "verification") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={goBack} disabled={isProcessing}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Verify Payment</h1>
            <div></div>
          </div>

          {/* Security Card */}
          <Card className="mb-6 shadow-lg border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Transaction</h3>
              <p className="text-sm text-gray-600">Enter your transaction password to complete the payment</p>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">To</span>
                  <span className="font-semibold">{paymentData?.recipientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-lg">₹{enteredAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">{transactionId}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Input */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 h-12"
                  disabled={isProcessing}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-12 w-12"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isProcessing}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Demo password: 1234</p>
            </CardContent>
          </Card>

          {/* Verify Button */}
          <Button
            onClick={handleVerification}
            disabled={!password || isProcessing}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              `Verify & Pay ₹${enteredAmount}`
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8 mt-16">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Your payment has been processed successfully</p>
          </div>

          {/* Transaction Summary */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">₹{enteredAmount}</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">To</span>
                  <span className="font-semibold">{paymentData?.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="text-sm">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="text-green-600 font-semibold">Success</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => {
                // Share transaction details
                if (navigator.share) {
                  navigator.share({
                    title: "Payment Receipt",
                    text: `Payment of ₹${enteredAmount} to ${paymentData?.recipientName} completed successfully. Transaction ID: ${transactionId}`,
                  })
                }
              }}
            >
              Share Receipt
            </Button>

            <Button
              onClick={resetScan}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Make Another Payment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Error Animation */}
          <div className="text-center mb-8 mt-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600">Your transaction could not be completed</p>
          </div>

          {/* Error Details */}
          <Card className="mb-6 shadow-lg border-red-200">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-red-600 mb-2">₹{enteredAmount}</div>
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Failed
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">To</span>
                  <span className="font-semibold">{paymentData?.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reason</span>
                  <span className="text-red-600 text-sm">Invalid Password</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setStep("verification")}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Try Again
            </Button>

            <Button variant="outline" onClick={resetScan} className="w-full h-12">
              Start New Payment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Scan
