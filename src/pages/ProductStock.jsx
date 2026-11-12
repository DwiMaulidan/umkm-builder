import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  getSavedProducts,
  saveProducts,
} from "../data/storage";

function ProductStock() {
  const [products, setProducts] = useState(getSavedProducts);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const lowStock = products.filter(p => p.stock <= p.min).length;
  const emptyStock = products.filter(p => p.stock === 0).length;

  function addProduct(e) {
    e.preventDefault();

    if (!name.trim() || Number(price) <= 0 || Number(stock) < 0) return;

    setProducts([...products, {
      id: Date.now(),
      name,
      category: "Produk Baru",
      price: Number(price),
      stock: Number(stock),
      min: 5,
      unit
    }]);

    setName("");
    setPrice("");
    setStock("");
    setShowForm(false);
  }

  function updateStock(productId, amount) {
    setProducts(currentProducts =>
      currentProducts.map(product =>
        product.id === productId
          ? {
              ...product,
              stock: Math.max(0, product.stock + amount),
            }
          : product
      )
    );
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
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

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
        <form className="add-product-form" onSubmit={addProduct}>
          <h3>Tambah Produk Baru</h3>
          <div className="form-grid">
            <label>
              Nama Produk
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Teh Manis"
                required
              />
            </label>
            <label>
              Harga Jual (Rp)
              <input
                type="number"
                min="1"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="5000"
                required
              />
            </label>
            <label>
              Jumlah Stok
              <input
                type="number"
                min="0"
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="20"
                required
              />
            </label>
            <label>
              Satuan
              <select value={unit} onChange={e => setUnit(e.target.value)}>
                <option value="pcs">Pcs</option>
                <option value="kg">Kg</option>
                <option value="botol">Botol</option>
                <option value="porsi">Porsi</option>
                <option value="karung">Karung</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Simpan Produk
            </button>
          </div>
        </form>
      )}

      <div className="panel inventory-table">
        <div className="panel-heading">
          <h3>Daftar Inventaris</h3>
          <span className="live-badge">{products.length} Produk</span>
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
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong><br />
                    <span>{product.category}</span>
                  </td>
                  <td>{formatRupiah(product.price)}</td>
                  <td><strong>{product.stock} {product.unit}</strong></td>
                  <td>
                    <span className={`inventory-status ${
                      product.stock === 0 ? "empty" :
                      product.stock <= product.min ? "low" : "safe"
                    }`}>
                      {product.stock === 0 ? "Habis" :
                       product.stock <= product.min ? "Menipis" : "Aman"}
                    </span>
                  </td>
                  <td>
                    <div className="stock-controls">
                      <button
                        onClick={() => updateStock(product.id, -1)}
                        disabled={product.stock <= 0}
                      >
                        −
                      </button>
                      <button onClick={() => updateStock(product.id, 1)}>
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductStock;