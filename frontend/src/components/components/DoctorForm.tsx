"use client"

import type React from "react"

import { useState } from "react"
import type { Doctor } from "@/types"
import { Plus } from "lucide-react"
import styles from "@/styles/components/form.module.css"

interface DoctorFormProps {
  onAddDoctor: (doctor: Omit<Doctor, "id" | "createdAt">) => void
}

export default function DoctorForm({ onAddDoctor }: DoctorFormProps) {
  const [name, setName] = useState("")
  const [specialization, setSpecialization] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !specialization.trim()) {
      alert("Please fill in all fields")
      return
    }
    onAddDoctor({ name: name.trim(), specialization: specialization.trim() })
    setName("")
    setSpecialization("")
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2>Add New Doctor</h2>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="doctor-name">Doctor Name</label>
        <input
          id="doctor-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Dr. John Smith"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="specialization">Specialization</label>
        <select
          id="specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className={styles.select}
        >
          <option value="">Select a specialization</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Neurology">Neurology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="General Practice">General Practice</option>
          <option value="Ophthalmology">Ophthalmology</option>
          <option value="Psychiatry">Psychiatry</option>
        </select>
      </div>

      <button type="submit" className={styles.submitButton}>
        <Plus size={20} />
        Add Doctor
      </button>
    </form>
  )
}
