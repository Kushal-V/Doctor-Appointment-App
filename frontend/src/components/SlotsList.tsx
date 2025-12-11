"use client"

import type { Doctor, Slot } from "@/types"
import { Clock, User } from "lucide-react"
import styles from "@/styles/components/slots-list.module.css"

interface SlotsListProps {
  slots: Slot[]
  doctors: Doctor[]
  onUpdateStatus: (slotId: string, status: "available" | "pending" | "booked") => void
}

export default function SlotsList({ slots, doctors, onUpdateStatus }: SlotsListProps) {
  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId)
    return doctor ? `Dr. ${doctor.name}` : "Unknown"
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString()
  }

  if (slots.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Clock size={48} />
        <h3>No slots yet</h3>
        <p>Create your first time slot to get started</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Slots</h2>
      <div className={styles.slotsList}>
        {slots.map((slot) => (
          <div key={slot.id} className={`${styles.slotCard} ${styles[slot.status]}`}>
            <div className={styles.slotHeader}>
              <div className={styles.doctorInfo}>
                <User size={20} />
                <span className={styles.doctorName}>{getDoctorName(slot.doctorId)}</span>
              </div>
              <div className={`${styles.statusBadge} ${styles[`status-${slot.status}`]}`}>
                {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
              </div>
            </div>

            <div className={styles.slotTimes}>
              <div className={styles.timeItem}>
                <span className={styles.label}>Start:</span>
                <span className={styles.time}>{formatDateTime(slot.startTime)}</span>
              </div>
              <div className={styles.timeItem}>
                <span className={styles.label}>End:</span>
                <span className={styles.time}>{formatDateTime(slot.endTime)}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => onUpdateStatus(slot.id, "available")}
                className={`${styles.actionButton} ${styles.availableBtn}`}
              >
                Mark Available
              </button>
              <button
                onClick={() => onUpdateStatus(slot.id, "pending")}
                className={`${styles.actionButton} ${styles.pendingBtn}`}
              >
                Mark Pending
              </button>
              <button
                onClick={() => onUpdateStatus(slot.id, "booked")}
                className={`${styles.actionButton} ${styles.bookedBtn}`}
              >
                Mark Booked
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
