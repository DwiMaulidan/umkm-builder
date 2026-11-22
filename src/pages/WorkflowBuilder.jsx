import { useEffect, useMemo, useRef, useState } from "react";
import {
  Ban,
  BadgeCheck,
  BellRing,
  Check,
  ChefHat,
  CircleCheck,
  CirclePlay,
  Flag,
  GitFork,
  LayoutGrid,
  LocateFixed,
  Maximize,
  MessageCircle,
  MessageSquare,
  Monitor,
  MousePointerClick,
  Package,
  Printer,
  QrCode,
  Redo2,
  Rocket,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Split,
  Trash2,
  TrendingUp,
  Undo2,
  Workflow,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  DEFAULT_WORKFLOW_NAME,
  LOW_STOCK_OPTIONS,
  NODE_HEIGHT,
  NODE_TYPES,
  NODE_WIDTH,
  PALETTE_GROUPS,
  STAGE_MIN_HEIGHT,
  STAGE_MIN_WIDTH,
  STOCK_NODE_HEIGHT,
  STOCK_TIMING_OPTIONS,
  createDefaultFlow,
  createDefaultStockConfig,
  loadWorkflowDraft,
  saveWorkflowDraft,
} from "../data/workflowBuilderData";
import "./WorkflowBuilder.css";

// ===============================
// KONSTANTA & PETA IKON
// ===============================

const PALETTE_ICONS = {
  monitor: Monitor,
  message: MessageSquare,
  qr: QrCode,
  package: Package,
  chef: ChefHat,
  printer: Printer,
  badge: BadgeCheck,
  split: Split,
  phone: Smartphone,
};

const NODE_ICONS = {
  trigger: Zap,
  system: ShieldCheck,
  decision: GitFork,
  stock: Package,
  kitchen: ChefHat,
  print: Printer,
  whatsapp: MessageCircle,
  warning: BellRing,
  cancel: Ban,
  end: Flag,
};

const MIN_ZOOM = 40;
const MAX_ZOOM = 160;
const ZOOM_STEP = 10;
const STAGE_PAD = 24;
const HISTORY_LIMIT = 50;
const STEP_DELAY = 700;

const ALL_PALETTE_ITEMS = PALETTE_GROUPS.flatMap((g) => g.items);

// ===============================
// FUNGSI BANTU
// ===============================

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function newId() {
  return `n_${Math.random().toString(36).slice(2, 9)}`;
}

function nextNumber(nodes) {
  let max = 0;
  for (const node of nodes) {
    const fromCode = /\d+/.exec(node.code || "");
    const fromKey = /\d+$/.exec(node.key || "");
    if (fromCode) max = Math.max(max, parseInt(fromCode[0], 10));
    if (fromKey) max = Math.max(max, parseInt(fromKey[0], 10));
  }
  return max + 1;
}

function createNode(item, x, y, nodes) {
  const num = nextNumber(nodes);
  const isStock = item.type === "stock";
  return {
    id: newId(),
    type: item.type,
    code: `#${pad2(num)}`,
    key: `node_${item.type}_${pad2(num)}`,
    title: item.title,
    detail: item.desc,
    x: Math.max(0, Math.round(x)),
    y: Math.max(0, Math.round(y)),
    w: NODE_WIDTH,
    h: isStock ? STOCK_NODE_HEIGHT : NODE_HEIGHT,
    ...(isStock ? { config: createDefaultStockConfig() } : {}),
  };
}

// Sambungkan blok baru ke blok di atasnya yang masih punya "slot" keluar.
function autoConnect(node, nodes, edges) {
  if (node.type === "trigger") return null;

  const centerX = node.x + node.w / 2;
  let best = null;
  let bestScore = Infinity;

  for (const candidate of nodes) {
    if (NODE_TYPES[candidate.type].terminal) continue;

    const outgoing = edges.filter((e) => e.from === candidate.id).length;
    const limit = candidate.type === "decision" ? 2 : 1;
    if (outgoing >= limit) continue;

    const gap = node.y - (candidate.y + candidate.h);
    if (gap < -20) continue;

    const dx = Math.abs(centerX - (candidate.x + candidate.w / 2));
    if (dx > 260) continue;

    const score = gap + dx;
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  if (!best) return null;

  if (best.type === "decision") {
    const goesLeft = centerX < best.x + best.w / 2;
    return {
      id: `e_${newId()}`,
      from: best.id,
      to: node.id,
      variant: goesLeft ? "ok" : "fail",
      side: goesLeft ? "left" : "right",
      label: goesLeft ? "Ya" : "Tidak",
    };
  }

  return { id: `e_${newId()}`, from: best.id, to: node.id, variant: "flow" };
}

function anchorPoint(node, side) {
  if (side === "left") return { x: node.x, y: node.y + node.h / 2 };
  if (side === "right") return { x: node.x + node.w, y: node.y + node.h / 2 };
  return { x: node.x + node.w / 2, y: node.y + node.h };
}

function buildEdgeGeometry(edge, nodeMap) {
  const from = nodeMap.get(edge.from);
  const to = nodeMap.get(edge.to);
  if (!from || !to) return null;

  const start = anchorPoint(from, edge.side);
  const end = { x: to.x + to.w / 2, y: to.y };
  const bend = Math.max(40, Math.abs(end.y - start.y) / 2);

  let c1 = { x: start.x, y: start.y + bend };
  if (edge.side === "left") c1 = { x: start.x - bend, y: start.y };
  if (edge.side === "right") c1 = { x: start.x + bend, y: start.y };
  const c2 = { x: end.x, y: end.y - bend };

  return {
    id: edge.id,
    variant: edge.variant,
    label: edge.label,
    side: edge.side,
    start,
    end,
    d: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`,
  };
}

function formatTime(date) {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// ===============================
// PANEL KONFIGURASI BLOK (KANAN)
// ===============================

function ConfigPanel({ node, onApply, onDelete, onClose }) {
  const type = NODE_TYPES[node.type];
  const isStock = node.type === "stock";

  const [title, setTitle] = useState(node.title);
  const [detail, setDetail] = useState(node.detail || "");
  const [config, setConfig] = useState(() =>
    node.config
      ? {
          ...node.config,
          materials: node.config.materials.map((m) => ({ ...m })),
        }
      : null
  );
  const [editRecipe, setEditRecipe] = useState(false);

  const titleEmpty = title.trim() === "";

  function updateMaterial(index, qty) {
    setConfig((prev) => ({
      ...prev,
      materials: prev.materials.map((m, i) => (i === index ? { ...m, qty } : m)),
    }));
  }

  function submit() {
    if (titleEmpty) return;
    onApply({
      title: title.trim(),
      ...(isStock ? {} : { detail: detail.trim() }),
      ...(config ? { config } : {}),
    });
  }

  return (
    <aside className="wb-config" aria-label="Konfigurasi blok">
      <div className="wb-config-head">
        <div>
          <h2>
            <SlidersHorizontal size={15} aria-hidden="true" />
            Konfigurasi Blok
          </h2>
          <p className="wb-config-meta">
            <span className="wb-config-tag">{type.label}</span>
            <code>id: {node.key}</code>
          </p>
        </div>
        <button
          type="button"
          className="wb-icon-btn"
          aria-label="Tutup panel konfigurasi"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>

      <div className="wb-config-body">
        <div className="wb-field">
          <label htmlFor="wb-step-name">Nama Langkah Alur</label>
          <input
            id="wb-step-name"
            type="text"
            value={title}
            maxLength={60}
            aria-invalid={titleEmpty}
            onChange={(e) => setTitle(e.target.value)}
          />
          {titleEmpty ? (
            <small className="wb-field-error">
              Nama langkah tidak boleh kosong.
            </small>
          ) : (
            <small>Nama ini akan tercatat pada log riwayat pesanan.</small>
          )}
        </div>

        {isStock && config ? (
          <>
            <div className="wb-section">
              <h3>Target Bahan &amp; Resep</h3>
              <div className="wb-method">
                <span>Metode Pemotongan:</span>
                <b>{config.method}</b>
              </div>
              <p className="wb-section-text">
                Otomatis menghitung gramatur bahan baku per porsi menu yang
                dipesan pelanggan:
              </p>

              <ul className="wb-materials">
                {config.materials.map((material, index) => (
                  <li key={material.name}>
                    <span>{material.name}</span>
                    {editRecipe ? (
                      <input
                        type="text"
                        value={material.qty}
                        maxLength={20}
                        aria-label={`Takaran ${material.name}`}
                        onChange={(e) => updateMaterial(index, e.target.value)}
                      />
                    ) : (
                      <strong>{material.qty}</strong>
                    )}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="wb-text-link"
                onClick={() => setEditRecipe((v) => !v)}
              >
                {editRecipe ? "Selesai Mengubah Takaran" : "Ubah Resep / Satuan Bahan"}
              </button>
            </div>

            <div
              className="wb-section wb-radio-group"
              role="radiogroup"
              aria-labelledby="wb-timing-title"
            >
              <h3 id="wb-timing-title">Waktu Pemotongan Stok</h3>
              {STOCK_TIMING_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`wb-radio ${
                    config.timing === option.id ? "is-checked" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="wb-stock-timing"
                    checked={config.timing === option.id}
                    onChange={() =>
                      setConfig((prev) => ({ ...prev, timing: option.id }))
                    }
                  />
                  <span>
                    <b>{option.title}</b>
                    <small>{option.desc}</small>
                  </span>
                </label>
              ))}
            </div>

            <div className="wb-field">
              <label htmlFor="wb-low-stock">Jika Bahan Baku Habis</label>
              <select
                id="wb-low-stock"
                value={config.lowStock}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, lowStock: e.target.value }))
                }
              >
                {LOW_STOCK_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="wb-field">
            <label htmlFor="wb-step-detail">Keterangan Langkah</label>
            <textarea
              id="wb-step-detail"
              rows={3}
              value={detail}
              maxLength={90}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>
        )}

        <div className="wb-config-actions">
          <button
            type="button"
            className="wb-btn wb-btn-primary wb-btn-block"
            disabled={titleEmpty}
            onClick={submit}
          >
            <CircleCheck size={15} />
            Terapkan Perubahan
          </button>
          <button type="button" className="wb-danger-link" onClick={onDelete}>
            <Trash2 size={14} />
            Hapus Blok Ini dari Alur
          </button>
        </div>

        {isStock && (
          <div className="wb-impact">
            <p>
              <TrendingUp size={13} aria-hidden="true" />
              Estimasi Dampak
            </p>
            <span>
              Menghilangkan selisih perhitungan bahan hingga 94% setiap tutup
              kasir malam.
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

// ===============================
// HALAMAN WORKFLOW BUILDER
// ===============================

function WorkflowBuilder() {
  const initial = useMemo(() => loadWorkflowDraft(), []);

  const [name, setName] = useState(initial?.name || DEFAULT_WORKFLOW_NAME);
  const [live, setLive] = useState(initial ? Boolean(initial.live) : true);
  const [flow, setFlow] = useState(() => initial?.flow || createDefaultFlow());
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [version, setVersion] = useState(0);
  const [selectedId, setSelectedId] = useState("n04a");
  const [zoom, setZoom] = useState(100);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [runningId, setRunningId] = useState(null);
  const [testing, setTesting] = useState(false);

  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const timersRef = useRef([]);

  const scale = zoom / 100;

  const nodeMap = useMemo(
    () => new Map(flow.nodes.map((n) => [n.id, n])),
    [flow.nodes]
  );

  const edgeShapes = useMemo(
    () =>
      flow.edges
        .map((edge) => buildEdgeGeometry(edge, nodeMap))
        .filter(Boolean),
    [flow.edges, nodeMap]
  );

  const stage = useMemo(() => {
    let right = 0;
    let bottom = 0;
    for (const n of flow.nodes) {
      right = Math.max(right, n.x + n.w);
      bottom = Math.max(bottom, n.y + n.h);
    }
    return {
      w: Math.max(STAGE_MIN_WIDTH, right + 80),
      h: Math.max(STAGE_MIN_HEIGHT, bottom + 60),
    };
  }, [flow.nodes]);

  const selected = selectedId ? nodeMap.get(selectedId) || null : null;

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PALETTE_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q)
      ),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  // Toast hilang sendiri.
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Bersihkan timer uji coba saat halaman ditinggalkan.
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // Escape menutup panel konfigurasi.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function showToast(message, kind = "success") {
    setToast({ message, kind });
  }

  // Semua perubahan "satu langkah" lewat sini agar bisa di-undo.
  function commit(next) {
    setPast((p) => [...p.slice(-(HISTORY_LIMIT - 1)), flow]);
    setFuture([]);
    setFlow(next);
  }

  function undo() {
    if (past.length === 0) return;
    setFuture((f) => [flow, ...f]);
    setFlow(past[past.length - 1]);
    setPast(past.slice(0, -1));
    setVersion((v) => v + 1);
  }

  function redo() {
    if (future.length === 0) return;
    setPast((p) => [...p, flow]);
    setFlow(future[0]);
    setFuture(future.slice(1));
    setVersion((v) => v + 1);
  }

  // ---------- Zoom ----------

  function zoomBy(delta) {
    setZoom((z) => clamp(z + delta, MIN_ZOOM, MAX_ZOOM));
  }

  function fitToScreen() {
    const el = canvasRef.current;
    if (!el) return;
    const availW = el.clientWidth - STAGE_PAD * 2;
    const availH = el.clientHeight - STAGE_PAD * 2;
    const fit = Math.floor(Math.min(availW / stage.w, availH / stage.h) * 100);
    setZoom(clamp(fit, MIN_ZOOM, MAX_ZOOM));
    el.scrollTo({ left: 0, top: 0 });
  }

  function resetView() {
    setZoom(100);
    canvasRef.current?.scrollTo({ left: 0, top: 0 });
  }

  // ---------- Tambah / hapus blok ----------

  function addNode(item, x, y) {
    const node = createNode(item, x, y, flow.nodes);
    const edge = autoConnect(node, flow.nodes, flow.edges);
    commit({
      nodes: [...flow.nodes, node],
      edges: edge ? [...flow.edges, edge] : flow.edges,
    });
    setSelectedId(node.id);
    showToast(
      edge
        ? `Blok "${item.title}" ditambahkan dan disambungkan.`
        : `Blok "${item.title}" ditambahkan. Belum tersambung ke blok lain.`,
      edge ? "success" : "info"
    );
  }

  function addNodeFromClick(item) {
    const bottom = flow.nodes.reduce((max, n) => Math.max(max, n.y + n.h), 0);
    addNode(item, 244, flow.nodes.length === 0 ? 20 : bottom + 36);
  }

  function handleDrop(e) {
    e.preventDefault();
    const item = ALL_PALETTE_ITEMS.find(
      (i) => i.id === e.dataTransfer.getData("text/plain")
    );
    const el = canvasRef.current;
    if (!item || !el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left + el.scrollLeft - STAGE_PAD) / scale;
    const y = (e.clientY - rect.top + el.scrollTop - STAGE_PAD) / scale;
    addNode(item, x - NODE_WIDTH / 2, y - 24);
  }

  function removeNode(id) {
    const node = nodeMap.get(id);
    if (!node) return;
    commit({
      nodes: flow.nodes.filter((n) => n.id !== id),
      edges: flow.edges.filter((e) => e.from !== id && e.to !== id),
    });
    setSelectedId(null);
    showToast(`Blok "${node.title}" dihapus. Gunakan Undo untuk mengembalikan.`, "info");
  }

  function applyChanges(patch) {
    if (!selected) return;
    commit({
      ...flow,
      nodes: flow.nodes.map((n) =>
        n.id === selected.id ? { ...n, ...patch } : n
      ),
    });
    setVersion((v) => v + 1);
    showToast(`Perubahan pada blok "${patch.title}" diterapkan.`);
  }

  // ---------- Geser blok di kanvas ----------

  function onNodePointerDown(e, node) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      id: node.id,
      startX: e.clientX,
      startY: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
      moved: false,
      snapshot: flow,
    };
  }

  function onNodePointerMove(e) {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 4) return;
      drag.moved = true;
      setPast((p) => [...p.slice(-(HISTORY_LIMIT - 1)), drag.snapshot]);
      setFuture([]);
    }

    const x = Math.max(0, Math.round(drag.nodeX + dx / scale));
    const y = Math.max(0, Math.round(drag.nodeY + dy / scale));
    setFlow((f) => ({
      ...f,
      nodes: f.nodes.map((n) => (n.id === drag.id ? { ...n, x, y } : n)),
    }));
  }

  function onNodePointerUp() {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag && !drag.moved) setSelectedId(drag.id);
  }

  function onNodeKeyDown(e, node) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedId(node.id);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      removeNode(node.id);
    }
  }

  // ---------- Uji coba, simpan, publikasi ----------

  function runTest() {
    if (testing) return;

    const start = flow.nodes.find((n) => n.type === "trigger");
    if (!start) {
      showToast("Tambahkan blok Pemicu Awal dulu sebelum uji coba.", "error");
      return;
    }

    // Ikuti jalur utama: cabang "Ya" jika ada, kalau tidak jalur pertama.
    const path = [];
    const seen = new Set();
    let current = start;
    while (current && !seen.has(current.id)) {
      path.push(current.id);
      seen.add(current.id);
      const outs = flow.edges.filter((e) => e.from === current.id);
      const next =
        outs.find((e) => e.variant === "ok") ||
        outs.find((e) => e.variant !== "fail") ||
        outs[0];
      current = next ? nodeMap.get(next.to) : null;
    }

    setTesting(true);
    path.forEach((id, index) => {
      timersRef.current.push(setTimeout(() => setRunningId(id), index * STEP_DELAY));
    });
    timersRef.current.push(
      setTimeout(() => {
        setRunningId(null);
        setTesting(false);
        showToast(
          `Uji coba selesai: ${path.length} langkah dilalui. Ini simulasi, tidak ada pesan atau stok yang diubah.`
        );
      }, path.length * STEP_DELAY)
    );
  }

  function persist(isLive) {
    return saveWorkflowDraft({ name, live: isLive, flow });
  }

  function saveDraft() {
    const ok = persist(live);
    if (ok) {
      showToast(
        `Draf tersimpan pukul ${formatTime(new Date())}. Disimpan di browser ini, belum ke server.`
      );
    } else {
      showToast("Draf gagal disimpan. Browser menolak penyimpanan.", "error");
    }
  }

  function publish() {
    if (!flow.nodes.some((n) => n.type === "trigger")) {
      showToast("Alur belum bisa dipublikasikan: belum ada blok Pemicu Awal.", "error");
      return;
    }
    if (flow.nodes.length < 2) {
      showToast("Alur belum bisa dipublikasikan: minimal 2 blok.", "error");
      return;
    }
    setLive(true);
    const ok = persist(true);
    if (ok) {
      showToast(
        "Alur dipublikasikan dan berstatus Aktif. Tersimpan di browser ini, belum terhubung ke server."
      );
    } else {
      showToast("Alur gagal disimpan. Browser menolak penyimpanan.", "error");
    }
  }

  // ---------- Render ----------

  const blockCount = ALL_PALETTE_ITEMS.length;

  return (
    <div className="wb-page">
      {/* ===== TOOLBAR ===== */}
      <div className="wb-toolbar">
        <div className="wb-toolbar-left">
          <Workflow size={15} aria-hidden="true" />
          <span className="wb-crumb">Workflow Builder</span>
          <span className="wb-slash">/</span>
          <input
            className="wb-name"
            type="text"
            value={name}
            title={name}
            aria-label="Nama workflow"
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              if (name.trim() === "") setName(DEFAULT_WORKFLOW_NAME);
              else setName(name.trim());
            }}
          />
          <span className={`wb-status ${live ? "is-live" : ""}`}>
            <i aria-hidden="true" />
            {live ? "Status: Aktif (Live)" : "Status: Nonaktif"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={live}
            aria-label="Aktifkan workflow"
            className={`wb-switch ${live ? "is-on" : ""}`}
            onClick={() => setLive((v) => !v)}
          >
            <span />
          </button>
        </div>

        <div className="wb-zoom" role="group" aria-label="Kontrol kanvas">
          <button
            type="button"
            aria-label="Perkecil"
            disabled={zoom <= MIN_ZOOM}
            onClick={() => zoomBy(-ZOOM_STEP)}
          >
            <ZoomOut size={15} />
          </button>
          <span className="wb-zoom-value" aria-live="polite">
            {zoom}%
          </span>
          <button
            type="button"
            aria-label="Perbesar"
            disabled={zoom >= MAX_ZOOM}
            onClick={() => zoomBy(ZOOM_STEP)}
          >
            <ZoomIn size={15} />
          </button>
          <button type="button" aria-label="Sesuaikan ke layar" onClick={fitToScreen}>
            <Maximize size={15} />
          </button>
          <button
            type="button"
            className="is-accent"
            aria-label="Kembalikan tampilan ke 100%"
            onClick={resetView}
          >
            <LocateFixed size={15} />
          </button>
          <span className="wb-zoom-sep" aria-hidden="true" />
          <button
            type="button"
            aria-label="Urungkan"
            disabled={past.length === 0}
            onClick={undo}
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            aria-label="Ulangi"
            disabled={future.length === 0}
            onClick={redo}
          >
            <Redo2 size={15} />
          </button>
        </div>

        <div className="wb-toolbar-right">
          <button
            type="button"
            className="wb-btn wb-btn-outline"
            disabled={testing}
            onClick={runTest}
          >
            <CirclePlay size={15} />
            {testing ? "Menguji..." : "Uji Coba Alur"}
          </button>
          <button type="button" className="wb-btn wb-btn-ghost" onClick={saveDraft}>
            Simpan Draf
          </button>
          <button type="button" className="wb-btn wb-btn-primary" onClick={publish}>
            <Rocket size={15} />
            Publikasikan Alur
          </button>
        </div>
      </div>

      {/* ===== BADAN: PALET | KANVAS | KONFIGURASI ===== */}
      <div className={`wb-body ${selected ? "" : "no-config"}`}>
        {/* ----- Panel komponen ----- */}
        <aside className="wb-palette" aria-label="Komponen alur">
          <div className="wb-palette-head">
            <h2>
              <LayoutGrid size={15} aria-hidden="true" />
              Komponen Alur
            </h2>
            <span className="wb-count">{blockCount} Blok</span>
          </div>

          <div className="wb-search">
            <Search size={14} aria-hidden="true" />
            <input
              type="search"
              placeholder="Cari blok alat..."
              value={query}
              aria-label="Cari blok"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="wb-palette-list">
            {filteredGroups.length === 0 && (
              <p className="wb-empty-search">Tidak ada blok yang cocok.</p>
            )}

            {filteredGroups.map((group) => (
              <section key={group.id}>
                <h3 className="wb-group-title">
                  <i style={{ background: group.color }} aria-hidden="true" />
                  {group.label}
                </h3>
                {group.items.map((item) => {
                  const Icon = PALETTE_ICONS[item.icon];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="wb-block"
                      draggable
                      title="Tarik ke kanvas atau klik untuk menambahkan"
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", item.id);
                        e.dataTransfer.effectAllowed = "copy";
                      }}
                      onClick={() => addNodeFromClick(item)}
                    >
                      <span
                        className="wb-block-icon"
                        style={{
                          color: NODE_TYPES[item.type].color,
                          background: `${NODE_TYPES[item.type].color}1a`,
                        }}
                      >
                        <Icon size={14} aria-hidden="true" />
                      </span>
                      <span className="wb-block-text">
                        <b>{item.title}</b>
                        <small>{item.desc}</small>
                      </span>
                    </button>
                  );
                })}
              </section>
            ))}
          </div>

          <p className="wb-hint">
            <MousePointerClick size={14} aria-hidden="true" />
            Tarik komponen ke kanvas untuk menyambung alur kerja otomatis toko
            Anda.
          </p>
        </aside>

        {/* ----- Kanvas ----- */}
        <div
          className="wb-canvas"
          ref={canvasRef}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }}
          onDrop={handleDrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <div
            className="wb-stage-box"
            style={{ width: stage.w * scale, height: stage.h * scale }}
          >
            <div
              className="wb-stage"
              style={{
                width: stage.w,
                height: stage.h,
                transform: `scale(${scale})`,
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedId(null);
              }}
            >
              <svg
                className="wb-edges"
                width={stage.w}
                height={stage.h}
                aria-hidden="true"
              >
                {edgeShapes.map((edge) => (
                  <g key={edge.id} className={`wb-edge wb-edge-${edge.variant}`}>
                    <path d={edge.d} />
                    <circle cx={edge.start.x} cy={edge.start.y} r="3.5" />
                    <circle cx={edge.end.x} cy={edge.end.y} r="3.5" />
                  </g>
                ))}
              </svg>

              {edgeShapes
                .filter((edge) => edge.label)
                .map((edge) => {
                  const side = edge.side === "left" ? "left" : "right";
                  return (
                    <span
                      key={edge.id}
                      className={`wb-edge-label wb-edge-label-${edge.variant} is-${side}`}
                      style={{
                        left: edge.start.x + (side === "left" ? -10 : 10),
                        top: edge.start.y - 16,
                      }}
                    >
                      {edge.variant === "ok" ? "✓ " : edge.variant === "fail" ? "✗ " : ""}
                      {edge.label}
                    </span>
                  );
                })}

              {flow.nodes.map((node) => {
                const type = NODE_TYPES[node.type];
                const Icon = NODE_ICONS[node.type];
                const isSelected = node.id === selectedId;
                const isRunning = node.id === runningId;

                return (
                  <div
                    key={node.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`${type.label}: ${node.title}`}
                    className={`wb-node ${isSelected ? "is-selected" : ""} ${
                      isRunning ? "is-running" : ""
                    }`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.w,
                      height: node.h,
                      "--wb-node-color": type.color,
                    }}
                    onPointerDown={(e) => onNodePointerDown(e, node)}
                    onPointerMove={onNodePointerMove}
                    onPointerUp={onNodePointerUp}
                    onPointerCancel={() => {
                      dragRef.current = null;
                    }}
                    onKeyDown={(e) => onNodeKeyDown(e, node)}
                  >
                    <span className="wb-port wb-port-top" aria-hidden="true" />
                    <span className="wb-port wb-port-bottom" aria-hidden="true" />

                    <div className="wb-node-head">
                      <span className="wb-node-kind">
                        {isSelected ? (
                          <CircleCheck size={11} aria-hidden="true" />
                        ) : (
                          <Icon size={11} aria-hidden="true" />
                        )}
                        {isSelected ? "Terpilih (Aktif)" : type.label}
                      </span>
                      {node.code && <span className="wb-node-code">{node.code}</span>}
                    </div>

                    <strong className="wb-node-title">{node.title}</strong>
                    <span className="wb-node-detail">{node.detail}</span>

                    {node.type === "stock" && node.config && (
                      <div className="wb-node-chips">
                        <span>
                          <Package size={10} aria-hidden="true" />
                          Resep {node.config.materials.length} item
                        </span>
                        <span>Buku Kas Sync</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {flow.nodes.length === 0 && (
                <div className="wb-empty">
                  <Workflow size={28} aria-hidden="true" />
                  <b>Kanvas masih kosong</b>
                  <span>
                    Tarik blok dari panel kiri, atau klik blok untuk
                    menambahkannya.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ----- Panel konfigurasi ----- */}
        {selected && (
          <ConfigPanel
            key={`${selected.id}:${version}`}
            node={selected}
            onApply={applyChanges}
            onDelete={() => removeNode(selected.id)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      {/* ===== TOAST ===== */}
      {toast && (
        <div
          className={`wb-toast wb-toast-${toast.kind}`}
          role="status"
          aria-live="polite"
        >
          <p>
            {toast.kind === "success" && <Check size={14} aria-hidden="true" />}
            {toast.message}
          </p>
          <button
            type="button"
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

export default WorkflowBuilder;
