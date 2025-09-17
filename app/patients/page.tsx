import { AdminLayout } from "@/components/admin-layout"
import { PatientDatabase } from "@/components/patient-database"

export default function PatientsPage() {
  return (
    <AdminLayout>
      <PatientDatabase />
    </AdminLayout>
  )
}
