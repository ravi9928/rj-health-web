"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Baby,
  Stethoscope,
  Eye,
  Bone,
  Brain,
  Activity,
  Microscope,
  ArrowRight,
  Calendar,
  Clock,
  Star,
} from "lucide-react";

import { BookingModal } from "@/components/booking-modal";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function Services() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, "procedures")); // 👈 only 3 docs
        const querySnapshot = await getDocs(q);

        const servicesList: any[] = [];
        querySnapshot.forEach((doc) => {
          servicesList.push({ id: doc.id, ...doc.data() });
        });
        console.log(`servicesList===`, servicesList);

        setServices(servicesList);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
  return (
    <>
      <section
        id="services"
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="h-4 w-4 mr-2" />
              Comprehensive Healthcare Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Medical{" "}
              <span className="text-gradient-teal">Specialties</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of medical services with
              state-of-the-art facilities, experienced healthcare professionals,
              and personalized care for every patient.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services &&
              services.map((service) => {
                // const IconComponent = service.icon;
                // const IconComponent = service.image_url || Heart; // fallback

                const features = service?.features
                  ? service.features.split(",").map((f: string) => f.trim())
                  : [];
                return (
                  <Card
                    key={service.id}
                    className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-gradient-to-br ${service.gradient}`}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div
                            className={`rounded-xl ${service.color} group-hover:scale-110 transition-transform duration-200`}
                          >
                            {/* <IconComponent className="h-6 w-6" /> */}
                            <div
                              className={`rounded-xl ${service.color} group-hover:scale-110 transition-transform duration-200`}
                            >
                              {
                                <img
                                  src={service.image_url}
                                  alt={service.name}
                                  className="h-6 w-6 object-contain"
                                />
                              }
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-700">
                              {service.rating}
                            </span>
                          </div>
                        </div>

                        <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                            {service.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs bg-teal-50 text-teal-700">
                            {service.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                      </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{service.duration}</span>
                            </div>
                            <div className="font-semibold text-teal-600">
                              ₹{service.price}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">
                              Key Services:
                            </p>

                            <div className="flex flex-wrap gap-1">
                               {features.slice(0, 3).map((feature:any, index:any) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                {feature}
                              </Badge>
                            ))}

                              {features.length > 3 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gray-100 text-gray-600"
                                >
                                  +{features.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-white/50">
                        <Button
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white group-hover:shadow-lg transition-all duration-200"
                          onClick={() => setIsBookingOpen(true)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Consultation
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-xl bg-transparent"
            >
              View All Services & Procedures
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}
