import { useState, useEffect } from "react";
import {
  LayoutDashboard, ReceiptText, Package, Users, ChartColumn,
  Workflow, Blocks, Plug, Settings, Search, Bell, ChevronDown,
  Plus, AlertTriangle, TrendingUp, Wallet, Clock, ArrowUpRight,
  Menu, X
} from "lucide-react";
import "./App.css";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Transaksi", icon: ReceiptText },
  { name: "Produk & Stok", icon: Package },
  { name: "Pelanggan", icon: Users },
  { name: "Laporan", icon: ChartColumn },
  { name: "Workflow Builder", icon: Workflow, tag: "Utama" },
  { name: "Template", icon: Blocks },
  { name: "Integrasi", icon: Plug },
  { name: "Pengaturan", icon: Settings },
];

const initialProducts = [
  { id: 1, name: "Beras Pandan Wangi 5kg", category: "Bahan Dapur", price: 78000, stock: 2, unit: "karung", min: 5 },
  { id: 2, name: "Ayam Broiler Segar", category: "Bahan Dapur", price: 38000, stock: 17, unit: "kg", min: 10 },
  { id: 3, name: "Sambal Botol Kemasan 150gr", category: "Makanan", price: 25000, stock: 3, unit: "botol", min: 15 },
  { id: 4, name: "Minyak Goreng Sawit 2L", category: "Bahan Dapur", price: 36000, stock: 2, unit: "pouch", min: 10 },
];

function getSavedProducts() {
  const saved = localStorage.getItem("umkm_products");

  if (!saved) return initialProducts;

  const products = JSON.parse(saved);

  return products.map((product, index) => ({
    ...product,
    id: product.id ?? index + 1,
    price: product.price ?? initialProducts[index]?.price ?? 0,
    category: product.category ?? initialProducts[index]?.category ?? "Lainnya",
  }));
} 

function saveProducts(products) {
  localStorage.setItem("umkm_products", JSON.stringify(products));
}

function getSavedOrders() {
  const saved = localStorage.getItem("umkm_orders");
  return saved ? JSON.parse(saved) : [];
}


const orders = [
  { id: "#TRX-1024-082", customer: "Pak Budiarto", item: "3x Paket Ayam Bakar", total: "Rp135.000", status: "Diproses" },
  { id: "#TRX-1024-081", customer: "Katering Graha Mandiri", item: "25x Nasi Kotak", total: "Rp875.000", status: "Siap Kirim" },
  { id: "#TRX-1024-080", customer: "Ibu Dewi Sandra", item: "2x Nasi Goreng", total: "Rp62.000", status: "Menunggu Bayar" },
  { id: "#TRX-1024-079", customer: "Mas Rian", item: "1x Sop Buntut Sapi", total: "Rp75.000", status: "Selesai" },
];

function Dashboard() {
  const [products] = useState(initialProducts);

  return (
    <>
      <div className="welcome-row">
        <div>
          <h1>Selamat datang kembali, Bu Rina</h1>
          <p>Operasional Depot Rasa Nusantara hari ini berjalan lancar.</p>
        </div>
        <span className="open-badge">TOKO BUKA</span>
      </div>

      <div className="quick-actions">
        <button className="btn-secondary"><Workflow size={16}/> Buat Workflow</button>
        <button className="btn-secondary"><Plus size={16}/> Tambah Produk</button>
        <button className="btn-primary"><Plus size={17}/> Transaksi Baru</button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-heading">PENJUALAN HARI INI <Wallet /></div>
          <h2>Rp4.280.000</h2>
          <span className="positive"><TrendingUp size={14}/> +14.2% vs kemarin</span>
        </div>
        <div className="stat-card">
          <div className="stat-heading">ANTREAN OPERASIONAL <Clock /></div>
          <h2>12 <small>Pesanan Aktif</small></h2>
          <span className="stat-note">4 Dapur • 5 Siap Kirim • 3 Unpaid</span>
        </div>
        <div className="stat-card">
          <div className="stat-heading">PERINGATAN INVENTORI <AlertTriangle /></div>
          <h2 className="danger-number">5 <small>Produk Menipis</small></h2>
          <span className="stat-note">Beras, Minyak, Sambal</span>
        </div>
        <div className="stat-card">
          <div className="stat-heading">OTOMATISASI SISTEM <Workflow /></div>
          <h2>3 <small>Alur Berjalan</small></h2>
          <span className="stat-note">124 eksekusi sukses hari ini</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel sales-panel">
          <div className="panel-heading">
            <div>
              <h3>Ritme Penjualan Hari Ini</h3>
              <p>Jam 08.00 s.d. 20.00 WIB</p>
            </div>
            <span className="legend">● Volume Omzet</span>
          </div>
          <div className="chart">
            {[25, 35, 48, 60, 95, 68, 45, 55, 70, 35].map((height, i) => (
              <div className="chart-column" key={i}>
                <div className="chart-bar" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
          <div className="chart-labels">
            <span>08:00</span><span>10:00</span><span>12:30</span>
            <span>14:00</span><span>16:00</span><span>18:30</span><span>20:00</span>
          </div>
        </div>

        <div className="panel stock-panel">
          <div className="panel-heading">
            <h3><AlertTriangle size={18}/> Perhatian Stok Menipis</h3>
            <span className="danger-badge">Segera Restok</span>
          </div>
          {products.filter(p => p.stock <= p.min).slice(0, 3).map((product) => (
            <div className="stock-item" key={product.name}>
              <div>
                <strong>{product.name}</strong>
                <p className="danger-text">Tersisa {product.stock} {product.unit} (Batas aman: {product.min})</p>
              </div>
              <button className="small-button">+ Restok</button>
            </div>
          ))}
        </div>

        <div className="panel orders-panel">
          <div className="panel-heading">
            <div>
              <h3>Pesanan Berjalan & Antrean Dapur</h3>
              <p>Ringkasan transaksi terbaru</p>
            </div>
            <span className="live-badge">● Live Kitchen Mode</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>No. Transaksi</th><th>Pelanggan</th><th>Nilai Pesanan</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td><strong>{order.customer}</strong><br/><span>{order.item}</span></td>
                    <td><strong>{order.total}</strong></td>
                    <td><span className="status-badge">{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel activity-panel">
          <h3>Aktivitas Alur Otomatisasi</h3>
          <div className="activity-item">
            <span className="activity-dot green"></span>
            <div><strong>14:15 WIB • Otomasi WhatsApp</strong><p>Konfirmasi pesanan berhasil dikirim.</p></div>
          </div>
          <div className="activity-item">
            <span className="activity-dot orange"></span>
            <div><strong>14:02 WIB • Mesin Cetak Dapur</strong><p>Tiket dapur otomatis dicetak.</p></div>
          </div>
          <div className="activity-item">
            <span className="activity-dot blue"></span>
            <div><strong>13:48 WIB • Auto Stock Deduction</strong><p>Stok bahan baku diperbarui.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductStock() {
  const [products, setProducts] = useState(getSavedProducts);
    useEffect(() => {
    saveProducts(products);
  }, [products]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [showForm, setShowForm] = useState(false);

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
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
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

    if (!Number.isFinite(number)) {
      return "Rp0";
    }

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
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Teh Manis" required />
            </label>
            <label>
              Harga Jual (Rp)
              <input type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} placeholder="5000" required />
            </label>
            <label>
              Jumlah Stok
              <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="20" required />
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
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Produk</button>
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
              {products.map((product) => (
                <tr key={product.id}>
                  <td><strong>{product.name}</strong><br /><span>{product.category}</span></td>
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

function Transactions() {
  const [products, setProducts] = useState(getSavedProducts);
  const [orders, setOrders] = useState(getSavedOrders);
  const [customer, setCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const selected = products.find(
    p => String(p.id) === String(selectedProduct)
  ) || null;

  const total = selected && quantity !== ""
    ? Number(selected.price) * Number(quantity)
    : 0;

  function formatRupiah(value) {
    return "Rp" + Number(value).toLocaleString("id-ID");
  }

  function submitTransaction(e) {
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
      Number(quantity) > selected.stock
    ) {
      setMessage("Jumlah pembelian tidak valid atau melebihi stok.");
      return;
    }

    const newOrder = {
      id: "TRX-" + Date.now().toString().slice(-7),
      customer,
      product: selected.name,
      quantity: Number(quantity),
      total,
      date: new Date().toLocaleString("id-ID"),
      status: "Selesai"
    };

    const updatedProducts = products.map(p =>
      p.id === selected.id
        ? { ...p, stock: p.stock - Number(quantity) }
        : p
    );

    const updatedOrders = [newOrder, ...orders];

    setProducts(updatedProducts);
    setOrders(updatedOrders);
    saveProducts(updatedProducts);
    localStorage.setItem("umkm_orders", JSON.stringify(updatedOrders));

    setCustomer("");
    setSelectedProduct("");
    setQuantity(1);
    setMessage("Transaksi berhasil disimpan dan stok telah diperbarui.");
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
          <small>Transaksi tercatat di browser ini</small>
        </div>
        <div className="stat-card">
          <span>Total Penjualan</span>
          <h2>{formatRupiah(orders.reduce((sum, o) => sum + o.total, 0))}</h2>
          <small>Akumulasi transaksi</small>
        </div>
        <div className="stat-card">
          <span>Produk Tersedia</span>
          <h2>{products.filter(p => p.stock > 0).length}</h2>
          <small>Jenis produk dengan stok</small>
        </div>
      </div>

      <form className="add-product-form" onSubmit={submitTransaction}>
        <h3><ReceiptText size={18} /> Buat Transaksi Baru</h3>

        <div className="form-grid">
          <label>
            Nama Pelanggan
            <input
              value={customer}
              onChange={e => setCustomer(e.target.value)}
              placeholder="Masukkan nama pelanggan"
              required
            />
          </label>

          <label>
            Pilih Produk
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">Pilih Produk</option>

              {products
                .filter((p) => p.stock > 0)
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
            Harga satuan: {formatRupiah(selected.price)} • Stok tersedia: {selected.stock} {selected.unit}
          </p>
        )}

        {message && <p className="transaction-message">{message}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            <Plus size={16} /> Simpan Transaksi
          </button>
        </div>
      </form>

      <div className="panel inventory-table">
        <div className="panel-heading">
          <h3>Riwayat Transaksi</h3>
          <span className="live-badge">{orders.length} Transaksi</span>
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-orders">
                    Belum ada transaksi. Silakan buat transaksi pertama.
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td><strong>{order.customer}</strong></td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td><strong>{formatRupiah(order.total)}</strong></td>
                  <td><span className="status-badge">{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="placeholder panel">
      <div className="placeholder-icon"><Blocks size={30}/></div>
      <h2>{title}</h2>
      <p>Halaman {title} akan kita bangun pada tahap berikutnya.</p>
      <span>UMKM-Builder • Depot Rasa Nusantara</span>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">U</div>
          <strong>UMKM-Builder</strong>
          <span>OPERASIONAL</span>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}><X/></button>
        </div>

        <div className="store-card">
          <strong>Depot Rasa Nusantara</strong>
          <span>Kuliner • Surabaya <b>● Toko Buka</b></span>
        </div>

        <nav>
          {menuItems.map(({ name, icon: Icon, tag }) => (
            <button
              key={name}
              className={`nav-item ${activePage === name ? "active" : ""}`}
              onClick={() => { setActivePage(name); setSidebarOpen(false); }}
            >
              <Icon size={18}/>
              <span>{name}</span>
              {tag && <small>{tag}</small>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="subscription">LANGGANAN<br/><strong>Paket Usaha Aktif</strong></div>
          <button className="help-button">▣ Bantuan WhatsApp</button>
        </div>
      </aside>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}><Menu/></button>
          <div className="breadcrumb">UMKM <span>/</span> <strong>Operasional</strong></div>
          <div className="search-box"><Search size={17}/><input placeholder="Cari transaksi, produk, atau alur kerja..."/></div>
          <div className="date-box">▦ <span>Hari ini, 08 Nov 2026</span></div>
          <button className="notification"><Bell size={19}/><i/></button>
          <div className="profile"><div className="avatar">R</div><div><strong>Bu Rina</strong><small>Pemilik Usaha</small></div><ChevronDown size={15}/></div>
        </header>

      <div className="page-content">
        {activePage === "Dashboard" ? (
          <Dashboard />
        ) : activePage === "Produk & Stok" ? (
          <ProductStock />
        ) : activePage === "Transaksi" ? (
          <Transactions />
        ) : (
          <PlaceholderPage title={activePage} />
        )}
      </div>
      </main>
    </div>
  );
}

export default App;
