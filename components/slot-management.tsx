"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit, Trash, Clock, Coffee, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { cn, generateTimeSlots } from "@/lib/utils" // Import generateTimeSlots from utils
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

export function SlotManagement() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [isSessionBreakDialogOpen, setIsSessionBreakDialogOpen] = useState(false)
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"session" | "break">("session")
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingIndex, setEditingIndex] = useState<number>(-1)
  const [editingHoliday, setEditingHoliday] = useState<any>(null)

  const { doctors, updateDoctor, holidays, addHoliday, updateHoliday, deleteHoliday, bookings } = useStore()
  const { addToast } = useToast()
  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor)

  // Generate time slots for the week view
  const startOfCurrentWeek = startOfWeek(date, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i))

  const getSlotColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "booked":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "break":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      default:
        return "bg-gray-100"
    }
  }

  const handleAddSession = (day: string) => {
    setDialogType("session")
    setEditingDay(day)
    setEditingItem({
      id: `session${Date.now()}`,
      name: "New Session",
      start: "09:00",
      end: "17:00",
      slotDuration: 30,
      isActive: true,
    })
    setEditingIndex(-1)
    setIsSessionBreakDialogOpen(true)
  }

  const handleEditSession = (day: string, sessionIndex: number) => {
    if (selectedDoctorData) {
      setDialogType("session")
      setEditingDay(day)
      setEditingItem({ ...selectedDoctorData.availability[day].sessions[sessionIndex] })
      setEditingIndex(sessionIndex)
      setIsSessionBreakDialogOpen(true)
    }
  }

  const handleAddBreak = (day: string) => {
    setDialogType("break")
    setEditingDay(day)
    setEditingItem({
      id: `break${Date.now()}`,
      name: "Break",
      start: "12:00",
      end: "13:00",
      isActive: true,
    })
    setEditingIndex(-1)
    setIsSessionBreakDialogOpen(true)
  }

  const handleEditBreak = (day: string, breakIndex: number) => {
    if (selectedDoctorData) {
      setDialogType("break")
      setEditingDay(day)
      setEditingItem({ ...selectedDoctorData.availability[day].breaks[breakIndex] })
      setEditingIndex(breakIndex)
      setIsSessionBreakDialogOpen(true)
    }
  }

  const handleSaveSessionBreak = () => {
    if (selectedDoctorData && editingDay) {
      const updatedAvailability = { ...selectedDoctorData.availability }

      if (dialogType === "session") {
        if (editingIndex >= 0) {
          updatedAvailability[editingDay].sessions[editingIndex] = editingItem
        } else {
          updatedAvailability[editingDay].sessions.push(editingItem)
        }
      } else {
        if (editingIndex >= 0) {
          updatedAvailability[editingDay].breaks[editingIndex] = editingItem
        } else {
          updatedAvailability[editingDay].breaks.push(editingItem)
        }
      }

      updateDoctor(selectedDoctorData.id, { availability: updatedAvailability })

      addToast({
        title: `${dialogType === "session" ? "Session" : "Break"} ${editingIndex >= 0 ? "Updated" : "Added"}`,
        description: `${editingItem.name} has been ${editingIndex >= 0 ? "updated" : "added"} successfully.`,
        variant: "success",
      })

      setIsSessionBreakDialogOpen(false)
    }
  }

  const handleDeleteSessionBreak = (day: string, type: "session" | "break", index: number) => {
    if (selectedDoctorData) {
      const updatedAvailability = { ...selectedDoctorData.availability }

      if (type === "session") {
        updatedAvailability[day].sessions.splice(index, 1)
      } else {
        updatedAvailability[day].breaks.splice(index, 1)
      }

      updateDoctor(selectedDoctorData.id, { availability: updatedAvailability })

      addToast({
        title: `${type === "session" ? "Session" : "Break"} Deleted`,
        description: `The ${type} has been deleted successfully.`,
        variant: "success",
      })
    }
  }

  const toggleDayAvailability = (day: string) => {
    if (selectedDoctorData) {
      const updatedAvailability = { ...selectedDoctorData.availability }
      updatedAvailability[day].isAvailable = !updatedAvailability[day].isAvailable

      updateDoctor(selectedDoctorData.id, { availability: updatedAvailability })

      addToast({
        title: "Availability Updated",
        description: `${day} availability has been ${updatedAvailability[day].isAvailable ? "enabled" : "disabled"}.`,
        variant: "success",
      })
    }
  }

  // Holiday Management Functions
  const handleAddHoliday = (selectedDate?: Date) => {
    setEditingHoliday({
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      name: "",
      type: "holiday",
      appliesTo: "all",
      doctorId: "",
      isFullDay: true,
      customSessions: [],
      customBreaks: [],
    })
    setIsHolidayDialogOpen(true)
  }

  const handleEditHoliday = (holiday: any) => {
    setEditingHoliday({ ...holiday })
    setIsHolidayDialogOpen(true)
  }

  const handleSaveHoliday = () => {
    if (!editingHoliday.name || !editingHoliday.date) {
      addToast({
        title: "Error",
        description: "Holiday name and date are required.",
        variant: "destructive",
      })
      return
    }

    if (editingHoliday.id) {
      updateHoliday(editingHoliday.id, editingHoliday)
      addToast({
        title: "Holiday Updated",
        description: `${editingHoliday.name} has been updated.`,
        variant: "success",
      })
    } else {
      addHoliday(editingHoliday)
      addToast({
        title: "Holiday Added",
        description: `${editingHoliday.name} has been added.`,
        variant: "success",
      })
    }
    setIsHolidayDialogOpen(false)
  }

  const handleDeleteHoliday = (id: string) => {
    deleteHoliday(id)
    addToast({
      title: "Holiday Deleted",
      description: "Holiday has been removed.",
      variant: "success",
    })
  }

  const getDaySlotsForPreview = (day: Date, doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId)
    if (!doctor) return []

    const formattedDate = format(day, "yyyy-MM-dd")
    const dayOfWeek = format(day, "EEEE").toLowerCase()

    // Check for clinic-wide holidays
    const clinicHoliday = holidays.find(
      (h) => h.date === formattedDate && h.appliesTo === "all" && h.type === "holiday",
    )
    if (clinicHoliday) {
      return [{ time: "Full Day", status: "break", session: clinicHoliday.name }]
    }

    // Check for doctor-specific holidays
    const doctorHoliday = holidays.find(
      (h) => h.date === formattedDate && h.appliesTo === "doctor" && h.doctorId === doctorId && h.type === "holiday",
    )
    if (doctorHoliday) {
      return [{ time: "Full Day", status: "break", session: doctorHoliday.name }]
    }

    let dayAvailability = doctor.availability[dayOfWeek]

    // Check for special days
    const specialDay = holidays.find(
      (h) => h.date === formattedDate && h.type === "special_day" && (h.appliesTo === "all" || h.doctorId === doctorId),
    )

    if (specialDay) {
      if (specialDay.isFullDay) {
        return [{ time: "Full Day", status: "break", session: specialDay.name }]
      }
      // Override availability with custom sessions/breaks for special day
      dayAvailability = {
        ...dayAvailability,
        isAvailable: true, // Assume available if custom sessions are provided
        sessions: specialDay.customSessions || [],
        breaks: specialDay.customBreaks || [],
      }
    }

    if (!dayAvailability?.isAvailable || dayAvailability.sessions.length === 0) {
      return []
    }

    const bookedSlots = bookings
      .filter(
        (b) => b.doctorId === doctorId && b.date === formattedDate && (b.status === "paid" || b.status === "confirmed"),
      )
      .map((b) => b.time)

    const allSlots: Array<{ time: string; status: "available" | "booked" | "break" }> = []
    for (const session of dayAvailability.sessions.filter((s) => s.isActive)) {
      allSlots.push(
        ...generateTimeSlots(session.start, session.end, session.slotDuration, bookedSlots, dayAvailability.breaks),
      )
    }

    return allSlots.sort((a, b) => a.time.localeCompare(b.time))
  }

  const getMonthDays = (month: Date) => {
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    return eachDayOfInterval({ start, end })
  }

  const currentMonthDays = getMonthDays(date)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Slot Management</h2>
          <p className="text-muted-foreground">Manage appointment slots, sessions, and break times for your doctors.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select doctor" />
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
                className="w-full sm:w-[240px] justify-start text-left font-normal bg-transparent"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="daily-weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="daily-weekly" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Daily/Weekly Slots
          </TabsTrigger>
          <TabsTrigger value="holidays" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Holidays & Special Days
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily-weekly" className="space-y-6">
          {selectedDoctor !== "all" && selectedDoctorData ? (
            <div className="space-y-6">
              {/* Day-wise Configuration */}
              <div className="grid gap-4">
                {daysOfWeek.map((day) => {
                  const dayData = selectedDoctorData.availability[day.key]
                  return (
                    <Card key={day.key}>
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={dayData.isAvailable}
                              onCheckedChange={() => toggleDayAvailability(day.key)}
                            />
                            <div>
                              <CardTitle className="text-lg">{day.label}</CardTitle>
                              <CardDescription className="text-sm">
                                {dayData.isAvailable ? "Available" : "Not Available"}
                              </CardDescription>
                            </div>
                          </div>
                          {dayData.isAvailable && (
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddSession(day.key)}
                                className="text-xs"
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                Add Session
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddBreak(day.key)}
                                className="text-xs"
                              >
                                <Coffee className="mr-1 h-3 w-3" />
                                Add Break
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      {dayData.isAvailable && (
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            {/* Sessions */}
                            {dayData.sessions.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Sessions ({dayData.sessions.length})
                                </h4>
                                <div className="grid gap-3">
                                  {dayData.sessions.map((session, index) => (
                                    <div
                                      key={session.id}
                                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-blue-50 rounded-lg border"
                                    >
                                      <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <Badge variant={session.isActive ? "default" : "secondary"}>
                                            {session.name}
                                          </Badge>
                                          <span className="text-sm text-muted-foreground">
                                            {session.start} - {session.end}
                                          </span>
                                          <span className="text-xs bg-white px-2 py-1 rounded border">
                                            {session.slotDuration}min slots
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleEditSession(day.key, index)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleDeleteSessionBreak(day.key, "session", index)}
                                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                          <Trash className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Breaks */}
                            {dayData.breaks.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                  <Coffee className="h-4 w-4" />
                                  Breaks ({dayData.breaks.length})
                                </h4>
                                <div className="grid gap-3">
                                  {dayData.breaks.map((breakItem, index) => (
                                    <div
                                      key={breakItem.id}
                                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-orange-50 rounded-lg border"
                                    >
                                      <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <Badge variant={breakItem.isActive ? "secondary" : "outline"}>
                                            {breakItem.name}
                                          </Badge>
                                          <span className="text-sm text-muted-foreground">
                                            {breakItem.start} - {breakItem.end}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleEditBreak(day.key, index)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleDeleteSessionBreak(day.key, "break", index)}
                                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                          <Trash className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>

              {/* Weekly Schedule View */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-xl">Weekly Schedule Preview</CardTitle>
                    <CardDescription>Week of {format(startOfCurrentWeek, "MMMM d, yyyy")}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setDate(addDays(startOfCurrentWeek, -7))}>
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous week</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDate(addDays(startOfCurrentWeek, 7))}>
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next week</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <div className="grid grid-cols-8 min-w-[800px] border rounded-lg">
                      {/* Time column */}
                      <div className="border-r">
                        <div className="h-12 border-b flex items-center justify-center font-medium bg-muted">Time</div>
                      </div>

                      {/* Days columns */}
                      {weekDays.map((day, dayIndex) => {
                        const daySlots = getDaySlotsForPreview(day, selectedDoctorData.id)

                        return (
                          <div key={dayIndex} className="border-r last:border-r-0">
                            <div className="h-12 border-b flex flex-col items-center justify-center bg-muted">
                              <div className="font-medium text-sm">{format(day, "EEE")}</div>
                              <div className="text-xs text-muted-foreground">{format(day, "MMM d")}</div>
                            </div>

                            {daySlots.length > 0 ? (
                              <div className="max-h-96 overflow-y-auto">
                                {daySlots.map((slot, slotIndex) => (
                                  <div
                                    key={slotIndex}
                                    className={cn(
                                      "h-10 border-b flex flex-col items-center justify-center text-xs cursor-pointer transition-colors",
                                      getSlotColor(slot.status),
                                    )}
                                    title={`${slot.time} - ${slot.session || ""} - ${slot.status}`}
                                  >
                                    <div className="font-mono">{slot.time}</div>
                                    {slot.status === "booked" && <div className="text-xs">Booked</div>}
                                    {slot.status === "break" && (
                                      <div className="text-xs">{slot.session || "Break"}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">
                                Not Available
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  {selectedDoctor === "all" ? "Please select a doctor to manage their slots." : "Doctor not found."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="holidays" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl">Monthly Holidays & Special Days</CardTitle>
                <CardDescription>
                  Manage clinic-wide or doctor-specific non-working days and custom schedules.
                </CardDescription>
              </div>
              <Button onClick={() => handleAddHoliday()} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Holiday/Special Day
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <Calendar
                  mode="single"
                  month={date}
                  onMonthChange={setDate}
                  selected={null} // No specific date selected by default
                  modifiers={{
                    holiday: holidays.map((h) => new Date(h.date)),
                    today: new Date(),
                  }}
                  modifiersStyles={{
                    holiday: { backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "0.375rem" }, // bg-red-50, text-red-500
                    today: { fontWeight: "bold", border: "1px solid #2563eb" }, // border-blue-600
                  }}
                  className="rounded-md border"
                />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Date</TableHead>
                      <TableHead className="min-w-[150px]">Name</TableHead>
                      <TableHead className="min-w-[100px]">Type</TableHead>
                      <TableHead className="min-w-[120px]">Applies To</TableHead>
                      <TableHead className="min-w-[150px]">Doctor (if applicable)</TableHead>
                      <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holidays
                      .filter((h) => {
                        const holidayMonth = new Date(h.date).getMonth()
                        const holidayYear = new Date(h.date).getFullYear()
                        return holidayMonth === date.getMonth() && holidayYear === date.getFullYear()
                      })
                      .map((holiday) => (
                        <TableRow key={holiday.id}>
                          <TableCell className="font-medium">
                            {format(new Date(holiday.date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>{holiday.name}</TableCell>
                          <TableCell>
                            <Badge variant={holiday.type === "holiday" ? "destructive" : "secondary"}>
                              {holiday.type === "holiday" ? "Holiday" : "Special Day"}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{holiday.appliesTo}</TableCell>
                          <TableCell>
                            {holiday.appliesTo === "doctor"
                              ? doctors.find((d) => d.id === holiday.doctorId)?.name || "N/A"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEditHoliday(holiday)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteHoliday(holiday.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    {holidays.filter((h) => {
                      const holidayMonth = new Date(h.date).getMonth()
                      const holidayYear = new Date(h.date).getFullYear()
                      return holidayMonth === date.getMonth() && holidayYear === date.getFullYear()
                    }).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No holidays or special days for this month.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Session/Break Dialog */}
      <Dialog open={isSessionBreakDialogOpen} onOpenChange={setIsSessionBreakDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex >= 0 ? "Edit" : "Add"} {dialogType === "session" ? "Session" : "Break"}
            </DialogTitle>
            <DialogDescription>
              Configure the {dialogType === "session" ? "working session" : "break time"} details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editingItem?.name || ""}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder={dialogType === "session" ? "e.g., Morning Session" : "e.g., Lunch Break"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={editingItem?.start || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={editingItem?.end || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, end: e.target.value })}
                />
              </div>
            </div>

            {dialogType === "session" && (
              <div className="space-y-2">
                <Label htmlFor="slot-duration">Slot Duration (minutes)</Label>
                <Select
                  value={editingItem?.slotDuration?.toString() || "30"}
                  onValueChange={(value) => setEditingItem({ ...editingItem, slotDuration: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={editingItem?.isActive || false}
                onCheckedChange={(checked) => setEditingItem({ ...editingItem, isActive: checked })}
              />
              <Label htmlFor="is-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSessionBreakDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSessionBreak}>
              {editingIndex >= 0 ? "Update" : "Add"} {dialogType === "session" ? "Session" : "Break"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Holiday Dialog */}
      <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingHoliday?.id ? "Edit Holiday/Special Day" : "Add Holiday/Special Day"}</DialogTitle>
            <DialogDescription>Configure details for this non-working day or custom schedule.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="holiday-name">Name</Label>
              <Input
                id="holiday-name"
                value={editingHoliday?.name || ""}
                onChange={(e) => setEditingHoliday({ ...editingHoliday, name: e.target.value })}
                placeholder="e.g., Christmas, Clinic Maintenance"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="holiday-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editingHoliday?.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingHoliday?.date ? format(new Date(editingHoliday.date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingHoliday?.date ? new Date(editingHoliday.date) : undefined}
                      onSelect={(date) =>
                        date && setEditingHoliday({ ...editingHoliday, date: format(date, "yyyy-MM-dd") })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="holiday-type">Type</Label>
                <Select
                  value={editingHoliday?.type || "holiday"}
                  onValueChange={(value) => setEditingHoliday({ ...editingHoliday, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="holiday">Holiday (Clinic Closed)</SelectItem>
                    <SelectItem value="special_day">Special Day (Custom Hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applies-to">Applies To</Label>
                <Select
                  value={editingHoliday?.appliesTo || "all"}
                  onValueChange={(value) => setEditingHoliday({ ...editingHoliday, appliesTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Doctors/Clinic</SelectItem>
                    <SelectItem value="doctor">Specific Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingHoliday?.appliesTo === "doctor" && (
                <div className="space-y-2">
                  <Label htmlFor="doctor-id">Select Doctor</Label>
                  <Select
                    value={editingHoliday?.doctorId || ""}
                    onValueChange={(value) => setEditingHoliday({ ...editingHoliday, doctorId: value })}
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
            </div>

            {editingHoliday?.type === "special_day" && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-full-day"
                    checked={editingHoliday?.isFullDay || false}
                    onCheckedChange={(checked) => setEditingHoliday({ ...editingHoliday, isFullDay: checked })}
                  />
                  <Label htmlFor="is-full-day">Full Day Closure (Overrides custom sessions)</Label>
                </div>

                {!editingHoliday?.isFullDay && (
                  <>
                    <div className="space-y-2">
                      <Label>Custom Sessions</Label>
                      {editingHoliday.customSessions?.map((session: any, index: number) => (
                        <div key={session.id} className="flex items-center gap-2 mb-2">
                          <Input
                            type="time"
                            value={session.start}
                            onChange={(e) => {
                              const newSessions = [...editingHoliday.customSessions]
                              newSessions[index].start = e.target.value
                              setEditingHoliday({ ...editingHoliday, customSessions: newSessions })
                            }}
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={session.end}
                            onChange={(e) => {
                              const newSessions = [...editingHoliday.customSessions]
                              newSessions[index].end = e.target.value
                              setEditingHoliday({ ...editingHoliday, customSessions: newSessions })
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Duration"
                            value={session.slotDuration}
                            onChange={(e) => {
                              const newSessions = [...editingHoliday.customSessions]
                              newSessions[index].slotDuration = Number(e.target.value)
                              setEditingHoliday({ ...editingHoliday, customSessions: newSessions })
                            }}
                            className="w-24"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newSessions = editingHoliday.customSessions.filter(
                                (_: any, i: number) => i !== index,
                              )
                              setEditingHoliday({ ...editingHoliday, customSessions: newSessions })
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingHoliday({
                            ...editingHoliday,
                            customSessions: [
                              ...(editingHoliday.customSessions || []),
                              {
                                id: `cs${Date.now()}`,
                                name: "Custom Session",
                                start: "09:00",
                                end: "12:00",
                                slotDuration: 30,
                                isActive: true,
                              },
                            ],
                          })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Custom Session
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Custom Breaks</Label>
                      {editingHoliday.customBreaks?.map((breakItem: any, index: number) => (
                        <div key={breakItem.id} className="flex items-center gap-2 mb-2">
                          <Input
                            type="time"
                            value={breakItem.start}
                            onChange={(e) => {
                              const newBreaks = [...editingHoliday.customBreaks]
                              newBreaks[index].start = e.target.value
                              setEditingHoliday({ ...editingHoliday, customBreaks: newBreaks })
                            }}
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={breakItem.end}
                            onChange={(e) => {
                              const newBreaks = [...editingHoliday.customBreaks]
                              newBreaks[index].end = e.target.value
                              setEditingHoliday({ ...editingHoliday, customBreaks: newBreaks })
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newBreaks = editingHoliday.customBreaks.filter((_: any, i: number) => i !== index)
                              setEditingHoliday({ ...editingHoliday, customBreaks: newBreaks })
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingHoliday({
                            ...editingHoliday,
                            customBreaks: [
                              ...(editingHoliday.customBreaks || []),
                              {
                                id: `cb${Date.now()}`,
                                name: "Custom Break",
                                start: "12:00",
                                end: "13:00",
                                isActive: true,
                              },
                            ],
                          })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Custom Break
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHolidayDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveHoliday}>{editingHoliday?.id ? "Update" : "Add"} Holiday</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
