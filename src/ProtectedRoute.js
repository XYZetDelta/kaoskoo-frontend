import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading") // "loading" | "ok" | "unauthorized"

  useEffect(() => {
    fetch("process.env.REACT_APP_API_URL/api/admin/me", {
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