"use client"

import { useState } from "react"
import AdminDashboard from "@/components/AdminDashboard"
import PatientBooking from "@/components/PatientBooking"
import Navigation from "@/components/Navigation"
import styles from "@/styles/page.module.css"

export default function Home() {
  const [activeView, setActiveView] = useState<"admin" | "patient">("patient")

  return (
    <div className={styles.appContainer}>
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      <main className={styles.mainContent}>{activeView === "admin" ? <AdminDashboard /> : <PatientBooking />}</main>
    </div>
  )
}
