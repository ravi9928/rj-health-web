"use client"

import { useState } from "react"
import { CreditCard, DollarSign, TrendingUp, Users, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"

export function PaymentIntegration() {
  const { razorpayAccounts, bookings } = useStore()
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  // Calculate payment statistics
  const totalRevenue = bookings
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0)

  const totalTransactions = bookings.filter((b) => b.status === "paid").length
  const pendingPayments = bookings.filter((b) => b.status === "pending").length
  const failedPayments = bookings.filter((b) => b.status === "cancelled").length

  const successRate = totalTransactions > 0 ? 
    Math.round((totalTransactions / (totalTransactions + failedPayments)) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Payment Integration</h2>
          <p className="text-sm md:text-base text-muted-foreground">Monitor payment performance and Razorpay integration status.</p>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              -2 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Razorpay Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {razorpayAccounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <Badge variant={account.status === "active" ? "default" : "secondary"}>
                      {account.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    <Badge variant="outline" className="capitalize">
                      {account.category}
                    </Badge>
                    <Badge variant={account.mode === "live" ? "default" : "secondary"} className="ml-2">
                      {account.mode}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Key ID:</span>
                      <span className="font-mono text-xs">{account.keyId.substring(0, 15)}...</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Convenience Fee:</span>
                      <span>{account.convenienceFee}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Default:</span>
                      <span>{account.isDefault ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Connected & Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment transactions across all accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => {
                  const account = razorpayAccounts.find((a) => a.id === booking.razorpayAccountId)
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          {booking.status === "paid" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : booking.status === "cancelled" ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{booking.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.id} • {account?.name || "Unknown Account"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{booking.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Credit/Debit Cards</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">UPI</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Net Banking</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Performance</CardTitle>
                <CardDescription>Revenue by Razorpay account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {razorpayAccounts.map((account) => {
                  const accountBookings = bookings.filter((b) => b.razorpayAccountId === account.id && b.status === "paid")
                  const accountRevenue = accountBookings.reduce((sum, b) => sum + b.amount, 0)
                  const percentage = totalRevenue > 0 ? Math.round((accountRevenue / totalRevenue) * 100) : 0
                  
                  return (
                    <div key={account.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{account.name}</span>
                        <span className="text-sm">₹{accountRevenue.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
