"use client"

import styles from "@/styles/components/navigation.module.css"
import { Stethoscope, Users } from "lucide-react"

interface NavigationProps {
  activeView: "admin" | "patient"
  setActiveView: (view: "admin" | "patient") => void
}

export default function Navigation({ activeView, setActiveView }: NavigationProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Stethoscope size={28} />
          <span>MediBook</span>
        </div>

        <div className={styles.navLinks}>
          <button
            className={`${styles.navButton} ${activeView === "patient" ? styles.active : ""}`}
            onClick={() => setActiveView("patient")}
          >
            <Users size={20} />
            Book Appointment
          </button>
          <button
            className={`${styles.navButton} ${activeView === "admin" ? styles.active : ""}`}
            onClick={() => setActiveView("admin")}
          >
            <Stethoscope size={20} />
            Admin Dashboard
          </button>
        </div>
      </div>
    </nav>
  )
}
