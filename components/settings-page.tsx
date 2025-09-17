"use client"

import { useState } from "react"
import { Eye, EyeOff, Plus, Edit, Trash, Shield, Globe, Bell, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/toast"

export function SettingsPage() {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [isRazorpayDialogOpen, setIsRazorpayDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    settings,
    updateSettings,
    razorpayAccounts,
    addRazorpayAccount,
    updateRazorpayAccount,
    deleteRazorpayAccount,
  } = useStore()
  const { addToast } = useToast()

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSaveSettings = (section: keyof typeof settings, data: any) => {
    updateSettings(section, data)
    addToast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
      variant: "success",
    })
  }

  const handleAddRazorpayAccount = () => {
    setEditingAccount({
      name: "",
      keyId: "",
      keySecret: "",
      webhookSecret: "",
      mode: "test",
      isDefault: false,
      category: "all",
      status: "active",
      convenienceFee: 2.5,
    })
    setIsRazorpayDialogOpen(true)
  }

  const handleEditRazorpayAccount = (account: any) => {
    setEditingAccount({ ...account })
    setIsRazorpayDialogOpen(true)
  }

  const handleSaveRazorpayAccount = () => {
    setIsLoading(true)
    try {
      if (editingAccount.id) {
        updateRazorpayAccount(editingAccount.id, editingAccount)
        addToast({
          title: "Account Updated",
          description: "Razorpay account has been updated successfully.",
          variant: "success",
        })
      } else {
        addRazorpayAccount(editingAccount)
        addToast({
          title: "Account Added",
          description: "New Razorpay account has been added successfully.",
          variant: "success",
        })
      }
      setIsRazorpayDialogOpen(false)
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to save Razorpay account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRazorpayAccount = (accountId: string) => {
    deleteRazorpayAccount(accountId)
    addToast({
      title: "Account Deleted",
      description: "Razorpay account has been deleted successfully.",
      variant: "success",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage your clinic settings, payment accounts, and configurations.
        </p>
      </div>

      <Tabs defaultValue="razorpay" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="razorpay" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Razorpay</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="razorpay" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg md:text-xl">Razorpay Accounts</CardTitle>
                <CardDescription>
                  Manage multiple Razorpay accounts for different specialties and services.
                </CardDescription>
              </div>
              <Button onClick={handleAddRazorpayAccount} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Account Name</TableHead>
                      <TableHead className="min-w-[120px]">Category</TableHead>
                      <TableHead className="min-w-[80px]">Mode</TableHead>
                      <TableHead className="min-w-[100px]">Fee (%)</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[80px]">Default</TableHead>
                      <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {razorpayAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {account.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.mode === "live" ? "default" : "secondary"}>{account.mode}</Badge>
                        </TableCell>
                        <TableCell>{account.convenienceFee}%</TableCell>
                        <TableCell>
                          <Badge
                            variant={account.status === "active" ? "default" : "secondary"}
                            className={
                              account.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {account.isDefault && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Default
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEditRazorpayAccount(account)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRazorpayAccount(account.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Global Razorpay Settings</CardTitle>
              <CardDescription>Configure global payment settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-mode">Default Mode</Label>
                  <Select
                    value={settings.razorpay.defaultMode}
                    onValueChange={(value) =>
                      handleSaveSettings("razorpay", { ...settings.razorpay, defaultMode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test Mode</SelectItem>
                      <SelectItem value="live">Live Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="global-fee">Global Convenience Fee (%)</Label>
                  <Input
                    id="global-fee"
                    type="number"
                    step="0.1"
                    value={settings.razorpay.globalConvenienceFee}
                    onChange={(e) =>
                      handleSaveSettings("razorpay", {
                        ...settings.razorpay,
                        globalConvenienceFee: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Clinic Information</CardTitle>
              <CardDescription>Basic information about your healthcare clinic.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">Clinic Name</Label>
                  <Input
                    id="clinic-name"
                    value={settings.general.clinicName}
                    onChange={(e) => handleSaveSettings("general", { ...settings.general, clinicName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-phone">Phone Number</Label>
                  <Input
                    id="clinic-phone"
                    value={settings.general.clinicPhone}
                    onChange={(e) =>
                      handleSaveSettings("general", { ...settings.general, clinicPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic-address">Address</Label>
                <Textarea
                  id="clinic-address"
                  value={settings.general.clinicAddress}
                  onChange={(e) =>
                    handleSaveSettings("general", { ...settings.general, clinicAddress: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinic-email">Email</Label>
                  <Input
                    id="clinic-email"
                    type="email"
                    value={settings.general.clinicEmail}
                    onChange={(e) =>
                      handleSaveSettings("general", { ...settings.general, clinicEmail: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input
                    id="emergency-contact"
                    value={settings.general.emergencyContact}
                    onChange={(e) =>
                      handleSaveSettings("general", { ...settings.general, emergencyContact: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="working-hours">Working Hours</Label>
                  <Input
                    id="working-hours"
                    value={settings.general.workingHours}
                    onChange={(e) =>
                      handleSaveSettings("general", { ...settings.general, workingHours: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => handleSaveSettings("general", { ...settings.general, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.general.currency}
                    onValueChange={(value) => handleSaveSettings("general", { ...settings.general, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Firebase Cloud Messaging</CardTitle>
              <CardDescription>Configure FCM settings for push notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fcm-server-key">FCM Server Key</Label>
                <div className="relative">
                  <Input
                    id="fcm-server-key"
                    type={showPasswords.fcmServerKey ? "text" : "password"}
                    value={settings.notifications.fcmServerKey}
                    onChange={(e) =>
                      handleSaveSettings("notifications", {
                        ...settings.notifications,
                        fcmServerKey: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("fcmServerKey")}
                  >
                    {showPasswords.fcmServerKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vapid-key">VAPID Key</Label>
                <div className="relative">
                  <Input
                    id="vapid-key"
                    type={showPasswords.vapidKey ? "text" : "password"}
                    value={settings.notifications.vapidKey}
                    onChange={(e) =>
                      handleSaveSettings("notifications", {
                        ...settings.notifications,
                        vapidKey: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("vapidKey")}
                  >
                    {showPasswords.vapidKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Notification Preferences</CardTitle>
              <CardDescription>Configure when and how notifications are sent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-0.5">
                  <Label>Booking Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send reminders before appointments</p>
                </div>
                <Switch
                  checked={settings.notifications.enableBookingReminders}
                  onCheckedChange={(checked) =>
                    handleSaveSettings("notifications", {
                      ...settings.notifications,
                      enableBookingReminders: checked,
                    })
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-0.5">
                  <Label>Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify about payment status changes</p>
                </div>
                <Switch
                  checked={settings.notifications.enablePaymentNotifications}
                  onCheckedChange={(checked) =>
                    handleSaveSettings("notifications", {
                      ...settings.notifications,
                      enablePaymentNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-0.5">
                  <Label>Appointment Updates</Label>
                  <p className="text-sm text-muted-foreground">Send updates about appointment changes</p>
                </div>
                <Switch
                  checked={settings.notifications.enableAppointmentUpdates}
                  onCheckedChange={(checked) =>
                    handleSaveSettings("notifications", {
                      ...settings.notifications,
                      enableAppointmentUpdates: checked,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-time">Reminder Time (hours before)</Label>
                <Select
                  value={settings.notifications.reminderTimeBefore.toString()}
                  onValueChange={(value) =>
                    handleSaveSettings("notifications", {
                      ...settings.notifications,
                      reminderTimeBefore: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">SEO Settings</CardTitle>
              <CardDescription>Configure SEO metadata for your clinic's online presence.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={settings.seo.metaTitle}
                  onChange={(e) => handleSaveSettings("seo", { ...settings.seo, metaTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={settings.seo.metaDescription}
                  onChange={(e) => handleSaveSettings("seo", { ...settings.seo, metaDescription: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og-image">Open Graph Image URL</Label>
                <Input
                  id="og-image"
                  type="url"
                  value={settings.seo.ogImage}
                  onChange={(e) => handleSaveSettings("seo", { ...settings.seo, ogImage: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Razorpay Account Dialog */}
      <Dialog open={isRazorpayDialogOpen} onOpenChange={setIsRazorpayDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAccount?.id ? "Edit Razorpay Account" : "Add Razorpay Account"}</DialogTitle>
            <DialogDescription>Configure your Razorpay account settings for payment processing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  value={editingAccount?.name || ""}
                  onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                  placeholder="e.g., Gynecology Payments"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingAccount?.category || "all"}
                  onValueChange={(value) => setEditingAccount({ ...editingAccount, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="gynecology">Gynecology</SelectItem>
                    <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="key-id">Razorpay Key ID</Label>
              <Input
                id="key-id"
                value={editingAccount?.keyId || ""}
                onChange={(e) => setEditingAccount({ ...editingAccount, keyId: e.target.value })}
                placeholder="rzp_test_..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key-secret">Razorpay Key Secret</Label>
              <div className="relative">
                <Input
                  id="key-secret"
                  type={showPasswords.keySecret ? "text" : "password"}
                  value={editingAccount?.keySecret || ""}
                  onChange={(e) => setEditingAccount({ ...editingAccount, keySecret: e.target.value })}
                  placeholder="Your secret key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("keySecret")}
                >
                  {showPasswords.keySecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Webhook Secret</Label>
              <div className="relative">
                <Input
                  id="webhook-secret"
                  type={showPasswords.webhookSecret ? "text" : "password"}
                  value={editingAccount?.webhookSecret || ""}
                  onChange={(e) => setEditingAccount({ ...editingAccount, webhookSecret: e.target.value })}
                  placeholder="Your webhook secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("webhookSecret")}
                >
                  {showPasswords.webhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mode">Mode</Label>
                <Select
                  value={editingAccount?.mode || "test"}
                  onValueChange={(value) => setEditingAccount({ ...editingAccount, mode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test Mode</SelectItem>
                    <SelectItem value="live">Live Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="convenience-fee">Convenience Fee (%)</Label>
                <Input
                  id="convenience-fee"
                  type="number"
                  step="0.1"
                  value={editingAccount?.convenienceFee || 2.5}
                  onChange={(e) =>
                    setEditingAccount({ ...editingAccount, convenienceFee: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-default"
                  checked={editingAccount?.isDefault || false}
                  onCheckedChange={(checked) => setEditingAccount({ ...editingAccount, isDefault: checked })}
                />
                <Label htmlFor="is-default">Set as Default Account</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={editingAccount?.status === "active"}
                  onCheckedChange={(checked) =>
                    setEditingAccount({ ...editingAccount, status: checked ? "active" : "inactive" })
                  }
                />
                <Label htmlFor="is-active">Active Status</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRazorpayDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRazorpayAccount} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
