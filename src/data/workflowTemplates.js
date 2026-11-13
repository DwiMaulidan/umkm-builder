// ===============================
// DATA TEMPLATE WORKFLOW
// ===============================
// Dipakai oleh halaman Template Workflow.
// Angka rating dan jumlah pemakai di bawah ini masih data contoh
// (mengikuti mockup Figma), belum berasal dari data pengguna asli.

export const BLANK_TEMPLATE_ID = "kanvas-kosong";
export const RECOMMENDED_TEMPLATE_ID = "kedai-resto";

export const CATEGORIES = [
  { id: "semua", label: "Semua Kategori" },
  { id: "kuliner", label: "Kuliner & Resto" },
  { id: "retail", label: "Retail & Toko Kelontong" },
  { id: "jasa", label: "Jasa & Layanan" },
];

export const SORT_OPTIONS = [
  { id: "populer", label: "Paling Populer" },
  { id: "rating", label: "Rating Tertinggi" },
  { id: "sederhana", label: "Langkah Tersedikit" },
];

// Alur singkat yang tampil di banner rekomendasi.
export const RECOMMENDED_FLOW = [
  { icon: "store", label: "Kasir / POS" },
  { icon: "qr", label: "Auto QRIS" },
  { icon: "chef", label: "KDS Dapur" },
  { icon: "message", label: "Struk WA" },
];

export const workflowTemplates = [
  {
    id: "kedai-resto",
    category: "kuliner",
    categoryLabel: "Kuliner",
    title: "Operasional Kedai & Resto (Dine-in + Takeaway)",
    rating: 4.9,
    users: 1400,
    highlight: { icon: "cog", label: "3 Otomatisasi Aktif", tone: "green" },
    description:
      "Alur lengkap dari input kasir/waiter, cetak KDS dapur, potong resep bahan baku otomatis, hingga rekap kasir harian.",
    flow: ["Pesanan", "QRIS", "Cetak Dapur", "Potong Stok", "Rekap Kasir"],
    steps: [
      { title: "Pesanan masuk", detail: "Kasir atau waiter menginput pesanan dine-in maupun takeaway." },
      { title: "Verifikasi pembayaran QRIS", detail: "Pembayaran dicek otomatis lewat notifikasi QRIS." },
      { title: "Cetak tiket dapur", detail: "Tiket pesanan dikirim ke printer atau layar KDS dapur." },
      { title: "Potong stok bahan baku", detail: "Stok berkurang sesuai resep tiap menu yang terjual." },
      { title: "Rekap kasir harian", detail: "Ringkasan penjualan dibuat otomatis saat toko tutup." },
    ],
  },
  {
    id: "retail-kasir",
    category: "retail",
    categoryLabel: "Retail",
    title: "Penjualan Toko Retail & Kasir Cepat",
    rating: 4.8,
    users: 980,
    highlight: { icon: "bell", label: "2 Peringatan Stok", tone: "amber" },
    description:
      "Optimasi kasir barcode instan, cetak struk thermal, potong stok SKU, dan peringatan otomatis jika stok < 5 barang.",
    flow: ["Scan Barcode", "Kasir Lunas", "Potong Stok", "Auto Alert"],
    steps: [
      { title: "Scan barcode produk", detail: "Produk masuk ke keranjang lewat pemindai barcode." },
      { title: "Kasir dan cetak struk", detail: "Pembayaran dicatat lunas, struk thermal tercetak." },
      { title: "Potong stok per SKU", detail: "Stok tiap SKU berkurang sesuai jumlah terjual." },
      { title: "Peringatan stok menipis", detail: "Notifikasi muncul jika stok di bawah 5 barang." },
    ],
  },
  {
    id: "jasa-reservasi",
    category: "jasa",
    categoryLabel: "Jasa",
    title: "Layanan Reservasi & Jasa Servis",
    rating: 4.9,
    users: 730,
    highlight: { icon: "calendar", label: "Pengingat Jadwal", tone: "blue" },
    description:
      "Cocok untuk salon, bengkel, atau klinik. Pengingat jadwal otomatis H-1 ke WhatsApp pelanggan dan konfirmasi kehadiran.",
    flow: ["Booking", "Konfirmasi DP", "Kalender", "WA H-1", "Layanan", "Pelunasan"],
    steps: [
      { title: "Booking masuk", detail: "Pelanggan memesan jadwal lewat form atau admin." },
      { title: "Konfirmasi DP", detail: "Uang muka dicek sebelum jadwal dikunci." },
      { title: "Masuk kalender", detail: "Jadwal tersimpan dan slot waktu tidak bisa dobel." },
      { title: "Pengingat WhatsApp H-1", detail: "Pelanggan menerima pengingat otomatis sehari sebelumnya." },
      { title: "Layanan dijalankan", detail: "Status berubah menjadi sedang dikerjakan." },
      { title: "Konfirmasi kehadiran dan pelunasan", detail: "Sisa pembayaran dicatat, riwayat pelanggan diperbarui." },
    ],
  },
  {
    id: "katering-online",
    category: "kuliner",
    categoryLabel: "Kuliner",
    title: "Pesanan Online & Delivery Katering",
    rating: 4.7,
    users: 520,
    highlight: { icon: "truck", label: "Integrasi Kurir", tone: "green" },
    description:
      "Manajemen pesanan pre-order, faktur DP otomatis, penjadwalan masak massal, dan pelacakan armada antar.",
    flow: ["Order Form", "DP Masuk", "Jadwal Masak", "Kirim Kurir", "Lunas"],
    steps: [
      { title: "Order form pre-order", detail: "Pelanggan mengisi pesanan beserta tanggal kirim." },
      { title: "Faktur dan DP otomatis", detail: "Faktur uang muka dikirim, pembayaran dicek." },
      { title: "Jadwal masak massal", detail: "Pesanan sehari digabung menjadi satu jadwal masak." },
      { title: "Kirim kurir", detail: "Pesanan diserahkan ke kurir beserta alamat tujuan." },
      { title: "Pelacakan dan pelunasan", detail: "Posisi armada dipantau, sisa pembayaran dicatat." },
    ],
  },
  {
    id: "grosir-b2b",
    category: "retail",
    categoryLabel: "Retail",
    title: "Grosir & Penjualan B2B Konsinyasi",
    rating: 4.8,
    users: 340,
    highlight: { icon: "invoice", label: "Faktur Tempo", tone: "brown" },
    description:
      "Catat pesanan grosir, surat jalan otomatis, pencatatan piutang jatuh tempo, dan rekonsiliasi pembayaran.",
    flow: ["PO Grosir", "Surat Jalan", "Piutang", "Tagihan"],
    steps: [
      { title: "PO grosir masuk", detail: "Pesanan pelanggan grosir dicatat beserta syarat tempo." },
      { title: "Surat jalan otomatis", detail: "Dokumen pengiriman dibuat dari data pesanan." },
      { title: "Catat piutang", detail: "Tagihan masuk daftar piutang dengan tanggal jatuh tempo." },
      { title: "Tagihan dan rekonsiliasi", detail: "Pengingat tagihan dikirim, pembayaran dicocokkan." },
    ],
  },
];

// Kartu khusus "Kanvas Kosong": tidak ikut difilter atau diurutkan.
export const blankTemplate = {
  id: BLANK_TEMPLATE_ID,
  title: "Kanvas Kosong (Mulai dari Nol)",
  steps: [],
};

// ===============================
// PENYIMPANAN PILIHAN (localStorage)
// ===============================
// Workflow Builder bisa membaca kunci ini untuk tahu template mana
// yang dipilih pengguna.

const SELECTED_KEY = "umkm_selected_workflow_template";
const DRAFT_KEY = "umkm_imported_workflow_draft";

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getSelectedTemplate() {
  return readJson(SELECTED_KEY);
}

export function saveSelectedTemplate(template) {
  return writeJson(SELECTED_KEY, {
    id: template.id,
    title: template.title,
    appliedAt: new Date().toISOString(),
  });
}

export function saveImportedDraft(draft) {
  return writeJson(DRAFT_KEY, {
    ...draft,
    importedAt: new Date().toISOString(),
  });
}

export function getImportedDraft() {
  return readJson(DRAFT_KEY);
}
