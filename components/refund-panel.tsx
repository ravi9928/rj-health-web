"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Search, Filter, CheckCircle, XCircle, Eye } from "lucide-react"
import { format } from "date-fns"

export function RefundPanel() {
  const { refunds, bookings, patients, updateRefund } = useStore()
  const { addToast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false)
  const [selectedRefund, setSelectedRefund] = useState<any>(null)
  const [processingNotes, setProcessingNotes] = useState("")

  const filteredRefunds = refunds.filter((refund) => {
    const booking = bookings.find((b) => b.id === refund.bookingId)
    const patient = patients.find((p) => p.id === refund.userId) // Assuming userId in refund is patientId

    const matchesSearch =
      searchTerm === "" ||
      refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking?.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || refund.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processed":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleViewRefund = (refund: any) => {
    setSelectedRefund(refund)
    setIsViewDialogOpen(true)
  }

  const handleProcessRefund = (refund: any) => {
    setSelectedRefund(refund)
    setProcessingNotes("")
    setIsProcessDialogOpen(true)
  }

  const confirmProcessRefund = () => {
    if (selectedRefund) {
      updateRefund(selectedRefund.id, {
        status: "processed",
        processedAt: new Date().toISOString(),
        notes: processingNotes,
      })
      addToast({
        title: "Refund Processed",
        description: `Refund ${selectedRefund.id} has been marked as processed.`,
        variant: "success",
      })
      setIsProcessDialogOpen(false)
      setSelectedRefund(null)
    }
  }

  const handleRejectRefund = (refund: any) => {
    if (confirm("Are you sure you want to reject this refund request?")) {
      updateRefund(refund.id, {
        status: "rejected",
        processedAt: new Date().toISOString(),
        notes: "Rejected by admin.",
      })
      addToast({
        title: "Refund Rejected",
        description: `Refund ${refund.id} has been rejected.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Refund Management</h2>
        <p className="text-muted-foreground">Manage and process refund requests for cancelled bookings.</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by refund ID, booking ID, or patient name..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Refunds Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Refund ID</TableHead>
                  <TableHead className="min-w-[120px]">Booking ID</TableHead>
                  <TableHead className="min-w-[150px]">Patient Name</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[200px]">Reason</TableHead>
                  <TableHead className="min-w-[120px]">Requested At</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRefunds.length > 0 ? (
                  filteredRefunds.map((refund) => {
                    const patient = patients.find((p) => p.id === refund.userId) // Assuming userId in refund is patientId
                    return (
                      <TableRow key={refund.id}>
                        <TableCell className="font-medium">{refund.id}</TableCell>
                        <TableCell>{refund.bookingId}</TableCell>
                        <TableCell>{patient?.name || "N/A"}</TableCell>
                        <TableCell>₹{refund.amount.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="line-clamp-1">{refund.reason}</TableCell>
                        <TableCell>{format(new Date(refund.requestedAt), "MMM dd, yyyy p")}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(refund.status)} className="capitalize">
                            {refund.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleViewRefund(refund)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            {refund.status === "pending" && (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => handleProcessRefund(refund)}>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="sr-only">Process</span>
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleRejectRefund(refund)}>
                                  <XCircle className="h-4 w-4 text-destructive" />
                                  <span className="sr-only">Reject</span>
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
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No refund requests found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Refund Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Refund Details</DialogTitle>
            <DialogDescription>Detailed information about the selected refund request.</DialogDescription>
          </DialogHeader>
          {selectedRefund && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Refund ID</p>
                  <p className="text-muted-foreground">{selectedRefund.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={getStatusBadgeVariant(selectedRefund.status)} className="capitalize">
                    {selectedRefund.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Booking ID</p>
                  <p className="text-muted-foreground">{selectedRefund.bookingId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Payment ID</p>
                  <p className="text-muted-foreground">{selectedRefund.paymentId || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Patient Name</p>
                  <p className="text-muted-foreground">
                    {patients.find((p) => p.id === selectedRefund.userId)?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-muted-foreground">₹{selectedRefund.amount.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Reason</p>
                <p className="text-muted-foreground">{selectedRefund.reason || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Requested At</p>
                  <p className="text-muted-foreground">{format(new Date(selectedRefund.requestedAt), "PPP p")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Processed At</p>
                  <p className="text-muted-foreground">
                    {selectedRefund.processedAt ? format(new Date(selectedRefund.processedAt), "PPP p") : "N/A"}
                  </p>
                </div>
              </div>
              {selectedRefund.notes && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Processing Notes</p>
                  <p className="text-muted-foreground">{selectedRefund.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Refund Dialog */}
      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>Confirm processing this refund. You can add notes.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="processingNotes">Processing Notes (Optional)</Label>
              <Textarea
                id="processingNotes"
                value={processingNotes}
                onChange={(e) => setProcessingNotes(e.target.value)}
                placeholder="e.g., Refund initiated via Razorpay, Transaction ID: XYZ"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmProcessRefund}>Confirm Process</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
