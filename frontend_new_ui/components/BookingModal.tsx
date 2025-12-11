"use client"

import type React from "react"

import { useState } from "react"
import type { ModalState } from "@/types"
import { X } from "lucide-react"
import styles from "@/styles/components/booking-modal.module.css"

interface BookingModalProps {
  modal: ModalState
  onConfirm: (patientName: string) => void
  onClose: () => void
}

export default function BookingModal({ modal, onConfirm, onClose }: BookingModalProps) {
  const [patientName, setPatientName] = useState("")
  const [loading, setLoading] = useState(false)

  if (!modal?.isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientName.trim()) {
      alert("Please enter your name")
      return
    }

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)

    onConfirm(patientName.trim())
    setPatientName("")
  }

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return ""
    return new Date(dateTime).toLocaleString()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Confirm Your Appointment</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.appointmentDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Date & Time</span>
              <span className={styles.value}>{formatDateTime(modal.startTime)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Duration</span>
              <span className={styles.value}>1 Hour</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="patient-name">Your Name</label>
              <input
                id="patient-name"
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter your full name"
                className={styles.input}
                disabled={loading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Confirming...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </form>

          <button className={styles.cancelButton} onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
