"use client";

// import { AdminLayout } from "@/components/admin-layout"
// import { BookingHistory } from "@/components/booking-history"
import { EmergencyBanner } from "@/components/emergency-banner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// export default function BookingsPage() {
//   return (
//     <main className="min-h-screen">
//       <EmergencyBanner />
//       <Header />
//       <BookingHistory/>
//       <Footer />
//     </main>
//   )
// }

import { useState } from "react";
import { BookingHistory } from "@/components/booking-history";
// import { BookingProcess } from "@/components/booking-process";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <>
      <EmergencyBanner />
      <Header />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="history">Booking History</TabsTrigger>
                <TabsTrigger value="book">Book Appointment</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="history">
              <BookingHistory />
            </TabsContent>

            {/* <TabsContent value="book">
      <BookingProcess />
    </TabsContent> */}
          </Tabs>
        </div>
      </main>
    </>
  );
}
