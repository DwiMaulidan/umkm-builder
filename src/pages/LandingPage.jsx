import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Menu,
  Package,
  ShoppingCart,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import "./LandingPage.css";

const features = [
  {
    icon: Package,
    title: "Manajemen Produk & Stok",
    description:
      "Pantau produk, persediaan, dan stok minimum agar operasional usaha lebih teratur.",
  },
  {
    icon: ShoppingCart,
    title: "Pencatatan Transaksi",
    description:
      "Catat transaksi penjualan dan kelola aktivitas bisnis dalam satu tempat.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Bangun alur kerja operasional sesuai kebutuhan usaha tanpa proses yang rumit.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Laporan Bisnis",
    description:
      "Dapatkan gambaran aktivitas usaha melalui informasi dan laporan yang terstruktur.",
  },
];

function DashboardPreview() {
  return (
    <div className="landing-preview">
      <div className="preview-glow" />

      <div className="preview-window">
        <div className="preview-topbar">
          <div className="preview-dots">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-address">app.umkm-builder.local</div>
          <div className="preview-status">
            <span /> Live Preview
          </div>
        </div>

        <div className="preview-body">
          <aside className="preview-sidebar">
            <div className="preview-brand">
              <div className="preview-brand-icon">U</div>
              <span>UMKM-Builder</span>
            </div>

            <div className="preview-menu active">
              <ChartNoAxesCombined size={15} />
              Dashboard
            </div>
            <div className="preview-menu">
              <ShoppingCart size={15} />
              Transaksi
            </div>
            <div className="preview-menu">
              <Package size={15} />
              Produk & Stok
            </div>
            <div className="preview-menu">
              <Workflow size={15} />
              Workflow
            </div>
          </aside>

          <div className="preview-content">
            <div className="preview-heading">
              <div>
                <span>OVERVIEW</span>
                <h3>Dashboard</h3>
                <p>Ringkasan aktivitas usaha Anda.</p>
              </div>
              <div className="preview-date">November 2026</div>
            </div>

            <div className="preview-stats">
              <div className="preview-stat">
                <span>Total Penjualan</span>
                <CircleDollarSign size={18} />
                <strong>Rp 12,8 jt</strong>
                <small>Ringkasan penjualan</small>
              </div>
              <div className="preview-stat">
                <span>Total Transaksi</span>
                <ClipboardList size={18} />
                <strong>248</strong>
                <small>Aktivitas transaksi</small>
              </div>
              <div className="preview-stat">
                <span>Total Produk</span>
                <Boxes size={18} />
                <strong>56</strong>
                <small>Produk terdaftar</small>
              </div>
            </div>

            <div className="preview-lower">
              <div className="preview-chart">
                <div className="preview-chart-heading">
                  <div>
                    <strong>Aktivitas Penjualan</strong>
                    <small>Ilustrasi data mingguan</small>
                  </div>
                  <ArrowUpRight size={17} />
                </div>

                <div className="chart-bars">
                  {[38, 60, 45, 78, 54, 90, 67].map((height, i) => (
                    <div className="chart-bar-wrapper" key={i}>
                      <div
                        className="chart-bar"
                        style={{ height: `${height}%` }}
                      />
                      <small>{["S", "S", "R", "K", "J", "S", "M"][i]}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-activity">
                <strong>Aktivitas Terbaru</strong>
                <div className="activity-item">
                  <span className="activity-icon">
                    <ShoppingCart size={13} />
                  </span>
                  <div>
                    <b>Penjualan baru</b>
                    <small>Transaksi berhasil dicatat</small>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon purple">
                    <Package size={13} />
                  </span>
                  <div>
                    <b>Produk diperbarui</b>
                    <small>Informasi produk berubah</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="preview-disclaimer">
              Tampilan ilustrasi dashboard UMKM-Builder
            </div>
          </div>
        </div>
      </div>

      <div className="preview-floating">
        <div className="floating-icon">
          <Zap size={19} />
        </div>
        <div>
          <strong>Operasional lebih teratur</strong>
          <small>Semua dalam satu platform</small>
        </div>
        <Check size={17} className="floating-check" />
      </div>
    </div>
  );
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <div className="landing-nav-container">
          <Link to="/" className="landing-logo" onClick={closeMenu}>
            <span className="landing-logo-mark">U</span>
            <span>UMKM-Builder</span>
          </Link>

          <button
            className="landing-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className={`landing-nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#beranda" onClick={closeMenu}>Beranda</a>
            <a href="#fitur" onClick={closeMenu}>Fitur</a>
            <a href="#cara-kerja" onClick={closeMenu}>Cara Kerja</a>
            <a href="#tentang" onClick={closeMenu}>Tentang</a>

            <div className="landing-mobile-actions">
              <Link to="/login" className="landing-login" onClick={closeMenu}>
                Masuk
              </Link>
              <Link to="/register" className="landing-register" onClick={closeMenu}>
                Daftar Sekarang <ArrowRight size={16} />
              </Link>
            </div>
          </nav>

          <div className="landing-nav-actions">
            <Link to="/login" className="landing-login">
              Masuk
            </Link>
            <Link to="/register" className="landing-register">
              Daftar Sekarang <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="beranda">
          <div className="landing-hero-container">
            <div className="landing-hero-copy">
              <div className="landing-eyebrow">
                <Sparkles size={15} />
                PLATFORM DIGITAL UNTUK UMKM
              </div>

              <h1>
                Kelola Usaha Lebih Mudah,
                <span> Kembangkan Bisnis Lebih Cepat.</span>
              </h1>

              <p>
                UMKM-Builder membantu pemilik UMKM mengelola operasional
                bisnis, mulai dari produk, stok, transaksi, hingga alur kerja
                dalam satu platform.
              </p>

              <div className="landing-hero-actions">
                <Link to="/register" className="landing-primary-button">
                  Mulai Sekarang <ArrowRight size={18} />
                </Link>
                <a href="#fitur" className="landing-secondary-button">
                  Pelajari Fitur <ChevronRight size={18} />
                </a>
              </div>

              <div className="landing-hero-note">
                <span><Check size={14} /></span>
                Kelola operasional usaha dalam satu platform
              </div>
            </div>

            <DashboardPreview />
          </div>
        </section>

        <section className="landing-features" id="fitur">
          <div className="landing-section-heading">
            <div className="landing-eyebrow">
              <Sparkles size={15} />
              FITUR UNGGULAN
            </div>
            <h2>
              Semua kebutuhan operasional
              <span> dalam satu platform.</span>
            </h2>
            <p>
              Kelola berbagai aktivitas usaha dengan lebih praktis,
              terstruktur, dan mudah dipantau.
            </p>
          </div>

          <div className="landing-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div className="landing-feature-card" key={feature.title}>
                  <div className="landing-feature-icon">
                    <Icon size={23} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a href="#cara-kerja">
                    Pelajari lebih lanjut <ArrowUpRight size={15} />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section className="landing-how" id="cara-kerja">
          <div className="landing-section-heading">
            <div className="landing-eyebrow">
              CARA KERJA
            </div>
            <h2>
              Mulai kelola usaha
              <span> dengan lebih terarah.</span>
            </h2>
            <p>Tiga langkah sederhana untuk memulai menggunakan UMKM-Builder.</p>
          </div>

          <div className="landing-steps">
            <div className="landing-step">
              <span className="step-number">01</span>
              <div className="step-icon"><ClipboardList size={24} /></div>
              <h3>Daftarkan Usaha</h3>
              <p>Buat akun dan masukkan informasi dasar usaha Anda.</p>
            </div>
            <div className="landing-step">
              <span className="step-number">02</span>
              <div className="step-icon"><Boxes size={24} /></div>
              <h3>Atur Operasional</h3>
              <p>Mulai kelola produk, stok, transaksi, dan kebutuhan usaha.</p>
            </div>
            <div className="landing-step">
              <span className="step-number">03</span>
              <div className="step-icon"><ChartNoAxesCombined size={24} /></div>
              <h3>Pantau Bisnis</h3>
              <p>Pantau aktivitas operasional melalui satu dashboard.</p>
            </div>
          </div>
        </section>

        <section className="landing-about" id="tentang">
          <div className="landing-about-content">
            <div className="landing-eyebrow">
              TENTANG UMKM-BUILDER
            </div>
            <h2>
              Teknologi yang membantu
              <span> usaha berkembang lebih terstruktur.</span>
            </h2>
            <p>
              UMKM-Builder merupakan platform pengelolaan operasional
              yang dirancang untuk membantu UMKM mengatur berbagai
              aktivitas bisnis dalam satu sistem.
            </p>
            <Link to="/register" className="landing-text-link">
              Kenali UMKM-Builder <ArrowRight size={17} />
            </Link>
          </div>

          <div className="landing-about-visual">
            <div className="about-icon about-icon-one"><Package /></div>
            <div className="about-icon about-icon-two"><Workflow /></div>
            <div className="about-icon about-icon-three"><ChartNoAxesCombined /></div>
            <div className="about-center">
              <span className="landing-logo-mark">U</span>
              <strong>UMKM-Builder</strong>
              <small>OPERASIONAL USAHA</small>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-cta-content">
            <div className="landing-eyebrow">
              SAATNYA MULAI
            </div>
            <h2>
              Saatnya kelola usahamu
              <span> dengan lebih terstruktur.</span>
            </h2>
            <p>
              Mulai perjalanan digitalisasi operasional usaha bersama
              UMKM-Builder.
            </p>
            <Link to="/register" className="landing-cta-button">
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-main">
          <div className="landing-footer-brand">
            <Link to="/" className="landing-logo">
              <span className="landing-logo-mark">U</span>
              <span>UMKM-Builder</span>
            </Link>
            <p>
              Membantu UMKM mengelola operasional usaha dengan lebih
              mudah dan terstruktur.
            </p>
          </div>

          <div className="landing-footer-links">
            <strong>Navigasi</strong>
            <a href="#beranda">Beranda</a>
            <a href="#fitur">Fitur</a>
            <a href="#cara-kerja">Cara Kerja</a>
          </div>

          <div className="landing-footer-links">
            <strong>Akun</strong>
            <Link to="/login">Masuk</Link>
            <Link to="/register">Daftar</Link>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <span>© 2026 UMKM-Builder. All rights reserved.</span>
          <span>Dibuat untuk mendukung UMKM Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
