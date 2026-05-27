import React, { useState, useEffect } from "react";
import icon from "../assets/education.png";

function OnboardingPage({ onNext, onBack, onProfileClick }) {
  const subjects = [
    "Matematika",
    "Fisika",
    "Kimia",
    "Biologi",
    "Sejarah",
    "Geografi",
    "Bahasa Inggris",
  ];

  // State untuk inisial profil
  const [initials, setInitials] = useState("U");

  // Mengambil nama dari localStorage untuk dijadikan inisial (misal: Ivan Kolap -> IK)
  useEffect(() => {
    const fullName = localStorage.getItem("user_name");
    if (fullName) {
      const nameParts = fullName.trim().split(" ");
      const ini =
        nameParts.length > 1
          ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
          : nameParts[0][0].toUpperCase();
      setInitials(ini);
    }
  }, []);

  const subjectIcons = {
    Matematika: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        ></path>
      </svg>
    ),
    Fisika: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="3"
          strokeWidth="2"
          transform="rotate(45 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="3"
          strokeWidth="2"
          transform="rotate(-45 12 12)"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    Kimia: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        ></path>
      </svg>
    ),
    Biologi: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4c6 0 10 4 10 10s-4 10-10 10m16-20c-6 0-10 4-10 10s4 10 10 10M8 8h8M8 16h8"
        />
      </svg>
    ),
    Sejarah: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ),
    Geografi: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ),
    "Bahasa Inggris": (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        ></path>
      </svg>
    ),
  };

  const handleSubmit = () => {
    if (onNext) onNext();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* HEADER NAVIGASI */}
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out border-b border-slate-200">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex-1 flex items-center">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition font-semibold"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          </div>
          <div className="font-h2 text-h2 text-blue-700 tracking-tight font-bold text-center text-xl">
            EduPath
          </div>
          <div className="flex-1 flex justify-end">
            <div
              onClick={onProfileClick}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:bg-blue-700 transition"
              title="Lihat Profil"
            >
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="flex-1 flex justify-center items-center py-12 px-4">
        <div className="bg-white max-w-3xl w-full rounded-2xl shadow-xl overflow-hidden mt-0">
          <div className="relative bg-slate-200 h-48 flex items-center justify-center">
            <div className="absolute inset-0 bg-linear-to-r from-[#325afa] to-[#e6d5c3] opacity-80"></div>
            <div className="relative z-10 flex flex-col items-center mt-6">
              <div className="bg-white p-3 rounded-full shadow-md mb-2">
                <img
                  src={icon}
                  alt="EduPath Illustration"
                  className="w-10 h-10"
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 px-4 lg:px-0 text-center">
                Selamat Datang di EduPath
              </h1>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <p className="text-center text-slate-600 mb-8 leading-relaxed">
              Mari kita temukan jalur karir yang paling tepat untukmu. Untuk
              memulai analisis yang akurat, pastikan kamu telah menyiapkan
              dokumen berikut.
            </p>

            <div className="border border-slate-200 rounded-xl p-6 mb-6">
              <h2 className="flex items-center text-lg font-bold text-slate-800 mb-5">
                <span className="text-blue-600 mr-2">✓</span> Siapkan Nilai
                Rapor
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {subjects.map((subject, index) => {
                  return (
                    <div key={index} className="flex items-start select-none">
                      <div className="w-8 h-8 rounded-lg mt-0.5 mr-3 flex items-center justify-center border bg-blue-50 border-blue-200 text-blue-600">
                        {subjectIcons[subject]}
                      </div>

                      <div>
                        <p className="font-semibold text-sm text-slate-800">
                          {subject}
                        </p>
                        <p className="text-xs text-slate-400">Semester 1 - 5</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#eff6ff] border border-blue-100 rounded-xl p-5 flex items-start mb-8">
              <div className="text-blue-600 mt-0.5 mr-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-1">
                  Privasi Terjamin
                </h3>
                <p className="text-xs text-blue-800/80 leading-relaxed">
                  Data nilaimu hanya digunakan untuk keperluan analisis AI dan
                  tidak akan dibagikan kepada pihak ketiga. Proses ini
                  sepenuhnya aman dan rahasia.
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#0d5abe] hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-md transition flex justify-center items-center"
            >
              Saya Siap, Mulai Isi Data
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* CSS untuk Animasi */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loadingBar {
          0% { width: 0%; left: 0%; }
          50% { width: 40%; left: 30%; }
          100% { width: 100%; left: 0%; }
        }
        .animate-loadingBar {
          animation: loadingBar 2s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </div>
  );
}

export default OnboardingPage;
