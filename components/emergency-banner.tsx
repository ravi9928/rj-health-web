"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, X, AlertTriangle } from "lucide-react"

export function EmergencyBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-red-600 text-white py-2 px-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium">
            24/7 Emergency Services Available - Call Now for Immediate Medical Assistance
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            size="sm"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-red-600 bg-transparent"
            onClick={() => window.open("tel:+919876543210")}
          >
            <Phone className="h-4 w-4 mr-2" />
            Emergency: +91-9876543210
          </Button>
          <button onClick={() => setIsVisible(false)} className="text-white hover:text-red-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
