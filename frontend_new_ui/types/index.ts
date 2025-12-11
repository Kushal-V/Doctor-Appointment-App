export interface Doctor {
  id: string
  name: string
  specialization: string
  createdAt: string
}

export interface Slot {
  id: string
  doctorId: string
  startTime: string
  endTime: string
  status: "available" | "pending" | "booked"
  createdAt: string
}

export interface Booking {
  id: string
  slotId: string
  doctorId: string
  patientName: string
  startTime: string
  endTime: string
  createdAt: string
}

export type ModalState = {
  isOpen: boolean
  slotId?: string
  doctorId?: string
  startTime?: string
  endTime?: string
} | null

export type NotificationState = {
  type: "success" | "error" | "loading"
  message: string
} | null
