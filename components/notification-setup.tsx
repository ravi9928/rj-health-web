"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { notificationService } from "@/lib/notifications"
import { useToast } from "@/components/ui/toast"

export function NotificationSetup() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isRequesting, setIsRequesting] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    if (notificationService.isSupported()) {
      setPermission(notificationService.getPermissionStatus())
    }
  }, [])

  const handleEnableNotifications = async () => {
    setIsRequesting(true)
    try {
      const granted = await notificationService.requestPermission()
      if (granted) {
        setPermission("granted")
        addToast({
          title: "Notifications Enabled!",
          description: "You'll now receive important updates and reminders.",
          variant: "success",
        })
      } else {
        addToast({
          title: "Notifications Blocked",
          description: "You can enable notifications later in your browser settings.",
          variant: "destructive",
        })
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRequesting(false)
    }
  }

  const handleTestNotification = async () => {
    try {
      await notificationService.showNotification({
        title: "Test Notification",
        body: "This is a test notification from RJ Healthcare Admin.",
        icon: "/icon-192x192.png",
      })
      addToast({
        title: "Test Sent",
        description: "Check if you received the test notification.",
        variant: "success",
      })
    } catch (error) {
      addToast({
        title: "Test Failed",
        description: "Failed to send test notification.",
        variant: "destructive",
      })
    }
  }

  if (!notificationService.isSupported()) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {permission === "granted" ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          Notifications
        </CardTitle>
        <CardDescription>
          {permission === "granted"
            ? "Notifications are enabled. You'll receive important updates."
            : "Enable notifications to receive appointment reminders and updates."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {permission === "granted" ? (
            <Button onClick={handleTestNotification} variant="outline">
              Test Notification
            </Button>
          ) : (
            <Button onClick={handleEnableNotifications} disabled={isRequesting}>
              {isRequesting ? "Requesting..." : "Enable Notifications"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
