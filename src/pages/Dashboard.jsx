import { useState } from "react";
import {
  Workflow,
  Plus,
  Wallet,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { initialProducts } from "../data/storage";

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
                <p className="danger-text">
                  Tersisa {product.stock} {product.unit} (Batas aman: {product.min})
                </p>
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
                <tr>
                  <th>No. Transaksi</th>
                  <th>Pelanggan</th>
                  <th>Nilai Pesanan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "#TRX-1024-082", customer: "Pak Budiarto", item: "3x Paket Ayam Bakar", total: "Rp135.000", status: "Diproses" },
                  { id: "#TRX-1024-081", customer: "Katering Graha Mandiri", item: "25x Nasi Kotak", total: "Rp875.000", status: "Siap Kirim" },
                  { id: "#TRX-1024-080", customer: "Ibu Dewi Sandra", item: "2x Nasi Goreng", total: "Rp62.000", status: "Menunggu Bayar" },
                  { id: "#TRX-1024-079", customer: "Mas Rian", item: "1x Sop Buntut Sapi", total: "Rp75.000", status: "Selesai" },
                ].map(order => (
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

export default Dashboard;