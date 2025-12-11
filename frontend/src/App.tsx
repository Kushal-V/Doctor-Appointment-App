import { useState } from "react"
import AdminDashboard from "@/components/AdminDashboard"
import PatientBooking from "@/components/PatientBooking"
import Navigation from "@/components/Navigation"
import { Toaster } from "@/components/ui/sonner"
// Import styles locally if needed or rely on global index.css
// import styles from "@/styles/page.module.css" 
// Since we copied globals.css to index.css, we might not need page.module.css if we use standard classes.
// However, the v0 code used a module. Let's create a wrapper div with standard Tailwind/CSS classes or standard styles.

import LoginView from "@/components/LoginView"

export default function App() {
  const [userRole, setUserRole] = useState<"admin" | "patient" | null>(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('userRole');
    return saved as "admin" | "patient" | null;
  });

  const handleLogin = (role: "admin" | "patient") => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
        <LoginView onLogin={handleLogin} />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <Navigation userRole={userRole} onLogout={handleLogout} />
      <main className="container mx-auto py-8 px-4">
        {userRole === "admin" ? <AdminDashboard /> : <PatientBooking />}
      </main>
      <Toaster />
    </div>
  )
}
