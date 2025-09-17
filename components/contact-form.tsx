"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MessageCircle, Send, MapPin, Clock } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    })

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "",
    })
    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageCircle className="h-4 w-4 mr-2" />
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-gradient-teal">RJ Healthcare</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our services or need to schedule an appointment? We're here to help. Reach out to us
            through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 9876543210"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="inquiryType">Inquiry Type</Label>
                  <Select
                    value={formData.inquiryType}
                    onValueChange={(value) => handleInputChange("inquiryType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment">Appointment Booking</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="insurance">Insurance Query</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief subject of your message"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please describe your inquiry in detail..."
                    required
                    rows={5}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Contact Info */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Contact</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-100 p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Phone Numbers</h3>
                      <div className="space-y-1 text-gray-600">
                        <p>
                          Reception:{" "}
                          <a href="tel:+911912345678" className="text-teal-600 hover:underline">
                            +91-191-2345678
                          </a>
                        </p>
                        <p>
                          Emergency:{" "}
                          <a href="tel:+919876543210" className="text-red-600 hover:underline">
                            +91-9876543210
                          </a>
                        </p>
                        <p>
                          Appointments:{" "}
                          <a href="tel:+919876543211" className="text-teal-600 hover:underline">
                            +91-9876543211
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email Addresses</h3>
                      <div className="space-y-1 text-gray-600">
                        <p>
                          <a href="mailto:info@rjhealthcare.com" className="text-blue-600 hover:underline">
                            info@rjhealthcare.com
                          </a>
                        </p>
                        <p>
                          <a href="mailto:appointments@rjhealthcare.com" className="text-blue-600 hover:underline">
                            appointments@rjhealthcare.com
                          </a>
                        </p>
                        <p>
                          <a href="mailto:emergency@rjhealthcare.com" className="text-blue-600 hover:underline">
                            emergency@rjhealthcare.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                      <p className="text-gray-600 mb-2">Quick support and appointment booking</p>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => window.open("https://wa.me/919876543210", "_blank")}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat on WhatsApp
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                      <p className="text-gray-600 mb-2">
                        RJ Healthcare Center
                        <br />
                        Gandhi Nagar, Near City Hospital
                        <br />
                        Jammu, J&K - 180004
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
                        onClick={() =>
                          window.open("https://maps.google.com/?q=RJ+Healthcare+Gandhi+Nagar+Jammu", "_blank")
                        }
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Operating Hours</h3>
                      <div className="text-gray-600 text-sm space-y-1">
                        <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                        <p>Saturday: 8:00 AM - 6:00 PM</p>
                        <p>Sunday: 9:00 AM - 2:00 PM</p>
                        <p className="text-red-600 font-medium">Emergency: 24/7 Available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <Card className="shadow-xl border-0 bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="font-bold text-red-900">Medical Emergency?</h3>
                </div>
                <p className="text-red-700 mb-4">
                  For immediate medical assistance, call our emergency hotline. Our medical team is available 24/7 for
                  urgent care.
                </p>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => window.open("tel:+919876543210")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Emergency: +91-9876543210
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
