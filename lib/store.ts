import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Doctor {
  id: string
  name: string
  slug: string
  specialty: string
  bio: string
  qualifications: string
  experience: number
  image: string
  firstTimeFee: number
  recurringFee: number
  priorityFee: number
  status: "active" | "inactive"
  availability: {
    [key: string]: {
      isAvailable: boolean
      sessions: Array<{
        id: string
        name: string
        start: string
        end: string
        slotDuration: number
        isActive: boolean
      }>
      breaks: Array<{
        id: string
        name: string
        start: string
        end: string
        isActive: boolean
      }>
    }
  }
}

export interface Procedure {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  price: number
  duration: number
  category: string
  image: string
  doctorIds: string[]
  status: "active" | "inactive"
}

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  isRecurring: boolean
  totalVisits: number
  lastVisit?: string
}

export interface Booking {
  id: string
  patientId: string
  doctorId: string
  procedureId?: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  amount: number
  isPriority: boolean
  couponCode?: string
  couponDiscount?: number
  notes?: string
  createdAt: string
}

export interface Coupon {
  id: string
  code: string
  description: string
  type: "percentage" | "fixed"
  value: number
  minAmount: number
  maxDiscount?: number
  validFrom: string
  validTo: string
  usageLimit: number
  usedCount: number
  status: "active" | "inactive"
}

interface Store {
  doctors: Doctor[]
  procedures: Procedure[]
  patients: Patient[]
  bookings: Booking[]
  coupons: Coupon[]

  // Actions
  addPatient: (patient: Omit<Patient, "id">) => string
  updatePatient: (id: string, updates: Partial<Patient>) => void
  getPatientByPhone: (phone: string) => Patient | undefined
  addBooking: (booking: Omit<Booking, "id">) => string
  validateCoupon: (code: string, amount: number) => { valid: boolean; discount: number; error?: string }
  getAvailableSlots: (doctorId: string, date: string) => string[]
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      doctors: [
        {
          id: "dr-samita-bhat",
          name: "Dr. Samita Bhat",
          slug: "dr-samita-bhat",
          specialty: "Gynecology & Obstetrics",
          bio: "Dr. Samita Bhat is a highly experienced gynecologist with over 15 years of practice in women's health. She specializes in high-risk pregnancies, minimally invasive surgeries, and comprehensive women's healthcare.",
          qualifications: "MBBS, MD (Gynecology & Obstetrics), FRCOG",
          experience: 15,
          image: "/placeholder.svg?height=300&width=300",
          firstTimeFee: 1500,
          recurringFee: 1200,
          priorityFee: 2000,
          status: "active",
          availability: {
            monday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "09:00", end: "13:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Evening Session", start: "15:00", end: "18:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "13:00", end: "15:00", isActive: true }],
            },
            tuesday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "09:00", end: "13:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Evening Session", start: "15:00", end: "18:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "13:00", end: "15:00", isActive: true }],
            },
            wednesday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "09:00", end: "13:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Evening Session", start: "15:00", end: "18:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "13:00", end: "15:00", isActive: true }],
            },
            thursday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "09:00", end: "13:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Evening Session", start: "15:00", end: "18:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "13:00", end: "15:00", isActive: true }],
            },
            friday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "09:00", end: "13:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Evening Session", start: "15:00", end: "18:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "13:00", end: "15:00", isActive: true }],
            },
            saturday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Weekend Session", start: "09:00", end: "14:00", slotDuration: 30, isActive: true },
              ],
              breaks: [],
            },
            sunday: { isAvailable: false, sessions: [], breaks: [] },
          },
        },
        {
          id: "dr-rajesh-kumar",
          name: "Dr. Rajesh Kumar",
          slug: "dr-rajesh-kumar",
          specialty: "Gastroenterology",
          bio: "Dr. Rajesh Kumar is a renowned gastroenterologist with expertise in digestive disorders, endoscopy, and liver diseases. He has been serving patients in Jammu for over 12 years.",
          qualifications: "MBBS, MD (Internal Medicine), DM (Gastroenterology)",
          experience: 12,
          image: "/placeholder.svg?height=300&width=300",
          firstTimeFee: 1800,
          recurringFee: 1500,
          priorityFee: 2500,
          status: "active",
          availability: {
            monday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Clinic", start: "10:00", end: "14:00", slotDuration: 45, isActive: true },
                { id: "s2", name: "Evening Clinic", start: "16:00", end: "19:00", slotDuration: 45, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "14:00", end: "16:00", isActive: true }],
            },
            tuesday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Clinic", start: "10:00", end: "14:00", slotDuration: 45, isActive: true },
                { id: "s2", name: "Evening Clinic", start: "16:00", end: "19:00", slotDuration: 45, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "14:00", end: "16:00", isActive: true }],
            },
            wednesday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Clinic", start: "10:00", end: "14:00", slotDuration: 45, isActive: true },
                { id: "s2", name: "Evening Clinic", start: "16:00", end: "19:00", slotDuration: 45, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "14:00", end: "16:00", isActive: true }],
            },
            thursday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Clinic", start: "10:00", end: "14:00", slotDuration: 45, isActive: true },
                { id: "s2", name: "Evening Clinic", start: "16:00", end: "19:00", slotDuration: 45, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "14:00", end: "16:00", isActive: true }],
            },
            friday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Clinic", start: "10:00", end: "14:00", slotDuration: 45, isActive: true },
                { id: "s2", name: "Evening Clinic", start: "16:00", end: "19:00", slotDuration: 45, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "14:00", end: "16:00", isActive: true }],
            },
            saturday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Weekend Clinic", start: "10:00", end: "15:00", slotDuration: 45, isActive: true },
              ],
              breaks: [],
            },
            sunday: { isAvailable: false, sessions: [], breaks: [] },
          },
        },
        {
          id: "dr-anita-sharma",
          name: "Dr. Anita Sharma",
          slug: "dr-anita-sharma",
          specialty: "Cardiology",
          bio: "Dr. Anita Sharma is an interventional cardiologist with expertise in cardiac catheterization, angioplasty, and preventive cardiology. She brings advanced cardiac care to Jammu.",
          qualifications: "MBBS, MD (Medicine), DM (Cardiology)",
          experience: 10,
          image: "/placeholder.svg?height=300&width=300",
          firstTimeFee: 2000,
          recurringFee: 1800,
          priorityFee: 2800,
          status: "active",
          availability: {
            monday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "08:00", end: "12:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Afternoon Session", start: "14:00", end: "17:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "12:00", end: "14:00", isActive: true }],
            },
            tuesday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "08:00", end: "12:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Afternoon Session", start: "14:00", end: "17:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "12:00", end: "14:00", isActive: true }],
            },
            wednesday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "08:00", end: "12:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Afternoon Session", start: "14:00", end: "17:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "12:00", end: "14:00", isActive: true }],
            },
            thursday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "08:00", end: "12:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Afternoon Session", start: "14:00", end: "17:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "12:00", end: "14:00", isActive: true }],
            },
            friday: {
              isAvailable: true,
              sessions: [
                { id: "s1", name: "Morning Session", start: "08:00", end: "12:00", slotDuration: 30, isActive: true },
                { id: "s2", name: "Afternoon Session", start: "14:00", end: "17:00", slotDuration: 30, isActive: true },
              ],
              breaks: [{ id: "b1", name: "Lunch Break", start: "12:00", end: "14:00", isActive: true }],
            },
            saturday: { isAvailable: false, sessions: [], breaks: [] },
            sunday: { isAvailable: false, sessions: [], breaks: [] },
          },
        },
      ],
      procedures: [
        {
          id: "laparoscopy",
          name: "Laparoscopy",
          slug: "laparoscopy",
          description: "Minimally invasive surgical procedure for diagnosis and treatment",
          longDescription:
            "Laparoscopy is a minimally invasive surgical technique that allows doctors to examine and treat conditions inside the abdomen and pelvis. Using small incisions and a camera, this procedure offers faster recovery times and reduced scarring compared to traditional open surgery.",
          price: 25000,
          duration: 60,
          category: "Gynecology",
          image: "/placeholder.svg?height=300&width=400",
          doctorIds: ["dr-samita-bhat"],
          status: "active",
        },
        {
          id: "endoscopy",
          name: "Upper Endoscopy",
          slug: "upper-endoscopy",
          description: "Diagnostic procedure to examine the upper digestive tract",
          longDescription:
            "Upper endoscopy is a procedure that uses a flexible tube with a camera to examine the lining of the upper digestive system, including the esophagus, stomach, and duodenum. It helps diagnose conditions like ulcers, inflammation, and other digestive disorders.",
          price: 4500,
          duration: 30,
          category: "Gastroenterology",
          image: "/placeholder.svg?height=300&width=400",
          doctorIds: ["dr-rajesh-kumar"],
          status: "active",
        },
        {
          id: "colonoscopy",
          name: "Colonoscopy",
          slug: "colonoscopy",
          description: "Screening procedure to examine the colon and rectum",
          longDescription:
            "Colonoscopy is a screening procedure that examines the inside of the large intestine (colon and rectum) using a flexible tube with a camera. It's primarily used for colorectal cancer screening and can detect polyps, inflammation, and other abnormalities.",
          price: 5500,
          duration: 45,
          category: "Gastroenterology",
          image: "/placeholder.svg?height=300&width=400",
          doctorIds: ["dr-rajesh-kumar"],
          status: "active",
        },
        {
          id: "ecg",
          name: "ECG (Electrocardiogram)",
          slug: "ecg-electrocardiogram",
          description: "Test to record the electrical activity of the heart",
          longDescription:
            "An electrocardiogram (ECG) is a simple, non-invasive test that records the electrical activity of your heart. It helps detect heart rhythm abnormalities, heart attacks, and other cardiac conditions. The test is quick, painless, and provides immediate results.",
          price: 800,
          duration: 15,
          category: "Cardiology",
          image: "/placeholder.svg?height=300&width=400",
          doctorIds: ["dr-anita-sharma"],
          status: "active",
        },
        {
          id: "echocardiogram",
          name: "Echocardiogram",
          slug: "echocardiogram",
          description: "Ultrasound examination of the heart",
          longDescription:
            "An echocardiogram uses ultrasound waves to create detailed images of your heart's structure and function. It helps evaluate heart valve function, chamber size, wall motion, and overall cardiac performance. This non-invasive test is essential for diagnosing various heart conditions.",
          price: 2500,
          duration: 30,
          category: "Cardiology",
          image: "/placeholder.svg?height=300&width=400",
          doctorIds: ["dr-anita-sharma"],
          status: "active",
        },
        {
          id: "prenatal-checkup",
          name: "Prenatal Checkup",
          slug: "prenatal-checkup",
          description: "Comprehensive pregnancy care and monitoring",
          longDescription:
            "Prenatal checkups are essential for monitoring the health of both mother and baby during pregnancy. These visits include physical examinations, ultrasounds, blood tests, and guidance on nutrition and lifestyle. Regular prenatal care helps ensure a healthy pregnancy and delivery.",
          price: 2000,
          duration: 45,
          category: "Gynecology",
          image: "/placeholder.svg?height=300&width=400",
          doctorIds: ["dr-samita-bhat"],
          status: "active",
        },
      ],
      patients: [],
      bookings: [],
      coupons: [
        {
          id: "FIRST20",
          code: "FIRST20",
          description: "20% off for first-time patients",
          type: "percentage",
          value: 20,
          minAmount: 500,
          maxDiscount: 1000,
          validFrom: "2024-01-01",
          validTo: "2024-12-31",
          usageLimit: 100,
          usedCount: 15,
          status: "active",
        },
        {
          id: "HEALTH500",
          code: "HEALTH500",
          description: "₹500 off on procedures above ₹2000",
          type: "fixed",
          value: 500,
          minAmount: 2000,
          validFrom: "2024-01-01",
          validTo: "2024-06-30",
          usageLimit: 50,
          usedCount: 8,
          status: "active",
        },
      ],

      // Actions
      addPatient: (patient) => {
        const id = generateId()
        set((state) => ({
          patients: [...state.patients, { ...patient, id }],
        }))
        return id
      },

      updatePatient: (id, updates) =>
        set((state) => ({
          patients: state.patients.map((patient) => (patient.id === id ? { ...patient, ...updates } : patient)),
        })),

      getPatientByPhone: (phone) => {
        const state = get()
        return state.patients.find((patient) => patient.phone === phone)
      },

      addBooking: (booking) => {
        const id = generateId()
        set((state) => ({
          bookings: [...state.bookings, { ...booking, id }],
        }))
        return id
      },

      validateCoupon: (code, amount) => {
        const state = get()
        const coupon = state.coupons.find((c) => c.code === code && c.status === "active")

        if (!coupon) {
          return { valid: false, discount: 0, error: "Invalid coupon code" }
        }

        const now = new Date()
        const validFrom = new Date(coupon.validFrom)
        const validTo = new Date(coupon.validTo)

        if (now < validFrom || now > validTo) {
          return { valid: false, discount: 0, error: "Coupon has expired" }
        }

        if (amount < coupon.minAmount) {
          return {
            valid: false,
            discount: 0,
            error: `Minimum amount ₹${coupon.minAmount} required`,
          }
        }

        if (coupon.usedCount >= coupon.usageLimit) {
          return { valid: false, discount: 0, error: "Coupon usage limit exceeded" }
        }

        let discount = 0
        if (coupon.type === "percentage") {
          discount = (amount * coupon.value) / 100
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount
          }
        } else {
          discount = coupon.value
        }

        return { valid: true, discount }
      },

      getAvailableSlots: (doctorId, date) => {
        const state = get()
        const doctor = state.doctors.find((d) => d.id === doctorId)
        if (!doctor) return []

        const dayOfWeek = new Date(date).toLocaleLowerCase()
        const availability = doctor.availability[dayOfWeek]

        if (!availability || !availability.isAvailable) return []

        const slots: string[] = []
        availability.sessions.forEach((session) => {
          if (!session.isActive) return

          const startTime = new Date(`2024-01-01T${session.start}:00`)
          const endTime = new Date(`2024-01-01T${session.end}:00`)
          const slotDuration = session.slotDuration

          while (startTime < endTime) {
            const timeString = startTime.toTimeString().slice(0, 5)

            // Check if this time conflicts with any breaks
            const isBreakTime = availability.breaks.some((breakTime) => {
              if (!breakTime.isActive) return false
              const breakStart = new Date(`2024-01-01T${breakTime.start}:00`)
              const breakEnd = new Date(`2024-01-01T${breakTime.end}:00`)
              return startTime >= breakStart && startTime < breakEnd
            })

            if (!isBreakTime) {
              slots.push(timeString)
            }

            startTime.setMinutes(startTime.getMinutes() + slotDuration)
          }
        })

        // Filter out booked slots
        const bookedSlots = state.bookings
          .filter((booking) => booking.doctorId === doctorId && booking.date === date && booking.status !== "cancelled")
          .map((booking) => booking.time)

        return slots.filter((slot) => !bookedSlots.includes(slot))
      },
    }),
    {
      name: "rj-healthcare-website-store",
    },
  ),
)
