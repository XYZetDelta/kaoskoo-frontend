import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = "http://localhost:5000/api/products"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/me", {
      credentials: "include"
    })
    .then(res => {
      if (res.status === 403) {
        navigate("/admin-login")
      } else {
        fetchProducts(1)
      }
    })
  }, [])

  async function fetchProducts(page = 1) {
    try {
      const res = await fetch(`${API_URL}?page=${page}&limit=12`, {
        credentials: "include"
      })

      if (res.status === 401 || res.status === 403) {
        navigate("/admin-login")
        return
      }

      if (!res.ok) throw new Error("Failed to fetch products")

      const json = await res.json()
      setProducts(json.data)
      setTotalPages(json.pagination.totalPages)
      setCurrentPage(json.pagination.currentPage)

    } catch (error) {
      console.error(error)
    }
  }

  async function deleteProduct(id) {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
    fetchProducts(currentPage)
  }

  async function logout() {
    await fetch("http://localhost:5000/api/admin/logout", {
      method: "POST",
      credentials: "include"
    })
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/add")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Produk
            </button>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <table className="w-full border border-gray-200 mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Harga</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="text-center">
                <td className="p-3 border">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000/uploads/${p.images[0]}`}
                      alt={p.name}
                      className="w-16 h-16 object-cover mx-auto rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 mx-auto rounded flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </td>
                <td className="p-3 border">{p.name}</td>
                <td className="p-3 border">
                  Rp {Number(p.price).toLocaleString()}
                </td>
                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>

                    <button
                      onClick={() => navigate(`/products/edit/${p.id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => fetchProducts(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchProducts(page)}
                className={`px-4 py-2 rounded ${
                  page === currentPage
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => fetchProducts(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}