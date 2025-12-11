"use client"

import { useState } from "react"
import type { Doctor, Slot } from "@/types"
import DoctorList from "./DoctorList"
import SlotGrid from "./SlotGrid"
import BookingModal from "./BookingModal"
import Notification from "./Notification"
import styles from "@/styles/components/patient-booking.module.css"
import type { ModalState, NotificationState } from "@/types"

export default function PatientBooking() {
  // Mock data for demo
  const [doctors] = useState<Doctor[]>([
    { id: "1", name: "Sarah Johnson", specialization: "Cardiology", createdAt: new Date().toISOString() },
    { id: "2", name: "Michael Chen", specialization: "Dermatology", createdAt: new Date().toISOString() },
    { id: "3", name: "Emily Rodriguez", specialization: "Neurology", createdAt: new Date().toISOString() },
  ])

  const [slots] = useState<Slot[]>([
    {
      id: "1",
      doctorId: "1",
      startTime: "2024-12-15T09:00",
      endTime: "2024-12-15T10:00",
      status: "available",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      doctorId: "1",
      startTime: "2024-12-15T10:00",
      endTime: "2024-12-15T11:00",
      status: "booked",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      doctorId: "1",
      startTime: "2024-12-15T11:00",
      endTime: "2024-12-15T12:00",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      doctorId: "1",
      startTime: "2024-12-15T14:00",
      endTime: "2024-12-15T15:00",
      status: "available",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      doctorId: "2",
      startTime: "2024-12-15T09:30",
      endTime: "2024-12-15T10:30",
      status: "available",
      createdAt: new Date().toISOString(),
    },
    {
      id: "6",
      doctorId: "2",
      startTime: "2024-12-15T11:00",
      endTime: "2024-12-15T12:00",
      status: "available",
      createdAt: new Date().toISOString(),
    },
    {
      id: "7",
      doctorId: "3",
      startTime: "2024-12-15T10:00",
      endTime: "2024-12-15T11:00",
      status: "booked",
      createdAt: new Date().toISOString(),
    },
  ])

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)
  const [notification, setNotification] = useState<NotificationState>(null)
  const [bookings, setBookings] = useState<Map<string, string>>(new Map())

  const selectedDoctor = selectedDoctorId ? doctors.find((d) => d.id === selectedDoctorId) : null
  const doctorSlots = selectedDoctorId ? slots.filter((s) => s.doctorId === selectedDoctorId) : []

  const handleSelectSlot = (slot: Slot) => {
    if (slot.status !== "available") return
    setModal({
      isOpen: true,
      slotId: slot.id,
      doctorId: slot.doctorId,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })
  }

  const handleConfirmBooking = (patientName: string) => {
    if (!modal?.slotId) return

    setBookings((prev) => new Map(prev).set(modal.slotId, patientName))
    setNotification({
      type: "success",
      message: `Appointment booked successfully for ${patientName}!`,
    })
    setModal(null)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCloseModal = () => {
    setModal(null)
  }

  return (
    <div className={styles.container}>
      {notification && <Notification notification={notification} />}

      <div className={styles.header}>
        <h1>Book Your Appointment</h1>
        <p>Find and book an appointment with our healthcare professionals</p>
      </div>

      <div className={styles.content}>
        <div className={styles.doctorListSection}>
          <DoctorList doctors={doctors} selectedDoctorId={selectedDoctorId} onSelectDoctor={setSelectedDoctorId} />
        </div>

        <div className={styles.slotsSection}>
          {selectedDoctor ? (
            <>
              <div className={styles.doctorInfo}>
                <h2>Dr. {selectedDoctor.name}</h2>
                <p>{selectedDoctor.specialization}</p>
              </div>
              <SlotGrid slots={doctorSlots} onSelectSlot={handleSelectSlot} bookedPatients={bookings} />
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select a doctor to view available slots</p>
            </div>
          )}
        </div>
      </div>

      {modal && modal.isOpen && (
        <BookingModal modal={modal} onConfirm={handleConfirmBooking} onClose={handleCloseModal} />
      )}
    </div>
  )
}
