// Firebase configuration and initialization
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  // apiKey: "AIzaSyDummyApiKeyForRJHealthcare123456789",
  // authDomain: "rj-healthcare-dummy.firebaseapp.com",
  // projectId: "rj-healthcare-dummy",
  // storageBucket: "rj-healthcare-dummy.appspot.com",
  // messagingSenderId: "123456789012",
  // appId: "1:123456789012:web:dummy123456789abcdef",
  // measurementId: "G-DUMMY123456",

  
  apiKey: "AIzaSyDcw0_FX77BTM8R_CD9bqKHBG-l_sg6e58",
  authDomain: "rj-health.firebaseapp.com",
  projectId: "rj-health",
  storageBucket: "rj-health.firebasestorage.app",
  messagingSenderId: "977001519760",
  appId: "1:977001519760:web:e5a6171961f1c141961615",
  measurementId: "G-WT84H0RWV7",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Enhanced mock data
const mockData: any = {
  doctors: [
    {
      id: "dr1",
      name: "Dr. Sarah Johnson",
      specialty: "Gynecology",
      status: "active",
      bankAccountId: "bank1",
      availability: {
        monday: { start: "09:00", end: "17:00", slots: 30, isAvailable: true },
        tuesday: { start: "09:00", end: "17:00", slots: 30, isAvailable: true },
        wednesday: { start: "10:00", end: "16:00", slots: 30, isAvailable: true },
        thursday: { start: "09:00", end: "17:00", slots: 30, isAvailable: true },
        friday: { start: "09:00", end: "15:00", slots: 30, isAvailable: true },
        saturday: { start: "09:00", end: "13:00", slots: 30, isAvailable: true },
        sunday: { start: "", end: "", slots: 0, isAvailable: false },
      },
    },
    {
      id: "dr2",
      name: "Dr. Michael Chen",
      specialty: "Gastroenterology",
      status: "active",
      bankAccountId: "bank2",
      availability: {
        monday: { start: "08:00", end: "16:00", slots: 45, isAvailable: true },
        tuesday: { start: "08:00", end: "16:00", slots: 45, isAvailable: true },
        wednesday: { start: "08:00", end: "16:00", slots: 45, isAvailable: true },
        thursday: { start: "08:00", end: "16:00", slots: 45, isAvailable: true },
        friday: { start: "08:00", end: "14:00", slots: 45, isAvailable: true },
        saturday: { start: "", end: "", slots: 0, isAvailable: false },
        sunday: { start: "", end: "", slots: 0, isAvailable: false },
      },
    },
  ],
  bankAccounts: [
    {
      id: "bank1",
      name: "RJ Healthcare Primary",
      bankName: "HDFC Bank",
      accountNumber: "50100123456789",
      ifscCode: "HDFC0001234",
      accountType: "Current",
      isDefault: true,
      category: "gynecology",
    },
    {
      id: "bank2",
      name: "RJ Healthcare Secondary",
      bankName: "ICICI Bank",
      accountNumber: "123456789012",
      ifscCode: "ICIC0001234",
      accountType: "Current",
      isDefault: false,
      category: "gastroenterology",
    },
  ],
  settings: {
    razorpay: {
      mode: "test",
      testKeys: {
        keyId: "rzp_test_dummy123456789",
        keySecret: "dummy_secret_key_for_testing_123456789",
        webhookSecret: "dummy_webhook_secret_123456789",
      },
      liveKeys: {
        keyId: "rzp_live_dummy123456789",
        keySecret: "dummy_live_secret_key_123456789",
        webhookSecret: "dummy_live_webhook_secret_123456789",
      },
      convenienceFee: 2.5,
    },
    seo: {
      metaTitle: "RJ Healthcare - Gynecology & Gastroenterology Clinic",
      metaDescription:
        "RJ Healthcare provides specialized gynecology and gastroenterology services with experienced doctors. Book your appointment online today.",
      ogImage: "https://rjhealthcare.com/og-image.jpg",
    },
    general: {
      clinicName: "RJ Healthcare",
      clinicAddress: "123 Medical Center, Healthcare District, City - 123456",
      clinicPhone: "+91 98765 43210",
      clinicEmail: "info@rjhealthcare.com",
      workingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
      emergencyContact: "+91 98765 43211",
      timezone: "Asia/Kolkata",
      currency: "INR",
      language: "en",
    },
    notifications: {
      fcmServerKey: "AAAADummyFCMServerKey:APA91bDummyServerKeyForNotifications123456789",
      vapidKey: "BDummyVapidKeyForFCMNotifications123456789",
      enableBookingReminders: true,
      enablePaymentNotifications: true,
      enableAppointmentUpdates: true,
      reminderTimeBefore: 24, // hours
    },
  },
  bookings: [],
  procedures: [],
  coupons: [],
  patients: [],
  refunds: [],
}

// FCM Functions
export const messaging = {
  getToken: async () => {
    console.log("Getting FCM token...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return "dummy_fcm_token_" + Date.now()
  },
  onMessage: (callback: (payload: any) => void) => {
    console.log("Setting up FCM message listener")
    // Simulate receiving a message after 5 seconds
    setTimeout(() => {
      callback({
        notification: {
          title: "New Appointment",
          body: "You have a new appointment booking",
        },
        data: {
          type: "booking",
          bookingId: "BK-123",
        },
      })
    }, 5000)
  },
  requestPermission: async () => {
    console.log("Requesting notification permission...")
    await new Promise((resolve) => setTimeout(resolve, 500))
    return "granted"
  },
}

// Cloud Functions
export const functions = {
  httpsCallable: (name: string) => async (data: any) => {
    console.log(`Calling function ${name} with data:`, data)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    switch (name) {
      case "sendNotification":
        return { success: true, messageId: "msg_" + Date.now() }
      case "processRefund":
        return { success: true, refundId: "rfnd_" + Date.now() }
      case "generateReport":
        return { success: true, reportUrl: "https://example.com/report.pdf" }
      default:
        return { success: true }
    }
  },
}

export default app
