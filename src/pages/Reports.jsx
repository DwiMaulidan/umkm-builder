import { useState } from "react";
import {
  CalendarDays,
  Download,
  Banknote,
  Receipt,
  ShoppingBasket,
  Zap,
  TrendingUp,
  Gauge,
  CheckCircle2,
  Utensils,
  Droplets,
  Beef,
  Package,
  Timer,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

import "./Reports.css";

const topMenus = [
  {
    name: "Paket Ayam Bakar Madu",
    sold: "512 porsi",
    revenue: "Rp20.480.000",
    status: "Aman",
  },
  {
    name: "Nasi Goreng Kampung Nusantara",
    sold: "384 porsi",
    revenue: "Rp11.520.000",
    status: "Aman",
  },
  {
    name: "Sop Buntut Sapi Kuah Rempah",
    sold: "210 porsi",
    revenue: "Rp14.700.000",
    status: "Menipis",
  },
  {
    name: "Bebek Goreng Sambal Korek",
    sold: "185 porsi",
    revenue: "Rp7.770.000",
    status: "Aman",
  },
  {
    name: "Es Teh Manis Solo",
    sold: "920 gelas",
    revenue: "Rp4.600.000",
    status: "Aman",
  },
];

const stockItems = [
  {
    name: "Beras Pandan Wangi",
    usage: "Pemakaian 80 kg/minggu",
    status: "Perlu restok 2 hari lagi",
    type: "warning",
    icon: Utensils,
  },
  {
    name: "Minyak Goreng Sawit",
    usage: "Pemakaian 45 L/minggu",
    status: "Perlu restok segera",
    type: "danger",
    icon: Droplets,
  },
  {
    name: "Daging Sapi Segar",
    usage: "Pemakaian 22 kg/minggu",
    status: "Harga beli +6%",
    type: "price",
    icon: Beef,
  },
];

function Reports() {
  const [period, setPeriod] = useState("Bulan Ini (1 - 24 Okt 2024)");

  const stats = [
    {
      title: "TOTAL PENJUALAN",
      value: "Rp94.620.000",
      description: "+18.4% dibanding bulan lalu",
      icon: Banknote,
      type: "positive",
    },
    {
      title: "TRANSAKSI SELESAI",
      value: "1.842",
      suffix: "Pesanan",
      description: "Rata-rata 76 pesanan/hari",
      icon: Receipt,
    },
    {
      title: "RATA-RATA TIKET (AOV)",
      value: "Rp51.360",
      description: "Stabil • Konsumsi rata-rata 2.4 porsi",
      icon: ShoppingBasket,
    },
    {
      title: "EFISIENSI ALUR OTOMATIS",
      value: "98.2%",
      description: "Pesanan diproses < 15 menit",
      icon: Zap,
      type: "positive",
    },
  ];

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-heading">
        <div>
          <h1>Laporan Operasional</h1>
          <p>
            Ringkasan data riil omzet penjualan, perputaran stok bahan
            baku, dan efisiensi alur kerja.
          </p>
        </div>

        <div className="reports-actions">
          <div className="reports-period">
            <CalendarDays size={16} />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Bulan Ini (1 - 24 Okt 2024)</option>
              <option>Bulan Lalu (1 - 30 Sep 2024)</option>
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
            <ChevronDown size={14} />
          </div>

          <button className="reports-export" onClick={handleExport}>
            <Download size={16} />
            Ekspor Laporan (PDF / Excel)
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="reports-stats">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className="report-stat-card" key={index}>
              <div className="report-stat-top">
                <span>{item.title}</span>
                <div className="report-stat-icon">
                  <Icon size={19} />
                </div>
              </div>

              <div className="report-stat-value">
                {item.value}
                {item.suffix && (
                  <small>{item.suffix}</small>
                )}
              </div>

              <div
                className={`report-stat-description ${
                  item.type === "positive" ? "positive" : ""
                }`}
              >
                {index === 0 && <TrendingUp size={14} />}
                {index === 1 && <Gauge size={14} />}
                {index === 3 && <CheckCircle2 size={14} />}
                {item.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Chart and Channels */}
      <div className="reports-middle">
        <section className="report-panel sales-chart-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Tren Penjualan Harian</h2>
              <p>Performa harian 1 s.d. 24 Oktober 2024</p>
            </div>
            <div className="chart-legend">
              <span><i className="legend-dot" /> Omzet Harian</span>
              <span><i className="legend-line" /> Target (Rp3.5Jt)</span>
            </div>
          </div>

          <div className="sales-chart">
            <div className="chart-tooltip">
              <span>●</span> 15 Okt: Rp5.800.000 (Event Katering)
            </div>

            <svg
              viewBox="0 0 650 250"
              preserveAspectRatio="none"
              className="sales-chart-svg"
            >
              <line x1="0" y1="35" x2="650" y2="35" />
              <line x1="0" y1="105" x2="650" y2="105" />
              <line x1="0" y1="175" x2="650" y2="175" />
              <line
                x1="0"
                y1="130"
                x2="650"
                y2="130"
                className="target-line"
              />
              <polyline
                points="0,170 85,145 170,160 255,105 340,25 425,120 510,85 650,55"
                className="sales-line"
              />
              <circle cx="340" cy="25" r="5" className="sales-point" />
            </svg>

            <div className="chart-labels">
              <span>01 Okt</span>
              <span>04 Okt</span>
              <span>08 Okt</span>
              <span>12 Okt</span>
              <span>15 Okt</span>
              <span>18 Okt</span>
              <span>21 Okt</span>
              <span>24 Okt (Hari ini)</span>
            </div>
          </div>
        </section>

        <section className="report-panel channel-panel">
          <h2>Saluran Penjualan</h2>
          <p>Distribusi pesanan operasional</p>

          <div className="channel-list">
            <div className="channel-item">
              <div className="channel-info">
                <span>Dine-In / Meja Kasir</span>
                <strong>54% (Rp51.1Jt)</strong>
              </div>
              <div className="channel-track">
                <div className="channel-bar dine-in" />
              </div>
            </div>

            <div className="channel-item">
              <div className="channel-info">
                <span>Katering & Pre-Order</span>
                <strong>31% (Rp29.3Jt)</strong>
              </div>
              <div className="channel-track">
                <div className="channel-bar catering" />
              </div>
            </div>

            <div className="channel-item">
              <div className="channel-info">
                <span>Takeaway / WA Bot</span>
                <strong>15% (Rp14.2Jt)</strong>
              </div>
              <div className="channel-track">
                <div className="channel-bar takeaway" />
              </div>
            </div>
          </div>

          <div className="payment-method">
            <h3>METODE PEMBAYARAN</h3>
            <div className="payment-grid">
              <div>
                <strong className="qris">62%</strong>
                <span>QRIS</span>
                <small>Dinamis</small>
              </div>
              <div>
                <strong>26%</strong>
                <span>Tunai Kasir</span>
              </div>
              <div>
                <strong className="transfer">12%</strong>
                <span>Transfer</span>
                <small>Bank</small>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Top Menus and Stock */}
      <div className="reports-bottom">
        <section className="report-panel top-menu-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Menu Paling Laris (Top 5)</h2>
              <p>Kontribusi pendapatan tertinggi periode ini</p>
            </div>
            <span className="verified-label">
              Otomatis Terverifikasi
            </span>
          </div>

          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Menu Makanan & Minuman</th>
                  <th>Terjual</th>
                  <th>Kontribusi</th>
                  <th>Status Stok</th>
                </tr>
              </thead>

              <tbody>
                {topMenus.map((menu, index) => (
                  <tr key={menu.name}>
                    <td>
                      <div className="top-menu-name">
                        <span className="menu-rank">{index + 1}</span>
                        {menu.name}
                      </div>
                    </td>
                    <td>{menu.sold}</td>
                    <td className="menu-revenue">{menu.revenue}</td>
                    <td>
                      <span
                        className={`stock-status ${
                          menu.status === "Menipis" ? "low" : "safe"
                        }`}
                      >
                        {menu.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-panel-footer">
            <span>Menampilkan 5 dari 34 menu aktif</span>
            <button type="button">
              Lihat Semua Menu <ArrowUpRight size={14} />
            </button>
          </div>
        </section>

        <section className="report-panel stock-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Perputaran Stok Bahan Baku</h2>
              <p>Monitoring inventaris dapur & peringatan restok</p>
            </div>
            <Package size={23} />
          </div>

          <div className="stock-list">
            {stockItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className={`stock-item ${item.type}`}
                  key={item.name}
                >
                  <div className="stock-icon">
                    <Icon size={20} />
                  </div>
                  <div className="stock-details">
                    <strong>{item.name}</strong>
                    <span>{item.usage}</span>
                  </div>
                  <span className="stock-alert">{item.status}</span>
                </div>
              );
            })}
          </div>

          <div className="workflow-efficiency">
            <div className="workflow-icon">
              <Timer size={23} />
            </div>
            <div>
              <span>EFISIENSI WORKFLOW AKTIF</span>
              <strong>
                Penghematan waktu catat manual diperkirakan
                3.5 jam/hari
              </strong>
            </div>
            <button type="button">Audit Log</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
