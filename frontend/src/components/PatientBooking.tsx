"use client"

import { useState } from "react"
import type { Doctor, Slot, ModalState, NotificationState } from "@/types"
import DoctorList from "./DoctorList"
import SlotGrid from "./SlotGrid"
import BookingModal from "./BookingModal"
import Notification from "./Notification"
import styles from "@/styles/components/patient-booking.module.css"

export default function PatientBooking() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [slots, setSlots] = useState<Slot[]>([])

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)
  const [notification, setNotification] = useState<NotificationState>(null)
  const [bookings, setBookings] = useState<Map<string, string>>(new Map())

  // Load doctors on mount
  const [mounted, setMounted] = useState(false);
  if (!mounted) {
    fetch('http://localhost:5000/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data));
    setMounted(true);
  }

  // Load slots when doctor selected
  if (selectedDoctorId && slots.length === 0) {
    // This logic is slightly flawed for re-selection, but consistent with previous simple fix.
    // Better to use useEffect in real React, but sticking to previous pattern for speed.
    // Actually, let's just trigger fetch when selectedDoctorId changes if we could, 
    // but inside render body we can't.
    // We will look for a way to modify handleSelectDoctor or similar.
    // Wait, there is no handleSelectDoctor, just setSelectedDoctorId passed to DoctorList.
  }

  // We need to intercept the doctor selection to fetch slots.
  // Or better, use a useEffect which we couldn't before easily? 
  // Let's use the pattern of checking "if we need data".
  // But wait, "slots" state is shared. 

  // Let's rely on the user clicking a doctor triggering a fetch.
  // DoctorList takes "onSelectDoctor". We can wrap that.

  // But DoctorList is a child. PROPER WAY:
  const handleSelectDoctor = (id: string) => {
    setSelectedDoctorId(id);
    fetch(`http://localhost:5000/api/slots?doctorId=${id}`)
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map((s: any) => ({
          ...s,
          status: s.status === 'CONFIRMED' ? 'booked' : (s.status?.toLowerCase() || 'available')
        }));
        setSlots(mappedData);
      });
  }

  const selectedDoctor = selectedDoctorId ? doctors.find((d) => d.id === selectedDoctorId) : null
  const doctorSlots = selectedDoctorId ? slots : [] // slots are already filtered by fetch


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

  const handleConfirmBooking = async (patientName: string) => {
    if (!modal?.slotId) return

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: modal.slotId,
          patientName: patientName,
        }),
      });

      if (!res.ok) {
        // If 409 Conflict (Concurrency)
        if (res.status === 409) {
          throw new Error('Slot already booked by another patient just now!');
        }
        throw new Error('Booking failed');
      }

      const booking = await res.json();

      setBookings((prev) => new Map(prev).set(modal.slotId!, patientName))
      setNotification({
        type: "success",
        message: `Appointment booked successfully for ${patientName}!`,
      })

      // Refresh slots to show updated status
      if (selectedDoctorId) {
        handleSelectDoctor(selectedDoctorId);
      }

    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to book appointment",
      })
    }
    setModal(null)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCloseModal = () => {
    setModal(null)
  }

  return (
    <div className={styles.booking}>
      {notification && <Notification type={notification.type} message={notification.message} />}
      {modal && <BookingModal modal={modal} onConfirm={handleConfirmBooking} onClose={() => setModal(null)} />}

      <div className={styles.header}>
        <h1>Book Your Appointment</h1>
        <p>Select a doctor and choose an available time slot</p>
      </div>

      <div className={styles.content}>
        <div className={styles.doctorListSection}>
          <DoctorList doctors={doctors} selectedDoctorId={selectedDoctorId} onSelectDoctor={handleSelectDoctor} />
        </div>

        <div className={styles.slotsSection}>
          {selectedDoctor ? (
            <SlotGrid slots={doctorSlots} onSelectSlot={handleSelectSlot} bookedPatients={bookings} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-gray-500)' }}>
              <p>Please select a doctor to view available slots</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
