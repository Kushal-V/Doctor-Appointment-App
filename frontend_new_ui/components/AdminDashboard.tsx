"use client"

import { useState } from "react"
import type { Doctor, Slot } from "@/types"
import DoctorForm from "./DoctorForm"
import SlotForm from "./SlotForm"
import SlotsList from "./SlotsList"
import styles from "@/styles/components/admin-dashboard.module.css"
import Notification from "./Notification"
import type { NotificationState } from "@/types"

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [notification, setNotification] = useState<NotificationState>(null)

  const handleAddDoctor = (doctor: Omit<Doctor, "id" | "createdAt">) => {
    const newDoctor: Doctor = {
      ...doctor,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    setDoctors([...doctors, newDoctor])
    setNotification({
      type: "success",
      message: `Dr. ${doctor.name} added successfully!`,
    })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAddSlot = (slotData: Omit<Slot, "id" | "createdAt">) => {
    const newSlot: Slot = {
      ...slotData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    setSlots([...slots, newSlot])
    setNotification({
      type: "success",
      message: "Slot created successfully!",
    })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleUpdateSlotStatus = (slotId: string, status: "available" | "pending" | "booked") => {
    setSlots(slots.map((slot) => (slot.id === slotId ? { ...slot, status } : slot)))
  }

  return (
    <div className={styles.dashboard}>
      {notification && <Notification notification={notification} />}

      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Manage doctors and appointment slots</p>
      </div>

      <div className={styles.content}>
        <div className={styles.formsSection}>
          <DoctorForm onAddDoctor={handleAddDoctor} />
          <SlotForm doctors={doctors} onAddSlot={handleAddSlot} />
        </div>

        <div className={styles.slotsSection}>
          <SlotsList slots={slots} doctors={doctors} onUpdateStatus={handleUpdateSlotStatus} />
        </div>
      </div>
    </div>
  )
}
