"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import type { Transaction, QRData } from "../types"
import { generateId, signTransaction } from "../utils/crypto"
import { saveTransaction } from "../utils/storage"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { toast } from "./ui/use-toast"
import { Badge } from "./ui/badge"
import { ShieldCheck, Clock, QrCode, Sparkles, ArrowLeft, Copy, CheckCircle } from "lucide-react"

const QRGenerator: React.FC = () => {
  const [amount, setAmount] = useState<string>("")
  const [recipient, setRecipient] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(10)
  const [isExpired, setIsExpired] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (qrData && !isExpired) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsExpired(true)
            setQrData(null)
            toast({
              title: "QR Code Expired",
              description: "The QR code has expired. Please generate a new one.",
              variant: "destructive",
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [qrData, isExpired])

  const handleGenerate = () => {
    if (!amount || !recipient) {
      toast({
        title: "Missing information",
        description: "Please enter an amount and recipient.",
        variant: "destructive",
      })
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setIsExpired(false)
    setTimeLeft(10)

    const sender = "wallet_" + Math.random().toString(36).substring(2, 6)
    const publicKey = "pk_demo"

    const transaction: Transaction = {
      id: generateId(),
      amount: amountValue,
      recipient,
      sender,
      timestamp: Date.now(),
      description: description || "Transfer",
      status: "pending",
    }

    const fakePrivateKey = "sk_demo"

    const signature = signTransaction(transaction, fakePrivateKey)
    transaction.signature = signature

    const newQrData: QRData = {
      transaction,
      publicKey,
    }

    saveTransaction(transaction)

    setTimeout(() => {
      setQrData(newQrData)
      setIsGenerating(false)

      toast({
        title: "QR Code Generated",
        description: "Transaction has been digitally signed and is ready to share.",
      })
    }, 1500)
  }

  const handleReset = () => {
    setQrData(null)
    setAmount("")
    setRecipient("")
    setDescription("")
    setIsExpired(false)
    setTimeLeft(10)
    setCopied(false)
  }

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(JSON.stringify(qrData))
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "QR data has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!qrData ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-white via-white to-blue-50/30 backdrop-blur-sm shadow-xl border-0 ring-1 ring-black/5">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Generate Payment QR
                </CardTitle>
                <p className="text-sm text-muted-foreground">Create a secure, digitally signed payment request</p>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                    Amount *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <Input
                      id="amount"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-8 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">
                    Recipient *
                  </Label>
                  <Input
                    id="recipient"
                    placeholder="Enter recipient name or address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="What is this payment for? (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="resize-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    rows={3}
                  />
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  onClick={handleGenerate}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Generate QR Code</span>
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="qr"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Timer Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / 10) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>

            <Card className="bg-gradient-to-br from-white via-white to-green-50/30 shadow-2xl border-0 ring-1 ring-black/5">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Secured</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono bg-blue-50 border-blue-200">
                    {qrData.transaction.signature?.substring(4, 14)}...
                  </Badge>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Expires in {timeLeft} seconds</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col items-center space-y-6">
                {/* QR Code with enhanced styling */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-20" />
                  <div className="relative p-6 bg-white rounded-2xl shadow-lg ring-1 ring-black/5">
                    <QRCodeSVG
                      value={JSON.stringify(qrData)}
                      size={220}
                      level="H"
                      includeMargin
                      className="mx-auto"
                      fgColor="#1f2937"
                      bgColor="#ffffff"
                    />
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="w-full space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      ₹{qrData.transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Transaction Amount</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">To:</span>
                      <span className="text-sm font-medium text-gray-900 truncate ml-2">
                        {qrData.transaction.recipient}
                      </span>
                    </div>

                    {qrData.transaction.description && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">For:</span>
                        <span className="text-sm text-gray-900 text-right ml-2">{qrData.transaction.description}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ID:</span>
                      <span className="text-xs font-mono text-gray-500">
                        {qrData.transaction.id.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  New QR
                </Button>

                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="h-11 px-4 border-gray-200 hover:bg-gray-50"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs text-blue-700 font-medium">Scan to complete payment</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QRGenerator
