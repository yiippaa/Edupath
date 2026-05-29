import React, { useState } from "react";
import iconLogin from "../assets/login.png";

function Login({ onLoginSuccess, onNavigateRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(
        "https://edupath-backend.vercel.app/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );

      const result = await response.json();

      if (!result.success) {
        let errorMessage = "Terjadi kesalahan sistem.";
        if (
          result.error?.code === "VALIDATION_ERROR" &&
          Array.isArray(result.error.details)
        ) {
          errorMessage = result.error.details
            .map((err) => err.message)
            .join(", ");
        } else if (typeof result.error?.details === "string") {
          errorMessage = result.error.details;
        } else if (result.message) {
          errorMessage = result.message;
        }
        throw new Error(errorMessage);
      }

      const token = result.data?.access_token;
      const userData = result.data?.user;

      if (token) {
        localStorage.setItem("user_token", token);
        if (userData?.full_name)
          localStorage.setItem("user_name", userData.full_name);
        if (userData?.school_name)
          localStorage.setItem("user_school", userData.school_name);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        throw new Error("Gagal mendapatkan akses token dari server.");
      }
    } catch (error) {
      setErrorMsg(error.message);
      // Matikan loading HANYA JIKA ERROR. Jika sukses, biarkan berputar sampai pindah halaman.
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); // Mencegah kursor melompat ke awal/akhir teks
      const form = e.target.closest("form");
      const inputs = Array.from(form.querySelectorAll("input"));
      const index = inputs.indexOf(e.target);

      if (e.key === "ArrowDown" && index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else if (e.key === "ArrowUp" && index > 0) {
        inputs[index - 1].focus();
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans text-slate-800 bg-slate-100 p-4 sm:p-8 relative">
      {/* OVERLAY LOADING FULL SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md animate-fadeIn">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-5 shadow-lg"></div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">
            Sedang Masuk...
          </h2>
          <p className="text-slate-500 font-medium">
            Memverifikasi data otentikasi Anda
          </p>
        </div>
      )}

      {/* KARTU UTAMA */}
      <div className="bg-white w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden min-h-150">
        {/* SISI KIRI: Form Login */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center relative">
          <div className="absolute top-6 left-6 md:top-8 md:left-8">
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-blue-600 font-bold flex items-center transition text-sm"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Kembali
            </button>
          </div>

          <div className="mt-8">
            <div className="mb-8 relative inline-block">
              <h2 className="text-3xl font-bold text-slate-900">Masuk</h2>
              <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full"></div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-6 border border-red-100 font-medium flex items-start">
                <svg
                  className="w-4 h-4 mr-2 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown} // <--- TAMBAHKAN DI SINI
                  placeholder="Email (budi@example.com)"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-slate-50 focus:bg-white text-sm"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown} // <--- TAMBAHKAN DI SINI
                  placeholder="Password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-slate-50 focus:bg-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 focus:outline-none transition"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-bold py-3.5 rounded-xl shadow-md transition mt-2 text-sm ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isLoading ? "Memproses..." : "Masuk Sekarang"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-500">
              Belum punya akun?{" "}
              <button
                onClick={onNavigateRegister}
                className="text-blue-600 hover:text-blue-800 hover:underline font-bold transition"
              >
                Daftar di sini
              </button>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Gambar Ilustrasi */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 text-center overflow-hidden bg-transparent">
          <img
            src={iconLogin}
            alt="login icon"
            className="absolute inset-auto w-auto h-auto"
          />
          <div className="absolute inset-0 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-linear-to-t from-indigo-900/90 to-transparent z-10"></div>

          <div className="relative z-20 space-y-4">
            <h3 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
              Senang bertemu
              <br />
              kembali!
            </h3>
            <p className="text-blue-100 text-lg font-medium">
              Lanjutkan petualangan pendidikanmu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
