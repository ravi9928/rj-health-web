"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote, ChevronLeft, ChevronRight, Heart, ThumbsUp } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Jammu",
    age: 28,
    rating: 5,
    text: "Dr. Samita Bhat provided exceptional care during my pregnancy. The entire team at RJ Healthcare was professional, caring, and always available when I needed them. The facilities are world-class and I felt completely safe throughout my journey. Highly recommend this facility to all expecting mothers.",
    service: "Gynecology & Obstetrics",
    date: "2 months ago",
    treatment: "Pregnancy Care & Delivery",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Gandhi Nagar",
    age: 45,
    rating: 5,
    text: "The gastroenterology department is outstanding. Dr. Kumar's expertise and the advanced diagnostic facilities helped identify my condition quickly. The treatment was effective and the staff was very supportive throughout the process. The endoscopy procedure was comfortable and professional.",
    service: "Gastroenterology",
    date: "1 month ago",
    treatment: "Endoscopy & Treatment",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Sunita Devi",
    location: "Tawi Vihar",
    age: 35,
    rating: 5,
    text: "My child received excellent care in the pediatrics department. Dr. Priya Sharma is wonderful with children and made the entire experience comfortable for both my child and our family. The vaccination process was smooth and the follow-up care was exceptional.",
    service: "Pediatrics",
    date: "3 weeks ago",
    treatment: "Child Healthcare & Vaccination",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "Amit Singh",
    location: "Residency Road",
    age: 52,
    rating: 5,
    text: "The orthopedic surgery I had was successful thanks to the skilled surgeons and excellent post-operative care. The facilities are modern, the nursing staff is very attentive, and the physiotherapy support helped me recover quickly. Truly grateful for the care I received.",
    service: "Orthopedics",
    date: "1 month ago",
    treatment: "Joint Replacement Surgery",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    name: "Meera Gupta",
    location: "Channi Himmat",
    age: 38,
    rating: 5,
    text: "RJ Healthcare provided comprehensive diagnostic services that helped detect my condition early. The radiologists and technicians are highly professional, the reports were accurate and timely, and the entire process was seamless. Early detection saved my life.",
    service: "Diagnostics",
    date: "2 weeks ago",
    treatment: "Comprehensive Health Screening",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 6,
    name: "Vikram Malhotra",
    location: "Sector 1, Nanak Nagar",
    age: 58,
    rating: 5,
    text: "The cardiology department saved my life. The emergency response was immediate, the cardiac care I received was world-class, and the follow-up treatment has been excellent. I'm grateful to the entire medical team for their dedication and expertise.",
    service: "Cardiology",
    date: "1 month ago",
    treatment: "Emergency Cardiac Care",
    image: "/placeholder.svg?height=60&width=60",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const testimonialsPerPage = 3

  const nextTestimonials = () => {
    setCurrentIndex((prev) => (prev + testimonialsPerPage >= testimonials.length ? 0 : prev + testimonialsPerPage))
  }

  const prevTestimonials = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, testimonials.length - testimonialsPerPage) : prev - testimonialsPerPage,
    )
  }

  const currentTestimonials = testimonials.slice(currentIndex, currentIndex + testimonialsPerPage)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="h-4 w-4 mr-2" />
            Patient Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-gradient-teal">Patients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read testimonials from our satisfied patients who have experienced our quality healthcare services,
            compassionate care, and successful treatment outcomes.
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTestimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <Quote className="h-8 w-8 text-teal-600 opacity-20" />
                    </div>

                    <p className="text-gray-700 leading-relaxed italic flex-1">"{testimonial.text}"</p>

                    <div className="bg-teal-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-teal-800 mb-1">Treatment:</div>
                      <div className="text-sm text-teal-700">{testimonial.treatment}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                            <div className="text-sm text-gray-600">
                              {testimonial.location} • Age {testimonial.age}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-teal-600">{testimonial.service}</div>
                            <div className="text-xs text-gray-500">{testimonial.date}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonials}
              disabled={currentIndex === 0}
              className="p-3 rounded-full border-teal-200 hover:bg-teal-50 bg-transparent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(testimonials.length / testimonialsPerPage) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * testimonialsPerPage)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    Math.floor(currentIndex / testimonialsPerPage) === i
                      ? "bg-teal-600 scale-125"
                      : "bg-gray-300 hover:bg-teal-300"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonials}
              disabled={currentIndex + testimonialsPerPage >= testimonials.length}
              className="p-3 rounded-full border-teal-200 hover:bg-teal-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Overall Rating Summary */}
        <div className="mt-16 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-3xl p-8 border border-teal-100">
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-teal-600 mb-3">4.9/5</div>
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 text-yellow-500 fill-current" />
              ))}
            </div>
            <div className="text-gray-700 text-lg font-medium mb-2">Excellent Patient Satisfaction</div>
            <div className="text-gray-600">Based on 500+ verified patient reviews</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">98%</div>
              <div className="text-sm text-gray-600">Would Recommend</div>
              <ThumbsUp className="h-5 w-5 text-teal-600 mx-auto mt-2" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
              <div className="text-sm text-gray-600">On-Time Appointments</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">97%</div>
              <div className="text-sm text-gray-600">Staff Courtesy</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">96%</div>
              <div className="text-sm text-gray-600">Facility Cleanliness</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">99%</div>
              <div className="text-sm text-gray-600">Treatment Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
