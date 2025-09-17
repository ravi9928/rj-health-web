"use client"

import { useState } from "react"
import { CalendarDays, DollarSign, TrendingUp, Users, Download, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useStore } from "@/lib/store"

// Sample analytics data
const revenueData = [
  { month: "Jan", revenue: 45000, bookings: 120 },
  { month: "Feb", revenue: 52000, bookings: 140 },
  { month: "Mar", revenue: 48000, bookings: 130 },
  { month: "Apr", revenue: 61000, bookings: 165 },
  { month: "May", revenue: 55000, bookings: 150 },
  { month: "Jun", revenue: 67000, bookings: 180 },
]

const specialtyData = [
  { name: "Gynecology", value: 65, color: "#0ea5e9" },
  { name: "Gastroenterology", value: 35, color: "#10b981" },
]

const doctorPerformance = [
  { name: "Dr. Sarah Johnson", bookings: 85, revenue: 102000 },
  { name: "Dr. Michael Chen", bookings: 72, revenue: 108000 },
]

export function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const { bookings, doctors, patients } = useStore()

  // Calculate real statistics
  const totalRevenue = bookings
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0)

  const totalBookings = bookings.length
  const totalPatients = patients.length
  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-sm md:text-base text-muted-foreground">Comprehensive insights into your clinic's performance.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
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
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Booking Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{avgBookingValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +7% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and booking trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue (₹)",
                  color: "hsl(var(--chart-1))",
                },
                bookings: {
                  label: "Bookings",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    name="Revenue (₹)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bookings"
                    stroke="var(--color-bookings)"
                    strokeWidth={2}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specialty Distribution</CardTitle>
            <CardDescription>Revenue distribution by medical specialty</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                gynecology: {
                  label: "Gynecology",
                  color: "#0ea5e9",
                },
                gastroenterology: {
                  label: "Gastroenterology",
                  color: "#10b981",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={specialtyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {specialtyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Performance</CardTitle>
          <CardDescription>Bookings and revenue by doctor</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              bookings: {
                label: "Bookings",
                color: "hsl(var(--chart-1))",
              },
              revenue: {
                label: "Revenue (₹)",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctorPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="bookings" fill="var(--color-bookings)" name="Bookings" />
                <Bar yAxisId="right" dataKey="revenue" fill="var(--color-revenue)" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
