// ===============================
// DATA WORKFLOW BUILDER
// ===============================
// Isi data di bawah mengikuti frame Figma "Workflow Builder - Alur
// Operasional Depot Rasa Nusantara". Penyimpanan masih memakai
// localStorage (belum terhubung ke backend).

// Ukuran kanvas virtual (px) sebelum zoom.
export const STAGE_MIN_WIDTH = 700;
export const STAGE_MIN_HEIGHT = 560;
export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 108;
export const STOCK_NODE_HEIGHT = 156;

// Jenis node: label, warna bar atas node, dan apakah node itu ujung alur.
export const NODE_TYPES = {
  trigger: { label: "Pemicu Awal", color: "#16a34a" },
  system: { label: "Aksi Sistem", color: "#2563eb" },
  decision: { label: "Percabangan", color: "#f59e0b" },
  stock: { label: "Aksi Update Stok", color: "#0f766e" },
  kitchen: { label: "Layar Dapur", color: "#6d28d9" },
  print: { label: "Cetak Struk", color: "#0369a1" },
  whatsapp: { label: "Notifikasi WA", color: "#15a34a" },
  warning: { label: "Peringatan", color: "#dc2626" },
  cancel: { label: "Batalkan", color: "#475569", terminal: true },
  end: { label: "Alur Sukses Selesai", color: "#334155", terminal: true },
};

// Opsi konfigurasi untuk blok "Potong Stok".
export const STOCK_TIMING_OPTIONS = [
  {
    id: "paid",
    title: "Seketika saat pembayaran lunas",
    desc: "Direkomendasikan agar stok etalase selalu sinkron.",
  },
  {
    id: "done",
    title: "Saat pesanan berstatus Selesai",
    desc: "Digunakan jika sering terjadi pembatalan menu di meja.",
  },
];

// Hanya opsi pertama yang terlihat di Figma. Dua opsi lain ditambahkan
// sebagai usulan dan perlu dikonfirmasi ke pemilik desain.
export const LOW_STOCK_OPTIONS = [
  {
    id: "alert-continue",
    label: "Kirim peringatan darurat ke Kasir & lanjutkan pesanan",
  },
  {
    id: "alert-hold",
    label: "Kirim peringatan ke Kasir & tahan pesanan",
  },
  {
    id: "mark-empty",
    label: "Tandai menu habis secara otomatis",
  },
];

export function createDefaultStockConfig() {
  return {
    method: "Berdasarkan BOM / Resep",
    materials: [
      { name: "Ayam Broiler Segar", qty: "1/4 Potong" },
      { name: "Beras Pandan Wangi", qty: "200 gram" },
      { name: "Sambal Bawang Nusantara", qty: "30 gram" },
    ],
    timing: "paid",
    lowStock: "alert-continue",
  };
}

// Panel kiri "Komponen Alur".
export const PALETTE_GROUPS = [
  {
    id: "trigger",
    label: "Pemicu Awal (Triggers)",
    color: "#16a34a",
    items: [
      {
        id: "p-kasir",
        type: "trigger",
        icon: "monitor",
        title: "Pesanan Masuk (Kasir)",
        desc: "Input manual meja / kasir",
      },
      {
        id: "p-wa",
        type: "trigger",
        icon: "message",
        title: "Pesanan Masuk (WhatsApp)",
        desc: "Pesan format otomasi bot",
      },
      {
        id: "p-qris",
        type: "trigger",
        icon: "qr",
        title: "QRIS Diterima",
        desc: "Webhook settlement bank",
      },
    ],
  },
  {
    id: "action",
    label: "Aksi Operasional",
    color: "#2563eb",
    items: [
      {
        id: "p-stok",
        type: "stock",
        icon: "package",
        title: "Update / Potong Stok",
        desc: "Sinkronisasi stok bahan baku",
      },
      {
        id: "p-dapur",
        type: "kitchen",
        icon: "chef",
        title: "Kirim Tiket ke Dapur",
        desc: "Layar dapur & antrean koki",
      },
      {
        id: "p-struk",
        type: "print",
        icon: "printer",
        title: "Cetak Struk Transaksi",
        desc: "Printer thermal Bluetooth",
      },
    ],
  },
  {
    id: "condition",
    label: "Kondisi & Percabangan",
    color: "#f59e0b",
    items: [
      {
        id: "p-bayar",
        type: "decision",
        icon: "badge",
        title: "Cek Status Pembayaran",
        desc: "Validasi Lunas vs Tertunda",
      },
      {
        id: "p-jenis",
        type: "decision",
        icon: "split",
        title: "Jenis: Takeaway / Dine-in",
        desc: "Pisah kemasan box vs piring",
      },
    ],
  },
  {
    id: "message",
    label: "Komunikasi & Pesan",
    color: "#15a34a",
    items: [
      {
        id: "p-kirim-wa",
        type: "whatsapp",
        icon: "phone",
        title: "Kirim WA ke Pelanggan",
        desc: "Status siap & link nota",
      },
    ],
  },
];

// Alur contoh yang tampil pertama kali (sesuai Figma).
export function createDefaultFlow() {
  return {
    nodes: [
      {
        id: "n01",
        type: "trigger",
        code: "#01",
        key: "node_trigger_01",
        title: "Pesanan Baru Masuk",
        detail: "Sumber: WhatsApp Order & Kasir",
        x: 244,
        y: 0,
        w: NODE_WIDTH,
        h: NODE_HEIGHT,
      },
      {
        id: "n02",
        type: "system",
        code: "#02",
        key: "node_system_02",
        title: "Verifikasi Pembayaran",
        detail: "Metode: QRIS Dinamis & Kasir Tunai",
        x: 244,
        y: 132,
        w: NODE_WIDTH,
        h: NODE_HEIGHT,
      },
      {
        id: "n03",
        type: "decision",
        code: "#03",
        key: "node_decision_03",
        title: "Apakah Pembayaran Lunas?",
        detail: "Pengecekan otomatis via QRIS / Kasir",
        x: 229,
        y: 264,
        w: 230,
        h: NODE_HEIGHT,
      },
      {
        id: "n04a",
        type: "stock",
        code: "#04A",
        key: "node_stock_04",
        title: "Potong Stok Bahan Otomatis",
        detail: "Stok bahan baku berkurang otomatis di inventaris sistem",
        x: 41,
        y: 392,
        w: 210,
        h: STOCK_NODE_HEIGHT,
        config: createDefaultStockConfig(),
      },
      {
        id: "n05a",
        type: "kitchen",
        code: "#05A",
        key: "node_kitchen_05",
        title: "Kirim Tiket ke Dapur (KDS)",
        detail: "Tag: Meja Pelanggan / Nomor Antrean",
        x: 46,
        y: 588,
        w: NODE_WIDTH,
        h: NODE_HEIGHT,
      },
      {
        id: "n06a",
        type: "whatsapp",
        code: "#06A",
        key: "node_whatsapp_06",
        title: "Kirim WA Konfirmasi",
        detail: "“Pesanan Anda #TRX-82 sedang dimasak”",
        x: 46,
        y: 732,
        w: NODE_WIDTH,
        h: NODE_HEIGHT,
      },
      {
        id: "n07a",
        type: "end",
        code: "",
        key: "node_end_07",
        title: "Arsip & Tutup Tiket",
        detail: "Data masuk buku rekapitulasi harian",
        x: 46,
        y: 876,
        w: NODE_WIDTH,
        h: NODE_HEIGHT,
      },
      {
        id: "n04b",
        type: "warning",
        code: "#04B",
        key: "node_warning_04",
        title: "Kirim WA Pengingat Bayar",
        detail: "“Batas bayar 15 menit sebelum batal otomatis”",
        x: 425,
        y: 392,
        w: NODE_WIDTH,
        h: NODE_HEIGHT,
      },
      {
        id: "n05b",
        type: "cancel",
        code: "#05B",
        key: "node_cancel_05",
        title: "Lepas Reservasi Meja / Antrean",
        detail: "Kembalikan slot dapur untuk pesanan lain",
        x: 425,
        y: 536,
        w: NODE_WIDTH,
        h: NODE_HEIGHT,
      },
    ],
    edges: [
      { id: "e1", from: "n01", to: "n02", variant: "flow" },
      { id: "e2", from: "n02", to: "n03", variant: "flow" },
      {
        id: "e3",
        from: "n03",
        to: "n04a",
        variant: "ok",
        side: "left",
        label: "Ya (Lunas / QRIS Sukses)",
      },
      {
        id: "e4",
        from: "n03",
        to: "n04b",
        variant: "fail",
        side: "right",
        label: "Gagal / Belum Bayar",
      },
      { id: "e5", from: "n04a", to: "n05a", variant: "flow" },
      { id: "e6", from: "n05a", to: "n06a", variant: "flow" },
      { id: "e7", from: "n06a", to: "n07a", variant: "flow" },
      { id: "e8", from: "n04b", to: "n05b", variant: "flow" },
    ],
  };
}

export const DEFAULT_WORKFLOW_NAME = "Alur Operasional Depot Rasa Nusantara";

// ===============================
// PENYIMPANAN DRAF (localStorage)
// ===============================

const DRAFT_KEY = "umkm_workflow_builder_draft";

function isValidFlow(flow) {
  return (
    flow &&
    Array.isArray(flow.nodes) &&
    Array.isArray(flow.edges) &&
    flow.nodes.every(
      (n) =>
        n &&
        typeof n.id === "string" &&
        typeof n.x === "number" &&
        typeof n.y === "number" &&
        NODE_TYPES[n.type]
    )
  );
}

export function loadWorkflowDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return isValidFlow(draft?.flow) ? draft : null;
  } catch {
    return null;
  }
}

export function saveWorkflowDraft(draft) {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ ...draft, savedAt: new Date().toISOString() })
    );
    return true;
  } catch {
    return false;
  }
}
