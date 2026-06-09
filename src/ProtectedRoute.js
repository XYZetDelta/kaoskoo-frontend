import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading") // "loading" | "ok" | "unauthorized"

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/me", {
      credentials: "include"
    })
    .then(res => {
      if (res.ok) {
        setStatus("ok")
      } else {
        setStatus("unauthorized")
      }
    })
    .catch(() => setStatus("unauthorized"))
  }, [])

  if (status === "loading") return null // atau bisa loading spinner
  if (status === "unauthorized") return <Navigate to="/admin-login" replace />
  return children
}