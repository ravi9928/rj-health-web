"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Edit, Trash, Search, Filter, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export function CouponManagement() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, doctors, procedures } = useStore()
  const { addToast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      searchTerm === "" ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || coupon.status === filterStatus
    const matchesType = filterType === "all" || coupon.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const handleAddCoupon = () => {
    setEditingCoupon({
      code: "",
      description: "",
      type: "percentage",
      value: 0,
      minAmount: 0,
      maxDiscount: null,
      validFrom: format(new Date(), "yyyy-MM-dd"),
      validTo: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
      usageLimit: 1,
      usedCount: 0,
      status: "active",
      applicableTo: "all",
      doctorId: "",
      procedureId: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon({ ...coupon })
    setIsDialogOpen(true)
  }

  const handleSaveCoupon = () => {
    if (!editingCoupon.code || !editingCoupon.description || editingCoupon.value <= 0) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields (Code, Description, Discount Value).",
        variant: "destructive",
      })
      return
    }

    if (editingCoupon.id) {
      updateCoupon(editingCoupon.id, editingCoupon)
      addToast({
        title: "Coupon Updated",
        description: `Coupon ${editingCoupon.code} has been updated.`,
        variant: "success",
      })
    } else {
      addCoupon(editingCoupon)
      addToast({
        title: "Coupon Added",
        description: `Coupon ${editingCoupon.code} has been added.`,
        variant: "success",
      })
    }
    setIsDialogOpen(false)
  }

  const handleDeleteCoupon = (id: string) => {
    deleteCoupon(id)
    addToast({
      title: "Coupon Deleted",
      description: "Coupon has been removed.",
      variant: "success",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coupon Management</h2>
          <p className="text-muted-foreground">Create and manage discount coupons for your services.</p>
        </div>
        <Button onClick={handleAddCoupon}>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by code or description..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Code</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[100px]">Discount</TableHead>
                  <TableHead className="min-w-[120px]">Valid From</TableHead>
                  <TableHead className="min-w-[120px]">Valid To</TableHead>
                  <TableHead className="min-w-[100px]">Usage</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[150px]">Applicable To</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">{coupon.code}</TableCell>
                      <TableCell>{coupon.description}</TableCell>
                      <TableCell className="capitalize">{coupon.type}</TableCell>
                      <TableCell>
                        {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value.toLocaleString("en-IN")}`}
                      </TableCell>
                      <TableCell>{format(new Date(coupon.validFrom), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(new Date(coupon.validTo), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        {coupon.usedCount}/{coupon.usageLimit}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(coupon.status)} className="capitalize">
                          {coupon.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {coupon.applicableTo === "all"
                          ? "All"
                          : coupon.applicableTo === "doctor"
                            ? doctors.find((d) => d.id === coupon.doctorId)?.name || "N/A"
                            : procedures.find((p) => p.id === coupon.procedureId)?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditCoupon(coupon)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteCoupon(coupon.id)}>
                            <Trash className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No coupons found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Coupon Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCoupon?.id ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
            <DialogDescription>
              {editingCoupon?.id ? "Update the coupon details." : "Add a new discount coupon."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={editingCoupon?.code || ""}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                  placeholder="e.g., SUMMER20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select
                  value={editingCoupon?.type || "percentage"}
                  onValueChange={(value) => setEditingCoupon({ ...editingCoupon, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={editingCoupon?.description || ""}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                placeholder="e.g., 20% off on all services for new users"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Discount Value *</Label>
                <Input
                  id="value"
                  type="number"
                  value={editingCoupon?.value || 0}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minAmount">Minimum Amount</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={editingCoupon?.minAmount || 0}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, minAmount: Number(e.target.value) })}
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editingCoupon?.validFrom && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingCoupon?.validFrom ? (
                        format(new Date(editingCoupon.validFrom), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingCoupon?.validFrom ? new Date(editingCoupon.validFrom) : undefined}
                      onSelect={(date) =>
                        date && setEditingCoupon({ ...editingCoupon, validFrom: format(date, "yyyy-MM-dd") })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validTo">Valid To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editingCoupon?.validTo && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingCoupon?.validTo ? (
                        format(new Date(editingCoupon.validTo), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingCoupon?.validTo ? new Date(editingCoupon.validTo) : undefined}
                      onSelect={(date) =>
                        date && setEditingCoupon({ ...editingCoupon, validTo: format(date, "yyyy-MM-dd") })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={editingCoupon?.usageLimit || 1}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: Number(e.target.value) })}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Discount (Optional)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={editingCoupon?.maxDiscount || ""}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscount: Number(e.target.value) || null })}
                  min="0"
                  placeholder="No limit"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicableTo">Applicable To</Label>
                <Select
                  value={editingCoupon?.applicableTo || "all"}
                  onValueChange={(value) => setEditingCoupon({ ...editingCoupon, applicableTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="doctor">Specific Doctor</SelectItem>
                    <SelectItem value="procedure">Specific Procedure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingCoupon?.applicableTo === "doctor" && (
                <div className="space-y-2">
                  <Label htmlFor="doctorId">Select Doctor</Label>
                  <Select
                    value={editingCoupon?.doctorId || ""}
                    onValueChange={(value) => setEditingCoupon({ ...editingCoupon, doctorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {editingCoupon?.applicableTo === "procedure" && (
                <div className="space-y-2">
                  <Label htmlFor="procedureId">Select Procedure</Label>
                  <Select
                    value={editingCoupon?.procedureId || ""}
                    onValueChange={(value) => setEditingCoupon({ ...editingCoupon, procedureId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select procedure" />
                    </SelectTrigger>
                    <SelectContent>
                      {procedures.map((procedure) => (
                        <SelectItem key={procedure.id} value={procedure.id}>
                          {procedure.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={editingCoupon?.status === "active"}
                onCheckedChange={(checked) =>
                  setEditingCoupon({ ...editingCoupon, status: checked ? "active" : "inactive" })
                }
              />
              <Label htmlFor="status">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCoupon}>{editingCoupon?.id ? "Save Changes" : "Create Coupon"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
