import React, { useState, useEffect, useRef } from "react";
// IMPORT FETCH OTOMATIS & LOADING PAGE
import { fetchWithAuth } from "../Utils/auth";

function PsychometricForm({
  onBack,
  academicData,
  onSubmitSuccess,
  onProfileClick,
  savedBehavioral,
  onSaveBehavioral,
}) {
  const [studyHours, setStudyHours] = useState(
    savedBehavioral?.studyHours ?? 10,
  );
  const [absentDays, setAbsentDays] = useState(
    savedBehavioral?.absentDays ?? "",
  );
  const [partTimeJob, setPartTimeJob] = useState(
    savedBehavioral?.partTimeJob ?? "No",
  );
  const [extracurricular, setExtracurricular] = useState(
    savedBehavioral?.extracurricular ?? "No",
  );

  const [isLoading, setIsLoading] = useState(false);

  const [initials, setInitials] = useState("U");

  const [progress, setProgress] = useState(0); // State untuk persentase progress
  const [loadingText, setLoadingText] = useState(""); // State untuk teks informasi

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto", // Ubah menjadi "auto" jika tidak ingin ada animasi gulir
    });
  }, []);

  const handleGoBack = (target) => {
    // 1. Simpan data yang sedang diisi ke App.jsx sebelum pindah
    if (onSaveBehavioral) {
      onSaveBehavioral({
        studyHours,
        absentDays,
        partTimeJob,
        extracurricular,
      });
    }
    // 2. Eksekusi perpindahan halaman
    if (onBack) onBack(target);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // <--- INI AKAN MEMICU LOADING PAGE MUNCUL

    const payload = {
      math_score: Number(academicData?.["Matematika"] ?? 92),
      physics_score: Number(academicData?.["Fisika"] ?? 60),
      chemistry_score: Number(academicData?.["Kimia"] ?? 78),
      biology_score: Number(academicData?.["Biologi"] ?? 72),
      history_score: Number(academicData?.["Sejarah"] ?? 65),
      english_score: Number(academicData?.["Bahasa Inggris"] ?? 95),
      geography_score: Number(academicData?.["Geografi"] ?? 65),

      weekly_self_study_hours: Number(studyHours),
      absence_days: Number(absentDays),

      part_time_job: partTimeJob === "Yes",
      extracurricular: extracurricular === "Yes",
    };

    console.log("Data siap dikirim ke backend:", payload);

    try {
      const API_URL = "https://edupath-backend.vercel.app/api/v1";

      // 1. Submit Assessment (MENGGUNAKAN fetchWithAuth)
      setProgress(30);
      setLoadingText("Menyimpan data assessment akademik...");
      const assessRes = await fetchWithAuth(`${API_URL}/assessments`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!assessRes.ok) throw new Error("Gagal submit assessment");
      const assessData = await assessRes.json();
      const assessmentId = assessData.data.assessment_id;

      // 2. Generate Prediction (MENGGUNAKAN fetchWithAuth)
      setProgress(60);
      setLoadingText("AI sedang menganalisis kecocokan jurusan...");
      const predictRes = await fetchWithAuth(
        `${API_URL}/recommendations/predict`,
        {
          method: "POST",
          body: JSON.stringify({ assessment_id: assessmentId }),
        },
      );
      if (!predictRes.ok) throw new Error("Gagal memicu AI prediction");
      const predictData = await predictRes.json();
      const recommendationId = predictData.data.recommendation_id;

      // 3. Get Recommendation Details (MENGGUNAKAN fetchWithAuth)
      setProgress(90);
      setLoadingText("Mengambil detail rekomendasi Anda...");
      const resultRes = await fetchWithAuth(
        `${API_URL}/recommendations/${recommendationId}`,
      );
      if (!resultRes.ok) throw new Error("Gagal mengambil detail hasil");
      const finalResult = await resultRes.json();

      setProgress(100);
      setLoadingText("Selesai! Mengalihkan ke halaman hasil...");

      setTimeout(() => {
        if (onSubmitSuccess) onSubmitSuccess(finalResult, payload);
      }, 1000);
    } catch (error) {
      console.warn("API Backend gagal. Menggunakan simulasi lokal.");

      // Setup Simulasi Loading Bertahap
      setProgress(20);
      setLoadingText("Memulai simulasi AI lokal...");

      let currentProgress = 20;
      const progressInterval = setInterval(() => {
        currentProgress += 15;
        if (currentProgress <= 90) {
          setProgress(currentProgress);
          if (currentProgress > 40)
            setLoadingText("Memproses profil kognitif...");
          if (currentProgress > 70)
            setLoadingText("Mencocokkan jalur karir...");
        }
      }, 500); // Bertambah setiap 0.5 detik

      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setLoadingText("Simulasi selesai! Menampilkan hasil...");

        const mockAPIResponse = {
          success: true,
          data: {
            user_details: {
              full_name: localStorage.getItem("user_name") || "Siswa",
              school_name:
                localStorage.getItem("user_school") || "Telkom University",
            },
            ai_summary:
              "Berdasarkan simulasi lokal, profil Anda menunjukkan determinasi belajar yang sangat baik.",
            ai_explanation: {
              alasan: `Simulasi menyimpulkan nilai Matematika (${payload.math_score}) dan Fisika (${payload.physics_score}) sangat krusial.`,
              kekuatan: `Kekuatan utama pada nilai Bahasa Inggris (${payload.english_score}).`,
              saran: `Pertahankan jam belajar mandiri yang tinggi.`,
              referensi: [
                {
                  title: "Simulasi EduPath",
                  url: "#",
                  keterangan: "Data dummy",
                },
              ],
            },
            cognitive_profile: [
              { subject: "Logika & Analitik", value: payload.math_score },
              { subject: "Literasi Sains", value: payload.physics_score },
              { subject: "Wawasan Sosial", value: payload.history_score },
              { subject: "Komunikasi Verbal", value: payload.english_score },
              { subject: "Manajemen Diri", value: 90 },
              {
                subject: "Interpersonal",
                value: payload.extracurricular ? 95 : 70,
              },
            ],
            career_matches: [
              {
                rank: 1,
                confidence_score: 95,
                career_name: "Simulasi Data Scientist",
                description: "Ini adalah simulasi.",
                related_majors: [{ major_name: "Sains Data" }],
              },
            ],
          },
        };
        setTimeout(() => {
          if (onSubmitSuccess) onSubmitSuccess(mockAPIResponse, payload);
          setIsLoading(false);
        }, 800);
      }, 3500);
    }
  };

  // Referensi untuk masing-masing blok input
  const studyRef = useRef(null);
  const absentRef = useRef(null);
  const jobRef = useRef(null);
  const extraRef = useRef(null);
  const submitRef = useRef(null);

  const blockRefs = [studyRef, absentRef, jobRef, extraRef, submitRef];

  // Fungsi pengelola perpindahan fokus
  const handleArrowNavigation = (e, currentIndex) => {
    if (e.key === "ArrowDown") {
      e.preventDefault(); // Mencegah layar ikut ter-scroll
      const nextIndex = Math.min(currentIndex + 1, blockRefs.length - 1);
      blockRefs[nextIndex].current?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = Math.max(currentIndex - 1, 0);
      blockRefs[prevIndex].current?.focus();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100 transition-all">
          <div className="flex justify-center mb-6">
            {/* Animasi Spinner Kecil */}
            <svg
              className="w-12 h-12 text-blue-600 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Memproses Data
          </h2>
          <p className="text-slate-500 text-sm mb-8 h-5 font-medium">
            {loadingText}
          </p>

          <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden relative">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="text-right text-sm font-bold text-blue-600">
            {progress}%
          </div>
        </div>
      </div>
    );
  }

  // Tampilan Form Utama (hanya akan dirender jika isLoading === false)
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out border-b border-slate-200">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex-1 flex items-center">
            <button
              onClick={() => handleGoBack("step1")}
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

      <main className="flex-1 flex justify-center py-12 px-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="mb-10">
            <div className="flex justify-between items-end mb-2 text-sm font-medium text-slate-600">
              <span>Langkah 2: Psikometri & Kebiasaan</span>
            </div>
            <div className="w-full bg-blue-600 rounded-full h-1.5 relative"></div>
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-bold text-slate-800 mb-2">
              Profil Perilaku
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Bantu kami memahami kebiasaan belajar dan rutinitas harian Anda
              untuk menghasilkan rekomendasi yang lebih akurat.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-slate-700">
                  Jam belajar mandiri (mingguan)
                </label>
                <span className="text-sm font-bold text-blue-600">
                  {studyHours} jam
                </span>
              </div>
              <input
                ref={studyRef}
                type="range"
                min="0"
                max="40"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                onKeyDown={(e) => handleArrowNavigation(e, 0)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>0</span>
                <span>40+</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jumlah absen / tidak hadir (Semester Ini)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <input
                  ref={absentRef}
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 2"
                  value={absentDays}
                  onChange={(e) => setAbsentDays(e.target.value)}
                  onKeyDown={(e) => handleArrowNavigation(e, 1)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div
              ref={jobRef}
              tabIndex={0}
              onKeyDown={(e) => {
                handleArrowNavigation(e, 2);
                // Shortcut untuk memilih jawaban dengan panah Kiri/Kanan
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  setPartTimeJob("Yes");
                }
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  setPartTimeJob("No");
                }
              }}
              className="mb-8 outline-none focus:ring-2 focus:ring-blue-200 rounded-xl p-2 -mx-2 transition-all"
            >
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Apakah Anda saat ini memiliki pekerjaan paruh waktu?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPartTimeJob("Yes")}
                  className={`flex items-center p-3 border rounded-lg transition-all ${
                    partTimeJob === "Yes"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                      partTimeJob === "Yes"
                        ? "border-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {partTimeJob === "Yes" && (
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${partTimeJob === "Yes" ? "text-blue-800" : "text-slate-600"}`}
                  >
                    Ya
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPartTimeJob("No")}
                  className={`flex items-center p-3 border rounded-lg transition-all ${
                    partTimeJob === "No"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                      partTimeJob === "No"
                        ? "border-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {partTimeJob === "No" && (
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${partTimeJob === "No" ? "text-blue-800" : "text-slate-600"}`}
                  >
                    Tidak
                  </span>
                </button>
              </div>
            </div>

            <div
              ref={extraRef}
              tabIndex={0}
              onKeyDown={(e) => {
                handleArrowNavigation(e, 3);
                // Shortcut untuk memilih jawaban dengan panah Kiri/Kanan
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  setExtracurricular("Yes");
                }
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  setExtracurricular("No");
                }
              }}
              className="mb-12 outline-none focus:ring-2 focus:ring-blue-200 rounded-xl p-2 -mx-2 transition-all"
            >
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Apakah Anda aktif mengikuti kegiatan ekstrakurikuler?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setExtracurricular("Yes")}
                  className={`flex items-center p-3 border rounded-lg transition-all ${
                    extracurricular === "Yes"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                      extracurricular === "Yes"
                        ? "border-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {extracurricular === "Yes" && (
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${extracurricular === "Yes" ? "text-blue-800" : "text-slate-600"}`}
                  >
                    Ya
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setExtracurricular("No")}
                  className={`flex items-center p-3 border rounded-lg transition-all ${
                    extracurricular === "No"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                      extracurricular === "No"
                        ? "border-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {extracurricular === "No" && (
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${extracurricular === "No" ? "text-blue-800" : "text-slate-600"}`}
                  >
                    Tidak
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                ref={submitRef}
                type="submit"
                disabled={isLoading || absentDays === ""}
                onKeyDown={(e) => handleArrowNavigation(e, 4)}
                className={`font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
                  isLoading || absentDays === ""
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#0f763b] hover:bg-green-800"
                }`}
              >
                Analisis Data
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
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

export default PsychometricForm;
