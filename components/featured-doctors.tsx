"use client";

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { BookingModal } from "@/components/booking-modal";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function FeaturedDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const q = query(collection(db, "doctors"), limit(3)); // 👈 only 3 docs
        const querySnapshot = await getDocs(q);

        const doctorsList: any[] = [];
        querySnapshot.forEach((doc) => {
          doctorsList.push({ id: doc.id, ...doc.data() });
        });
        console.log("doctorsList======", doctorsList);
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof doctors)[0] | null
  >(null);

  const handleBookAppointment = (doctor: (typeof doctors)[0]) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  return (
    <>
      <section id="doctors" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="h-4 w-4 mr-2" />
              Meet Our Expert Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Experienced{" "}
              <span className="text-gradient-teal">Doctors</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of highly qualified and experienced doctors are dedicated
              to providing personalized care with the latest medical
              technologies and treatments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <Card
                key={doctor?.id}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={doctor?.image || "/placeholder.svg"}
                    alt={doctor?.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-gray-900">
                        {doctor?.rating}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {doctor?.experience}
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {doctor?.name}
                    </h3>
                    <p className="text-teal-600 font-medium mb-2">
                      {doctor?.specialization}
                    </p>
                    <p className="text-sm text-gray-600">{doctor?.education}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{doctor?.rating}</span>
                      <span className="text-gray-500">
                        ({doctor?.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <ul className="text-xs leading-5">
                        {Object.entries(
                          doctor.availability as Record<string, any>
                        ).map(([day, schedule]) => (
                          <li key={day} className="capitalize">
                            <strong>{day}:</strong>{" "}
                            {schedule?.start && schedule?.end
                              ? `${schedule.start} - ${schedule.end}`
                              : "Closed"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      Expertise:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {doctor?.expertise
                        ? doctor?.expertise
                            .slice(0, 3)
                            .map(
                              (
                                skill:
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | ReactElement<
                                      any,
                                      string | JSXElementConstructor<any>
                                    >
                                  | Iterable<ReactNode>
                                  | ReactPortal
                                  | Promise<AwaitedReactNode>
                                  | null
                                  | undefined,
                                index: Key | null | undefined
                              ) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-teal-50 text-teal-700 hover:bg-teal-100"
                                >
                                  {skill}
                                </Badge>
                              )
                            )
                        : "N/A"}
                      {doctor?.expertise?.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          +{doctor?.expertise?.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        First Consultation:
                      </span>
                      <span className="font-bold text-teal-600">
                        ₹{doctor?.priorityFee}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Follow-up:</span>
                      <span className="font-bold text-teal-600">
                        ₹{doctor?.recurringFee}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white group"
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Book Now
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-xl bg-transparent"
            >
              View All Doctors
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedDoctor={selectedDoctor}
      />
    </>
  );
}
