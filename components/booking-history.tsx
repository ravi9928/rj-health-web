"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Search, Filter, CalendarIcon, Eye, XCircle, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export function BookingHistory() {
  const { bookings, doctors, procedures, patients, updateBooking } = useStore()
  const { addToast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDoctor, setFilterDoctor] = useState("all")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [cancelReason, setCancelReason] = useState("")

  const filteredBookings = bookings.filter((booking) => {
    const patient = patients.find((p) => p.id === booking.patientId)
    const doctor = doctors.find((d) => d.id === booking.doctorId)
    const procedure = procedures.find((p) => p.id === booking.procedureId)

    const matchesSearch =
      searchTerm === "" ||
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    const matchesDoctor = filterDoctor === "all" || booking.doctorId === filterDoctor
    const matchesDate = !filterDate || format(new Date(booking.date), "yyyy-MM-dd") === format(filterDate, "yyyy-MM-dd")

    return matchesSearch && matchesStatus && matchesDoctor && matchesDate
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "completed":
        return "success"
      case "cancelled":
        return "destructive"
      case "paid":
        return "outline"
      default:
        return "default"
    }
  }

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsViewDialogOpen(true)
  }

  const handleCancelBooking = (booking: any) => {
    setSelectedBooking(booking)
    setCancelReason("")
    setIsCancelDialogOpen(true)
  }

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      updateBooking(selectedBooking.id, { status: "cancelled", notes: cancelReason })
      addToast({
        title: "Booking Cancelled",
        description: `Booking ${selectedBooking.id} has been cancelled.`,
        variant: "success",
      })
      setIsCancelDialogOpen(false)
      setSelectedBooking(null)
    }
  }

  const handleCompleteBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsCompleteDialogOpen(true)
  }

  const confirmCompleteBooking = () => {
    if (selectedBooking) {
      updateBooking(selectedBooking.id, { status: "completed", paymentStatus: "paid" }) // Assuming payment is handled
      addToast({
        title: "Booking Completed",
        description: `Booking ${selectedBooking.id} has been marked as completed.`,
        variant: "success",
      })
      setIsCompleteDialogOpen(false)
      setSelectedBooking(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Booking History</h2>
        <p className="text-muted-foreground">View and manage all appointments.</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, doctor, procedure, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDoctor} onValueChange={setFilterDoctor}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-auto justify-start text-left font-normal",
                    !filterDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "PPP") : <span>Filter by date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Booking ID</TableHead>
                  <TableHead className="min-w-[150px]">Patient Name</TableHead>
                  <TableHead className="min-w-[150px]">Doctor</TableHead>
                  <TableHead className="min-w-[150px]">Procedure</TableHead>
                  <TableHead className="min-w-[120px]">Date & Time</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Payment</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const patient = patients.find((p) => p.id === booking.patientId)
                    const doctor = doctors.find((d) => d.id === booking.doctorId)
                    const procedure = procedures.find((p) => p.id === booking.procedureId)

                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{patient?.name || "N/A"}</TableCell>
                        <TableCell>{doctor?.name || "N/A"}</TableCell>
                        <TableCell>{procedure?.name || "N/A"}</TableCell>
                        <TableCell>
                          {format(new Date(booking.date), "MMM dd, yyyy")} at {booking.time}
                        </TableCell>
                        <TableCell>₹{booking.amount.toLocaleString("en-IN")}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={booking.paymentStatus === "paid" ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleViewBooking(booking)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            {booking.status !== "cancelled" && booking.status !== "completed" && (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => handleCompleteBooking(booking)}>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="sr-only">Complete</span>
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleCancelBooking(booking)}>
                                  <XCircle className="h-4 w-4 text-destructive" />
                                  <span className="sr-only">Cancel</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No bookings found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Detailed information about the selected appointment.</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Booking ID</p>
                  <p className="text-muted-foreground">{selectedBooking.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={getStatusBadgeVariant(selectedBooking.status)} className="capitalize">
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Patient Name</p>
                  <p className="text-muted-foreground">
                    {patients.find((p) => p.id === selectedBooking.patientId)?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Patient Contact</p>
                  <p className="text-muted-foreground">
                    {patients.find((p) => p.id === selectedBooking.patientId)?.email || "N/A"} /{" "}
                    {patients.find((p) => p.id === selectedBooking.patientId)?.phone || "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Doctor</p>
                  <p className="text-muted-foreground">
                    {doctors.find((d) => d.id === selectedBooking.doctorId)?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Procedure</p>
                  <p className="text-muted-foreground">
                    {procedures.find((p) => p.id === selectedBooking.procedureId)?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {format(new Date(selectedBooking.date), "PPP")} at {selectedBooking.time}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-muted-foreground">₹{selectedBooking.amount.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Payment Status</p>
                <Badge
                  variant={selectedBooking.paymentStatus === "paid" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {selectedBooking.paymentStatus}
                </Badge>
                {selectedBooking.paymentId && (
                  <p className="text-xs text-muted-foreground mt-1">Payment ID: {selectedBooking.paymentId}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Notes</p>
                <p className="text-muted-foreground">{selectedBooking.notes || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Created At</p>
                <p className="text-muted-foreground">{format(new Date(selectedBooking.createdAt), "PPP p")}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Reason for Cancellation</Label>
              <Textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., Patient requested, Doctor unavailable"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              No, Keep Booking
            </Button>
            <Button variant="destructive" onClick={confirmCancelBooking} disabled={!cancelReason.trim()}>
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Booking Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Booking</DialogTitle>
            <DialogDescription>Are you sure you want to mark this booking as completed?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              This will update the booking status to "completed" and payment status to "paid".
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCompleteBooking}>Confirm Completion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
