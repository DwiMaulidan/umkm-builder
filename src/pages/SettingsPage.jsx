
import { useState } from "react";
import {
  Building2,
  MapPin,
  Store,
  Users,
  Bell,
  Workflow,
  Shield,
  Mail,
  Phone,
  Clock,
  Utensils,
  Download,
  Upload,
  Check,
  X,
  Edit3,
  UserPlus,
  Cloud,
  CalendarDays,
  Receipt,
  QrCode,
  ChevronDown,
  Settings,
  Save,
  Lock,
  MessageCircle,
  Trash2,
} from "lucide-react";

const tabs = [
  { id: "profil", label: "Profil Bisnis", icon: Building2 },
  { id: "staf", label: "Pengguna & Staf", icon: Users },
  { id: "notifikasi", label: "Notifikasi & Pesan", icon: Bell },
  { id: "workflow", label: "Preferensi Workflow", icon: Workflow },
  { id: "keamanan", label: "Keamanan Akun", icon: Shield },
];

const initialBusiness = {
  name: "Depot Rasa Nusantara",
  category: "Kuliner & Restoran Cepat Saji",
  nib: "9120003482910",
  npwp: "72.482.910.1-604.000 (PP 23 0.5%)",
  description:
    "Masakan tradisional khas nusantara, paket katering kantor, dan oleh-oleh sambal kemasan.",
  address:
    "Jl. Rungkut Madya No. 45, Rungkut Kidul, Surabaya, Jawa Timur 60293",
  phone: "+62 812-3456-7890",
  weekdayOpen: "08:00",
  weekdayClose: "20:00",
  weekendOpen: "08:00",
  weekendClose: "21:30",
  receiptHeader: "Depot Rasa Nusantara - Nikmat Rasa Tradisi",
  receiptFooter:
    "Terima kasih atas kunjungan Anda! Ikuti Instagram @depotrasanusantara",
};

const initialStaff = [
  { id: 1, name: "Mas Dani", role: "Kasir Depan", access: "POS", initials: "MD", color: "bg-cyan-100 text-cyan-800" },
  { id: 2, name: "Pak Joko", role: "Kepala Dapur", access: "KDS & Stok", initials: "PJ", color: "bg-orange-100 text-orange-800" },
  { id: 3, name: "Siti Nurhaliza", role: "Keuangan", access: "Buku Kas", initials: "SN", color: "bg-indigo-100 text-indigo-800" },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? "bg-teal-700" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-transparent bg-[#eef3ff] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
      />
    </label>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, badge }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-blue-100 p-2 text-teal-800">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      {badge && (
        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-teal-800">
          {badge}
        </span>
      )}
    </div>
  );
}

function SettingCard({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-slate-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profil");
  const [business, setBusiness] = useState(initialBusiness);
  const [savedBusiness, setSavedBusiness] = useState(initialBusiness);
  const [staff, setStaff] = useState(initialStaff);
  const [acceptOrders, setAcceptOrders] = useState(true);
  const [qris, setQris] = useState(true);
  const [notifications, setNotifications] = useState({
    orders: true,
    stock: true,
    payments: true,
    whatsapp: true,
    email: false,
  });
  const [workflow, setWorkflow] = useState({
    autoStock: true,
    autoReport: false,
    autoInvoice: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlert: true,
  });
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Kasir");
  const [message, setMessage] = useState("");

  const updateBusiness = (key, value) => {
    setBusiness((prev) => ({ ...prev, [key]: value }));
  };

  const saveChanges = () => {
    setSavedBusiness({ ...business });
    setMessage("Perubahan berhasil disimpan!");
    setTimeout(() => setMessage(""), 3000);
  };

  const cancelChanges = () => {
    setBusiness({ ...savedBusiness });
    setMessage("Perubahan dibatalkan.");
    setTimeout(() => setMessage(""), 3000);
  };

  const addStaff = () => {
    if (!newStaffName.trim()) return;

    const initials = newStaffName
      .trim()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setStaff((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newStaffName,
        role: newStaffRole,
        access: newStaffRole === "Kasir" ? "POS" : "Operasional",
        initials,
        color: "bg-teal-100 text-teal-800",
      },
    ]);

    setNewStaffName("");
    setShowStaffForm(false);
  };

  const removeStaff = (id) => {
    setStaff((prev) => prev.filter((person) => person.id !== id));
  };

  const ToggleRow = ({ icon: Icon, title, description, checked, onChange }) => (
    <div className="flex items-center justify-between gap-4 rounded-md bg-[#eef3ff] p-3">
      <div className="flex min-w-0 items-start gap-3">
        <Icon size={18} className="mt-0.5 shrink-0 text-teal-800" />
        <div>
          <p className="text-xs font-semibold text-slate-800">{title}</p>
          <p className="text-[11px] text-slate-500">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );

  const renderProfil = () => (
    <>
      <SettingCard>
        <SectionTitle
          icon={Building2}
          title="Identitas Resmi Usaha"
          subtitle="Informasi legalitas dan identifikasi gerai Anda"
          badge="TERVERIFIKASI"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label={<>Nama Usaha / Merk Dagang <span className="text-red-500">*</span></>}
            value={business.name}
            onChange={(e) => updateBusiness("name", e.target.value)}
          />

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">
              Kategori Industri / Bidang *
            </span>
            <select
              value={business.category}
              onChange={(e) => updateBusiness("category", e.target.value)}
              className="w-full rounded-md border border-transparent bg-[#eef3ff] px-3 py-2.5 text-sm outline-none focus:border-teal-500"
            >
              <option>Kuliner & Restoran Cepat Saji</option>
              <option>Fashion & Pakaian</option>
              <option>Kerajinan & Souvenir</option>
              <option>Perdagangan & Retail</option>
              <option>Jasa & Layanan</option>
              <option>Pertanian & Peternakan</option>
              <option>Lainnya</option>
            </select>
          </label>

          <Field
            label="Nomor Induk Berusaha (NIB) · Wajib UMKM"
            value={business.nib}
            onChange={(e) => updateBusiness("nib", e.target.value)}
          />

          <Field
            label="NPWP & Status Skema Pajak"
            value={business.npwp}
            onChange={(e) => updateBusiness("npwp", e.target.value)}
          />

          <div className="sm:col-span-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Deskripsi Singkat Gerai
              </span>
              <textarea
                rows={2}
                value={business.description}
                onChange={(e) => updateBusiness("description", e.target.value)}
                className="w-full resize-none rounded-md border border-transparent bg-[#eef3ff] px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:bg-white"
              />
              <span className="mt-1 block text-[11px] text-slate-500">
                Deskripsi akan ditampilkan pada struk digital WhatsApp dan profil katalog publik.
              </span>
            </label>
          </div>
        </div>
      </SettingCard>

      <SettingCard>
        <SectionTitle
          icon={MapPin}
          title="Lokasi & Jam Operasional"
          subtitle="Atur alamat fisik dan jam layanan aktif penerimaan pesanan"
          badge="● GERAI AKTIF"
        />

        <div className="space-y-4">
          <Field
            label="Alamat Gerai Utama"
            value={business.address}
            onChange={(e) => updateBusiness("address", e.target.value)}
          />
          <Field
            label="Telepon & WhatsApp CS Utama"
            value={business.phone}
            onChange={(e) => updateBusiness("phone", e.target.value)}
          />

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-700">
              Jadwal Jam Buka Reguler
            </p>
            <div className="space-y-2 rounded-md bg-[#eef3ff] p-2">
              <div className="flex flex-wrap items-center gap-2 rounded bg-white p-2.5">
                <Clock size={15} className="text-teal-700" />
                <span className="mr-auto text-xs font-semibold text-slate-800">
                  Senin – Jumat
                </span>
                <span className="rounded bg-cyan-100 px-2 py-1 text-[10px] font-semibold text-cyan-800">
                  Hari Kerja
                </span>
                <input
                  type="time"
                  value={business.weekdayOpen}
                  onChange={(e) => updateBusiness("weekdayOpen", e.target.value)}
                  className="rounded bg-blue-50 px-2 py-1.5 text-xs"
                />
                <span className="text-xs">–</span>
                <input
                  type="time"
                  value={business.weekdayClose}
                  onChange={(e) => updateBusiness("weekdayClose", e.target.value)}
                  className="rounded bg-blue-50 px-2 py-1.5 text-xs"
                />
                <span className="text-[10px] text-slate-500">WIB</span>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-teal-800">
                  Aktif
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 rounded bg-white p-2.5">
                <span className="text-base">☀️</span>
                <span className="mr-auto text-xs font-semibold text-slate-800">
                  Sabtu – Minggu
                </span>
                <span className="rounded bg-orange-100 px-2 py-1 text-[10px] font-semibold text-orange-800">
                  Akhir Pekan
                </span>
                <input
                  type="time"
                  value={business.weekendOpen}
                  onChange={(e) => updateBusiness("weekendOpen", e.target.value)}
                  className="rounded bg-blue-50 px-2 py-1.5 text-xs"
                />
                <span className="text-xs">–</span>
                <input
                  type="time"
                  value={business.weekendClose}
                  onChange={(e) => updateBusiness("weekendClose", e.target.value)}
                  className="rounded bg-blue-50 px-2 py-1.5 text-xs"
                />
                <span className="text-[10px] text-slate-500">WIB</span>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-teal-800">
                  Aktif
                </span>
              </div>
            </div>
          </div>

          <ToggleRow
            icon={Utensils}
            title="Status Penerimaan Pesanan Hari Ini"
            description="Jika dimatikan, pesanan baru lewat POS & WA builder otomatis dijeda sementara."
            checked={acceptOrders}
            onChange={setAcceptOrders}
          />
        </div>
      </SettingCard>

      <SettingCard>
        <SectionTitle
          icon={Receipt}
          title="Preferensi Struk & Nota Kasir"
          subtitle="Sesuaikan tampilan struk thermal 58mm / 80mm dan PDF tagihan"
        />

        <div className="space-y-4">
          <Field
            label="Header Struk (Teks Utama Atas)"
            value={business.receiptHeader}
            onChange={(e) => updateBusiness("receiptHeader", e.target.value)}
          />
          <Field
            label="Pesan Kaki Nota (Catatan Bawah Struk)"
            value={business.receiptFooter}
            onChange={(e) => updateBusiness("receiptFooter", e.target.value)}
          />
          <ToggleRow
            icon={QrCode}
            title="Cetak Otomatis QRIS Statis di Struk Kasir"
            description="Memudahkan pembeli scan pembayaran langsung di kertas struk meja."
            checked={qris}
            onChange={setQris}
          />
        </div>
      </SettingCard>
    </>
  );

  const renderStaf = () => (
    <SettingCard>
      <SectionTitle
        icon={Users}
        title="Pengguna & Hak Akses Staf"
        subtitle="Kelola anggota tim dan batas akses setiap karyawan"
        badge={`${staff.length} OPERATOR AKTIF`}
      />

      <div className="space-y-3">
        {staff.map((person) => (
          <div key={person.id} className="flex items-center gap-3 rounded-lg bg-[#eef3ff] p-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${person.color}`}>
              {person.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">{person.name}</p>
              <p className="text-xs text-slate-500">
                {person.role} • {person.access}
              </p>
            </div>
            <button
              onClick={() => {
                const updated = prompt("Ubah jabatan staf:", person.role);
                if (updated?.trim()) {
                  setStaff((prev) =>
                    prev.map((s) => s.id === person.id ? { ...s, role: updated } : s)
                  );
                }
              }}
              className="rounded bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-50"
            >
              Edit
            </button>
            <button
              onClick={() => removeStaff(person.id)}
              title="Hapus staf"
              className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {showStaffForm && (
        <div className="mt-4 space-y-3 rounded-lg border border-teal-100 bg-teal-50/50 p-4">
          <h3 className="text-sm font-bold">Undang Karyawan Baru</h3>
          <Field
            label="Nama Karyawan"
            value={newStaffName}
            onChange={(e) => setNewStaffName(e.target.value)}
            placeholder="Masukkan nama karyawan"
          />
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Jabatan</span>
            <select
              value={newStaffRole}
              onChange={(e) => setNewStaffRole(e.target.value)}
              className="w-full rounded-md bg-white px-3 py-2.5 text-sm"
            >
              <option>Kasir</option>
              <option>Kepala Dapur</option>
              <option>Keuangan</option>
              <option>Admin</option>
              <option>Operator</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button onClick={addStaff} className="rounded-md bg-teal-700 px-4 py-2 text-xs font-semibold text-white">
              Tambahkan
            </button>
            <button onClick={() => setShowStaffForm(false)} className="rounded-md bg-white px-4 py-2 text-xs">
              Batal
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowStaffForm(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
      >
        <UserPlus size={16} /> Undang Karyawan Baru
      </button>
    </SettingCard>
  );

  const renderNotifikasi = () => (
    <SettingCard>
      <SectionTitle
        icon={Bell}
        title="Notifikasi & Pesan"
        subtitle="Atur pemberitahuan aktivitas bisnis dan komunikasi"
      />
      <div className="space-y-3">
        {[
          ["orders", Receipt, "Notifikasi Pesanan Baru", "Terima pemberitahuan setiap ada pesanan masuk."],
          ["stock", Store, "Peringatan Stok Menipis", "Informasi ketika stok produk mencapai batas minimum."],
          ["payments", Check, "Konfirmasi Pembayaran", "Pemberitahuan ketika pembayaran berhasil diterima."],
          ["whatsapp", MessageCircle, "Notifikasi WhatsApp", "Kirim pemberitahuan melalui WhatsApp."],
          ["email", Mail, "Notifikasi Email", "Kirim ringkasan aktivitas melalui email."],
        ].map(([key, Icon, title, description]) => (
          <ToggleRow
            key={key}
            icon={Icon}
            title={title}
            description={description}
            checked={notifications[key]}
            onChange={(value) => setNotifications((prev) => ({ ...prev, [key]: value }))}
          />
        ))}
      </div>
    </SettingCard>
  );

  const renderWorkflow = () => (
    <SettingCard>
      <SectionTitle
        icon={Workflow}
        title="Preferensi Workflow"
        subtitle="Atur otomatisasi proses operasional bisnis"
      />
      <div className="space-y-3">
        <ToggleRow
          icon={Store}
          title="Sinkronisasi Stok Otomatis"
          description="Perbarui stok produk secara otomatis setelah transaksi."
          checked={workflow.autoStock}
          onChange={(value) => setWorkflow((prev) => ({ ...prev, autoStock: value }))}
        />
        <ToggleRow
          icon={Receipt}
          title="Laporan Penjualan Otomatis"
          description="Buat ringkasan laporan penjualan secara otomatis."
          checked={workflow.autoReport}
          onChange={(value) => setWorkflow((prev) => ({ ...prev, autoReport: value }))}
        />
        <ToggleRow
          icon={Download}
          title="Pembuatan Invoice Otomatis"
          description="Buat nota tagihan ketika transaksi berhasil."
          checked={workflow.autoInvoice}
          onChange={(value) => setWorkflow((prev) => ({ ...prev, autoInvoice: value }))}
        />
      </div>
    </SettingCard>
  );

  const renderKeamanan = () => (
    <SettingCard>
      <SectionTitle
        icon={Shield}
        title="Keamanan Akun"
        subtitle="Kelola perlindungan akun dan aktivitas login"
      />
      <div className="space-y-3">
        <ToggleRow
          icon={Lock}
          title="Autentikasi Dua Faktor (2FA)"
          description="Tambahkan lapisan keamanan saat masuk ke akun."
          checked={security.twoFactor}
          onChange={(value) => setSecurity((prev) => ({ ...prev, twoFactor: value }))}
        />
        <ToggleRow
          icon={Bell}
          title="Peringatan Login Baru"
          description="Terima notifikasi ketika akun login dari perangkat baru."
          checked={security.loginAlert}
          onChange={(value) => setSecurity((prev) => ({ ...prev, loginAlert: value }))}
        />
      </div>
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="mb-2 text-sm font-bold text-slate-800">Ganti Password</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Password Baru" value="" placeholder="Masukkan password baru" type="password" onChange={() => {}} />
          <Field label="Konfirmasi Password" value="" placeholder="Ulangi password baru" type="password" onChange={() => {}} />
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Fitur perubahan password perlu dihubungkan dengan autentikasi backend.
        </p>
      </div>
    </SettingCard>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fd] text-slate-800">
    

      {/* PAGE CONTENT */}
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 lg:px-8">
        {/* TITLE AND ACTION */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs text-slate-500">
              Pengaturan <span className="mx-1">›</span>{" "}
              <span className="font-semibold text-teal-800">Profil Bisnis & Operasional</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Pengaturan Sistem
            </h1>
            <p className="mt-1 max-w-md text-sm leading-5 text-slate-500">
              Konfigurasi identitas profil usaha, hak akses karyawan, preferensi operasional, dan keamanan akun.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={cancelChanges}
              className="flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <X size={15} /> Batal
            </button>
            <button
              onClick={saveChanges}
              className="flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              <Check size={16} /> Simpan Perubahan
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
            <Check size={16} /> {message}
          </div>
        )}

        {/* TABS */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold transition ${
                activeTab === id
                  ? "bg-teal-700 text-white shadow-sm"
                  : "border border-slate-100 bg-white text-slate-600 hover:bg-teal-50"
              }`}
            >
              <Icon size={15} />
              {label}
              {id === "staf" && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  activeTab === id ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800"
                }`}>
                  {staff.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 space-y-5">
            {activeTab === "profil" && renderProfil()}
            {activeTab === "staf" && renderStaf()}
            {activeTab === "notifikasi" && renderNotifikasi()}
            {activeTab === "workflow" && renderWorkflow()}
            {activeTab === "keamanan" && renderKeamanan()}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5">
            <SettingCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Pemilik Akun Utama
                </h3>
                <span className="rounded-full bg-teal-100 px-2 py-1 text-[10px] font-bold text-teal-800">
                  Super Admin
                </span>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-800">
                  BR
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bu Rina Kusuma</h3>
                  <p className="text-xs text-slate-500">Pemilik Depot & Founder</p>
                </div>
              </div>

              <div className="space-y-2 rounded-md bg-[#eef3ff] p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-teal-800" />
                  <span className="break-all">rina.kusuma@depotrasanusantara.id</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-teal-800" />
                  <span>+62 811-2233-4455</span>
                </div>
              </div>

              <button
                onClick={() => alert("Fitur edit profil pribadi akan dihubungkan ke backend.")}
                className="mt-3 w-full rounded-md bg-blue-100 py-2.5 text-xs font-semibold text-blue-900 hover:bg-blue-200"
              >
                Edit Profil Pribadi
              </button>
            </SettingCard>

            <SettingCard>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Hak Akses Staf</h3>
                  <p className="text-xs text-slate-500">{staff.length} Operator Toko Aktif</p>
                </div>
                <Users size={17} className="text-teal-800" />
              </div>

              <div className="space-y-2">
                {staff.slice(0, 3).map((person) => (
                  <div key={person.id} className="flex items-center gap-2 rounded-md bg-[#eef3ff] p-2">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${person.color}`}>
                      {person.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold">{person.name}</p>
                      <p className="truncate text-[10px] text-slate-500">
                        {person.role} • {person.access}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("staf")}
                      className="bg-white px-2 py-1 text-[10px] font-semibold text-teal-800 hover:bg-teal-50"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveTab("staf");
                  setShowStaffForm(true);
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 py-2.5 text-xs font-semibold text-white hover:bg-teal-800"
              >
                <UserPlus size={14} /> Undang Karyawan Baru
              </button>
            </SettingCard>

            <SettingCard>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud size={18} className="text-teal-800" />
                  <h3 className="font-bold text-slate-900">Cadangan Data</h3>
                </div>
                <span className="h-2 w-2 rounded-full bg-teal-700" />
              </div>

              <div className="flex items-center justify-between rounded-md bg-[#eef3ff] p-2.5 text-xs">
                <span className="text-slate-600">Sinkronisasi Cloud:</span>
                <span className="font-semibold text-slate-800">2 menit lalu</span>
              </div>

              <p className="my-3 text-[11px] leading-4 text-slate-600">
                Unduh salinan riwayat transaksi, buku kas, resep dapur, dan daftar pelanggan dalam format aman (.JSON / .CSV) untuk arsip pembukuan mandiri.
              </p>

              <button
                onClick={() => {
                  const backup = {
                    business,
                    staff,
                    acceptOrders,
                    qris,
                    notifications,
                    workflow,
                    security,
                    exportedAt: new Date().toISOString(),
                  };
                  const blob = new Blob(
                    [JSON.stringify(backup, null, 2)],
                    { type: "application/json" }
                  );
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "umkm-builder-backup.json";
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-100 py-2.5 text-xs font-semibold text-blue-900 hover:bg-blue-200"
              >
                <Download size={14} /> Unduh Draf Cadangan
              </button>
            </SettingCard>
          </aside>
        </div>
      </main>
    </div>
  );
}
