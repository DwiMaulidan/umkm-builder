
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  ShoppingBag,
  Wallet,
  CalendarDays,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  MessageCircle,
} from "lucide-react";
import { getSavedOrders } from "../data/storage";
import "./Customers.css";

const initialCustomers = [
  {
    id: 1,
    name: "Andi Pratama",
    phone: "081234567890",
    email: "andi@email.com",
    address: "Surabaya",
  },
  {
    id: 2,
    name: "Siti Rahma",
    phone: "082345678901",
    email: "siti@email.com",
    address: "Sidoarjo",
  },
  {
    id: 3,
    name: "Budi Santoso",
    phone: "085678901234",
    email: "budi@email.com",
    address: "Gresik",
  },
];

function getCustomers() {
  const saved = localStorage.getItem("umkm_customers");

  if (!saved) return initialCustomers;

  try {
    return JSON.parse(saved);
  } catch {
    return initialCustomers;
  }
}

function formatRupiah(value) {
  return "Rp" + Number(value || 0).toLocaleString("id-ID");
}

function Customers() {
  const [customers, setCustomers] = useState(getCustomers);
  const [orders] = useState(getSavedOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    localStorage.setItem("umkm_customers", JSON.stringify(customers));
  }, [customers]);

  const customerStats = useMemo(() => {
    return customers.map((customer) => {
      const customerOrders = orders.filter(
        (order) =>
          order.customer?.toLowerCase() === customer.name.toLowerCase()
      );

      const totalSpent = customerOrders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
      );

      return {
        ...customer,
        totalOrders: customerOrders.length,
        totalSpent,
        lastTransaction: customerOrders[0]?.date || "-",
      };
    });
  }, [customers, orders]);

  const filteredCustomers = customerStats.filter((customer) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      customer.name.toLowerCase().includes(keyword) ||
      customer.phone.includes(keyword) ||
      customer.email.toLowerCase().includes(keyword);

    const matchesFilter =
      filter === "Semua" ||
      (filter === "Pernah Transaksi" && customer.totalOrders > 0) ||
      (filter === "Belum Transaksi" && customer.totalOrders === 0);

    return matchesSearch && matchesFilter;
  });

  const totalRevenue = customerStats.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );

  function openAddForm() {
    setEditingCustomer(null);
    setForm({ name: "", phone: "", email: "", address: "" });
    setShowForm(true);
  }

  function openEditForm(customer) {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      alert("Nama dan nomor telepon wajib diisi.");
      return;
    }

    if (!/^[0-9+\-\s]{9,16}$/.test(form.phone.trim())) {
      alert("Nomor telepon tidak valid.");
      return;
    }

    const duplicate = customers.some(
      (customer) =>
        customer.phone === form.phone.trim() &&
        customer.id !== editingCustomer?.id
    );

    if (duplicate) {
      alert("Nomor telepon sudah terdaftar.");
      return;
    }

    if (editingCustomer) {
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editingCustomer.id
            ? { ...customer, ...form, name: form.name.trim(), phone: form.phone.trim() }
            : customer
        )
      );
    } else {
      setCustomers((current) => [
        {
          id: Date.now(),
          ...form,
          name: form.name.trim(),
          phone: form.phone.trim(),
        },
        ...current,
      ]);
    }

    setShowForm(false);
  }

  function deleteCustomer(customer) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus pelanggan ${customer.name}?`
    );

    if (!confirmed) return;

    setCustomers((current) =>
      current.filter((item) => item.id !== customer.id)
    );

    if (selectedCustomer?.id === customer.id) {
      setSelectedCustomer(null);
    }
  }

  const selectedOrders = selectedCustomer
    ? orders.filter(
        (order) =>
          order.customer?.toLowerCase() ===
          selectedCustomer.name.toLowerCase()
      )
    : [];

  return (
    <div className="customers-page">
      <div className="customers-heading">
        <div>
          <h1>Pelanggan</h1>
          <p>Kelola informasi dan pantau aktivitas pelanggan usaha Anda.</p>
        </div>

        <button className="customer-primary-btn" onClick={openAddForm}>
          <UserPlus size={17} />
          Tambah Pelanggan
        </button>
      </div>

      <div className="customer-stats">
        <div className="customer-stat-card">
          <div className="customer-stat-icon purple">
            <Users size={20} />
          </div>
          <span>Total Pelanggan</span>
          <h2>{customers.length}</h2>
          <small>Pelanggan terdaftar</small>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon green">
            <ShoppingBag size={20} />
          </div>
          <span>Pelanggan Aktif</span>
          <h2>
            {customerStats.filter((customer) => customer.totalOrders > 0).length}
          </h2>
          <small>Pernah melakukan transaksi</small>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon orange">
            <Wallet size={20} />
          </div>
          <span>Total Penjualan</span>
          <h2>{formatRupiah(totalRevenue)}</h2>
          <small>Dari transaksi pelanggan</small>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon blue">
            <ShoppingBag size={20} />
          </div>
          <span>Total Transaksi</span>
          <h2>{orders.length}</h2>
          <small>Seluruh transaksi tercatat</small>
        </div>
      </div>

      <div className="customer-content">
        <section className="panel customer-list-panel">
          <div className="customer-panel-heading">
            <div>
              <h3>Daftar Pelanggan</h3>
              <p>Informasi seluruh pelanggan usaha Anda.</p>
            </div>
            <span className="customer-count">
              {filteredCustomers.length} Pelanggan
            </span>
          </div>

          <div className="customer-toolbar">
            <div className="customer-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, nomor telepon, atau email..."
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>Semua</option>
              <option>Pernah Transaksi</option>
              <option>Belum Transaksi</option>
            </select>
          </div>

          <div className="customer-table-wrap">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Nama Pelanggan</th>
                  <th>Kontak</th>
                  <th>Total Transaksi</th>
                  <th>Total Belanja</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="customer-empty">
                      Tidak ada pelanggan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className={
                        selectedCustomer?.id === customer.id
                          ? "selected-customer-row"
                          : ""
                      }
                    >
                      <td>
                        <button
                          className="customer-name-button"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <span className="customer-avatar">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                          <span>
                            <strong>{customer.name}</strong>
                            <small>{customer.address || "Alamat belum diisi"}</small>
                          </span>
                        </button>
                      </td>

                      <td>
                        <span>{customer.phone}</span>
                        <small className="customer-email">
                          {customer.email || "-"}
                        </small>
                      </td>

                      <td>{customer.totalOrders} transaksi</td>

                      <td>
                        <strong>{formatRupiah(customer.totalSpent)}</strong>
                      </td>

                      <td>
                        <div className="customer-actions">
                          <button
                            title="Detail pelanggan"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <MoreHorizontal size={17} />
                          </button>
                          <button
                            title="Edit pelanggan"
                            onClick={() => openEditForm(customer)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title="Hapus pelanggan"
                            onClick={() => deleteCustomer(customer)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="panel customer-detail-panel">
          {selectedCustomer ? (
            <>
              <div className="customer-detail-heading">
                <h3>Detail Pelanggan</h3>
                <button onClick={() => setSelectedCustomer(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="customer-detail-profile">
                <div className="customer-detail-avatar">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <h3>{selectedCustomer.name}</h3>
                <span>Pelanggan UMKM-Builder</span>
              </div>

              <div className="customer-contact-info">
                <div>
                  <Phone size={16} />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div>
                  <Mail size={16} />
                  <span>{selectedCustomer.email || "-"}</span>
                </div>
                <div>
                  <CalendarDays size={16} />
                  <span>{selectedCustomer.address || "Alamat belum diisi"}</span>
                </div>
              </div>

              <div className="customer-detail-summary">
                <div>
                  <span>Total Transaksi</span>
                  <strong>{selectedOrders.length}</strong>
                </div>
                <div>
                  <span>Total Belanja</span>
                  <strong>
                    {formatRupiah(
                      selectedOrders.reduce(
                        (sum, order) => sum + Number(order.total || 0),
                        0
                      )
                    )}
                  </strong>
                </div>
              </div>

              <div className="customer-history">
                <h4>Riwayat Transaksi</h4>

                {selectedOrders.length === 0 ? (
                  <p className="customer-empty-history">
                    Belum ada transaksi dengan pelanggan ini.
                  </p>
                ) : (
                  selectedOrders.map((order, index) => (
                    <div className="customer-history-item" key={order.id || index}>
                      <div>
                        <strong>{order.product}</strong>
                        <small>{order.date}</small>
                      </div>
                      <strong>{formatRupiah(order.total)}</strong>
                    </div>
                  ))
                )}
              </div>

              <a
                className="customer-whatsapp-btn"
                href={`https://wa.me/${selectedCustomer.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} />
                Hubungi via WhatsApp
              </a>
            </>
          ) : (
            <div className="customer-detail-empty">
              <div>
                <Users size={30} />
              </div>
              <h3>Detail Pelanggan</h3>
              <p>Pilih pelanggan dari daftar untuk melihat informasi dan riwayat transaksinya.</p>
            </div>
          )}
        </aside>
      </div>

      {showForm && (
        <div className="customer-modal-overlay">
          <form className="customer-modal" onSubmit={handleSubmit}>
            <div className="customer-modal-heading">
              <div>
                <h3>{editingCustomer ? "Edit Pelanggan" : "Tambah Pelanggan"}</h3>
                <p>Lengkapi informasi pelanggan di bawah ini.</p>
              </div>
              <button type="button" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <label>
              Nama Lengkap *
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Masukkan nama pelanggan"
                required
              />
            </label>

            <label>
              Nomor Telepon *
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="Contoh: 081234567890"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="nama@email.com"
              />
            </label>

            <label>
              Alamat
              <input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                placeholder="Masukkan alamat pelanggan"
              />
            </label>

            <div className="customer-modal-actions">
              <button
                type="button"
                className="customer-cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Batal
              </button>
              <button type="submit" className="customer-primary-btn">
                {editingCustomer ? "Simpan Perubahan" : "Simpan Pelanggan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Customers;
