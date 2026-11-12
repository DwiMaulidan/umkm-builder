
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Store, Mail, LockKeyhole, Eye, EyeOff,
  ArrowRight, ShieldCheck, AlertCircle
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};

    if (!form.email.trim()) {
      err.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = "Format email tidak valid.";
    }

    if (!form.password) {
      err.password = "Password wajib diisi.";
    }

    setErrors(err);
    setMessage("");

    if (Object.keys(err).length === 0) {
      setMessage("Form valid. Login akan tersedia setelah backend terhubung.");
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border bg-[#f0f4ff] py-3 pl-10 pr-11 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 ${
      errors[field] ? "border-red-400" : "border-transparent"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fd] p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2">

        <div className="hidden flex-col justify-between bg-[#0f8178] p-10 text-white lg:flex">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-3 text-teal-700">
              <Store size={25}/>
            </div>
            <div>
              <h1 className="text-xl font-bold">UMKM-Builder</h1>
              <p className="text-xs text-teal-100">PLATFORM OPERASIONAL UMKM</p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Kelola usaha lebih mudah dalam satu platform.
            </h2>
            <p className="mt-5 text-sm leading-7 text-teal-50">
              Kelola transaksi, produk, stok, pelanggan,
              laporan, dan workflow bisnis secara terintegrasi.
            </p>
          </div>

          <p className="text-xs text-teal-100">
            © 2026 UMKM-Builder
          </p>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">

            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <Store className="text-teal-700" size={30}/>
              <strong className="text-xl">UMKM-Builder</strong>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Selamat datang kembali
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Masuk ke Akun
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Masukkan email dan password untuk melanjutkan.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3 top-3.5 text-slate-400"/>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({...form, email: e.target.value});
                      setErrors({...errors, email: ""});
                      setMessage("");
                    }}
                    placeholder="nama@email.com"
                    className={inputClass("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={13}/> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole size={17} className="absolute left-3 top-3.5 text-slate-400"/>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => {
                      setForm({...form, password: e.target.value});
                      setErrors({...errors, password: ""});
                      setMessage("");
                    }}
                    placeholder="Masukkan password"
                    className={inputClass("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMessage("Fitur lupa password akan tersedia setelah backend terhubung.")}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  Lupa password?
                </button>
              </div>

              {message && (
                <div className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm text-teal-800">
                  {message}
                </div>
              )}

              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f8178] py-3.5 text-sm font-bold text-white hover:bg-teal-800">
                Masuk <ArrowRight size={17}/>
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Belum memiliki akun?{" "}
              <Link to="/register" className="font-bold text-teal-700 hover:underline">
                Daftar sekarang
              </Link>
            </p>

            <div className="mt-8 flex justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={15}/> Platform operasional UMKM-Builder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
