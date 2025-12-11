"use client"

import type React from "react"

import { useState } from "react"
import type { Doctor, Slot } from "@/types"
import { Calendar } from "lucide-react"
import styles from "@/styles/components/form.module.css"

interface SlotFormProps {
  doctors: Doctor[]
  onAddSlot: (slot: Omit<Slot, "id" | "createdAt">) => void
}

export default function SlotForm({ doctors, onAddSlot }: SlotFormProps) {
  const [doctorId, setDoctorId] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("09:00:00") // Default 9 AM
  const [endTime, setEndTime] = useState("17:00:00")   // Default 5 PM (17:00)
  const [duration, setDuration] = useState("30")
  const [lunchStart, setLunchStart] = useState("")
  const [lunchEnd, setLunchEnd] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctorId || !date || !startTime || !endTime) {
      alert("Please fill in Doctor, Date, Start Time, and End Time")
      return
    }

    const startDateTime = new Date(`${date}T${startTime}`)
    const endDateTime = new Date(`${date}T${endTime}`)

    // Validate Lunch
    let lunchStartDateTime: Date | null = null
    let lunchEndDateTime: Date | null = null
    if (lunchStart && lunchEnd) {
      lunchStartDateTime = new Date(`${date}T${lunchStart}`)
      lunchEndDateTime = new Date(`${date}T${lunchEnd}`)
    }

    if (startDateTime >= endDateTime) {
      alert("Shift End time must be after Start time")
      return
    }

    const slotDurationMs = parseInt(duration) * 60 * 1000
    let current = startDateTime.getTime()
    const end = endDateTime.getTime()

    let createdCount = 0;

    while (current + slotDurationMs <= end) {
      const slotStart = new Date(current)
      const slotEnd = new Date(current + slotDurationMs)

      // Check overlap with lunch
      let isLunch = false
      if (lunchStartDateTime && lunchEndDateTime) {
        const lStart = lunchStartDateTime.getTime()
        const lEnd = lunchEndDateTime.getTime()
        // If slot overlaps with lunch (even partially? usually completely inside or matching start)
        // "no slots will be assigned for that time". 
        // Simplest check: If slot start is >= lunch start AND slot start < lunch end
        if (current >= lStart && current < lEnd) {
          isLunch = true
        }
      }

      if (!isLunch) {
        // Create the slot
        // We use onAddSlot one by one. 
        // Note: AdminDashboard expects Omit<Slot, "id" | "createdAt">
        // It's async but we interpret onAddSlot as fire-and-forget or we await if we can. 
        // Since props return void, we just fire.
        onAddSlot({
          doctorId,
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          status: "available",
        })
        createdCount++;
      }

      current += slotDurationMs
    }

    if (createdCount === 0 && (lunchStartDateTime && lunchEndDateTime)) {
      alert("No slots created! Check your times and lunch break.")
    } else {
      // Reset purely optional
      // alert(`Generated ${createdCount} slots!`)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2>Generate Shifts</h2>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="slot-doctor">Doctor</label>
        <select
          id="slot-doctor"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className={styles.select}
        >
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.name} - {doctor.specialization}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="slot-date">Date</label>
        <input
          id="slot-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={styles.input}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className={styles.formGroup} style={{ flex: 1 }}>
          <label htmlFor="start-time">Shift Start</label>
          <input
            id="start-time"
            type="time"
            value={startTime} // Time input expects "HH:MM" or "HH:MM:SS"
            onChange={(e) => setStartTime(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup} style={{ flex: 1 }}>
          <label htmlFor="end-time">Shift End</label>
          <input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="slot-duration">Slot Duration (mins)</label>
        <select
          id="slot-duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className={styles.select}
        >
          <option value="15">15 Minutes</option>
          <option value="30">30 Minutes</option>
          <option value="45">45 Minutes</option>
          <option value="60">60 Minutes</option>
        </select>
      </div>

      <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Lunch Break (Optional)</h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label htmlFor="lunch-start" style={{ fontSize: '0.8rem' }}>Start</label>
            <input
              id="lunch-start"
              type="time"
              value={lunchStart}
              onChange={(e) => setLunchStart(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label htmlFor="lunch-end" style={{ fontSize: '0.8rem' }}>End</label>
            <input
              id="lunch-end"
              type="time"
              value={lunchEnd}
              onChange={(e) => setLunchEnd(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        <Calendar size={20} />
        Generate Slots
      </button>
    </form>
  )
}
