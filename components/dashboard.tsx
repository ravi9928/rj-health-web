"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Calendar } from "lucide-react"
import { useStore } from "@/lib/store"

export function Dashboard() {
  const { doctors, procedures, bookings, patients } = useStore()

  const totalDoctors = doctors.length
  const totalProcedures = procedures.length
  const totalBookings = bookings.length
  const totalPatients = patients.length

  const upcomingBookings = bookings.filter(
    (booking) =>
      new Date(booking.date) >= new Date() && booking.status !== "cancelled" && booking.status !== "completed",
  ).length

  const revenue = bookings.reduce((sum, booking) => sum + (booking.paymentStatus === "paid" ? booking.amount : 0), 0)

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenue.toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clinic Overview</CardTitle>
            <CardDescription>Quick stats about your clinic's operations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Doctors Registered</span>
              <span className="text-lg font-bold">{totalDoctors}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Procedures Offered</span>
              <span className="text-lg font-bold">{totalProcedures}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Coupons</span>
              <span className="text-lg font-bold">
                {useStore.getState().coupons.filter((c) => c.status === "active").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest appointments booked by patients.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium leading-none">{booking.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {doctors.find((d) => d.id === booking.doctorId)?.name} -{" "}
                        {procedures.find((p) => p.id === booking.procedureId)?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{booking.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                  </div>
                ))}
              {bookings.length === 0 && <p className="text-center text-muted-foreground">No recent bookings.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
