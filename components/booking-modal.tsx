"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  Tag,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
} from "firebase/firestore";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDoctor?: {
    id: number;
    name: string;
    specialization: string;
    consultationFee: {
      first: number;
      followup: number;
    };
    image: string;
  } | null;
}

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

// const doctors = [
//   { id: 1, name: "Dr. Samita Bhat", specialization: "Gynecology & Obstetrics", fee: { first: 800, followup: 500 } },
//   { id: 2, name: "Dr. Rajesh Kumar", specialization: "Gastroenterology", fee: { first: 900, followup: 600 } },
//   { id: 3, name: "Dr. Priya Sharma", specialization: "Pediatrics", fee: { first: 700, followup: 400 } },
// ]

export function BookingModal({
  isOpen,
  onClose,
  selectedDoctor,
}: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [coupons, setCoupens] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    symptoms: "",
    doctorId: selectedDoctor?.id || 1,
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const q = query(collection(db, "coupons"), limit(3)); // 👈 only 3 docs
        const querySnapshot = await getDocs(q);

        const couponsList: any[] = [];
        querySnapshot.forEach((doc) => {
          couponsList.push({ id: doc.id, ...doc.data() });
        });
        console.log(couponsList, "======t couponsList");
        setCoupens(couponsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "doctors"));
        const doctorsList: any[] = [];
        querySnapshot.forEach((doc) => {
          doctorsList.push({ id: doc.id, ...doc.data() });
        });
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const { toast } = useToast();

  useEffect(() => {
    if (selectedDoctor) {
      setFormData((prev) => ({ ...prev, doctorId: selectedDoctor.id }));
    }
  }, [selectedDoctor]);

  const selectedDoctorData =
    doctors.find((d) => d.id === formData.doctorId) || doctors[0];
  console.log("selectedDoctorData===", selectedDoctorData);

  const baseFee = isFirstTime
    ? selectedDoctorData?.priorityFee
    : selectedDoctorData?.recurringFee;
  const priorityFee = isPriority ? 200 : 0;
  const subtotal = baseFee + priorityFee;
  const discount = (subtotal * couponDiscount) / 100;
  const convenienceFee = 50;
  const total = subtotal - discount + convenienceFee;

  const handleNext = () => {
    if (step === 1 && (!selectedDate || !selectedTime)) {
      toast({
        title: "Please select date and time",
        description: "Both date and time slot are required to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && (!formData.name || !formData.phone)) {
      toast({
        title: "Please fill required fields",
        description: "Name and phone number are required.",
        variant: "destructive",
      });
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const applyCoupon = () => {
    const validCoupons = {
      FIRST10: 10,
      HEALTH20: 20,
      NEWPATIENT: 15,
    };

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setCouponDiscount(validCoupons[couponCode as keyof typeof validCoupons]);
      toast({
        title: "Coupon Applied!",
        description: `You saved ${
          validCoupons[couponCode as keyof typeof validCoupons]
        }% on your booking.`,
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code.",
        variant: "destructive",
      });
    }
  };

  // Utility: Save / Update Order Status
  const updateOrderStatus = async (orderId: string, data: any) => {
    try {
      await setDoc(doc(db, "bookings", orderId), data, { merge: true });
      console.log(`✅ Order ${orderId} updated:`, data);
    } catch (err) {
      console.error(`❌ Failed to update order ${orderId}:`, err);
    }
  };

  const handleBooking = async () => {
    try {
      // 1. Create order on backend
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total, // in rupees, API multiplies by 100
          doctorId: formData.doctorId,
          procedureId: "procedure_123", // replace with actual procedureId
          patientData: formData,
          couponId: couponCode || null,
          isUrgent: isPriority,
        }),
      });

      let order = await orderResponse.json(); // ✅ order is directly the Razorpay order object
      // order = order.order;
      if (!order?.order.id) {
        throw new Error("Failed to create Razorpay order");
      }
      const createOrder = order?.order;
      const pendingOrder = {
        ...createOrder,
        status: "pending",
        payment: null,
        patientData: formData,
      };
      try {
        await updateOrderStatus(createOrder.id, pendingOrder);
      } catch (err) {
        console.error(
          "⚠️ Failed to update Firestore, but payment succeeded:",
          err
        );
      }
      // 2. Razorpay options
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount, // already in paise
        currency: order.currency,
        name: "RJ Healthcare",
        description: "Doctor Appointment Booking",
        order_id: order.id, // use directly
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async function (response: any) {
          // ✅ Payment successful

          const paidOrder = {
            ...pendingOrder,
            status: "paid",
            payment: response,
          };

          await updateOrderStatus(createOrder.id, paidOrder);
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });

          // TODO: Save booking with payment details to DB
          // await fetch("/api/bookings", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({
          //     order,
          //     payment: response,
          //     patientData: formData,
          //   }),
          // });

          // onClose();
          setTimeout(() => {
            setStep(1);
            setSelectedDate(undefined);
            setSelectedTime("");
            setFormData({
              name: "",
              phone: "",
              email: "",
              age: "",
              gender: "",
              symptoms: "",
              doctorId: selectedDoctor?.id || 1,
            });
            onClose();
          }, 2000);
        },
        theme: { color: "#14B8A6" },
      };

      // 3. Open Razorpay Checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      // 5. Handle payment failure
      rzp.on("payment.failed", async function (response: any) {
        const failedOrder = {
          ...pendingOrder,
          status: "failed",
          payment: response.error || null,
          failedReason: response.error?.description || "Unknown error",
        };

        try {
          await updateOrderStatus(createOrder.id, failedOrder);
        } catch (err) {
          console.error(
            "⚠️ Failed to update Firestore on payment.failed:",
            err
          );
        }

        toast({
          title: "Payment Failed",
          description: "Payment Failed: " + failedOrder.failedReason,
          variant: "destructive",
        });
      });
    } catch (err) {
      console.error("Payment error:", err);
      toast({
        title: "Payment Failed",
        description: "Something went wrong while processing payment.",
        variant: "destructive",
      });
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const maxDate = addDays(today, 30);
    return date < today || date > maxDate || date.getDay() === 0; // Disable Sundays
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="mr-2 h-6 w-6 text-teal-600" />
            Book Your Appointment
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNumber
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? "bg-teal-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Date & Time Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select Date & Time
              </h3>
              <p className="text-gray-600">
                Choose your preferred appointment date and time slot
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Select Date
                </Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  className="rounded-lg border shadow-sm"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  Available Time Slots
                </Label>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={`${
                          selectedTime === time
                            ? "bg-teal-600 hover:bg-teal-700 text-white"
                            : "border-gray-300 hover:border-teal-600 hover:text-teal-600"
                        }`}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Please select a date first
                  </div>
                )}
              </div>
            </div>

            {selectedDate && selectedTime && (
              <Card className="bg-teal-50 border-teal-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-teal-900">
                        Selected Appointment
                      </p>
                      <p className="text-teal-700">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")} at{" "}
                        {selectedTime}
                      </p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-teal-600" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Patient Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Patient Information
              </h3>
              <p className="text-gray-600">
                Please provide your details for the appointment
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 9876543210"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="Enter your age"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select
                    value={formData.doctorId.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        doctorId: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem
                          key={doctor.id}
                          value={doctor.id.toString()}
                        >
                          {doctor.name} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) =>
                  setFormData({ ...formData, symptoms: e.target.value })
                }
                placeholder="Please describe your symptoms or reason for consultation..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="first-time" className="text-base font-medium">
                  First time patient?
                </Label>
                <p className="text-sm text-gray-600">
                  This affects consultation fees
                </p>
              </div>
              <Switch
                id="first-time"
                checked={isFirstTime}
                onCheckedChange={setIsFirstTime}
              />
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Coupons */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Review & Apply Coupons
              </h3>
              <p className="text-gray-600">
                Review your booking details and apply discount coupons
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Appointment Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">
                          {selectedDoctorData.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {selectedDate
                            ? format(selectedDate, "MMM d, yyyy")
                            : "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {selectedTime || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient Type:</span>
                        <Badge variant={isFirstTime ? "default" : "secondary"}>
                          {isFirstTime ? "First Time" : "Follow-up"}
                        </Badge>
                      </div>
                      {isPriority && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Priority Booking
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <Label
                      htmlFor="priority"
                      className="text-base font-medium text-amber-900"
                    >
                      Priority Appointment
                    </Label>
                    <p className="text-sm text-amber-700">
                      Get seen faster (+₹200)
                    </p>
                  </div>
                  <Switch
                    id="priority"
                    checked={isPriority}
                    onCheckedChange={setIsPriority}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Apply Coupon
                    </h4>
                    <div className="flex space-x-2 mb-4">
                      <Input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        className="flex-1"
                      />
                      <Button onClick={applyCoupon} variant="outline">
                        <Tag className="mr-1 h-4 w-4" />
                        Apply
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">Available coupons:</p>
                      <ul className="space-y-1">
                        {coupons.length > 0 ? (
                          coupons.map((coupon) => (
                            <li
                              key={coupon.id}
                              className="flex items-center text-sm"
                            >
                              •{" "}
                              <span className="ml-1 font-semibold">
                                {coupon.code}
                              </span>{" "}
                              - {coupon.description}
                              {coupon.type === "percentage" ? (
                                <span>({coupon.value}% off)</span>
                              ) : (
                                <span>(₹{coupon.value} off)</span>
                              )}
                              {coupon.applicableFor === "first-time" && (
                                <span className="ml-2 text-blue-500">
                                  (First-time only)
                                </span>
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500">
                            No coupons available
                          </li>
                        )}
                      </ul>

                      {/* <ul className="space-y-1">
                        <li>• FIRST10 - 10% off for first-time patients</li>
                        <li>• HEALTH20 - 20% off on all consultations</li>
                        <li>• NEWPATIENT - 15% off for new patients</li>
                      </ul> */}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Fee Breakdown
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consultation Fee:</span>
                        <span>₹{baseFee}</span>
                      </div>
                      {isPriority && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority Fee:</span>
                          <span>₹{priorityFee}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>₹{subtotal}</span>
                      </div>
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({couponDiscount}%):</span>
                          <span>-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Convenience Fee:</span>
                        <span>₹{convenienceFee}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Amount:</span>
                          <span className="text-teal-600">₹{total}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Complete Payment
              </h3>
              <p className="text-gray-600">
                Secure payment powered by Razorpay
              </p>
            </div>

            <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Final Booking Details
                  </h4>
                  <div className="text-2xl font-bold text-teal-600">
                    ₹{total}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-teal-600" />
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-teal-600" />
                      <span>{formData.phone}</span>
                    </div>
                    {formData.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-teal-600" />
                        <span>{formData.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-teal-600" />
                      <span>
                        {selectedDate
                          ? format(selectedDate, "MMM d, yyyy")
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-teal-600" />
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      <span>RJ Healthcare, Jammu</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleBooking}
                className="bg-teal-600 hover:bg-teal-700 text-white px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Pay ₹{total} & Confirm Booking
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Secure payment powered by Razorpay • 256-bit SSL encrypted
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : handleBack}
            className="px-6 bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 4 && (
            <Button
              onClick={handleNext}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
