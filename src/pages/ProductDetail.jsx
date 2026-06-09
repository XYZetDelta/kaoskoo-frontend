import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"

const API_URL = process.env.REACT_APP_API_URL

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [size, setSize] = useState("S")
  const [qty, setQty] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)

  const loadProduct = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/products/${id}`)
    const data = await res.json()
    setProduct(data)
  }, [id])

  useEffect(() => {
    loadProduct()
  }, [loadProduct])

  function prevImage() {
    setActiveIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  function nextImage() {
    setActiveIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  if (!product) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const images = product.images && product.images.length > 0 ? product.images : []

  return (
    <div className="bg-black text-white min-h-screen pb-24">

      <div className="max-w-xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-yellow-400 hover:underline"
        >
          ← Kembali
        </button>

        <div className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden">

          {/* IMAGE SLIDER */}
          <div className="bg-zinc-800 relative flex justify-center items-center p-6">

            {images.length > 0 ? (
              <>
                <img
                  src={`${API_URL}/uploads/${images[activeIndex]}`}
                  className="w-full max-h-[400px] object-contain"
                  alt={product.name}
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 bg-black/50 hover:bg-black/80 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 bg-black/50 hover:bg-black/80 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg"
                    >
                      ›
                    </button>
                  </>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-3 right-4 text-xs text-zinc-400">
                    {activeIndex + 1} / {images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-zinc-500 text-sm">
                Tidak ada gambar
              </div>
            )}
          </div>

          {/* Dot indicator */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 py-3 bg-zinc-800">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex ? "bg-yellow-400 w-4" : "bg-zinc-600"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail row */}
          {images.length > 1 && (
            <div className="flex gap-2 px-4 py-3 bg-zinc-900 overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={`${API_URL}/uploads/${img}`}
                  onClick={() => setActiveIndex(i)}
                  className={`w-14 h-14 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${
                    i === activeIndex
                      ? "ring-2 ring-yellow-400 opacity-100"
                      : "opacity-50 hover:opacity-80"
                  }`}
                  alt={`thumb-${i}`}
                />
              ))}
            </div>
          )}

          {/* DETAIL */}
          <div className="p-6 space-y-4">

            <h1 className="text-2xl font-bold">{product.name}</h1>

            <p className="text-yellow-400 text-xl font-semibold">
              Rp {Number(product.price).toLocaleString()}
            </p>

            <div>
              <h3 className="font-semibold mb-2">Deskripsi Produk</h3>
              <p className="text-zinc-300 text-sm whitespace-pre-line">
                {product.description || "Tidak ada deskripsi produk."}
              </p>
            </div>

            <div className="space-y-4 pt-4">

              <div>
                <label className="text-sm">Ukuran</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
                >
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>XXL</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Jumlah</label>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 p-4">
        <div className="max-w-xl mx-auto">
          <button className="bg-green-600 hover:bg-green-700 w-full py-3 rounded-xl font-semibold">
            Pesan Sekarang
          </button>
        </div>
      </div>

    </div>
  )
}