import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Login gagal!")
        return
      }

      navigate("/admin")

    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan server")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md">

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl p-8">

          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-indigo-500/30"
            >
              Login
            </button>

          </form>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          © 2026 Kaoskoo
        </p>

      </div>
    </div>
  )
}