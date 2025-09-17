interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export class PWAInstallService {
  private static instance: PWAInstallService
  private deferredPrompt: BeforeInstallPromptEvent | null = null
  private isInstallable = false

  static getInstance(): PWAInstallService {
    if (!PWAInstallService.instance) {
      PWAInstallService.instance = new PWAInstallService()
    }
    return PWAInstallService.instance
  }

  init(): void {
    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("beforeinstallprompt event fired")
      e.preventDefault()
      this.deferredPrompt = e as BeforeInstallPromptEvent
      this.isInstallable = true

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent("pwa-installable"))
    })

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed")
      this.deferredPrompt = null
      this.isInstallable = false

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent("pwa-installed"))
    })
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log("No install prompt available")
      return false
    }

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt()

      // Wait for the user to respond
      const { outcome } = await this.deferredPrompt.userChoice

      console.log(`User response to install prompt: ${outcome}`)

      // Clear the prompt
      this.deferredPrompt = null
      this.isInstallable = false

      return outcome === "accepted"
    } catch (error) {
      console.error("Error showing install prompt:", error)
      return false
    }
  }

  isInstallAvailable(): boolean {
    return this.isInstallable
  }

  isStandalone(): boolean {
    return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
  }

  canInstall(): boolean {
    return this.isInstallAvailable() && !this.isStandalone()
  }
}

export const pwaInstallService = PWAInstallService.getInstance()
