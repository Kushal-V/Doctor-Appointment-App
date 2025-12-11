"use client"

import { useEffect, useState } from "react"
import type { NotificationState } from "@/types"
import { Check, AlertCircle, Loader } from "lucide-react"
import styles from "@/styles/components/notification.module.css"

interface NotificationProps {
  notification: NotificationState
}

export default function Notification({ notification }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible || !notification) return null

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <Check size={20} />
      case "error":
        return <AlertCircle size={20} />
      case "loading":
        return <Loader size={20} className={styles.spinner} />
    }
  }

  return (
    <div className={`${styles.notification} ${styles[notification.type]}`}>
      {getIcon()}
      <span>{notification.message}</span>
    </div>
  )
}
