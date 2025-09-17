"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { pwaInstallService } from "@/lib/pwa-install"
import { useToast } from "@/components/ui/toast"

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    pwaInstallService.init()

    const handleInstallable = () => {
      if (pwaInstallService.canInstall()) {
        setShowPrompt(true)
      }
    }

    const handleInstalled = () => {
      setShowPrompt(false)
      addToast({
        title: "App Installed!",
        description: "RJ Healthcare Admin has been installed successfully.",
        variant: "success",
      })
    }

    window.addEventListener("pwa-installable", handleInstallable)
    window.addEventListener("pwa-installed", handleInstalled)

    // Check if already installable
    if (pwaInstallService.canInstall()) {
      setShowPrompt(true)
    }

    return () => {
      window.removeEventListener("pwa-installable", handleInstallable)
      window.removeEventListener("pwa-installed", handleInstalled)
    }
  }, [addToast])

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const installed = await pwaInstallService.promptInstall()
      if (installed) {
        setShowPrompt(false)
        addToast({
          title: "Installation Started",
          description: "The app is being installed...",
          variant: "success",
        })
      } else {
        addToast({
          title: "Installation Cancelled",
          description: "You can install the app later from the browser menu.",
        })
      }
    } catch (error) {
      addToast({
        title: "Installation Failed",
        description: "There was an error installing the app. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    addToast({
      title: "Install Reminder",
      description: "You can install the app anytime from the browser menu.",
    })
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Install App</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Install RJ Healthcare Admin for a better experience with offline access and notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button onClick={handleInstall} disabled={isInstalling} className="flex-1">
              {isInstalling ? "Installing..." : "Install"}
            </Button>
            <Button variant="outline" onClick={handleDismiss}>
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
