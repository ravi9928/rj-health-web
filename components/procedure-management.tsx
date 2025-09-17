"use client"

import { useState } from "react"
import { Plus, Edit, Trash, Search, Filter, DollarSign, Clock, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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

export function ProcedureManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProcedure, setEditingProcedure] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterDoctor, setFilterDoctor] = useState("all")

  const { procedures, addProcedure, updateProcedure, deleteProcedure, doctors } = useStore()
  const { addToast } = useToast()

  const categories = Array.from(new Set(procedures.map((p) => p.category)))

  const filteredProcedures = procedures.filter((procedure) => {
    const matchesSearch =
      searchTerm === "" ||
      procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || procedure.category === filterCategory
    const matchesDoctor = filterDoctor === "all" || procedure.doctorIds?.includes(filterDoctor)
    return matchesSearch && matchesCategory && matchesDoctor
  })

  const handleAddProcedure = () => {
    setEditingProcedure({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "",
      status: "active",
      doctorIds: [],
    })
    setIsDialogOpen(true)
  }

  const handleEditProcedure = (procedure: any) => {
    setEditingProcedure({ ...procedure })
    setIsDialogOpen(true)
  }

  const handleSaveProcedure = () => {
    if (!editingProcedure.name || !editingProcedure.price || !editingProcedure.category) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields (Name, Price, Category).",
        variant: "destructive",
      })
      return
    }

    if (editingProcedure.id) {
      updateProcedure(editingProcedure.id, editingProcedure)
      addToast({
        title: "Procedure Updated",
        description: `${editingProcedure.name} has been updated successfully.`,
        variant: "success",
      })
    } else {
      addProcedure(editingProcedure)
      addToast({
        title: "Procedure Added",
        description: `${editingProcedure.name} has been added successfully.`,
        variant: "success",
      })
    }
    setIsDialogOpen(false)
  }

  const handleDeleteProcedure = (id: string) => {
    deleteProcedure(id)
    addToast({
      title: "Procedure Deleted",
      description: "Procedure has been removed successfully.",
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
          <h2 className="text-3xl font-bold tracking-tight">Procedure Management</h2>
          <p className="text-muted-foreground">Manage the medical procedures and services offered by your clinic.</p>
        </div>
        <Button onClick={handleAddProcedure}>
          <Plus className="mr-2 h-4 w-4" />
          Add Procedure
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
                  placeholder="Search procedures by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
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
          </div>
        </CardContent>
      </Card>

      {/* Procedures Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProcedures.map((procedure) => (
          <Card key={procedure.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">{procedure.name}</CardTitle>
                <CardDescription>{procedure.category}</CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(procedure.status)} className="capitalize">
                {procedure.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{procedure.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Price: ₹{procedure.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {procedure.duration} mins</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Associated Doctors: </span>
                {procedure.doctorIds && procedure.doctorIds.length > 0
                  ? procedure.doctorIds
                      .map((id) => doctors.find((d) => d.id === id)?.name)
                      .filter(Boolean)
                      .join(", ")
                  : "N/A"}
              </div>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEditProcedure(procedure)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteProcedure(procedure.id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredProcedures.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No procedures found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Try adjusting your search or filter criteria, or add a new procedure.
              </p>
              <Button onClick={handleAddProcedure}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Procedure
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Procedure Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProcedure?.id ? "Edit Procedure" : "Add New Procedure"}</DialogTitle>
            <DialogDescription>
              {editingProcedure?.id ? "Update the procedure's details." : "Add a new medical procedure or service."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Procedure Name *</Label>
              <Input
                id="name"
                value={editingProcedure?.name || ""}
                onChange={(e) => setEditingProcedure({ ...editingProcedure, name: e.target.value })}
                placeholder="e.g., Routine Checkup"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingProcedure?.description || ""}
                onChange={(e) => setEditingProcedure({ ...editingProcedure, description: e.target.value })}
                placeholder="A brief description of the procedure."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingProcedure?.price || 0}
                  onChange={(e) => setEditingProcedure({ ...editingProcedure, price: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={editingProcedure?.duration || 0}
                  onChange={(e) => setEditingProcedure({ ...editingProcedure, duration: Number(e.target.value) })}
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={editingProcedure?.category || ""}
                  onChange={(e) => setEditingProcedure({ ...editingProcedure, category: e.target.value })}
                  placeholder="e.g., Consultation, Diagnostic, Surgery"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingProcedure?.status || "active"}
                  onValueChange={(value) => setEditingProcedure({ ...editingProcedure, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorIds">Associated Doctors</Label>
              <Select
                value={editingProcedure?.doctorIds?.[0] || ""} // Assuming single doctor for simplicity in UI
                onValueChange={(value) => setEditingProcedure({ ...editingProcedure, doctorIds: value ? [value] : [] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select associated doctor(s)" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialty})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Select the doctor(s) who perform this procedure.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProcedure}>{editingProcedure?.id ? "Save Changes" : "Add Procedure"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
