"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, User, Phone, Download, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  useEffect(() => {
    // In a real app, you'd fetch booking details using the booking ID from searchParams
    // For now, we'll use mock data
    setBookingDetails({
      id: "RJ" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      patientName: "John Doe",
      doctorName: "Dr. Samita Bhat",
      specialization: "Gynecologist & Obstetrician",
      date: "2024-01-25",
      time: "10:30 AM",
      phone: "+91 9876543210",
      amount: 800,
      status: "Confirmed",
    })
  }, [])

  const addToCalendar = () => {
    if (!bookingDetails) return

    const startDate = new Date(`${bookingDetails.date} ${bookingDetails.time}`)
    const endDate = new Date(startDate.getTime() + 30 * 60000) // 30 minutes later

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Medical Appointment with ${bookingDetails.doctorName}&dates=${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=Appointment with ${bookingDetails.doctorName} (${bookingDetails.specialization}) at RJ Healthcare&location=RJ Healthcare, Gandhi Nagar, Jammu`

    window.open(calendarUrl, "_blank")
  }

  const downloadReceipt = () => {
    // Mock download functionality
    const element = document.createElement("a")
    const file = new Blob(["Appointment Receipt - RJ Healthcare"], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `receipt-${bookingDetails?.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h1>
            <p className="text-lg text-gray-600">Your appointment has been successfully booked. We'll see you soon!</p>
          </div>

          {/* Booking Details */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Appointment Details</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-600">Booking ID</span>
                  </div>
                  <span className="font-bold text-gray-900">{bookingDetails.id}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-600">Patient Name</span>
                  </div>
                  <span className="font-bold text-gray-900">{bookingDetails.patientName}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-600">Doctor</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{bookingDetails.doctorName}</p>
                    <p className="text-sm text-gray-600">{bookingDetails.specialization}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-600">Date & Time</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {new Date(bookingDetails.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{bookingDetails.time}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-600">Contact</span>
                  </div>
                  <span className="font-bold text-gray-900">{bookingDetails.phone}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-gray-600">Amount Paid</span>
                  </div>
                  <span className="font-bold text-green-600">₹{bookingDetails.amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Button onClick={addToCalendar} className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>

            <Button onClick={downloadReceipt} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>

          {/* Important Information */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Important Information</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Please arrive 15 minutes before your appointment time</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Bring a valid ID and any previous medical records</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>If you need to reschedule, please call us at least 2 hours in advance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>For any queries, contact us at +91 9876543210</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Options */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Button variant="outline" className="flex items-center justify-center bg-transparent" asChild>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </a>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/">Book Another Appointment</Link>
            </Button>
          </div>

          {/* Location Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Clinic Location</h3>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">RJ Healthcare Complex</p>
                  <p className="text-gray-600">Gandhi Nagar, Jammu</p>
                  <p className="text-gray-600">Jammu & Kashmir - 180004</p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
