"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/toast"
import { useStore } from "@/lib/store"
import { format, isPast, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Info } from "lucide-react"

export function EnhancedBookingSystem() {
  const { doctors, procedures, addBooking, patients, addPatient, updatePatient, bookings } = useStore()
  const { addToast } = useToast()

  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    doctorId: "",
    procedureId: "",
    date: new Date(),
    time: "",
    notes: "",
  })
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedDoctorProcedures, setSelectedDoctorProcedures] = useState<any[]>([])
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId)
  const selectedProcedure = procedures.find((p) => p.id === formData.procedureId)

  useEffect(() => {
    if (formData.doctorId) {
      const doctorProcedures = procedures.filter((p) => p.doctorIds?.includes(formData.doctorId))
      setSelectedDoctorProcedures(doctorProcedures)
      // Reset procedure if the previously selected one is not available for the new doctor
      if (formData.procedureId && !doctorProcedures.some((p) => p.id === formData.procedureId)) {
        setFormData((prev) => ({ ...prev, procedureId: "" }))
      }
    } else {
      setSelectedDoctorProcedures([])
      setFormData((prev) => ({ ...prev, procedureId: "" }))
    }
  }, [formData.doctorId, procedures])

  useEffect(() => {
    const fetchSlots = async () => {
      if (formData.doctorId && formData.date) {
        const formattedDate = format(formData.date, "yyyy-MM-dd")
        // Simulate API call to get available slots
        // In a real app, this would be an actual fetch to your /api/slots/available endpoint
        // const response = await fetch(`/api/slots/available?doctorId=${formData.doctorId}&date=${formattedDate}`);
        // const data = await response.json();
        // setAvailableSlots(data.slots);

        // For now, simulate based on doctor's availability and existing bookings
        const doctor = doctors.find((d) => d.id === formData.doctorId)
        if (doctor) {
          const dayOfWeek = format(formData.date, "EEEE").toLowerCase()
          let dayAvailability = doctor.availability[dayOfWeek]

          // Apply holiday/special day logic
          const formattedDate = format(formData.date, "yyyy-MM-dd")
          const clinicHoliday = useStore
            .getState()
            .holidays.find((h) => h.date === formattedDate && h.appliesTo === "all" && h.type === "holiday")
          const doctorHoliday = useStore
            .getState()
            .holidays.find(
              (h) =>
                h.date === formattedDate &&
                h.appliesTo === "doctor" &&
                h.doctorId === formData.doctorId &&
                h.type === "holiday",
            )
          const specialDay = useStore
            .getState()
            .holidays.find(
              (h) =>
                h.date === formattedDate &&
                h.type === "special_day" &&
                (h.appliesTo === "all" || h.doctorId === formData.doctorId),
            )

          if (clinicHoliday || doctorHoliday || (specialDay && specialDay.isFullDay)) {
            setAvailableSlots([]) // Fully closed
            return
          }

          if (specialDay) {
            dayAvailability = {
              ...dayAvailability,
              isAvailable: true,
              sessions: specialDay.customSessions || [],
              breaks: specialDay.customBreaks || [],
            }
          }

          if (dayAvailability?.isAvailable) {
            const bookedSlotsForDate = bookings
              .filter(
                (b) =>
                  b.doctorId === formData.doctorId &&
                  b.date === formattedDate &&
                  (b.status === "confirmed" || b.status === "pending"),
              )
              .map((b) => b.time)

            const generatedSlots: string[] = []
            for (const session of dayAvailability.sessions.filter((s) => s.isActive)) {
              const start = new Date(`2000-01-01T${session.start}:00`)
              const end = new Date(`2000-01-01T${session.end}:00`)
              const current = start

              while (current.getTime() < end.getTime()) {
                const slotTime = format(current, "HH:mm")
                const isBreak = dayAvailability.breaks.some(
                  (b) => b.isActive && slotTime >= b.start && slotTime < b.end,
                )
                if (!isBreak && !bookedSlotsForDate.includes(slotTime)) {
                  generatedSlots.push(slotTime)
                }
                current.setMinutes(current.getMinutes() + session.slotDuration)
              }
            }
            setAvailableSlots(generatedSlots.sort())
          } else {
            setAvailableSlots([])
          }
        }
      } else {
        setAvailableSlots([])
      }
      setFormData((prev) => ({ ...prev, time: "" })) // Reset selected time
    }
    fetchSlots()
  }, [formData.doctorId, formData.date, doctors, bookings]) // Added bookings to dependency array

  useEffect(() => {
    if (selectedDoctor && selectedProcedure) {
      const isFirstTimePatient = !patients.some((p) => p.phone === formData.patientPhone)
      const fee = isFirstTimePatient ? selectedDoctor.firstTimeFee : selectedDoctor.recurringFee
      setCalculatedAmount(fee + selectedProcedure.price)
    } else {
      setCalculatedAmount(null)
    }
  }, [formData.patientPhone, selectedDoctor, selectedProcedure, patients])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleDateSelect = (date?: Date) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (
      !formData.patientName ||
      !formData.patientEmail ||
      !formData.patientPhone ||
      !formData.doctorId ||
      !formData.procedureId ||
      !formData.date ||
      !formData.time ||
      calculatedAmount === null
    ) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Check if patient exists, if not, add them
      const existingPatient = patients.find((p) => p.phone === formData.patientPhone)
      let patientId = existingPatient?.id

      if (!existingPatient) {
        const newPatient = {
          id: `patient_${Date.now()}`, // Generate a simple ID for now
          name: formData.patientName,
          email: formData.patientEmail,
          phone: formData.patientPhone,
          dateOfBirth: "", // To be added in patient management
          gender: "other", // To be added in patient management
          address: "", // To be added in patient management
          emergencyContact: "", // To be added in patient management
          medicalHistory: "", // To be added in patient management
          allergies: "", // To be added in patient management
          bloodGroup: "", // To be added in patient management
          registrationDate: format(new Date(), "yyyy-MM-dd"),
          lastVisit: format(formData.date, "yyyy-MM-dd"),
          totalVisits: 1,
        }
        addPatient(newPatient)
        patientId = newPatient.id
      } else {
        // Update existing patient's visit count and last visit
        updatePatient(existingPatient.id, {
          totalVisits: existingPatient.totalVisits + 1,
          lastVisit: format(formData.date, "yyyy-MM-dd"),
        })
      }

      const newBooking = {
        id: `booking_${Date.now()}`, // Generate a simple ID for now
        patientId: patientId!,
        doctorId: formData.doctorId,
        procedureId: formData.procedureId,
        date: format(formData.date, "yyyy-MM-dd"),
        time: formData.time,
        status: "pending" as const, // Default to pending, can be confirmed after payment
        paymentStatus: "pending" as const,
        amount: calculatedAmount,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
      }

      addBooking(newBooking)

      addToast({
        title: "Booking Created",
        description: "Appointment has been successfully scheduled.",
        variant: "success",
      })

      // Reset form
      setFormData({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        doctorId: "",
        procedureId: "",
        date: new Date(),
        time: "",
        notes: "",
      })
      setCalculatedAmount(null)
      setAvailableSlots([])
    } catch (error) {
      console.error("Booking error:", error)
      addToast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Book New Appointment</h2>
        <p className="text-muted-foreground">Schedule appointments for patients with doctors and procedures.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Fill in the details for the new appointment.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input id="patientName" value={formData.patientName} onChange={handleChange} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientEmail">Patient Email *</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={formData.patientEmail}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientPhone">Patient Phone *</Label>
                <Input
                  id="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorId">Doctor *</Label>
                <Select value={formData.doctorId} onValueChange={(value) => handleSelectChange("doctorId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedureId">Procedure *</Label>
                <Select
                  value={formData.procedureId}
                  onValueChange={(value) => handleSelectChange("procedureId", value)}
                  disabled={!formData.doctorId || selectedDoctorProcedures.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a procedure" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDoctorProcedures.map((procedure) => (
                      <SelectItem key={procedure.id} value={procedure.id}>
                        {procedure.name} (₹{procedure.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Appointment Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) => isPast(date) && !isToday(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Available Slots *</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => handleSelectChange("time", value)}
                  disabled={!formData.doctorId || !formData.date || availableSlots.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No slots available for this date/doctor
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific notes for the appointment..."
              />
            </div>

            {calculatedAmount !== null && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  <span className="font-medium">Estimated Amount:</span>
                </div>
                <span className="text-2xl font-bold text-primary">₹{calculatedAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting || calculatedAmount === null}>
              {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
