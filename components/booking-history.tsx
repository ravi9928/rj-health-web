"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Calendar,
  MoreHorizontal,
  Phone,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  auth,
  db,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { format } from "date-fns";

interface Booking {
  patientData: any;
  id: string;
  patientName: string;
  doctor: string;
  procedure: string;
  dateTime: string;
  amount: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  payment: "paid" | "pending" | "failed";
}

// const mockBookings: Booking[] = [
//   {
//     id: "BK001",
//     patientName: "Sarah Johnson",
//     doctor: "Dr. Smith",
//     procedure: "General Checkup",
//     dateTime: "2024-01-15 10:00 AM",
//     amount: "₹500",
//     status: "confirmed",
//     payment: "paid",
//   },
//   {
//     id: "BK002",
//     patientName: "Emily Davis",
//     doctor: "Dr. Patel",
//     procedure: "Consultation",
//     dateTime: "2024-01-16 2:30 PM",
//     amount: "₹300",
//     status: "pending",
//     payment: "pending",
//   },
// ];

export function BookingHistory() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpStep, setOtpStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpVerifyError, setOtpVerifyError] = useState<string>("");

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible", // you can use 'normal' for visible captcha
          callback: () => {
            console.log("reCAPTCHA solved");
          },
        }
      );
    }
  };

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);

      // Initialize reCAPTCHA if not already
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      // Send OTP
      const phone = `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);

      // Switch to OTP input step
      setOtpStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) {
      setOtpVerifyError("OTP was not sent. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      setOtpVerifyError(""); // reset previous error

      // Verify the OTP using Firebase
      const result = await confirmationResult.confirm(otp);

      // OTP verified successfully
      console.log("User signed in:", result.user);

      try {
        // Query bookings where patientPhone matches the entered phoneNumber
        const bookingsRef = collection(db, "bookings");
        const q = query(
          bookingsRef,
          where("notes.patientPhone", "==", `+91${phoneNumber}`)
        );
        const querySnapshot = await getDocs(q);

        const bookingsList: any[] = [];
        querySnapshot.forEach((doc) => {
          bookingsList.push({ id: doc.id, ...doc.data() });
        });

        console.log("bookingsList", bookingsList);

        setBookings(bookingsList);
        console.log("Bookings fetched for patient:", bookingsList);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }

      setIsAuthenticated(true);
      setShowOtpModal(false);

      // Reset modal state
      setOtpStep("phone");
      setPhoneNumber("");
      setOtp("");
    } catch (error: any) {
      console.error(error.code, "OTP verification failed:", error);

      // Show error below OTP input
      if (error.code === "auth/invalid-verification-code") {
        setOtpVerifyError("Invalid OTP. Please check and try again.");
      } else if (error.code === "auth/code-expired") {
        setOtpVerifyError("OTP expired. Please request a new one.");
      } else {
        setOtpVerifyError("OTP verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-secondary text-secondary-foreground";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case "paid":
        return "bg-secondary text-secondary-foreground";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Booking History
            </h1>
            <p className="text-muted-foreground">
              View and manage all appointments.
            </p>
          </div>

          {/* Empty State */}
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Booking History
              </h3>
              <p className="text-muted-foreground mb-6">
                To view your booking history, please verify your phone number
                first.
              </p>
              <Button
                onClick={() => setShowOtpModal(true)}
                className="w-full max-w-xs"
              >
                View Your Bookings
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {otpStep === "phone" ? "Verify Phone Number" : "Enter OTP"}
              </DialogTitle>
              <DialogDescription>
                {otpStep === "phone"
                  ? "Enter your phone number to receive an OTP"
                  : `Enter the 6-digit code sent to ${phoneNumber}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {otpStep === "phone" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="modal-phone">Phone Number</Label>
                    <Input
                      id="modal-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  {otpVerifyError && (
                    <p className="mt-1 text-red-500 text-sm">
                      {otpVerifyError}
                    </p>
                  )}

                  <Button
                    onClick={handleSendOTP}
                    disabled={!phoneNumber || isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                  <div id="recaptcha-container"></div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="modal-otp">OTP Code</Label>
                    <Input
                      id="modal-otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setOtpStep("phone")}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Booking History
          </h1>
          <p className="text-muted-foreground">
            View and manage all appointments.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsAuthenticated(false)}
          className="text-sm"
        >
          Sign Out
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by patient, doctor, procedure, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select defaultValue="all-statuses">
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-statuses">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-doctors">
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-doctors">All Doctors</SelectItem>
              <SelectItem value="dr-smith">Dr. Smith</SelectItem>
              <SelectItem value="dr-patel">Dr. Patel</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  SR
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Patient Name
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Doctor
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Procedure
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Date & Time
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Payment
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking,i) => (
                  <tr
                    key={booking.id}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <td className="p-4 font-medium text-foreground">
                      {++i}
                    </td>
                    <td className="p-4 text-foreground">
                      {booking.patientData.name}
                    </td>
                    <td className="p-4 text-foreground">
                      {booking.patientData.doctorId}
                    </td>
                    <td className="p-4 text-foreground">{booking.procedure}</td>
                    <td className="p-4 text-foreground">
                      {" "}
                      {format(
                        new Date(booking.created_at * 1000),
                        "yyyy-MM-dd HH:mm"
                      )}
                    </td>
                    <td className="p-4 font-medium text-foreground">
                      {booking.amount}
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPaymentColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Booking</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
