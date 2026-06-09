import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = process.env.REACT_APP_API_URL

export default function AddProduct() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [fileInputKey, setFileInputKey] = useState(0)
  const [dragIndex, setDragIndex] = useState(null)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID()
    }))
    setImages((prev) => [...prev, ...files])
    setFileInputKey((prev) => prev + 1)
  }

  const removeImage = (id) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id)
      if (removed) URL.revokeObjectURL(removed.preview)
      return prev.filter((img) => img.id !== id)
    })
    setFileInputKey((prev) => prev + 1)
  }

  function handleDragStart(index) {
    setDragIndex(index)
  }

  function handleDrop(index) {
    if (dragIndex === null || dragIndex === index) return

    const reordered = [...images]
    const dragged = reordered.splice(dragIndex, 1)[0]
    reordered.splice(index, 0, dragged)

    setImages(reordered)
    setDragIndex(null)
  }

  async function addProduct() {
    if (!name || !price || images.length === 0) {
      alert("Semua field wajib diisi!")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price)
    formData.append("description", description)
    images.forEach(({ file }) => {
      formData.append("image", file)
    })

    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      credentials: "include",
      body: formData,
    })

    if (!response.ok) {
      alert("Terjadi kesalahan saat upload Produk")
      return
    }

    navigate("/admin")
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6">Tambah Produk</h2>

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <textarea
            placeholder="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            key={fileInputKey}
            type="file"
            multiple
            onChange={handleFileChange}
            className="border p-3 rounded-lg"
          />

          {images.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Preview — drag untuk urutkan
              </p>
              <div className="flex gap-2 flex-wrap">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    className={`relative cursor-grab active:cursor-grabbing transition-opacity ${
                      dragIndex === index ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <img
                      src={img.preview}
                      className="w-20 h-20 object-cover rounded-lg"
                      alt={`preview-${index}`}
                    />
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-xs rounded px-1">
                      {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={addProduct}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
          >
            Simpan Produk
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="text-gray-500 hover:underline"
          >
            Kembali
          </button>
        </div>

      </div>
    </div>
  )
}