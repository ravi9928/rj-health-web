import { type NextRequest, NextResponse } from "next/server"
import { analyticsFunctions } from "@/lib/firebase-functions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get("endDate") || new Date().toISOString()

    const data = await analyticsFunctions.getDashboardData(startDate, endDate)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
