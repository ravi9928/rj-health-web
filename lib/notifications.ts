import { messaging, functions } from "@/lib/firebase"

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
}

export class NotificationService {
  private static instance: NotificationService
  private fcmToken: string | null = null

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async requestPermission(): Promise<boolean> {
    try {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications")
        return false
      }

      const permission = await Notification.requestPermission()
      console.log("Notification permission:", permission)

      if (permission === "granted") {
        await this.initializeFCM()
        return true
      }

      return false
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }

  async initializeFCM(): Promise<void> {
    try {
      // Get FCM token
      this.fcmToken = await messaging.getToken()
      console.log("FCM Token:", this.fcmToken)

      // Store token in localStorage for persistence
      localStorage.setItem("fcm_token", this.fcmToken)

      // Listen for messages
      messaging.onMessage((payload) => {
        console.log("Message received:", payload)
        this.showNotification(payload.notification)
      })

      // Send token to server
      await this.sendTokenToServer(this.fcmToken)
    } catch (error) {
      console.error("Error initializing FCM:", error)
    }
  }

  private async sendTokenToServer(token: string): Promise<void> {
    try {
      const sendToken = functions.httpsCallable("saveUserToken")
      await sendToken({ token, userId: "admin123" })
      console.log("Token sent to server successfully")
    } catch (error) {
      console.error("Error sending token to server:", error)
    }
  }

  async showNotification(payload: NotificationPayload): Promise<void> {
    try {
      if ("serviceWorker" in navigator && "Notification" in window) {
        const registration = await navigator.serviceWorker.ready

        await registration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || "/icon-192x192.png",
          badge: payload.badge || "/icon-192x192.png",
          data: payload.data,
          requireInteraction: true,
          actions: [
            {
              action: "view",
              title: "View",
            },
            {
              action: "dismiss",
              title: "Dismiss",
            },
          ],
        })
      } else {
        // Fallback for browsers without service worker
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || "/icon-192x192.png",
        })
      }
    } catch (error) {
      console.error("Error showing notification:", error)
    }
  }

  async sendNotificationToUser(userId: string, payload: NotificationPayload): Promise<void> {
    try {
      const sendNotification = functions.httpsCallable("sendNotification")
      await sendNotification({
        userId,
        notification: payload,
      })
      console.log("Notification sent successfully")
    } catch (error) {
      console.error("Error sending notification:", error)
    }
  }

  async sendBulkNotification(userIds: string[], payload: NotificationPayload): Promise<void> {
    try {
      const sendBulkNotification = functions.httpsCallable("sendBulkNotification")
      await sendBulkNotification({
        userIds,
        notification: payload,
      })
      console.log("Bulk notification sent successfully")
    } catch (error) {
      console.error("Error sending bulk notification:", error)
    }
  }

  getToken(): string | null {
    return this.fcmToken || localStorage.getItem("fcm_token")
  }

  isSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission
  }
}

export const notificationService = NotificationService.getInstance()
