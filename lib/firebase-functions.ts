import { db, functions, storage } from "@/lib/firebase"
import { generateTimeSlots } from "@/lib/utils" // Import the utility function
import { useStore } from "@/lib/store" // Import useStore to access holidays

// Doctor Functions
export const doctorFunctions = {
  create: async (doctorData: any) => {
    try {
      const result = await db.collection("doctors").add({
        ...doctorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      console.log("Doctor created with ID:", result.id)
      return result
    } catch (error) {
      console.error("Error creating doctor:", error)
      throw error
    }
  },

  update: async (doctorId: string, doctorData: any) => {
    try {
      await db
        .collection("doctors")
        .doc(doctorId)
        .update({
          ...doctorData,
          updatedAt: new Date().toISOString(),
        })
      console.log("Doctor updated:", doctorId)
      return true
    } catch (error) {
      console.error("Error updating doctor:", error)
      throw error
    }
  },

  delete: async (doctorId: string) => {
    try {
      // Check if doctor has active bookings
      const bookings = await db.collection("bookings").where("doctorId", "==", doctorId).get()

      if (bookings.docs.length > 0) {
        throw new Error("Cannot delete doctor with active bookings")
      }

      await db.collection("doctors").doc(doctorId).delete()
      console.log("Doctor deleted:", doctorId)
      return true
    } catch (error) {
      console.error("Error deleting doctor:", error)
      throw error
    }
  },

  getAll: async () => {
    try {
      const snapshot = await db.collection("doctors").get()
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching doctors:", error)
      throw error
    }
  },

  getById: async (doctorId: string) => {
    try {
      const doc = await db.collection("doctors").doc(doctorId).get()
      if (doc.exists) {
        return { id: doc.id, ...doc.data() }
      }
      return null
    } catch (error) {
      console.error("Error fetching doctor:", error)
      throw error
    }
  },

  updateAvailability: async (doctorId: string, availability: any) => {
    try {
      await db.collection("doctors").doc(doctorId).update({
        availability,
        updatedAt: new Date().toISOString(),
      })
      console.log("Doctor availability updated:", doctorId)
      return true
    } catch (error) {
      console.error("Error updating availability:", error)
      throw error
    }
  },

  uploadImage: async (doctorId: string, file: File) => {
    try {
      const storageRef = storage.ref(`doctors/${doctorId}/${file.name}`)
      const uploadTask = await storageRef.put(file)
      const downloadURL = await uploadTask.ref.getDownloadURL()

      await db.collection("doctors").doc(doctorId).update({
        image: downloadURL,
        updatedAt: new Date().toISOString(),
      })

      return downloadURL
    } catch (error) {
      console.error("Error uploading doctor image:", error)
      throw error
    }
  },

  getAvailableSlots: async (doctorId: string, date: string) => {
    try {
      // Get doctor data
      const doctor = await db.collection("doctors").doc(doctorId).get()
      if (!doctor.exists) {
        throw new Error("Doctor not found")
      }

      const doctorData = doctor.data()
      const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "lowercase" })
      let dayAvailability = doctorData?.availability?.[dayOfWeek]

      // Get holidays from the store (assuming this function runs in a context where Zustand is available,
      // or you'd pass holidays as an argument if this were a server function)
      const { holidays, bookings } = useStore.getState() // Access state directly for server-side like context

      // Check for clinic-wide holidays
      const clinicHoliday = holidays.find((h) => h.date === date && h.appliesTo === "all" && h.type === "holiday")
      if (clinicHoliday) {
        return [] // Clinic is fully closed
      }

      // Check for doctor-specific holidays
      const doctorHoliday = holidays.find(
        (h) => h.date === date && h.appliesTo === "doctor" && h.doctorId === doctorId && h.type === "holiday",
      )
      if (doctorHoliday) {
        return [] // Doctor is fully closed
      }

      // Check for special days
      const specialDay = holidays.find(
        (h) => h.date === date && h.type === "special_day" && (h.appliesTo === "all" || h.doctorId === doctorId),
      )

      if (specialDay) {
        if (specialDay.isFullDay) {
          return [] // Special day is a full closure
        }
        // Override availability with custom sessions/breaks for special day
        dayAvailability = {
          ...dayAvailability,
          isAvailable: true, // Assume available if custom sessions are provided
          sessions: specialDay.customSessions || [],
          breaks: specialDay.customBreaks || [],
        }
      }

      if (!dayAvailability?.isAvailable || dayAvailability.sessions.length === 0) {
        return []
      }

      // Get existing bookings for the date
      const bookedSlots = bookings
        .filter((b) => b.doctorId === doctorId && b.date === date && (b.status === "paid" || b.status === "pending"))
        .map((b) => b.time)

      // Generate available slots from sessions
      const availableSlots: string[] = []

      for (const session of dayAvailability.sessions.filter((s: any) => s.isActive)) {
        const sessionSlots = generateTimeSlots(
          session.start,
          session.end,
          session.slotDuration,
          bookedSlots,
          dayAvailability.breaks,
        )
        availableSlots.push(...sessionSlots.filter((slot) => slot.status === "available").map((slot) => slot.time))
      }

      return availableSlots.sort()
    } catch (error) {
      console.error("Error fetching available slots:", error)
      throw error
    }
  },
}

// Procedure Functions
export const procedureFunctions = {
  create: async (procedureData: any) => {
    try {
      const result = await db.collection("procedures").add({
        ...procedureData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      console.log("Procedure created with ID:", result.id)
      return result
    } catch (error) {
      console.error("Error creating procedure:", error)
      throw error
    }
  },

  update: async (procedureId: string, procedureData: any) => {
    try {
      await db
        .collection("procedures")
        .doc(procedureId)
        .update({
          ...procedureData,
          updatedAt: new Date().toISOString(),
        })
      console.log("Procedure updated:", procedureId)
      return true
    } catch (error) {
      console.error("Error updating procedure:", error)
      throw error
    }
  },

  delete: async (procedureId: string) => {
    try {
      // Check if procedure has active bookings
      const bookings = await db.collection("bookings").where("procedureId", "==", procedureId).get()

      if (bookings.docs.length > 0) {
        throw new Error("Cannot delete procedure with active bookings")
      }

      await db.collection("procedures").doc(procedureId).delete()
      console.log("Procedure deleted:", procedureId)
      return true
    } catch (error) {
      console.error("Error deleting procedure:", error)
      throw error
    }
  },

  getAll: async () => {
    try {
      const snapshot = await db.collection("procedures").get()
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching procedures:", error)
      throw error
    }
  },

  getByDoctor: async (doctorId: string) => {
    try {
      const snapshot = await db.collection("procedures").where("doctorId", "==", doctorId).get()
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching procedures by doctor:", error)
      throw error
    }
  },
}

// Booking Functions
export const bookingFunctions = {
  create: async (bookingData: any) => {
    try {
      const result = await db.collection("bookings").add({
        ...bookingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Send notification to admin
      await notificationFunctions.sendToAdmin({
        title: "New Booking",
        body: `New appointment booked by ${bookingData.userName}`,
        data: { bookingId: result.id, type: "booking" },
      })

      console.log("Booking created with ID:", result.id)
      return result
    } catch (error) {
      console.error("Error creating booking:", error)
      throw error
    }
  },

  update: async (bookingId: string, bookingData: any) => {
    try {
      await db
        .collection("bookings")
        .doc(bookingId)
        .update({
          ...bookingData,
          updatedAt: new Date().toISOString(),
        })

      // Send notification for status changes
      if (bookingData.status) {
        await notificationFunctions.sendToUser(bookingData.userId, {
          title: "Booking Update",
          body: `Your booking status has been updated to ${bookingData.status}`,
          data: { bookingId, type: "booking_update" },
        })
      }

      console.log("Booking updated:", bookingId)
      return true
    } catch (error) {
      console.error("Error updating booking:", error)
      throw error
    }
  },

  cancel: async (bookingId: string, reason: string) => {
    try {
      const booking = await db.collection("bookings").doc(bookingId).get()
      if (!booking.exists) {
        throw new Error("Booking not found")
      }

      const bookingData = booking.data()

      // Update booking status
      await db.collection("bookings").doc(bookingId).update({
        status: "cancelled",
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Create refund if payment was made
      if (bookingData?.paymentId && bookingData?.status === "paid") {
        await refundFunctions.create({
          bookingId,
          paymentId: bookingData.paymentId,
          amount: bookingData.amount,
          reason,
          userId: bookingData.userId,
        })
      }

      console.log("Booking cancelled:", bookingId)
      return true
    } catch (error) {
      console.error("Error cancelling booking:", error)
      throw error
    }
  },

  getAll: async (filters?: any) => {
    try {
      let query = db.collection("bookings")

      if (filters?.doctorId) {
        query = query.where("doctorId", "==", filters.doctorId)
      }
      if (filters?.status) {
        query = query.where("status", "==", filters.status)
      }
      if (filters?.date) {
        query = query.where("date", "==", filters.date)
      }

      const snapshot = await query.get()
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching bookings:", error)
      throw error
    }
  },

  getAvailableSlots: async (doctorId: string, date: string) => {
    try {
      return await doctorFunctions.getAvailableSlots(doctorId, date)
    } catch (error) {
      console.error("Error fetching available slots:", error)
      throw error
    }
  },
}

// Patient Functions
export const patientFunctions = {
  create: async (patientData: any) => {
    try {
      const result = await db.collection("patients").add({
        ...patientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      console.log("Patient created with ID:", result.id)
      return result
    } catch (error) {
      console.error("Error creating patient:", error)
      throw error
    }
  },

  update: async (patientId: string, patientData: any) => {
    try {
      await db
        .collection("patients")
        .doc(patientId)
        .update({
          ...patientData,
          updatedAt: new Date().toISOString(),
        })
      console.log("Patient updated:", patientId)
      return true
    } catch (error) {
      console.error("Error updating patient:", error)
      throw error
    }
  },

  getOrCreate: async (phone: string, patientData: any) => {
    try {
      // Check if patient exists
      const existingPatients = await db.collection("patients").where("phone", "==", phone).get()

      if (existingPatients.docs.length > 0) {
        const patient = existingPatients.docs[0]
        // Update visit count and last visit
        await patientFunctions.update(patient.id, {
          visitCount: (patient.data().visitCount || 0) + 1,
          lastVisit: new Date().toISOString().split("T")[0],
          type: patient.data().visitCount > 0 ? "recurring" : "first-time",
        })
        return { id: patient.id, ...patient.data() }
      } else {
        // Create new patient
        const result = await patientFunctions.create({
          ...patientData,
          visitCount: 1,
          firstVisit: new Date().toISOString().split("T")[0],
          lastVisit: new Date().toISOString().split("T")[0],
          type: "first-time",
        })
        return { id: result.id, ...patientData }
      }
    } catch (error) {
      console.error("Error getting or creating patient:", error)
      throw error
    }
  },

  getAll: async (filters?: any) => {
    try {
      let query = db.collection("patients")

      if (filters?.type) {
        query = query.where("type", "==", filters.type)
      }

      const snapshot = await query.get()
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching patients:", error)
      throw error
    }
  },
}

// Coupon Functions
export const couponFunctions = {
  create: async (couponData: any) => {
    try {
      const result = await db.collection("coupons").add({
        ...couponData,
        usedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      console.log("Coupon created with ID:", result.id)
      return result
    } catch (error) {
      console.error("Error creating coupon:", error)
      throw error
    }
  },

  update: async (couponId: string, couponData: any) => {
    try {
      await db
        .collection("coupons")
        .doc(couponId)
        .update({
          ...couponData,
          updatedAt: new Date().toISOString(),
        })
      console.log("Coupon updated:", couponId)
      return true
    } catch (error) {
      console.error("Error updating coupon:", error)
      throw error
    }
  },

  delete: async (couponId: string) => {
    try {
      await db.collection("coupons").doc(couponId).delete()
      console.log("Coupon deleted:", couponId)
      return true
    } catch (error) {
      console.error("Error deleting coupon:", error)
      throw error
    }
  },

  validate: async (code: string, amount: number, doctorId?: string, procedureId?: string) => {
    try {
      const coupons = await db.collection("coupons").where("code", "==", code).get()

      if (coupons.docs.length === 0) {
        throw new Error("Invalid coupon code")
      }

      const coupon = coupons.docs[0].data()

      // Check if coupon is active
      if (coupon.status !== "active") {
        throw new Error("Coupon is not active")
      }

      // Check expiry date
      if (new Date(coupon.expiryDate) < new Date()) {
        throw new Error("Coupon has expired")
      }

      // Check usage limit
      if (coupon.usedCount >= coupon.usageLimit) {
        throw new Error("Coupon usage limit exceeded")
      }

      // Check applicability
      if (coupon.applicableTo === "doctor" && coupon.doctorId !== doctorId) {
        throw new Error("Coupon not applicable for this doctor")
      }

      if (coupon.applicableTo === "procedure" && coupon.procedureId !== procedureId) {
        throw new Error("Coupon not applicable for this procedure")
      }

      // Calculate discount
      let discount = 0
      if (coupon.type === "percent") {
        discount = (amount * coupon.discount) / 100
      } else {
        discount = Math.min(coupon.discount, amount)
      }

      return {
        valid: true,
        discount,
        couponId: coupons.docs[0].id,
        coupon,
      }
    } catch (error) {
      console.error("Error validating coupon:", error)
      throw error
    }
  },

  apply: async (couponId: string) => {
    try {
      const coupon = await db.collection("coupons").doc(couponId).get()
      if (!coupon.exists) {
        throw new Error("Coupon not found")
      }

      const couponData = coupon.data()
      await db
        .collection("coupons")
        .doc(couponId)
        .update({
          usedCount: (couponData?.usedCount || 0) + 1,
          updatedAt: new Date().toISOString(),
        })

      console.log("Coupon applied:", couponId)
      return true
    } catch (error) {
      console.error("Error applying coupon:", error)
      throw error
    }
  },
}

// Refund Functions
export const refundFunctions = {
  create: async (refundData: any) => {
    try {
      const result = await db.collection("refunds").add({
        ...refundData,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Send notification to admin
      await notificationFunctions.sendToAdmin({
        title: "New Refund Request",
        body: `Refund request for ₹${refundData.amount}`,
        data: { refundId: result.id, type: "refund" },
      })

      console.log("Refund created with ID:", result.id)
      return result
    } catch (error) {
      console.error("Error creating refund:", error)
      throw error
    }
  },

  process: async (refundId: string, notes?: string) => {
    try {
      const refund = await db.collection("refunds").doc(refundId).get()
      if (!refund.exists) {
        throw new Error("Refund not found")
      }

      const refundData = refund.data()

      // Process refund via Razorpay
      const razorpayRefund = await functions.httpsCallable("processRazorpayRefund")({
        paymentId: refundData?.paymentId,
        amount: refundData?.amount,
        notes: { refundId, notes },
      })

      // Update refund status
      await db.collection("refunds").doc(refundId).update({
        status: "processed",
        razorpayRefundId: razorpayRefund.data.id,
        processedAt: new Date().toISOString(),
        notes,
        updatedAt: new Date().toISOString(),
      })

      // Send notification to user
      await notificationFunctions.sendToUser(refundData?.userId, {
        title: "Refund Processed",
        body: `Your refund of ₹${refundData?.amount} has been processed`,
        data: { refundId, type: "refund_processed" },
      })

      console.log("Refund processed:", refundId)
      return true
    } catch (error) {
      console.error("Error processing refund:", error)
      throw error
    }
  },

  getAll: async (filters?: any) => {
    try {
      let query = db.collection("refunds")

      if (filters?.status) {
        query = query.where("status", "==", filters.status)
      }
      if (filters?.userId) {
        query = query.where("userId", "==", filters.userId)
      }

      const snapshot = await query.get()
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching refunds:", error)
      throw error
    }
  },
}

// Notification Functions
export const notificationFunctions = {
  sendToUser: async (userId: string, notification: any) => {
    try {
      const sendNotification = functions.httpsCallable("sendNotificationToUser")
      const result = await sendNotification({
        userId,
        notification,
      })
      console.log("Notification sent to user:", userId)
      return result
    } catch (error) {
      console.error("Error sending notification to user:", error)
      throw error
    }
  },

  sendToAdmin: async (notification: any) => {
    try {
      const sendNotification = functions.httpsCallable("sendNotificationToAdmin")
      const result = await sendNotification({ notification })
      console.log("Notification sent to admin")
      return result
    } catch (error) {
      console.error("Error sending notification to admin:", error)
      throw error
    }
  },

  sendBulk: async (userIds: string[], notification: any) => {
    try {
      const sendBulkNotification = functions.httpsCallable("sendBulkNotification")
      const result = await sendBulkNotification({
        userIds,
        notification,
      })
      console.log("Bulk notification sent")
      return result
    } catch (error) {
      console.error("Error sending bulk notification:", error)
      throw error
    }
  },

  scheduleReminder: async (bookingId: string, reminderTime: string) => {
    try {
      const scheduleReminder = functions.httpsCallable("scheduleBookingReminder")
      const result = await scheduleReminder({
        bookingId,
        reminderTime,
      })
      console.log("Reminder scheduled for booking:", bookingId)
      return result
    } catch (error) {
      console.error("Error scheduling reminder:", error)
      throw error
    }
  },
}

// Settings Functions
export const settingsFunctions = {
  get: async () => {
    try {
      const doc = await db.collection("settings").doc("clinic").get()
      if (doc.exists) {
        return doc.data()
      }
      return null
    } catch (error) {
      console.error("Error fetching settings:", error)
      throw error
    }
  },

  update: async (settings: any) => {
    try {
      await db
        .collection("settings")
        .doc("clinic")
        .update({
          ...settings,
          updatedAt: new Date().toISOString(),
        })
      console.log("Settings updated")
      return true
    } catch (error) {
      console.error("Error updating settings:", error)
      throw error
    }
  },
}

// Razorpay Account Functions
export const razorpayAccountFunctions = {
  create: async (accountData: any) => {
    try {
      const result = await db.collection("razorpayAccounts").add({
        ...accountData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      console.log("Razorpay account created with ID:", result.id)
      return result
    } catch (error) {
      console.error("Error creating Razorpay account:", error)
      throw error
    }
  },

  update: async (accountId: string, accountData: any) => {
    try {
      await db
        .collection("razorpayAccounts")
        .doc(accountId)
        .update({
          ...accountData,
          updatedAt: new Date().toISOString(),
        })
      console.log("Razorpay account updated:", accountId)
      return true
    } catch (error) {
      console.error("Error updating Razorpay account:", error)
      throw error
    }
  },

  delete: async (accountId: string) => {
    try {
      await db.collection("razorpayAccounts").doc(accountId).delete()
      console.log("Razorpay account deleted:", accountId)
      return true
    } catch (error) {
      console.error("Error deleting Razorpay account:", error)
      throw error
    }
  },

  getAll: async () => {
    try {
      const snapshot = await db.collection("razorpayAccounts").get()
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching Razorpay accounts:", error)
      throw error
    }
  },
}

// Analytics Functions
export const analyticsFunctions = {
  getDashboardData: async (startDate: string, endDate: string) => {
    try {
      const getDashboardData = functions.httpsCallable("getDashboardAnalytics")
      const result = await getDashboardData({ startDate, endDate })
      return result.data
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      throw error
    }
  },

  getRevenueReport: async (period: string) => {
    try {
      const getRevenueReport = functions.httpsCallable("getRevenueReport")
      const result = await getRevenueReport({ period })
      return result.data
    } catch (error) {
      console.error("Error fetching revenue report:", error)
      throw error
    }
  },

  exportData: async (type: string, filters: any) => {
    try {
      const exportData = functions.httpsCallable("exportData")
      const result = await exportData({ type, filters })
      return result.data
    } catch (error) {
      console.error("Error exporting data:", error)
      throw error
    }
  },
}
