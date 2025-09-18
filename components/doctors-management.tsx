"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Plus, Edit, Trash, Search, Filter, UploadCloud } from "lucide-react"
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
import { Users } from "lucide-react" // Import Users component

export function DoctorsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState("all")
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { doctors, addDoctor, updateDoctor, deleteDoctor, razorpayAccounts } = useStore()
  const { addToast } = useToast()

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)))

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = filterSpecialty === "all" || doctor.specialty === filterSpecialty
    return matchesSearch && matchesSpecialty
  })

  const handleAddDoctor = () => {
    setEditingDoctor({
      name: "",
      specialty: "",
      bio: "",
      qualifications: "",
      image: "/placeholder.svg?height=100&width=100",
      firstTimeFee: 0,
      recurringFee: 0,
      priorityFee: 0,
      razorpayAccountId: "",
      status: "active",
      availability: {
        monday: { isAvailable: true, sessions: [], breaks: [] },
        tuesday: { isAvailable: true, sessions: [], breaks: [] },
        wednesday: { isAvailable: true, sessions: [], breaks: [] },
        thursday: { isAvailable: true, sessions: [], breaks: [] },
        friday: { isAvailable: true, sessions: [], breaks: [] },
        saturday: { isAvailable: false, sessions: [], breaks: [] },
        sunday: { isAvailable: false, sessions: [], breaks: [] },
      },
    })
    setSelectedImage(null)
    setImagePreview(null)
    setIsDialogOpen(true)
  }

  const handleEditDoctor = (doctor: any) => {
    setEditingDoctor({ ...doctor })
    setImagePreview(doctor.image)
    setSelectedImage(null)
    setIsDialogOpen(true)
  }

  const handleSaveDoctor = async () => {
    if (!editingDoctor.name || !editingDoctor.specialty || !editingDoctor.firstTimeFee) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields (Name, Specialty, First Time Fee).",
        variant: "destructive",
      })
      return
    }

    // Simulate image upload
    let imageUrl = editingDoctor.image
    if (selectedImage) {
      // In a real app, you'd upload to Firebase Storage here and get the URL
      // For now, we'll just use a placeholder or the existing preview
      imageUrl = imagePreview || "/placeholder.svg?height=100&width=100"
      addToast({
        title: "Image Uploaded",
        description: "Doctor image simulated upload.",
        variant: "success",
      })
    }

    const doctorToSave = { ...editingDoctor, image: imageUrl }

    if (editingDoctor.id) {
      updateDoctor(editingDoctor.id, doctorToSave)
      addToast({
        title: "Doctor Updated",
        description: `${editingDoctor.name} has been updated successfully.`,
        variant: "success",
      })
    } else {
      addDoctor(doctorToSave)
      addToast({
        title: "Doctor Added",
        description: `${editingDoctor.name} has been added successfully.`,
        variant: "success",
      })
    }
    setIsDialogOpen(false)
  }

  const handleDeleteDoctor = (id: string) => {
    deleteDoctor(id)
    addToast({
      title: "Doctor Deleted",
      description: "Doctor has been removed successfully.",
      variant: "success",
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Doctors Management</h2>
          <p className="text-muted-foreground">Manage your clinic's doctors, their specialties, and availability.</p>
        </div>
        <Button onClick={handleAddDoctor}>
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
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
                  placeholder="Search doctors by name..."
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <Image
                  src={doctor.image || "/placeholder.svg?height=100&width=100"}
                  alt={doctor.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
                <div>
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.specialty}</CardDescription>
                </div>
              </div>
              <Badge variant={doctor.status === "active" ? "default" : "secondary"}>{doctor.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Qualifications:</span> {doctor.qualifications}
                </div>
                <div>
                  <span className="font-medium">Fees:</span> ₹{doctor.firstTimeFee} (First), ₹{doctor.recurringFee}{" "}
                  (Recurring)
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEditDoctor(doctor)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteDoctor(doctor.id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredDoctors.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No doctors found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Try adjusting your search or filter criteria, or add a new doctor.
              </p>
              <Button onClick={handleAddDoctor}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Doctor
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Doctor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingDoctor?.id ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
            <DialogDescription>
              {editingDoctor?.id ? "Update the doctor's information." : "Add a new doctor to your clinic."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                <Image
                  src={imagePreview || editingDoctor?.image || "/placeholder.svg?height=100&width=100"}
                  alt="Doctor Image"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                  <UploadCloud className="h-4 w-4" /> Upload Image
                </Label>
                <Input id="image-upload" type="file" className="hidden" onChange={handleImageChange} />
                {imagePreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null)
                      setSelectedImage(null)
                      setEditingDoctor({ ...editingDoctor, image: "" })
                    }}
                  >
                    Remove Image
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={editingDoctor?.name || ""}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  placeholder="Dr. Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty *</Label>
                <Input
                  id="specialty"
                  value={editingDoctor?.specialty || ""}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                  placeholder="e.g., Cardiology, Pediatrics"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editingDoctor?.bio || ""}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                placeholder="A brief description of the doctor's experience and focus."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input
                id="qualifications"
                value={editingDoctor?.qualifications || ""}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, qualifications: e.target.value })}
                placeholder="MBBS, MD, etc."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstTimeFee">First Time Fee *</Label>
                <Input
                  id="firstTimeFee"
                  type="number"
                  value={editingDoctor?.firstTimeFee || 0}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, firstTimeFee: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recurringFee">Recurring Fee</Label>
                <Input
                  id="recurringFee"
                  type="number"
                  value={editingDoctor?.recurringFee || 0}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, recurringFee: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priorityFee">Priority Fee</Label>
                <Input
                  id="priorityFee"
                  type="number"
                  value={editingDoctor?.priorityFee || 0}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, priorityFee: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="razorpayAccountId">Razorpay Account</Label>
                <Select
                  value={editingDoctor?.razorpayAccountId || ""}
                  onValueChange={(value) => setEditingDoctor({ ...editingDoctor, razorpayAccountId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Razorpay Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {razorpayAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.mode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingDoctor?.status || "active"}
                  onValueChange={(value) => setEditingDoctor({ ...editingDoctor, status: value })}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDoctor}>{editingDoctor?.id ? "Save Changes" : "Add Doctor"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
