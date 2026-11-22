import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  QrCode,
  Printer,
  Wallet,
  Bike,
  Store,
  Network,
  RefreshCw,
  BadgeCheck,
  Send,
  Receipt,
  SlidersHorizontal,
  Lock,
  Info,
  Link2,
  History,
  X,
  CheckCircle2,
} from "lucide-react";

import "./Integrations.css";

// ===============================
// DATA LAYANAN (data lokal / dummy)
// ===============================

const initialServices = [
  {
    id: "wa",
    icon: MessageCircle,
    title: "WhatsApp Business & Bot Notifikasi",
    provider: "Penyedia: Meta Cloud API Indonesia",
    desc: "Mengirimkan struk belanja digital otomatis, update status pesanan dapur langsung ke pelanggan, dan pengingat pelunasan piutang pesanan katering.",
    connected: true,
    primary: "Atur Pengaturan Bot",
    secondary: { label: "Uji Kirim", icon: Send, type: "event" },
    fields: [
      { key: "phone", label: "Nomor WhatsApp Bisnis", value: "+62 812-9988-7711" },
      { key: "name", label: "Nama Terverifikasi", value: "Depot Rasa Nusantara Verified" },
      { key: "quota", label: "Kuota Pesan per Bulan", value: "2000" },
    ],
  },
  {
    id: "qris",
    icon: QrCode,
    title: "QRIS Dinamis Nasional",
    provider: "NMID: ID1029384756 • BI Standar",
    desc: "Generate kode QR pembayaran unik per pesanan kasir, validasi transaksi lunas instan detik itu juga tanpa perlu pengecekan mutasi manual.",
    connected: true,
    primary: "Kelola Rekening",
    secondary: { label: "Settlement", icon: Receipt, type: "event" },
    fields: [
      { key: "bank", label: "Rekening Penampungan", value: "BCA Bisnis •••• 8821" },
      { key: "owner", label: "Atas Nama Rekening", value: "Depot Rasa Nusantara" },
      { key: "mdr", label: "Biaya Transaksi (MDR)", value: "0.3% (Usaha Mikro UMI)" },
    ],
  },
  {
    id: "printer",
    icon: Printer,
    title: "Printer Kasir & KDS Dapur",
    provider: "Jaringan: Bluetooth BLE & Local LAN",
    desc: "Pencetakan tiket pesanan dapur instan saat status berubah ke 'Diproses' dan cetak struk kasir 58mm/80mm tanpa jeda via auto-cutter.",
    connected: true,
    badge: "TERHUBUNG (2 UNIT)",
    primary: "Uji Cetak Tiket",
    primaryType: "event",
    secondary: { label: "Format Kertas", icon: SlidersHorizontal, type: "modal" },
    fields: [
      { key: "kitchen", label: "Printer Dapur (LAN)", value: "192.168.1.50:9100" },
      { key: "cashier", label: "Printer Kasir (BLE)", value: "RP-58" },
      { key: "paper", label: "Lebar Kertas (58mm / 80mm)", value: "80mm" },
    ],
  },
  {
    id: "pg",
    icon: Wallet,
    title: "Payment Gateway VA & E-Wallet",
    provider: "Virtual Account BCA, Mandiri, BRI, GoPay",
    desc: "Opsi pembayaran pesanan katering partai besar dan pesanan pre-order via Virtual Account perbankan, GoPay, dan ShopeePay dengan verifikasi otomatis.",
    connected: true,
    primary: "Pengaturan Saluran Bayar & Biaya",
    fields: [
      { key: "channels", label: "Saluran Aktif", value: "VA BCA, Mandiri, BRI, GoPay" },
      { key: "webhook", label: "Webhook Listener", value: "https://api.umkm-builder.id/hook/depot-rn" },
    ],
  },
  {
    id: "courier",
    icon: Bike,
    title: "Integrasi Kurir Instan",
    provider: "Gosend, GrabExpress & Lalamove",
    desc: "Panggil driver penjemputan otomatis untuk pesanan katering dan online delivery begitu juru masak menandai makanan selesai dikemas di dapur.",
    connected: false,
    note: "Sambungkan akun merchant toko Anda untuk mengaktifkan pemesanan kurir instan satu-klik langsung dari layar kasir.",
    noteIcon: Info,
    primary: "Hubungkan Layanan Kurir",
    primaryIcon: Link2,
    primaryStyle: "solid",
    fields: [
      { key: "provider", label: "Penyedia Kurir", value: "", placeholder: "Gosend / GrabExpress / Lalamove" },
      { key: "merchant", label: "ID Merchant", value: "", placeholder: "Masukkan ID merchant" },
    ],
  },
  {
    id: "multi",
    icon: Store,
    title: "Sinkronisasi Stok Multi-Outlet",
    provider: "POS Multi-Cabang & Konsinyasi Etalase",
    desc: "Pusatkan sisa stok bahan baku saat membuka cabang gerai baru, booth bazar kuliner mingguan, atau etalase konsinyasi di luar depot utama.",
    connected: false,
    note: "Tersedia untuk pengguna Paket Usaha Aktif. Anda dapat menghubungkan hingga 3 outlet tambahan tanpa biaya ekstra.",
    noteIcon: Store,
    primary: "Hubungkan Cabang Baru",
    primaryIcon: Store,
    fields: [
      { key: "outlet", label: "Nama Outlet / Cabang", value: "", placeholder: "Contoh: Booth Bazar Minggu" },
      { key: "location", label: "Lokasi", value: "", placeholder: "Contoh: Taman Bungkul, Surabaya" },
    ],
  },
];

const initialEvents = [
  { time: "14:32:10", channel: "QRIS Dinamis", activity: "Verifikasi Pelunasan Pesanan #TRX-9081 (Rp 74.000)", response: "HTTP 200 OK (38ms)", status: "SUKSES" },
  { time: "14:31:55", channel: "Printer Dapur (LAN)", activity: "Pencetakan Tiket Dapur Order #TRX-9081 (Rawon + Es Teh)", response: "Socket TCP Acked", status: "TERCETAK" },
  { time: "14:31:02", channel: "WhatsApp Cloud API", activity: "Pengiriman Struk Pembayaran PDF ke +62 857-1122-3344", response: "Message ID: wamid.HBgL", status: "TERKIRIM" },
  { time: "14:15:40", channel: "Payment Gateway VA", activity: "Pembuatan Kode Virtual Account Mandiri untuk DP Katering #CAT-044", response: "VA Active: 8902200192", status: "MENUNGGU" },
];

const sparkPoints = "0,22 14,24 28,14 42,18 56,8 70,12 84,6 100,3";

const nowTime = () =>
  new Date().toLocaleTimeString("id-ID", { hour12: false }).replace(/\./g, ":");

// ===============================
// KOMPONEN
// ===============================

function StatusBadge({ connected, label }) {
  return (
    <span
      className={`integration-badge ${
        connected ? "integration-badge-on" : "integration-badge-off"
      }`}
    >
      {connected && <i />}
      {label || (connected ? "TERHUBUNG" : "BELUM TERHUBUNG")}
    </span>
  );
}

function ServiceDetails({ service, values }) {
  const v = values[service.id];

  if (!service.connected) {
    const Icon = service.noteIcon;
    return (
      <div className="integration-note">
        <Icon size={16} />
        <p>{service.note}</p>
      </div>
    );
  }

  if (service.id === "wa") {
    const quota = Number(v.quota) || 2000;
    const used = 1840;
    const pct = Math.min(100, Math.round((used / quota) * 100));
    return (
      <div className="integration-detail">
        <div className="integration-wa-phone">
          <BadgeCheck size={15} />
          <span>
            <b>{v.phone}</b> ({v.name})
          </span>
        </div>
        <small className="integration-wa-tier">Tier 2 Enterprise</small>
        <div className="integration-quota-row">
          <span>Penggunaan Kuota Pesan</span>
          <b>
            {used.toLocaleString("id-ID")} / {quota.toLocaleString("id-ID")} Pesan
          </b>
        </div>
        <div className="integration-quota-bar">
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  if (service.id === "qris") {
    return (
      <div className="integration-detail">
        <div className="integration-row">
          <span>Rekening Penampungan:</span>
          <b>{v.bank}</b>
        </div>
        <div className="integration-row">
          <span>Atas Nama Rekening:</span>
          <b>{v.owner}</b>
        </div>
        <div className="integration-row">
          <span>Biaya Transaksi (MDR):</span>
          <b className="integration-mdr">{v.mdr}</b>
        </div>
      </div>
    );
  }

  if (service.id === "printer") {
    return (
      <div className="integration-detail">
        <div className="integration-row">
          <span className="integration-device">
            <i /> <b>Dapur: Epson TM-T82X (LAN)</b>
          </span>
          <em>{v.kitchen}</em>
        </div>
        <div className="integration-row">
          <span className="integration-device">
            <i /> <b>Kasir Depan: {v.cashier} (BT BLE)</b>
          </span>
          <em>Sinyal: 98% (Sangat Baik)</em>
        </div>
      </div>
    );
  }

  if (service.id === "pg") {
    return (
      <div className="integration-detail">
        <div className="integration-row">
          <span>Status Lingkungan:</span>
          <b className="integration-env">
            <Lock size={13} /> Produksi (Live Mode)
          </b>
        </div>
        <div className="integration-row">
          <span>Webhook Listener:</span>
          <b>{v.webhook}</b>
        </div>
      </div>
    );
  }

  // courier & multi setelah terhubung
  return (
    <div className="integration-detail">
      {service.fields.map((f) => (
        <div className="integration-row" key={f.key}>
          <span>{f.label}:</span>
          <b>{v[f.key]}</b>
        </div>
      ))}
    </div>
  );
}

function ServiceModal({ service, values, onClose, onSave, onDisconnect }) {
  const [draft, setDraft] = useState(values[service.id]);
  const isNew = !service.connected;
  const canSave = !isNew || service.fields.every((f) => draft[f.key]?.trim());

  return (
    <div className="integration-overlay" onClick={onClose}>
      <div
        className="integration-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="integration-modal-head">
          <div>
            <h3>{isNew ? `Hubungkan: ${service.title}` : service.title}</h3>
            <p>{service.provider}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup">
            <X size={18} />
          </button>
        </div>

        <div className="integration-modal-body">
          {service.fields.map((f) => (
            <label key={f.key}>
              <span>{f.label}</span>
              <input
                value={draft[f.key] ?? ""}
                placeholder={f.placeholder}
                onChange={(e) =>
                  setDraft({ ...draft, [f.key]: e.target.value })
                }
              />
            </label>
          ))}
          <p className="integration-modal-hint">
            Perubahan hanya tersimpan selama sesi ini (data lokal), belum
            terhubung ke server.
          </p>
        </div>

        <div className="integration-modal-foot">
          {!isNew && (
            <button
              type="button"
              className="integration-btn-danger"
              onClick={() => onDisconnect(service.id)}
            >
              Putuskan Layanan
            </button>
          )}
          <button type="button" className="integration-btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="integration-btn-solid"
            disabled={!canSave}
            onClick={() => onSave(service.id, draft)}
          >
            {isNew ? "Hubungkan" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Integrations() {
  const [services, setServices] = useState(initialServices);
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      initialServices.map((s) => [
        s.id,
        Object.fromEntries(s.fields.map((f) => [f.key, f.value])),
      ])
    )
  );
  const [events, setEvents] = useState(initialEvents);
  const [modalId, setModalId] = useState(null);
  const [checking, setChecking] = useState(false);
  const [updatedLabel, setUpdatedLabel] = useState("2 menit yang lalu");
  const [toast, setToast] = useState("");
  const timers = useRef([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    timers.current.push(setTimeout(() => setToast(""), 2800));
  };

  const addEvent = (event) =>
    setEvents((prev) => [{ time: nowTime(), ...event }, ...prev].slice(0, 8));

  const connectedCount = services.filter((s) => s.connected).length;

  const handleCheck = () => {
    if (checking) return;
    setChecking(true);
    timers.current.push(
      setTimeout(() => {
        setChecking(false);
        setUpdatedLabel("baru saja");
        showToast("Pengecekan status selesai (simulasi, data lokal).");
      }, 900)
    );
  };

  const runEvent = (service, which) => {
    const map = {
      wa: { channel: "WhatsApp Cloud API", activity: "Pesan uji coba dikirim ke nomor bisnis", response: "Message ID: wamid.TEST", status: "TERKIRIM" },
      qris: { channel: "QRIS Dinamis", activity: "Permintaan rekap settlement hari ini", response: "HTTP 202 Accepted", status: "MENUNGGU" },
      printer: { channel: "Printer Dapur (LAN)", activity: "Pencetakan tiket uji coba", response: "Socket TCP Acked", status: "TERCETAK" },
    };
    addEvent(map[service.id]);
    showToast(`${which}: aktivitas ditambahkan ke riwayat.`);
  };

  const handlePrimary = (s) => {
    if (s.primaryType === "event") return runEvent(s, s.primary);
    setModalId(s.id);
  };

  const handleSecondary = (s) => {
    if (s.secondary.type === "event") return runEvent(s, s.secondary.label);
    setModalId(s.id);
  };

  const handleSave = (id, draft) => {
    const wasConnected = services.find((s) => s.id === id).connected;
    setValues((prev) => ({ ...prev, [id]: draft }));
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, connected: true, badge: s.id === "printer" ? s.badge : undefined }
          : s
      )
    );
    setModalId(null);
    showToast(wasConnected ? "Pengaturan disimpan." : "Layanan berhasil dihubungkan.");
  };

  const handleDisconnect = (id) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, connected: false, badge: undefined } : s))
    );
    setModalId(null);
    showToast("Layanan diputuskan.");
  };

  const modalService = services.find((s) => s.id === modalId);

  return (
    <div className="integration-page">
      {/* Header */}
      <div className="integration-heading">
        <div>
          <span className="integration-eyebrow">
            PENGATURAN TOKO • <b>KONEKTIVITAS SISTEM</b>
          </span>
          <h1>Integrasi Layanan & Perangkat</h1>
          <p>
            Hubungkan sistem kasir Depot Rasa Nusantara dengan penyedia
            pembayaran resmi, bot perpesanan otomatis, serta periferal perangkat
            keras fisik di gerai.
          </p>
        </div>

        <div className="integration-heading-actions">
          <div className="integration-summary">
            <i />
            <span>
              {connectedCount} dari {services.length} Layanan Aktif Terhubung
            </span>
          </div>
          <button
            type="button"
            className="integration-check"
            onClick={handleCheck}
            disabled={checking}
          >
            <RefreshCw size={16} className={checking ? "integration-spin" : ""} />
            <span>Periksa Status</span>
          </button>
        </div>
      </div>

      {/* Kesehatan gateway */}
      <div className="integration-health">
        <div className="integration-health-icon">
          <Network size={20} />
        </div>
        <div className="integration-health-text">
          <strong>Kesehatan Gateway & Webhook Lokal</strong>
          <span>
            Latensi rata-rata: 42 ms • Tanpa downtime dalam 30 hari terakhir
          </span>
        </div>
        <div className="integration-health-uptime">
          <small>Uptime Bulan Ini</small>
          <b>99.98%</b>
        </div>
        <svg viewBox="0 0 100 28" className="integration-spark" aria-hidden="true">
          <polyline points={sparkPoints} fill="none" stroke="#0f766e" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="100" cy="3" r="2" fill="#0f766e" />
        </svg>
      </div>

      {/* Kartu layanan */}
      <div className="integration-grid">
        {services.map((s) => {
          const Icon = s.icon;
          const PrimaryIcon = s.primaryIcon;
          const SecIcon = s.secondary?.icon;
          return (
            <article className="integration-card" key={s.id}>
              <div className="integration-card-top">
                <div className="integration-card-icon">
                  <Icon size={22} />
                </div>
                <div className="integration-card-title">
                  <h3>{s.title}</h3>
                  <small>{s.provider}</small>
                </div>
                <StatusBadge connected={s.connected} label={s.connected ? s.badge : undefined} />
              </div>

              <p className="integration-card-desc">{s.desc}</p>

              <ServiceDetails service={s} values={values} />

              <div className="integration-card-actions">
                <button
                  type="button"
                  className={`integration-btn-main ${
                    s.primaryStyle === "solid" && !s.connected ? "is-solid" : ""
                  }`}
                  onClick={() => handlePrimary(s)}
                >
                  {PrimaryIcon && !s.connected && <PrimaryIcon size={15} />}
                  {s.primary}
                </button>
                {s.secondary && s.connected && (
                  <button
                    type="button"
                    className="integration-btn-sec"
                    onClick={() => handleSecondary(s)}
                  >
                    <SecIcon size={14} />
                    {s.secondary.label}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Riwayat */}
      <section className="integration-history">
        <div className="integration-history-head">
          <h3>
            <History size={19} /> Riwayat Event Komunikasi Terakhir
          </h3>
          <span>Diperbarui {updatedLabel}</span>
        </div>

        <div className="integration-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Saluran Layanan</th>
                <th>Aktivitas Operasional</th>
                <th>Respon Gateway</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={`${e.time}-${i}`}>
                  <td>{e.time}</td>
                  <td><b>{e.channel}</b></td>
                  <td>{e.activity}</td>
                  <td>{e.response}</td>
                  <td>
                    <span className={`integration-status integration-status-${e.status.toLowerCase()}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modalService && (
        <ServiceModal
          key={modalService.id}
          service={modalService}
          values={values}
          onClose={() => setModalId(null)}
          onSave={handleSave}
          onDisconnect={handleDisconnect}
        />
      )}

      {toast && (
        <div className="integration-toast" role="status">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}
    </div>
  );
}
