
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Store, User, Building2, Mail, LockKeyhole,
  Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2
} from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    ownerName: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");

  const update = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({ ...errors, [name]: "" });
    setMessage("");
  };

  const validate = () => {
    const err = {};

    if (!form.ownerName.trim())
      err.ownerName = "Nama pemilik wajib diisi.";

    if (!form.businessName.trim())
      err.businessName = "Nama usaha wajib diisi.";

    if (!form.email.trim()) {
      err.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = "Format email tidak valid.";
    }

    if (!form.password) {
      err.password = "Password wajib diisi.";
    } else if (form.password.length < 8) {
      err.password = "Password minimal 8 karakter.";
    } else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password)) {
      err.password = "Password harus memiliki huruf besar dan kecil.";
    } else if (!/[0-9]/.test(form.password)) {
      err.password = "Password harus mengandung angka.";
    }

    if (!form.confirmPassword) {
      err.confirmPassword = "Konfirmasi password wajib diisi.";
    } else if (form.confirmPassword !== form.password) {
      err.confirmPassword = "Konfirmasi password tidak sama.";
    }

    if (!form.terms)
      err.terms = "Kamu harus menyetujui syarat dan ketentuan.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setMessage(
      "Data berhasil divalidasi. Pendaftaran akun akan aktif setelah backend terhubung."
    );
  };

  const inputClass = (field) =>
    `w-full rounded-lg border bg-[#f0f4ff] py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 ${
      errors[field] ? "border-red-400" : "border-transparent"
    }`;

  const passwordRules = [
    ["Minimal 8 karakter", form.password.length >= 8],
    ["Huruf besar dan kecil", /[a-z]/.test(form.password) && /[A-Z]/.test(form.password)],
    ["Mengandung angka", /[0-9]/.test(form.password)],
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fd] px-4 py-8">
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
              Mulai perjalanan bisnis bersama kami.
            </h2>
            <p className="mt-5 text-sm leading-7 text-teal-50">
              Daftarkan usaha kamu dan nikmati kemudahan
              pengelolaan bisnis dalam satu platform.
            </p>
            <div className="mt-8 space-y-4 text-sm">
              {[
                "Kelola bisnis dari satu dashboard",
                "Pantau transaksi dan stok",
                "Kembangkan operasional usaha",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={18}/> {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-teal-100">© 2026 UMKM-Builder</p>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">

            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <Store size={30} className="text-teal-700"/>
              <strong className="text-xl">UMKM-Builder</strong>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Bergabung bersama kami
            </span>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Buat Akun Baru
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Daftarkan usaha kamu untuk mulai menggunakan UMKM-Builder.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">

              {[
                {
                  name: "ownerName",
                  label: "Nama Pemilik Usaha",
                  placeholder: "Contoh: Budi Santoso",
                  icon: User,
                  type: "text",
                },
                {
                  name: "businessName",
                  label: "Nama Usaha",
                  placeholder: "Contoh: Depot Rasa Nusantara",
                  icon: Building2,
                  type: "text",
                },
                {
                  name: "email",
                  label: "Email",
                  placeholder: "nama@email.com",
                  icon: Mail,
                  type: "email",
                },
              ].map((field) => {
                const Icon = field.icon;

                return (
                  <div key={field.name}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Icon size={17} className="absolute left-3 top-3.5 text-slate-400"/>
                      <input
                        name={field.name}
                        type={field.type}
                        value={form[field.name]}
                        onChange={update}
                        placeholder={field.placeholder}
                        className={inputClass(field.name)}
                      />
                    </div>
                    {errors[field.name] && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                );
              })}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole size={17} className="absolute left-3 top-3.5 text-slate-400"/>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={update}
                    placeholder="Buat password"
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

                {form.password && (
                  <div className="mt-2 space-y-1 rounded-lg bg-[#f7f8fd] p-3">
                    {passwordRules.map(([label, valid]) => (
                      <p key={label} className={`flex items-center gap-2 text-xs ${
                        valid ? "text-green-600" : "text-slate-400"
                      }`}>
                        <CheckCircle2 size={13}/> {label}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <LockKeyhole size={17} className="absolute left-3 top-3.5 text-slate-400"/>
                  <input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={update}
                    placeholder="Ulangi password"
                    className={inputClass("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-slate-400"
                  >
                    {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={update}
                    className="mt-1 accent-teal-700"
                  />
                  Saya menyetujui syarat dan ketentuan serta kebijakan privasi UMKM-Builder.
                </label>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-600">{errors.terms}</p>
                )}
              </div>

              {message && (
                <div className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm text-teal-800">
                  {message}
                </div>
              )}

              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f8178] py-3.5 text-sm font-bold text-white hover:bg-teal-800">
                Daftar Sekarang <ArrowRight size={17}/>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Sudah memiliki akun?{" "}
              <Link to="/login" className="font-bold text-teal-700 hover:underline">
                Login di sini
              </Link>
            </p>

            <div className="mt-7 flex justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={15}/> Platform operasional UMKM-Builder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
