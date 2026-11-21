import { useMemo, useState } from "react";
import {
  Users,
  Tag,
  ReceiptText,
  Search,
  Plus,
  Megaphone,
  MessageCircle,
  Filter,
  History,
  MapPin,
  X,
  UserPlus,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Bot,
} from "lucide-react";
import "./Customers.css";

const initialCustomers = [
  {
    id: 1,
    name: "Pak Budiarto",
    initials: "PB",
    phone: "+62 812-9481-2291",
    category: "Langganan Mingguan",
    type: "Katering",
    transactions: 14,
    total: 1890000,
    lastTransaction: "Hari ini (12:44)",
    address: "Jl. Rungkut Asri No. 12, SBY",
    note: "Suka sambal dipisah, tidak pedas ekstrem untuk anak. Selalu minta sendok ramah lingkungan.",
    favorite: "Ayam Bakar",
    favoriteCount: 11,
    history: [
      {
        id: "#TRX-1024-082",
        status: "Lunas QRIS",
        item: "3x Paket Ayam Bakar Madu + Jeruk Hangat",
        total: 135000,
        date: "Hari ini, 12:44",
      },
      {
        id: "#TRX-1021-044",
        status: "Lunas Tunai",
        item: "2x Paket Ayam Bakar + Sambal Terasi Ekstra",
        total: 95000,
        date: "21 Okt 2024, 18:20",
      },
      {
        id: "#TRX-1017-092",
        status: "Lunas QRIS",
        item: "3x Paket Ayam Penyet + Sup Gurame",
        total: 145000,
        date: "17 Okt 2024, 13:10",
      },
    ],
  },
  {
    id: 2,
    name: "Graha Mandiri",
    initials: "GM",
    phone: "+62 811-2334-998",
    category: "Pelanggan Kantor",
    type: "Katering",
    transactions: 8,
    total: 6950000,
    lastTransaction: "Hari ini (12:38)",
    address: "Jl. Raya Darmo, Surabaya",
    note: "Pesanan rutin untuk makan siang kantor.",
    favorite: "Paket Katering",
    favoriteCount: 18,
    history: [],
  },
  {
    id: 3,
    name: "Ibu Dewi Sandra",
    initials: "DS",
    phone: "+62 818-0922-1144",
    category: "Pelanggan Dine-in",
    type: "Dine-in",
    transactions: 5,
    total: 410000,
    lastTransaction: "Hari ini (12:30)",
    address: "Surabaya",
    note: "Pelanggan reguler.",
    favorite: "Ayam Penyet",
    favoriteCount: 4,
    history: [],
  },
  {
    id: 4,
    name: "Mas Rian Pradana",
    initials: "RP",
    phone: "+62 856-7788-3321",
    category: "Langganan Makan Siang",
    type: "Katering",
    transactions: 19,
    total: 1425000,
    lastTransaction: "Hari ini (12:17)",
    address: "Jl. Jemursari, Surabaya",
    note: "Biasanya pesan makan siang.",
    favorite: "Nasi Goreng",
    favoriteCount: 12,
    history: [],
  },
  {
    id: 5,
    name: "Bpk. Hendra Gunawan",
    initials: "HG",
    phone: "+62 813-8822-0012",
    category: "Take-away Malam",
    type: "Dine-in",
    transactions: 11,
    total: 1650000,
    lastTransaction: "Hari ini (12:02)",
    address: "Surabaya",
    note: "Sering melakukan pemesanan take-away.",
    favorite: "Ayam Bakar",
    favoriteCount: 9,
    history: [],
  },
  {
    id: 6,
    name: "Mbak Dian Permata",
    initials: "DP",
    phone: "+62 812-7711-4560",
    category: "Pelanggan Dine-in",
    type: "Dine-in",
    transactions: 3,
    total: 285000,
    lastTransaction: "Kemarin",
    address: "Surabaya",
    note: "Tidak ada catatan khusus.",
    favorite: "Es Teh",
    favoriteCount: 3,
    history: [],
  },
  {
    id: 7,
    name: "Dr. Arifin Santoso",
    initials: "AS",
    phone: "+62 815-6677-8901",
    category: "Pesanan Khusus Arisan",
    type: "Grosir",
    transactions: 22,
    total: 2860000,
    lastTransaction: "22 Okt 2024",
    address: "Surabaya",
    note: "Pesanan khusus untuk acara arisan.",
    favorite: "Paket Nasi",
    favoriteCount: 15,
    history: [],
  },
];

const formatRupiah = (value) =>
  "Rp" + Number(value).toLocaleString("id-ID");

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [sort, setSort] = useState("transactions");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "Pelanggan Dine-in",
    address: "",
  });

  const filteredCustomers = useMemo(() => {
    let result = customers.filter((customer) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(keyword) ||
        customer.phone.toLowerCase().includes(keyword) ||
        customer.category.toLowerCase().includes(keyword);

      const matchesFilter =
        filter === "Semua" ||
        (filter === "Langganan Katering" && customer.type === "Katering") ||
        (filter === "Pelanggan Dine-in" && customer.type === "Dine-in") ||
        (filter === "Grosir Sambal" && customer.type === "Grosir");

      return matchesSearch && matchesFilter;
    });

    result.sort((a, b) =>
      sort === "transactions"
        ? b.transactions - a.transactions
        : b.total - a.total
    );

    return result;
  }, [customers, search, filter, sort]);

  const selectedCustomer =
    customers.find((customer) => customer.id === selectedId) ||
    filteredCustomers[0];

  function addCustomer(e) {
    e.preventDefault();

    const newCustomer = {
      id: Date.now(),
      name: form.name.trim(),
      initials: form.name
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join(""),
      phone: form.phone,
      category: form.category,
      type:
        form.category === "Pelanggan Dine-in"
          ? "Dine-in"
          : form.category === "Pelanggan Grosir"
            ? "Grosir"
            : "Katering",
      transactions: 0,
      total: 0,
      lastTransaction: "-",
      address: form.address || "-",
      note: "Belum ada catatan khusus.",
      favorite: "-",
      favoriteCount: 0,
      history: [],
    };

    setCustomers((current) => [newCustomer, ...current]);
    setSelectedId(newCustomer.id);
    setSearch("");
    setFilter("Semua");
    setForm({
      name: "",
      phone: "",
      category: "Pelanggan Dine-in",
      address: "",
    });
    setShowForm(false);
  }

  return (
    <div className="customers-page">
      <div className="customers-heading">
        <div>
          <div className="customers-title">
            <h1>Pelanggan</h1>
            <span className="customer-store-badge">Depot Kas Buku</span>
          </div>
          <p>
            Catatan riwayat kunjungan dan preferensi pelanggan setia
            Depot Rasa Nusantara tanpa CRM rumit.
          </p>
        </div>

        <div className="customer-actions">
          <button
            className="btn-secondary"
            onClick={() =>
              window.open(
                "https://wa.me/?text=Halo%20pelanggan%20setia%20kami!",
                "_blank"
              )
            }
          >
            <Megaphone size={15} />
            Kirim Pesan Promo WA
          </button>

          <button
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            Tambah Pelanggan
          </button>
        </div>
      </div>

      <div className="customer-stats">
        <div className="customer-stat-card">
          <div className="customer-stat-heading">
            TOTAL PELANGGAN TERDAFTAR
            <span className="customer-stat-icon">
              <Users size={18} />
            </span>
          </div>
          <h2>{284 + Math.max(0, customers.length - 7)}</h2>
          <small className="customer-positive">↗ +18 bulan ini</small>
          <p>Tercatat di pembukuan kasir POS</p>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-heading">
            PELANGGAN SETIA (&gt;5 TRANSAKSI)
            <span className="customer-stat-icon orange">
              <Tag size={18} />
            </span>
          </div>
          <h2>64</h2>
          <small className="customer-orange">22,5% dari total</small>
          <p>Sering re-order menu favorit mingguan</p>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-heading">
            RATA-RATA NILAI BELANJA
            <span className="customer-stat-icon">
              <ReceiptText size={18} />
            </span>
          </div>
          <h2>Rp92.500 <small>/ pesanan</small></h2>
          <p>Kombinasi dine-in & katering harian</p>
        </div>
      </div>

      <div className="customer-toolbar">
        <div className="customer-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pelanggan, nomor WhatsApp, atau catatan"
          />
        </div>

        <div className="customer-toolbar-right">
          <div className="customer-filters">
            {[
              "Semua",
              "Langganan Katering",
              "Pelanggan Dine-in",
              "Grosir Sambal",
            ].map((item) => (
              <button
                key={item}
                className={filter === item ? "selected" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="customer-sort">
            <Filter size={15} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="transactions">Transaksi Terbanyak</option>
              <option value="total">Belanja Terbesar</option>
            </select>
          </div>
        </div>
      </div>

      <div className="customers-layout">
        <section className="customer-list-card">
          <div className="customer-list-heading">
            <h3>Daftar Buku Kontak Toko</h3>
            <span>{filteredCustomers.length} Aktif</span>
            <small>Klik nama untuk melihat profil & preferensi</small>
          </div>

          <div className="customer-table-wrap">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Nomor WhatsApp</th>
                  <th>Trx</th>
                  <th>Total Pembelian</th>
                  <th>Terakhir</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className={
                      selectedId === customer.id
                        ? "customer-row-active"
                        : ""
                    }
                    onClick={() => setSelectedId(customer.id)}
                  >
                    <td>
                      <div className="customer-name-cell">
                        <span className={`customer-avatar avatar-${index % 5}`}>
                          {customer.initials}
                        </span>
                        <div>
                          <strong>{customer.name}</strong>
                          <small>{customer.category}</small>
                        </div>
                      </div>
                    </td>
                    <td>{customer.phone}</td>
                    <td><strong>{customer.transactions}x</strong></td>
                    <td><strong>{formatRupiah(customer.total)}</strong></td>
                    <td>{customer.lastTransaction}</td>
                    <td>
                      <button
                        className={
                          selectedId === customer.id
                            ? "customer-detail-button active"
                            : "customer-detail-button"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(customer.id);
                        }}
                      >
                        {selectedId === customer.id ? "Dipilih" : "Detail"}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="customer-empty">
                      Pelanggan tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="customer-pagination">
            <span>
              Menampilkan {filteredCustomers.length} dari{" "}
              {customers.length} pelanggan
            </span>
            <div>
              <button disabled><ChevronLeft size={16} /></button>
              <strong>Hal 1 / 1</strong>
              <button disabled><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>

        {selectedCustomer ? (
          <aside className="customer-detail-column">
            <section className="customer-profile-card">
              <div className="customer-profile-heading">
                <span className="customer-profile-avatar">
                  {selectedCustomer.initials}
                </span>
                <div className="customer-profile-name">
                  <h2>{selectedCustomer.name}</h2>
                  <small>
                    Terdaftar di buku kontak toko
                  </small>
                </div>
                <span className="customer-loyalty">
                  {selectedCustomer.transactions > 5
                    ? "Pelanggan Setia"
                    : "Pelanggan Baru"}
                </span>
              </div>

              <div className="customer-contact-grid">
                <div>
                  <small>NOMOR WHATSAPP</small>
                  <strong>{selectedCustomer.phone}</strong>
                </div>
                <div>
                  <small>ALAMAT ANTAR / LOKASI</small>
                  <span>{selectedCustomer.address}</span>
                </div>
              </div>

              <div className="customer-note">
                <strong>♨ Catatan Khusus Pesanan & Dapur:</strong>
                <p>"{selectedCustomer.note}"</p>
              </div>

              <div className="customer-mini-stats">
                <div>
                  <small>Frekuensi</small>
                  <strong>{selectedCustomer.transactions}x</strong>
                  <span>Transaksi</span>
                </div>
                <div>
                  <small>Akumulasi Belanja</small>
                  <strong>{formatRupiah(selectedCustomer.total)}</strong>
                  <span>Total belanja</span>
                </div>
                <div>
                  <small>Menu Favorit</small>
                  <strong>{selectedCustomer.favorite}</strong>
                  <span>{selectedCustomer.favoriteCount}x dipesan</span>
                </div>
              </div>

              <a
                className="customer-whatsapp-link"
                href={`https://wa.me/${selectedCustomer.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={15} />
                Hubungi via WhatsApp
              </a>
            </section>

            <section className="customer-history-card">
              <div className="customer-history-heading">
                <History size={17} />
                <h3>Riwayat 3 Transaksi Terakhir</h3>
                <small>Sinkron dengan POS Kasir</small>
              </div>

              {selectedCustomer.history.length > 0 ? (
                selectedCustomer.history.map((transaction) => (
                  <div className="customer-history-item" key={transaction.id}>
                    <div className="customer-history-top">
                      <strong>{transaction.id}</strong>
                      <span>{transaction.status}</span>
                    </div>
                    <div className="customer-history-content">
                      <p>{transaction.item}</p>
                      <strong>{formatRupiah(transaction.total)}</strong>
                    </div>
                    <small>{transaction.date}</small>
                  </div>
                ))
              ) : (
                <div className="customer-no-history">
                  Belum ada riwayat transaksi untuk pelanggan ini.
                </div>
              )}
            </section>

            <section className="customer-automation">
              <Bot size={23} />
              <div>
                <strong>Alur Kerja Otomatis Aktif <span>●</span></strong>
                <p>
                  Pelanggan menerima notifikasi otomatis saat pesanan
                  siap saji via WhatsApp Bot Depot dan pengingat diskon
                  ulang tahun bulanan.
                </p>
              </div>
            </section>
          </aside>
        ) : (
          <div className="customer-detail-empty">
            Pilih pelanggan untuk melihat detail.
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="customer-modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <form
            className="customer-modal"
            onSubmit={addCustomer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="customer-modal-heading">
              <div>
                <h2>Tambah Pelanggan</h2>
                <p>Masukkan informasi pelanggan baru.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Tutup form"
              >
                <X size={19} />
              </button>
            </div>

            <label>
              Nama pelanggan
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Nama lengkap pelanggan"
              />
            </label>

            <label>
              Nomor WhatsApp
              <input
                required
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="+62 812 xxxx xxxx"
              />
            </label>

            <label>
              Kategori pelanggan
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option>Pelanggan Dine-in</option>
                <option>Langganan Katering</option>
                <option>Pelanggan Grosir</option>
              </select>
            </label>

            <label>
              Alamat / lokasi
              <input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                placeholder="Alamat pelanggan"
              />
            </label>

            <div className="customer-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Batal
              </button>
              <button type="submit" className="btn-primary">
                <UserPlus size={15} />
                Simpan Pelanggan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Customers;
