"use client"

import type { Slot } from "@/types"
import { Clock } from "lucide-react"
import styles from "@/styles/components/slot-grid.module.css"

interface SlotGridProps {
  slots: Slot[]
  onSelectSlot: (slot: Slot) => void
  bookedPatients: Map<string, string>
}

export default function SlotGrid({ slots, onSelectSlot, bookedPatients }: SlotGridProps) {
  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (slots.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Clock size={48} />
        <h3>No slots available</h3>
        <p>Please check back later or select another doctor</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Available Times</h3>
      <div className={styles.grid}>
        {slots.map((slot) => {
          const patientName = bookedPatients.get(slot.id)
          return (
            <button
              key={slot.id}
              className={`${styles.slot} ${styles[slot.status]}`}
              onClick={() => onSelectSlot(slot)}
              disabled={slot.status !== "available"}
              title={patientName ? `Booked by ${patientName}` : ""}
            >
              <div className={styles.date}>{new Date(slot.startTime).toLocaleDateString()}</div>
              <div className={styles.time}>{formatTime(slot.startTime)}</div>
              <div className={styles.duration}>
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </div>
              {patientName && <div className={styles.patientName}>Patient: {patientName}</div>}
            </button>
          )
        })}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.availableColor}`}></div>
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.pendingColor}`}></div>
          <span>Pending</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.bookedColor}`}></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  )
}
