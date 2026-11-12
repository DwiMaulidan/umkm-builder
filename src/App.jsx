import Dashboard from "./pages/Dashboard";
import ProductStock from "./pages/ProductStock";
import Transactions from "./pages/Transactions";
import SettingsPage from "./pages/SettingsPage";
import { useState } from "react";
import {
  LayoutDashboard, ReceiptText, Package, Users, ChartColumn,
  Workflow, Blocks, Plug, Settings as SettingsIcon, Search, Bell, ChevronDown,
  Plus, AlertTriangle, TrendingUp, Wallet, Clock, ArrowUpRight,
  Menu, X
} from "lucide-react";
import "./App.css";
import Customers from "./pages/Customers";


const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Transaksi", icon: ReceiptText },
  { name: "Produk & Stok", icon: Package },
  { name: "Pelanggan", icon: Users },
  { name: "Laporan", icon: ChartColumn },
  { name: "Workflow Builder", icon: Workflow, tag: "Utama" },
  { name: "Template", icon: Blocks },
  { name: "Integrasi", icon: Plug },
  { name: "Pengaturan", icon: SettingsIcon },
];

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
 ) : activePage === "Pengaturan" ? (
  <SettingsPage />
) : activePage === "Pelanggan" ? (
  <Customers />
) : (
  <PlaceholderPage title={activePage} />
)}
</div>
      </main>
    </div>
  );
}

export default App;
