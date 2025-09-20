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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingModal } from "@/components/booking-modal";
import {
  Star,
  Calendar,
  Clock,
  Search,
  Filter,
  MapPin,
  GraduationCap,
  Languages,
  Users,
} from "lucide-react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const specializations = [
  "All Specializations",
  "Gynecology & Obstetrics",
  "Gastroenterology",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
];

export function DoctorsListing({ required }: { required: string }) {
  const [doctors, setDoctors] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    "All Specializations"
  );
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof doctors)[0] | null
  >(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let q = null;
        console.log("============", required);

        if (required == "all") {
          q = query(collection(db, "doctors"));
        } else {
          q = query(collection(db, "doctors"), limit(3)); // 👈 only 3 docs
        }
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

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "All Specializations" ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleBookAppointment = (doctor: (typeof doctors)[0]) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="h-4 w-4 mr-2" />
              Meet Our Medical Team
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Expert <span className="text-gradient-teal">Doctors</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our team of highly qualified and experienced doctors who are
              dedicated to providing personalized care with the latest medical
              technologies and treatments.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search doctors by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedSpecialization}
                onValueChange={setSelectedSpecialization}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Showing {filteredDoctors.length} of {doctors.length} doctors
                </span>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-white"
              >
                <div className="relative">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-gray-900">
                        {doctor.rating}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {doctor.experience}
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-teal-600 font-medium mb-2">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>
                        {/* {doctor.education.split(",")[0]}, {doctor.education.split(",")[1]} */}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-gray-500">
                        ({doctor.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">
                        {/* {doctor.availability.split(":")[0]} */}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      Expertise:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {/* {doctor.expertise.slice(0, 3).map((skill: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-teal-50 text-teal-700 hover:bg-teal-100"
                        >
                          {skill}
                        </Badge>
                      ))} */}

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
                      {doctor.expertise && doctor.expertise.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          +{doctor.expertise.length - 3} more
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

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Languages className="h-4 w-4" />
                      <span>
                        {doctor?.languages
                          ? doctor?.languages.join(", ")
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or browse all doctors.
                </p>
              </div>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("All Specializations");
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
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
