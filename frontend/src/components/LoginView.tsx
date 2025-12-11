import { useState } from "react"
import { Stethoscope, User, Lock } from "lucide-react"

interface LoginViewProps {
    onLogin: (role: "admin" | "patient") => void
}

export default function LoginView({ onLogin }: LoginViewProps) {
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === "admin123") {
            onLogin("admin")
        } else {
            setError("Invalid admin password")
        }
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <Stethoscope className="mx-auto h-12 w-12 text-blue-600" />
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Welcome to MediBook
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please select your portal to continue
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <button
                            onClick={() => onLogin("patient")}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-teal-500 px-4 py-3 text-sm font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <User className="h-5 w-5 text-teal-200 group-hover:text-teal-100" />
                            </span>
                            Patient Portal (Book Appointment)
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">Or Admin Access</span>
                            </div>
                        </div>

                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Admin Password (admin123)"
                                    className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-800 px-4 py-3 text-sm font-medium text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
                                </span>
                                Admin Dashboard Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
