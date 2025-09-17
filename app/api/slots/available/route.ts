import { type NextRequest, NextResponse } from "next/server"
import { bookingFunctions } from "@/lib/firebase-functions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")
    const date = searchParams.get("date")

    if (!doctorId || !date) {
      return NextResponse.json({ error: "Missing doctorId or date" }, { status: 400 })
    }

    // In a real application, you would fetch holidays from a database here
    // and pass them to getAvailableSlots if it were a pure server function.
    // For this example, we're assuming useStore.getState() can be called
    // in a server-like context for demonstration, but typically you'd pass data.
    const slots = await bookingFunctions.getAvailableSlots(doctorId, date)

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("Slots fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch available slots" }, { status: 500 })
  }
}
