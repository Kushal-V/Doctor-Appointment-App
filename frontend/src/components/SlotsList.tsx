"use client"

import { useState } from "react"
import type { Slot, Doctor } from "@/types"
import { Calendar, Trash2 } from "lucide-react"
import styles from "@/styles/components/slots-grid-admin.module.css"

interface SlotsListProps {
  slots: Slot[]
  doctors: Doctor[]
  onUpdateStatus: (slotId: string, status: "available" | "pending" | "booked") => void
  onDeleteSlot: (slotId: string) => void
}

export default function SlotsList({ slots, doctors, onUpdateStatus, onDeleteSlot }: SlotsListProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const getDoctorName = (slot: any) => {
    // First try to get from slot data (backend includes it)
    if (slot.doctor_name) {
      return `Dr. ${slot.doctor_name}`;
    }
    // Fallback to lookup
    const doctor = doctors.find((d) => d.id === slot.doctorId)
    return doctor ? `Dr. ${doctor.name}` : "Unknown"
  }

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (slots.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Calendar size={48} />
        <h3>No slots created yet</h3>
        <p>Create time slots using the form above</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Manage Slots ({slots.length})</h3>
      <div className={styles.grid}>
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`${styles.slotCard} ${styles[slot.status || 'available']}`}
            onClick={() => setSelectedSlot(selectedSlot === slot.id ? null : slot.id)}
          >
            <div className={styles.slotHeader}>
              <span className={styles.doctorName}>{getDoctorName(slot)}</span>
              <span className={`${styles.statusBadge} ${styles[slot.status || 'available']}`}>
                {(slot.status || 'available').charAt(0).toUpperCase() + (slot.status || 'available').slice(1)}
              </span>
            </div>

            <div className={styles.slotDate}>{formatDate(slot.startTime)}</div>
            <div className={styles.slotTime}>
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </div>

            {slot.status === 'booked' && slot.patientName && (
              <div className={styles.patientName}>
                Patient: {slot.patientName}
              </div>
            )}

            {selectedSlot === slot.id && (
              <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onUpdateStatus(slot.id, "available")}
                  className={`${styles.actionBtn} ${styles.availableBtn}`}
                  disabled={slot.status === "available"}
                >
                  Available
                </button>
                <button
                  onClick={() => onUpdateStatus(slot.id, "pending")}
                  className={`${styles.actionBtn} ${styles.pendingBtn}`}
                  disabled={slot.status === "pending"}
                >
                  Pending
                </button>
                <button
                  onClick={() => onUpdateStatus(slot.id, "booked")}
                  className={`${styles.actionBtn} ${styles.bookedBtn}`}
                  disabled={slot.status === "booked"}
                >
                  Booked
                </button>
                <button
                  onClick={() => onDeleteSlot(slot.id)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
