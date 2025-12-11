"use client"

import styles from "@/styles/components/navigation.module.css"
import { Stethoscope, Users } from "lucide-react"

interface NavigationProps {
  userRole: "admin" | "patient"
  onLogout: () => void
}

export default function Navigation({ userRole, onLogout }: NavigationProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Stethoscope size={28} />
          <span>MediBook</span>
        </div>

        <div className={styles.navLinks}>
          <span className={styles.roleLabel}>
            {userRole === "admin" ? "Admin Dashboard" : "Patient Portal"}
          </span>
          <button
            className={`${styles.navButton}`}
            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
