import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  ChefHat,
  Cog,
  Eye,
  GitBranch,
  Headset,
  MessageSquare,
  Plus,
  QrCode,
  ReceiptText,
  SquarePlus,
  Star,
  Store,
  Truck,
  Upload,
  X,
  Zap,
} from "lucide-react";
import {
  CATEGORIES,
  RECOMMENDED_FLOW,
  RECOMMENDED_TEMPLATE_ID,
  SORT_OPTIONS,
  blankTemplate,
  getSelectedTemplate,
  saveImportedDraft,
  saveSelectedTemplate,
  workflowTemplates,
} from "../data/workflowTemplates";
import "./TemplateWorkflow.css";

// ===============================
// PETA IKON
// ===============================

const highlightIcons = {
  cog: Cog,
  bell: Bell,
  calendar: CalendarClock,
  truck: Truck,
  invoice: ReceiptText,
};

const flowIcons = {
  store: Store,
  qr: QrCode,
  chef: ChefHat,
  message: MessageSquare,
};

const MAX_IMPORT_SIZE = 1024 * 1024; // 1 MB

function formatUsers(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(".", ",") + "k";
  }
  return String(count);
}

// ===============================
// HALAMAN TEMPLATE WORKFLOW
// ===============================

function TemplateWorkflow({ onNavigate }) {
  const [category, setCategory] = useState("semua");
  const [sort, setSort] = useState("populer");
  const [selectedId, setSelectedId] = useState(
    () => getSelectedTemplate()?.id ?? null
  );
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const recommended = workflowTemplates.find(
    (t) => t.id === RECOMMENDED_TEMPLATE_ID
  );

  // Jumlah template per kategori dihitung dari data.
  const counts = useMemo(() => {
    const result = { semua: workflowTemplates.length };
    for (const t of workflowTemplates) {
      result[t.category] = (result[t.category] || 0) + 1;
    }
    return result;
  }, []);

  const visibleTemplates = useMemo(() => {
    const list =
      category === "semua"
        ? [...workflowTemplates]
        : workflowTemplates.filter((t) => t.category === category);

    if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating || b.users - a.users);
    } else if (sort === "sederhana") {
      list.sort((a, b) => a.steps.length - b.steps.length);
    } else {
      list.sort((a, b) => b.users - a.users);
    }
    return list;
  }, [category, sort]);

  // Toast hilang sendiri setelah 5 detik.
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Tutup pratinjau dengan tombol Esc.
  useEffect(() => {
    if (!preview) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  function showToast(message, kind = "success", withBuilderAction = false) {
    setToast({ message, kind, withBuilderAction });
  }

  function applyTemplate(template) {
    const saved = saveSelectedTemplate(template);
    setSelectedId(template.id);
    setPreview(null);

    if (!saved) {
      showToast(
        "Template dipilih, tetapi browser menolak menyimpannya. Pilihan hilang saat halaman dimuat ulang.",
        "error"
      );
      return;
    }
    showToast(`Template "${template.title}" dipilih.`, "success", true);
  }

  function openBlankCanvas() {
    applyTemplate(blankTemplate);
  }

  function showUnavailable() {
    showToast("Fitur ini belum tersedia di versi sekarang.", "info");
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_IMPORT_SIZE) {
      showToast("File terlalu besar. Ukuran maksimal 1 MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const draft = JSON.parse(String(reader.result));
        const valid =
          draft &&
          typeof draft.name === "string" &&
          draft.name.trim() !== "" &&
          Array.isArray(draft.steps);

        if (!valid) throw new Error("format");

        const saved = saveImportedDraft({
          name: draft.name.trim(),
          steps: draft.steps,
        });
        if (!saved) {
          showToast("Draf terbaca, tetapi browser menolak menyimpannya.", "error");
          return;
        }
        showToast(`Draf "${draft.name.trim()}" berhasil diimpor.`, "success", true);
      } catch {
        showToast(
          "File tidak bisa dibaca. Gunakan file JSON yang memiliki isian name dan steps.",
          "error"
        );
      }
    };
    reader.onerror = () =>
      showToast("File gagal dibaca. Coba pilih file lagi.", "error");
    reader.readAsText(file);
  }

  return (
    <div className="tw-page">
      {/* ===== HEADER ===== */}
      <header className="tw-header">
        <div>
          <p className="tw-catalog">
            <span className="tw-catalog-badge">Katalog Resmi</span>
            <span className="tw-catalog-version">Versi 2.4</span>
          </p>
          <h1>Template Workflow</h1>
          <p className="tw-subtitle">
            Mulai dari alur yang sesuai dengan jenis bisnis Anda tanpa perlu
            merancang dari awal. Terbukti memangkas waktu kerja hingga 40%.
          </p>
        </div>

        <div className="tw-header-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="tw-file-input"
            onChange={handleImport}
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            type="button"
            className="tw-btn tw-btn-outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={15} />
            Impor Draf Workflow
          </button>
          <button
            type="button"
            className="tw-btn tw-btn-outline"
            onClick={openBlankCanvas}
          >
            <SquarePlus size={15} />
            Mulai dari Kanvas Kosong
          </button>
        </div>
      </header>

      {/* ===== BANNER REKOMENDASI ===== */}
      <section className="tw-recommend" aria-labelledby="tw-recommend-title">
        <div className="tw-recommend-body">
          <p className="tw-recommend-label">
            <span className="tw-dot" aria-hidden="true" />
            <span className="tw-recommend-badge">Rekomendasi Utama</span>
            <span className="tw-recommend-note">Khusus Merchant Kuliner</span>
          </p>
          <h2 id="tw-recommend-title">
            Baru Memulai? Gunakan Alur Standar Depot Rasa Nusantara
          </h2>
          <p className="tw-recommend-text">
            Alur operasional terbukti yang menghubungkan <b>Pesanan Kasir</b>{" "}
            → <b>Validasi QRIS Otomatis</b> → <b>Cetak Tiket Dapur</b> →{" "}
            <b>Notifikasi Struk WhatsApp</b>. Menghilangkan salah antar dan
            nota terselip di jam sibuk.
          </p>

          <ul className="tw-recommend-flow" aria-label="Urutan alur standar">
            {RECOMMENDED_FLOW.map((item, index) => {
              const Icon = flowIcons[item.icon];
              return (
                <li key={item.label}>
                  {index > 0 && <ArrowRight size={14} aria-hidden="true" />}
                  <span className="tw-flow-pill">
                    <Icon size={14} aria-hidden="true" />
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="tw-recommend-actions">
          <button
            type="button"
            className="tw-btn tw-btn-primary"
            onClick={() => applyTemplate(recommended)}
          >
            <Zap size={15} />
            Terapkan ke Toko Saya
          </button>
          <button
            type="button"
            className="tw-btn tw-btn-soft"
            onClick={() => setPreview(recommended)}
          >
            <Eye size={15} />
            Pratinjau Alur Lengkap
          </button>
        </div>
      </section>

      {/* ===== FILTER ===== */}
      <div className="tw-toolbar">
        <div className="tw-tabs" role="tablist" aria-label="Kategori template">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={category === item.id}
              className={`tw-tab ${category === item.id ? "active" : ""}`}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
              <span className="tw-tab-count">{counts[item.id] || 0}</span>
            </button>
          ))}
        </div>

        <label className="tw-sort">
          <span>Urutkan:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ===== GRID TEMPLATE ===== */}
      <div className="tw-grid">
        {visibleTemplates.map((template) => {
          const HighlightIcon = highlightIcons[template.highlight.icon];
          const isSelected = selectedId === template.id;

          return (
            <article key={template.id} className="tw-card">
              <div className="tw-card-top">
                <span className={`tw-category tw-category-${template.category}`}>
                  {template.categoryLabel}
                </span>
                <span
                  className="tw-rating"
                  title={`${template.users} pemakai`}
                >
                  <Star size={13} aria-hidden="true" />
                  {template.rating.toFixed(1)} ({formatUsers(template.users)} pakai)
                </span>
              </div>

              <h3>{template.title}</h3>

              <p className="tw-meta">
                <span>
                  <GitBranch size={13} aria-hidden="true" />
                  {template.steps.length} Langkah Alur
                </span>
                <span className={`tw-highlight tw-tone-${template.highlight.tone}`}>
                  <HighlightIcon size={13} aria-hidden="true" />
                  {template.highlight.label}
                </span>
              </p>

              <p className="tw-description">{template.description}</p>

              <div className="tw-mini-flow">
                <p>Mini Alur Kerja</p>
                <ol title={template.flow.join(" → ")}>
                  {template.flow.map((step, index) => (
                    <li key={step}>
                      {step}
                      {index < template.flow.length - 1 && (
                        <ArrowRight size={11} aria-hidden="true" />
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              <button
                type="button"
                className={`tw-btn tw-btn-primary tw-btn-block ${
                  isSelected ? "is-selected" : ""
                }`}
                aria-pressed={isSelected}
                onClick={() => applyTemplate(template)}
              >
                <Check size={15} />
                {isSelected ? "Template Dipakai" : "Gunakan Template"}
              </button>
              <button
                type="button"
                className="tw-link"
                onClick={() => setPreview(template)}
              >
                Lihat Skema Alur
              </button>
            </article>
          );
        })}

        {/* Kartu Kanvas Kosong hanya tampil di tab "Semua Kategori". */}
        {category === "semua" && (
          <article className="tw-card tw-card-blank">
            <div className="tw-card-top">
              <span className="tw-category tw-category-custom">
                Kustomisasi Bebas
              </span>
              <span className="tw-advanced">Tingkat Mahir</span>
            </div>

            <h3>Kanvas Kosong (Mulai dari Nol)</h3>

            <p className="tw-meta">
              <span>Node Drag &amp; Drop</span>
              <span>Tanpa Batasan</span>
            </p>

            <p className="tw-description">
              Bangun alur logika operasional khusus untuk model bisnis unik
              Anda dengan editor drag-and-drop Workflow Builder.
            </p>

            <button
              type="button"
              className="tw-blank-area"
              onClick={openBlankCanvas}
            >
              <span className="tw-blank-icon">
                <Plus size={20} aria-hidden="true" />
              </span>
              Rancang Alur Unik Sendiri
            </button>

            <button
              type="button"
              className="tw-btn tw-btn-soft tw-btn-block"
              onClick={openBlankCanvas}
            >
              <SquarePlus size={15} />
              Buka Kanvas Baru
            </button>
            <button type="button" className="tw-link" onClick={showUnavailable}>
              Pelajari Dokumentasi
            </button>
          </article>
        )}
      </div>

      {/* ===== BANTUAN ===== */}
      <section className="tw-help" aria-labelledby="tw-help-title">
        <span className="tw-help-icon">
          <Headset size={22} aria-hidden="true" />
        </span>
        <div className="tw-help-text">
          <h2 id="tw-help-title">Perlu Bantuan Menyesuaikan Alur Kerja?</h2>
          <p>
            Tim spesialis UMKM-Builder siap membantu memetakan buku manual toko
            Anda ke sistem otomatis.
          </p>
        </div>
        <div className="tw-help-actions">
          <button
            type="button"
            className="tw-btn tw-btn-white"
            onClick={showUnavailable}
          >
            Tanya Komunitas
          </button>
          <button
            type="button"
            className="tw-btn tw-btn-primary"
            onClick={showUnavailable}
          >
            <MessageSquare size={15} />
            Konsultasi Gratis
          </button>
        </div>
      </section>

      {/* ===== MODAL SKEMA ALUR ===== */}
      {preview && (
        <div
          className="tw-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreview(null);
          }}
        >
          <div
            className="tw-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tw-modal-title"
          >
            <div className="tw-modal-head">
              <div>
                <p className="tw-modal-kicker">Skema Alur</p>
                <h2 id="tw-modal-title">{preview.title}</h2>
              </div>
              <button
                type="button"
                className="tw-icon-btn"
                aria-label="Tutup pratinjau"
                onClick={() => setPreview(null)}
                autoFocus
              >
                <X size={18} />
              </button>
            </div>

            <ol className="tw-steps">
              {preview.steps.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <span>{step.detail}</span>
                </li>
              ))}
            </ol>

            <div className="tw-modal-actions">
              <button
                type="button"
                className="tw-btn tw-btn-outline"
                onClick={() => setPreview(null)}
              >
                Tutup
              </button>
              <button
                type="button"
                className="tw-btn tw-btn-primary"
                onClick={() => applyTemplate(preview)}
              >
                <Check size={15} />
                Gunakan Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOAST ===== */}
      {toast && (
        <div
          className={`tw-toast tw-toast-${toast.kind}`}
          role="status"
          aria-live="polite"
        >
          <p>{toast.message}</p>
          {toast.withBuilderAction && onNavigate && (
            <button
              type="button"
              onClick={() => {
                setToast(null);
                onNavigate("Workflow Builder");
              }}
            >
              Buka Workflow Builder
            </button>
          )}
          <button
            type="button"
            className="tw-toast-close"
            aria-label="Tutup pesan"
            onClick={() => setToast(null)}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default TemplateWorkflow;
