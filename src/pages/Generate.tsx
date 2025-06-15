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
