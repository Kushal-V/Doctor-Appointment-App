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
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctorId || !startTime || !endTime) {
      alert("Please fill in all fields")
      return
    }
    if (startTime >= endTime) {
      alert("End time must be after start time")
      return
    }
    onAddSlot({
      doctorId,
      startTime,
      endTime,
      status: "available",
    })
    setDoctorId("")
    setStartTime("")
    setEndTime("")
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2>Create Time Slot</h2>
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
        <label htmlFor="start-time">Start Time</label>
        <input
          id="start-time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="end-time">End Time</label>
        <input
          id="end-time"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className={styles.input}
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        <Calendar size={20} />
        Create Slot
      </button>
    </form>
  )
}
