import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Users, Award, Heart, Microscope, CheckCircle, Star, Zap, Phone } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Advanced Medical Technology",
    description:
      "State-of-the-art medical equipment and latest treatment technologies for accurate diagnosis and effective treatment with international standards.",
    color: "bg-teal-100 text-teal-600",
    stats: "ISO 9001:2015 Certified",
  },
  {
    icon: Users,
    title: "Expert Medical Team",
    description:
      "Highly qualified and experienced doctors with specialized training, continuous education, and compassionate care approach.",
    color: "bg-blue-100 text-blue-600",
    stats: "15+ Specialist Doctors",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Care",
    description:
      "Round-the-clock emergency services with immediate response, critical care facilities, and dedicated emergency medical team.",
    color: "bg-red-100 text-red-600",
    stats: "< 5 min Response Time",
  },
  {
    icon: Award,
    title: "Quality Healthcare",
    description:
      "Maintaining highest standards of healthcare quality, safety protocols, and patient satisfaction with continuous improvement.",
    color: "bg-purple-100 text-purple-600",
    stats: "98% Success Rate",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description:
      "Individual attention and customized treatment plans tailored to each patient's specific needs, preferences, and medical history.",
    color: "bg-pink-100 text-pink-600",
    stats: "Patient-First Approach",
  },
  {
    icon: Microscope,
    title: "Advanced Diagnostics",
    description:
      "Comprehensive diagnostic services with latest imaging and laboratory technologies for accurate, fast, and reliable results.",
    color: "bg-emerald-100 text-emerald-600",
    stats: "Same-Day Reports",
  },
]

const stats = [
  { number: "15+", label: "Years of Excellence", icon: Award, color: "text-teal-600" },
  { number: "10,000+", label: "Happy Patients", icon: Users, color: "text-blue-600" },
  { number: "98%", label: "Success Rate", icon: CheckCircle, color: "text-green-600" },
  { number: "4.9", label: "Patient Rating", icon: Star, color: "text-yellow-600" },
]

const achievements = [
  "Best Women's Healthcare Provider 2023",
  "Excellence in Patient Care Award",
  "ISO 9001:2015 Quality Certification",
  "NABH Accredited Healthcare Facility",
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Why Choose RJ Healthcare
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Excellence in <span className="text-gradient-teal">Healthcare</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are committed to providing exceptional healthcare services with a patient-first approach, combining
            medical expertise with compassionate care and cutting-edge technology.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white"
              >
                <CardContent className="p-6">
                  <div className={`bg-gray-50 p-4 rounded-full w-fit mx-auto mb-4 ${stat.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group"
              >
                <CardContent className="p-6 h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-4 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                        {feature.stats}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Trusted by Thousands</h3>
              <p className="text-gray-600 mb-4">
                Join thousands of satisfied patients who have experienced our quality healthcare services and
                compassionate care.
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="h-5 w-5 text-teal-600" />
                <span className="text-teal-600 font-medium">24/7 Support Available</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 text-center">Our Achievements</h4>
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span>{achievement}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">4.9/5</div>
              <div className="text-gray-600 mb-3">Average Patient Rating</div>
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <div className="text-sm text-gray-500">Based on 500+ reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
