import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`

export default function Home() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  async function loadProducts(page = 1) {
    const res = await fetch(`${API_URL}?page=${page}&limit=12`)
    const json = await res.json()
    setProducts(json.data)
    setTotalPages(json.pagination.totalPages)
    setCurrentPage(json.pagination.currentPage)
  }

  useEffect(() => {
    loadProducts(currentPage)
  }, [currentPage])

  function addToCart(product, size, qty) {
    setCart([...cart, { ...product, size, qty: Number(qty) }])
  }

  function sendToWhatsApp() {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!")
      return
    }

    let message = `Halo Kaoskoo!\n\n`
    message += `Nama: ${name}\n`
    message += `Alamat: ${address}\n`
    message += `No HP: ${phone}\n\n`
    message += `Pesanan:\n`

    cart.forEach((item) => {
      message += `- ${item.name} (${item.size}) x${item.qty}\n`
    })

    message += `\nCatatan: ${note}`

    const url = `https://wa.me/62895364695777?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-8">Kaoskoo</h1>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${
                  page === currentPage
                    ? "bg-yellow-500 text-black font-bold"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        {/* CART + FORM */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">Isi Data Pemesanan</h2>

          <p className="font-semibold mb-2">Pesanan Anda:</p>

          <ul className="mb-6 list-disc list-inside text-sm">
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} ({item.size}) x{item.qty}
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            />

            <input
              type="text"
              placeholder="Alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            />

            <input
              type="text"
              placeholder="No. HP"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            />

            <input
              type="text"
              placeholder="Catatan"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
            />

            <button
              onClick={sendToWhatsApp}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold w-full"
            >
              Kirim ke WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

// COMPONENT PRODUK
function ProductCard({ product, addToCart }) {
  const [size, setSize] = useState("S")
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)

  return (
    <div className="bg-zinc-800 p-4 rounded-xl shadow-lg">
      {product.images && product.images.length > 0 && (
        <img
          src={`${process.env.REACT_APP_API_URL}/uploads/${product.images[0]}`}
          className="w-full object-cover rounded-lg mb-4"
          alt={product.name}
        />
      )}

      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-yellow-400 font-bold mb-2">
        Rp {Number(product.price).toLocaleString()}
      </p>
      <label>Ukuran</label>
      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="w-full mb-2 p-2 rounded bg-zinc-700"
      >
        <option>S</option>
        <option>M</option>
        <option>L</option>
        <option>XL</option>
        <option>XXL</option>
      </select>
      <label>Jumlah</label>
      <input
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        className="w-full mb-2 p-2 rounded bg-zinc-700"
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => addToCart(product, size, qty)}
          className="flex-1 bg-zinc-600 hover:bg-yellow-600 w-full py-2 rounded"
        >
          Pesan
        </button>
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="flex-1 bg-yellow-600 hover:bg-yellow-500 py-2 rounded"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  )
}