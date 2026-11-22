import { useEffect, useState } from "react";
import { Plus, ReceiptText } from "lucide-react";
import { apiRequest } from "../services/api";

function Transactions() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    try {
      const [productData, transactionData] = await Promise.all([
        apiRequest("/products"),
        apiRequest("/transactions"),
      ]);

      setProducts(productData.products || []);

      setOrders(
        (transactionData.transactions || []).map((item) => ({
          id: item.invoice_number,
          customer: item.customer || "-",
          product: item.product || "-",
          quantity: Number(item.quantity || 0),
          total: Number(item.total_amount || 0),
          status: "Selesai",
        }))
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selected =
    products.find(
      (p) => String(p.id) === String(selectedProduct)
    ) || null;

  const total =
    selected && quantity !== ""
      ? Number(selected.price) * Number(quantity)
      : 0;

  function formatRupiah(value) {
    return "Rp" + Number(value).toLocaleString("id-ID");
  }

  async function submitTransaction(e) {
    e.preventDefault();

    if (!customer.trim()) {
      setMessage("Nama pelanggan harus diisi.");
      return;
    }

    if (!selected) {
      setMessage("Produk belum terdeteksi. Silakan pilih kembali produk.");
      return;
    }

    if (
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1 ||
      Number(quantity) > Number(selected.stock)
    ) {
      setMessage("Jumlah pembelian tidak valid atau melebihi stok.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await apiRequest("/transactions", {
        method: "POST",
        body: JSON.stringify({
          customer: customer.trim(),
          productId: selected.id,
          quantity: Number(quantity),
          paymentMethod: "Cash",
        }),
      });

      setCustomer("");
      setSelectedProduct("");
      setQuantity(1);

      await loadData();

      setMessage("Transaksi berhasil disimpan dan stok telah diperbarui.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="inventory-page">
      <div className="inventory-heading">
        <div>
          <h1>Transaksi</h1>
          <p>Catat penjualan dan pantau riwayat transaksi usaha Anda.</p>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <span>Total Transaksi</span>
          <h2>{orders.length}</h2>
          <small>Transaksi tercatat di database</small>
        </div>

        <div className="stat-card">
          <span>Total Penjualan</span>
          <h2>
            {formatRupiah(
              orders.reduce((sum, o) => sum + o.total, 0)
            )}
          </h2>
          <small>Akumulasi transaksi</small>
        </div>

        <div className="stat-card">
          <span>Produk Tersedia</span>
          <h2>{products.filter((p) => Number(p.stock) > 0).length}</h2>
          <small>Jenis produk dengan stok</small>
        </div>
      </div>

      <form className="add-product-form" onSubmit={submitTransaction}>
        <h3>
          <ReceiptText size={18} /> Buat Transaksi Baru
        </h3>

        <div className="form-grid">
          <label>
            Nama Pelanggan
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Masukkan nama pelanggan"
              required
            />
          </label>

          <label>
            Pilih Produk
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setQuantity(1);
                setMessage("");
              }}
            >
              <option value="">Pilih Produk</option>
              {products
                .filter((p) => Number(p.stock) > 0)
                .map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name} — Stok {p.stock}
                  </option>
                ))}
            </select>
          </label>

          <label>
            Jumlah Pembelian
            <input
              type="number"
              min="1"
              max={selected ? selected.stock : 1}
              value={quantity}
              disabled={!selected}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setQuantity("");
                  return;
                }

                const number = Number(value);

                if (Number.isFinite(number)) {
                  setQuantity(number);
                }
              }}
              required
            />
          </label>

          <label>
            Total Pembayaran
            <input value={formatRupiah(total)} readOnly />
          </label>
        </div>

        {selected && (
          <p className="transaction-info">
            Harga satuan: {formatRupiah(selected.price)} • Stok tersedia:{" "}
            {selected.stock} {selected.unit}
          </p>
        )}

        {message && (
          <p className="transaction-message">{message}</p>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || loading}
          >
            <Plus size={16} />
            {submitting ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </div>
      </form>

      <div className="panel inventory-table">
        <div className="panel-heading">
          <h3>Riwayat Transaksi</h3>
          <span className="live-badge">
            {orders.length} Transaksi
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Pelanggan</th>
                <th>Produk</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-orders">
                    Memuat data transaksi...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-orders">
                    Belum ada transaksi. Silakan buat transaksi pertama.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>
                      <strong>{order.customer}</strong>
                    </td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <strong>{formatRupiah(order.total)}</strong>
                    </td>
                    <td>
                      <span className="status-badge">
                        {order.status}
                      </span>
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

export default Transactions;
