import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { apiRequest } from "../services/api";

function ProductStock() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Produk Baru");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [minStock, setMinStock] = useState("5");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState("");

  // Mengambil produk dari backend Neon
  const fetchProducts = async () => {
    try {
      setError("");
      const data = await apiRequest("/products");

      setProducts(
        (data.products || []).map((product) => ({
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
          min: Number(product.min_stock),
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= product.min
  ).length;

  const emptyStock = products.filter(
    (product) => product.stock === 0
  ).length;

  function resetForm() {
    setName("");
    setCategory("Produk Baru");
    setPrice("");
    setStock("");
    setUnit("pcs");
    setMinStock("5");
    setEditingId(null);
    setShowForm(false);
  }

  function openAddForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(product) {
    setName(product.name || "");
    setCategory(product.category || "");
    setPrice(String(product.price));
    setStock("");
    setUnit(product.unit || "pcs");
    setMinStock(String(product.min));
    setEditingId(product.id);
    setShowForm(true);
    setError("");
  }

  // Menambahkan atau mengedit produk
  async function saveProduct(e) {
    e.preventDefault();

    if (
      !name.trim() ||
      Number(price) <= 0 ||
      Number(minStock) < 0 ||
      (!editingId && Number(stock) < 0)
    ) {
      setError("Periksa kembali data produk yang dimasukkan.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: name.trim(),
        category: category.trim() || "Produk Baru",
        price: Number(price),
        unit,
        min_stock: Number(minStock),
      };

      if (editingId) {
        await apiRequest(`/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/products", {
          method: "POST",
          body: JSON.stringify({
            ...payload,
            stock: Number(stock),
          }),
        });
      }

      await fetchProducts();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Memperbarui stok melalui backend
  async function updateStock(productId, amount) {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) return;

    const newStock = product.stock + amount;

    if (newStock < 0) return;

    try {
      setError("");

      await apiRequest(`/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
          stock: newStock,
        }),
      });

      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  // Menghapus atau menonaktifkan produk
  // Menghapus atau menonaktifkan produk
  async function handleDeleteProduct(product) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus produk "${product.name}"?\n\n` +
      "Jika produk memiliki riwayat transaksi atau stok, " +
      "produk hanya akan dinonaktifkan agar riwayat tetap aman."
    );

    if (!confirmed) return;

    try {
      setDeletingId(product.id);
      setError("");
      setNotice("");

      const result = await apiRequest(`/products/${product.id}`, {
        method: "DELETE",
      });

      setNotice(result.message || "Produk berhasil dihapus.");
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  function formatRupiah(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) return "Rp0";

    return "Rp" + number.toLocaleString("id-ID");
  }

  return (
    <div className="inventory-page">
      <div className="inventory-heading">
        <div>
          <h1>Produk & Stok</h1>
          <p>Pantau persediaan produk dan bahan baku usaha Anda.</p>
        </div>

        <button
          className="btn-primary"
          onClick={openAddForm}
          type="button"
        >
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: "red", marginBottom: 16 }}>
          {error}
        </p>
      )}

      {notice && (
        <p role="status" style={{ color: "green", marginBottom: 16 }}>
          {notice}
        </p>
      )}

      <div className="inventory-stats">
        <div className="stat-card">
          <span>Total Produk</span>
          <h2>{products.length}</h2>
          <small>Item terdaftar</small>
        </div>

        <div className="stat-card">
          <span>Stok Menipis</span>
          <h2 className="warning-number">{lowStock}</h2>
          <small>Perlu diperiksa</small>
        </div>

        <div className="stat-card">
          <span>Stok Habis</span>
          <h2 className="danger-number">{emptyStock}</h2>
          <small>Perlu restok</small>
        </div>
      </div>

      {showForm && (
        <form className="add-product-form" onSubmit={saveProduct}>
          <h3>
            {editingId ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>

          <div className="form-grid">
            <label>
              Nama Produk
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Teh Manis"
                required
              />
            </label>

            <label>
              Kategori
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Minuman"
              />
            </label>

            <label>
              Harga Jual (Rp)
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="5000"
                required
              />
            </label>

            <label>
              Satuan
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="pcs">Pcs</option>
                <option value="kg">Kg</option>
                <option value="botol">Botol</option>
                <option value="porsi">Porsi</option>
                <option value="karung">Karung</option>
              </select>
            </label>

            {!editingId && (
              <label>
                Jumlah Stok Awal
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="20"
                  required
                />
              </label>
            )}

            <label>
              Batas Minimum Stok
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="5"
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
              disabled={saving}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving
                ? "Menyimpan..."
                : editingId
                  ? "Simpan Perubahan"
                  : "Simpan Produk"}
            </button>
          </div>
        </form>
      )}

      <div className="panel inventory-table">
  <div className="panel-heading">
    <h3>Daftar Inventaris</h3>
  </div>

  <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Harga Jual</th>
                <th>Stok Tersisa</th>
                <th>Status</th>
                <th>Kelola Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
  {loading ? (
    <tr>
      <td colSpan="6">Memuat data produk...</td>
    </tr>
  ) : products.length === 0 ? (
    <tr>
      <td colSpan="6">Belum ada produk terdaftar.</td>
    </tr>
  ) : (
    products.map((product) => (
      <tr key={product.id}>
        <td>
          <strong>{product.name}</strong>
          <br />
          <span>{product.category || "-"}</span>
        </td>

        <td>{formatRupiah(product.price)}</td>

        <td>
          <strong>
            {product.stock} {product.unit}
          </strong>
        </td>

        <td>
          <span
            className={`inventory-status ${
              product.stock === 0
                ? "empty"
                : product.stock <= product.min
                  ? "low"
                  : "safe"
            }`}
          >
            {product.stock === 0
              ? "Habis"
              : product.stock <= product.min
                ? "Menipis"
                : "Aman"}
          </span>
        </td>

        <td>
          <div className="stock-controls">
            <button
              type="button"
              onClick={() => updateStock(product.id, -1)}
              disabled={product.stock <= 0}
              aria-label={`Kurangi stok ${product.name}`}
            >
              −
            </button>

            <button
              type="button"
              onClick={() => updateStock(product.id, 1)}
              aria-label={`Tambah stok ${product.name}`}
            >
              +
            </button>
          </div>
        </td>

        <td>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => openEditForm(product)}
              aria-label={`Edit ${product.name}`}
              title="Edit produk"
            >
              <Pencil size={14} /> Edit
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleDeleteProduct(product)}
              disabled={deletingId === product.id}
              aria-label={`Hapus ${product.name}`}
              title="Hapus produk"
            >
              <Trash2 size={14} />
              {deletingId === product.id ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductStock;
