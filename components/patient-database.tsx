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
import { Plus, Edit, Trash, Search, Filter } from "lucide-react"
import { format } from "date-fns"

export function PatientDatabase() {
  const { patients, addPatient, updatePatient, deletePatient } = useStore()
  const { addToast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all") // "first-time" | "recurring" | "all"
  const [filterGender, setFilterGender] = useState("all") // "male" | "female" | "other" | "all"

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchTerm === "" ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || patient.type === filterType
    const matchesGender = filterGender === "all" || patient.gender === filterGender
    return matchesSearch && matchesType && matchesGender
  })

  const handleAddPatient = () => {
    setEditingPatient({
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "other",
      address: "",
      emergencyContact: "",
      medicalHistory: "",
      allergies: "",
      bloodGroup: "",
      registrationDate: format(new Date(), "yyyy-MM-dd"),
      lastVisit: null,
      totalVisits: 0,
      type: "first-time",
    })
    setIsDialogOpen(true)
  }

  const handleEditPatient = (patient: any) => {
    setEditingPatient({ ...patient })
    setIsDialogOpen(true)
  }

  const handleSavePatient = () => {
    if (!editingPatient.name || !editingPatient.phone || !editingPatient.email) {
      addToast({
        title: "Error",
        description: "Patient Name, Phone, and Email are required.",
        variant: "destructive",
      })
      return
    }

    if (editingPatient.id) {
      updatePatient(editingPatient.id, editingPatient)
      addToast({
        title: "Patient Updated",
        description: `${editingPatient.name}'s details have been updated.`,
        variant: "success",
      })
    } else {
      addPatient(editingPatient)
      addToast({
        title: "Patient Added",
        description: `${editingPatient.name} has been added to the database.`,
        variant: "success",
      })
    }
    setIsDialogOpen(false)
  }

  const handleDeletePatient = (id: string) => {
    deletePatient(id)
    addToast({
      title: "Patient Deleted",
      description: "Patient has been removed from the database.",
      variant: "success",
    })
  }

  const getVisitTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "first-time":
        return "default"
      case "recurring":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patient Database</h2>
          <p className="text-muted-foreground">Manage patient records, medical history, and contact information.</p>
        </div>
        <Button onClick={handleAddPatient}>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
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
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by visit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visit Types</SelectItem>
                <SelectItem value="first-time">First-Time</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[150px]">Email</TableHead>
                  <TableHead className="min-w-[120px]">Phone</TableHead>
                  <TableHead className="min-w-[100px]">Gender</TableHead>
                  <TableHead className="min-w-[120px]">Last Visit</TableHead>
                  <TableHead className="min-w-[100px]">Total Visits</TableHead>
                  <TableHead className="min-w-[120px]">Visit Type</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell className="capitalize">{patient.gender}</TableCell>
                      <TableCell>
                        {patient.lastVisit ? format(new Date(patient.lastVisit), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>{patient.totalVisits}</TableCell>
                      <TableCell>
                        <Badge variant={getVisitTypeBadgeVariant(patient.type)} className="capitalize">
                          {patient.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditPatient(patient)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeletePatient(patient.id)}>
                            <Trash className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No patients found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Patient Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingPatient?.id ? "Edit Patient" : "Add New Patient"}</DialogTitle>
            <DialogDescription>
              {editingPatient?.id ? "Update the patient's information." : "Add a new patient to your database."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={editingPatient?.name || ""}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingPatient?.email || ""}
                  onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                  placeholder="jane.doe@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={editingPatient?.phone || ""}
                  onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={editingPatient?.dateOfBirth || ""}
                  onChange={(e) => setEditingPatient({ ...editingPatient, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={editingPatient?.gender || "other"}
                  onValueChange={(value) => setEditingPatient({ ...editingPatient, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  value={editingPatient?.bloodGroup || ""}
                  onChange={(e) => setEditingPatient({ ...editingPatient, bloodGroup: e.target.value })}
                  placeholder="A+, O-, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={editingPatient?.address || ""}
                onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                placeholder="123 Main St, City, State, Zip"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={editingPatient?.emergencyContact || ""}
                onChange={(e) => setEditingPatient({ ...editingPatient, emergencyContact: e.target.value })}
                placeholder="+91 98765 12345 (Relation)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={editingPatient?.medicalHistory || ""}
                onChange={(e) => setEditingPatient({ ...editingPatient, medicalHistory: e.target.value })}
                placeholder="Chronic conditions, past surgeries, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                value={editingPatient?.allergies || ""}
                onChange={(e) => setEditingPatient({ ...editingPatient, allergies: e.target.value })}
                placeholder="Medications, food, environmental"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePatient}>{editingPatient?.id ? "Save Changes" : "Add Patient"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
