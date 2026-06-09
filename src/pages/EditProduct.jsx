import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const API_URL = "http://localhost:5000/api/products"

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [fileInputKey, setFileInputKey] = useState(0)
  const [dragIndex, setDragIndex] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name)
        setPrice(data.price)
        setDescription(data.description)
        setImages(
          (data.images || []).map((filename) => ({
            type: "old",
            filename
          }))
        )
      })
  }, [id])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      type: "new",
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID()
    }))
    setImages((prev) => [...prev, ...files])
    setFileInputKey((prev) => prev + 1)
  }

  const removeImage = (index) => {
    setImages((prev) => {
      const removed = prev[index]
      if (removed.type === "new") URL.revokeObjectURL(removed.preview)
      return prev.filter((_, i) => i !== index)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !price) {
      alert("Nama dan harga wajib diisi!")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price)
    formData.append("description", description)

    // Kirim urutan final ke backend
    const order = images.map((img) =>
      img.type === "old" ? img.filename : "__new__"
    )
    formData.append("order", JSON.stringify(order))

    // Kirim keepImages dan file baru
    images.forEach((img) => {
      if (img.type === "old") {
        formData.append("keepImages", img.filename)
      } else {
        formData.append("image", img.file)
      }
    })

    const response = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    credentials: "include",
    body: formData,
  })

    if (!response.ok) {
      alert("Terjadi kesalahan saat update produk")
      return
    }

    navigate("/admin")
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6">Edit Produk</h2>

        <form onSubmit={handleSubmit} className="grid gap-4">

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
                Gambar Saat Ini — drag untuk urutkan
              </p>
              <div className="flex gap-2 flex-wrap">
                {images.map((img, index) => (
                  <div
                    key={img.type === "old" ? img.filename : img.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    className={`relative cursor-grab active:cursor-grabbing transition-opacity ${
                      dragIndex === index ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <img
                      src={
                        img.type === "old"
                          ? `http://localhost:5000/uploads/${img.filename}`
                          : img.preview
                      }
                      alt={`img-${index}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-xs rounded px-1">
                      {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
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
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
          >
            Update Produk
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="text-gray-500 hover:underline"
          >
            Kembali
          </button>

        </form>
      </div>
    </div>
  )
}