"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import { useStore } from "@/lib/store"
import { Plus, Edit, Trash2, Search, Filter, Users, Stethoscope } from "lucide-react"

export function EnhancedDoctorsManagement() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor, razorpayAccounts } = useStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    bio: "",
    qualifications: "",
    firstTimeFee: 0,
    recurringFee: 0,
    priorityFee: 0,
    razorpayAccountId: "",
    status: "active" as "active" | "inactive",
  })

  const specialties = ["Gynecology", "Gastroenterology", "Cardiology", "Dermatology", "Pediatrics"]

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = filterSpecialty === "all" || doctor.specialty === filterSpecialty
    return matchesSearch && matchesSpecialty
  })

  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      bio: "",
      qualifications: "",
      firstTimeFee: 0,
      recurringFee: 0,
      priorityFee: 0,
      razorpayAccountId: "",
      status: "active",
    })
  }

  const handleAddDoctor = () => {
    if (!formData.name || !formData.specialty) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newDoctor = {
      id: `doctor_${Date.now()}`,
      ...formData,
      image: "/placeholder.svg?height=100&width=100",
      availability: {
        monday: { isAvailable: false, sessions: [], breaks: [] },
        tuesday: { isAvailable: false, sessions: [], breaks: [] },
        wednesday: { isAvailable: false, sessions: [], breaks: [] },
        thursday: { isAvailable: false, sessions: [], breaks: [] },
        friday: { isAvailable: false, sessions: [], breaks: [] },
        saturday: { isAvailable: false, sessions: [], breaks: [] },
        sunday: { isAvailable: false, sessions: [], breaks: [] },
      },
    }

    addDoctor(newDoctor)
    resetForm()
    setIsAddDialogOpen(false)
    toast({
      title: "Success",
      description: "Doctor added successfully",
    })
  }

  const handleEditDoctor = () => {
    if (!selectedDoctor || !formData.name || !formData.specialty) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    updateDoctor(selectedDoctor.id, formData)
    resetForm()
    setIsEditDialogOpen(false)
    setSelectedDoctor(null)
    toast({
      title: "Success",
      description: "Doctor updated successfully",
    })
  }

  const handleDeleteDoctor = (doctorId: string) => {
    deleteDoctor(doctorId)
    toast({
      title: "Success",
      description: "Doctor deleted successfully",
    })
  }

  const openEditDialog = (doctor: any) => {
    setSelectedDoctor(doctor)
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      bio: doctor.bio,
      qualifications: doctor.qualifications,
      firstTimeFee: doctor.firstTimeFee,
      recurringFee: doctor.recurringFee,
      priorityFee: doctor.priorityFee,
      razorpayAccountId: doctor.razorpayAccountId,
      status: doctor.status,
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Doctors Management</h2>
          <p className="text-muted-foreground">Manage your medical team and their schedules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
              <DialogDescription>Add a new doctor to your medical team</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty *</Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <Input
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  placeholder="MBBS, MD, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief description about the doctor"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstTimeFee">First Time Fee (₹)</Label>
                  <Input
                    id="firstTimeFee"
                    type="number"
                    value={formData.firstTimeFee}
                    onChange={(e) => setFormData({ ...formData, firstTimeFee: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recurringFee">Recurring Fee (₹)</Label>
                  <Input
                    id="recurringFee"
                    type="number"
                    value={formData.recurringFee}
                    onChange={(e) => setFormData({ ...formData, recurringFee: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priorityFee">Priority Fee (₹)</Label>
                  <Input
                    id="priorityFee"
                    type="number"
                    value={formData.priorityFee}
                    onChange={(e) => setFormData({ ...formData, priorityFee: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razorpayAccount">Razorpay Account</Label>
                  <Select
                    value={formData.razorpayAccountId}
                    onValueChange={(value) => setFormData({ ...formData, razorpayAccountId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {razorpayAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
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
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDoctor}>Add Doctor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                  <AvatarFallback>
                    <Stethoscope className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.specialty}</CardDescription>
                  <Badge variant={doctor.status === "active" ? "default" : "secondary"} className="mt-1">
                    {doctor.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="line-clamp-2">{doctor.bio}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="font-medium">₹{doctor.firstTimeFee}</p>
                  <p className="text-xs text-muted-foreground">First Time</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">₹{doctor.recurringFee}</p>
                  <p className="text-xs text-muted-foreground">Recurring</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">₹{doctor.priorityFee}</p>
                  <p className="text-xs text-muted-foreground">Priority</p>
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(doctor)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteDoctor(doctor.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>Update doctor information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specialty">Specialty *</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-qualifications">Qualifications</Label>
              <Input
                id="edit-qualifications"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstTimeFee">First Time Fee (₹)</Label>
                <Input
                  id="edit-firstTimeFee"
                  type="number"
                  value={formData.firstTimeFee}
                  onChange={(e) => setFormData({ ...formData, firstTimeFee: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-recurringFee">Recurring Fee (₹)</Label>
                <Input
                  id="edit-recurringFee"
                  type="number"
                  value={formData.recurringFee}
                  onChange={(e) => setFormData({ ...formData, recurringFee: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priorityFee">Priority Fee (₹)</Label>
                <Input
                  id="edit-priorityFee"
                  type="number"
                  value={formData.priorityFee}
                  onChange={(e) => setFormData({ ...formData, priorityFee: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-razorpayAccount">Razorpay Account</Label>
                <Select
                  value={formData.razorpayAccountId}
                  onValueChange={(value) => setFormData({ ...formData, razorpayAccountId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {razorpayAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
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
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDoctor}>Update Doctor</Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredDoctors.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No doctors found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || filterSpecialty !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first doctor to the system"}
            </p>
            {!searchTerm && filterSpecialty === "all" && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Doctor
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
