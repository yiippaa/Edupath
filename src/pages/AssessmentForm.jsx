import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAssessment } from "../context/AssessmentContext";

function AssessmentForm() {
  const navigate = useNavigate();
  const { academicData, setAcademicData } = useAssessment();
  const subjects = [
    "Matematika",
    "Fisika",
    "Kimia",
    "Biologi",
    "Sejarah",
    "Geografi",
    "Bahasa Inggris",
  ];

  const [grades, setGrades] = useState(() => {
    if (academicData && Object.keys(academicData).length > 0) {
      return academicData;
    }
    return subjects.reduce((acc, subject) => {
      acc[subject] = "";
      return acc;
    }, {});
  });

  const [errors, setErrors] = useState({});

  // State untuk inisial profil
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto", // Ubah menjadi "auto" jika tidak ingin ada animasi gulir
    });
  }, []);

  // Mengambil nama dari localStorage
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

  const handleGradeChange = (subject, value) => {
    setGrades((prev) => ({ ...prev, [subject]: value }));

    const numValue = Number(value);
    if (value !== "" && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
      setErrors((prev) => ({
        ...prev,
        [subject]: "Value must be between 0 and 100",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [subject]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((err) => err !== null);
    if (hasErrors) {
      alert("Mohon perbaiki nilai yang salah sebelum melanjutkan.");
      return;
    }

    console.log("Data Nilai:", grades);
    setAcademicData(grades);
    navigate("/assessment/step2");
  };

  const inputRefs = useRef([]);
  const submitRef = useRef(null);

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown") {
      e.preventDefault(); // Mencegah scrolling halaman
      if (index < subjects.length - 1) {
        // Pindah ke input berikutnya
        inputRefs.current[index + 1]?.focus();
      } else {
        // Jika di input terakhir, pindah ke tombol submit
        submitRef.current?.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index > 0) {
        // Pindah ke input sebelumnya
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmitKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      // Pindah kembali ke input terakhir
      inputRefs.current[subjects.length - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* HEADER NAVIGASI */}
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out border-b border-slate-200">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex-1 flex items-center">
            <button
              onClick={() => navigate("/onboarding")}
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
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-h2 text-h2 text-primary tracking-tight font-bold text-center text-xl cursor-pointer hover:opacity-80 transition-opacity"
          >
            EduPath
          </button>
          <div className="flex-1 flex justify-end">
            <div
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:bg-blue-700 transition"
              title="Lihat Profil"
            >
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 flex justify-center">
        <div className="bg-white w-full max-w-3xl rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-2 text-sm font-medium text-slate-600">
              <span>Langkah 1: Data Akademik</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-slate-800 mb-2">
              Penilaian Akademik
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Silakan masukkan nilai rata-rata Anda (0-100) untuk mata pelajaran
              berikut agar kami dapat menganalisis profil akademik Anda.
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Tambahkan parameter index di sini */}
              {subjects.map((subject, index) => {
                const isError = errors[subject];

                return (
                  <div key={subject} className="flex flex-col">
                    <label className="text-sm font-medium text-slate-700 mb-2">
                      {subject}
                    </label>
                    <div className="relative">
                      <input
                        // --- TAMBAHKAN REF DAN ONKEYDOWN DI SINI ---
                        ref={(el) => (inputRefs.current[index] = el)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        // -------------------------------------------
                        type="number"
                        placeholder="0-100"
                        required
                        value={grades[subject]}
                        onChange={(e) =>
                          handleGradeChange(subject, e.target.value)
                        }
                        className={`w-full border rounded-lg p-3 outline-none transition-all focus:ring-offset-1 ${
                          isError
                            ? "border-red-400 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-200"
                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                      />
                      {/* Error Icon */}
                      {isError && (
                        <svg
                          className="w-5 h-5 text-red-500 absolute right-3 top-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    {/* Error Message Text */}
                    {isError && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">
                        {isError}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                ref={submitRef}
                onKeyDown={handleSubmitKeyDown}
                type="submit"
                disabled={
                  Object.values(errors).some((err) => err !== null) ||
                  Object.values(grades).some((val) => val === "")
                }
                className={`text-white font-semibold py-3 px-8 rounded-lg shadow-md transition flex items-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  Object.values(errors).some((err) => err !== null) ||
                  Object.values(grades).some((val) => val === "")
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#0d5abe] hover:bg-blue-800"
                }`}
              >
                Selanjutnya
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
          </form>
        </div>
      </main>
    </div>
  );
}

export default AssessmentForm;
