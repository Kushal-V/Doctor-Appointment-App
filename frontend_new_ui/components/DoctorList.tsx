"use client"

import type { Doctor } from "@/types"
import { User, ChevronRight } from "lucide-react"
import styles from "@/styles/components/doctor-list.module.css"

interface DoctorListProps {
  doctors: Doctor[]
  selectedDoctorId: string | null
  onSelectDoctor: (doctorId: string) => void
}

export default function DoctorList({ doctors, selectedDoctorId, onSelectDoctor }: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No doctors available</p>
      </div>
    )
  }

  return (
    <div className={styles.doctorList}>
      <h3 className={styles.title}>Doctors</h3>
      <div className={styles.list}>
        {doctors.map((doctor) => (
          <button
            key={doctor.id}
            className={`${styles.doctorCard} ${selectedDoctorId === doctor.id ? styles.active : ""}`}
            onClick={() => onSelectDoctor(doctor.id)}
          >
            <div className={styles.avatar}>
              <User size={24} />
            </div>
            <div className={styles.info}>
              <p className={styles.name}>Dr. {doctor.name}</p>
              <p className={styles.specialization}>{doctor.specialization}</p>
            </div>
            <ChevronRight size={20} className={styles.icon} />
          </button>
        ))}
      </div>
    </div>
  )
}
