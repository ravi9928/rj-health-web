import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, fetch from database
    const bookings = [
      {
        id: "bk1",
        userId: "user1",
        userName: "Anita Sharma",
        phone: "+91 98765 43210",
        email: "anita@example.com",
        doctorId: "dr1",
        procedureId: "proc1",
        date: "2023-05-15",
        time: "10:00",
        amount: 1200,
        status: "paid",
        paymentId: "pay_123456789",
        razorpayAccountId: "rzp1",
      },
    ]

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()

    // In a real implementation, save to database
    console.log("Creating booking:", bookingData)

    const newBooking = {
      id: `bk${Date.now()}`,
      ...bookingData,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
