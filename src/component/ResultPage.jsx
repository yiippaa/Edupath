import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { fetchWithAuth } from "../Utils/auth";

function ResultPage({
  onRetry,
  onBack,
  resultData,
  academicData,
  behavioralData,
}) {
  const finalData = resultData?.data || resultData;

  const [openAccordion, setOpenAccordion] = useState("alasan");
  const [showAllCareers, setShowAllCareers] = useState(false);

  // STATE DATA USER
  const [userData, setUserData] = useState({
    full_name: localStorage.getItem("user_name") || "Siswa",
    school_name:
      localStorage.getItem("user_school") || "Sekolah Tidak Diketahui",
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto", // Ubah menjadi "auto" jika tidak ingin ada animasi gulir
    });
  }, []);

  const getMatchText = (score) => {
    if (score >= 90) return "Sangat Direkomendasikan";
    if (score >= 80) return "Sangat Cocok";
    if (score >= 70) return "Pilihan Potensial";
    return "Layak Dieksplorasi";
  };

  // FETCH DATA PROFIL MENGGUNAKAN fetchWithAuth
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) return;

        // Pemanggilan API
        const response = await fetchWithAuth(
          "https://edupath-backend.vercel.app/api/v1/profiles/me",
        );
        const result = await response.json();

        if (result.success && result.data) {
          setUserData({
            full_name: result.data.full_name || "Siswa",
            school_name: result.data.school_name || "Sekolah Tidak Diketahui",
          });

          localStorage.setItem("user_name", result.data.full_name);
          localStorage.setItem("user_school", result.data.school_name);
        }
      } catch (error) {
        console.error("Gagal menarik data profil di Result Page:", error);
      }
    };

    fetchLatestProfile();
  }, []);

  const fullName =
    finalData?.user_details?.full_name ||
    finalData?.user?.full_name ||
    userData.full_name;
  const schoolName =
    finalData?.user_details?.school_name ||
    finalData?.user?.school_name ||
    userData.school_name;

  const aiSummary =
    finalData?.ai_summary ||
    "Berdasarkan analisis AI, kamu memiliki potensi besar.";
  const aiExplanation = finalData?.ai_explanation || {};
  const alasanText =
    aiExplanation.alasan || "Data alasan belum tersedia dari AI.";
  const kekuatanText =
    aiExplanation.kekuatan || "Data kekuatan belum tersedia dari AI.";
  const saranText =
    aiExplanation.saran || "Data saran pengembangan belum tersedia dari AI.";
  const referensiList = aiExplanation.referensi || [];

  const careers = finalData?.career_matches || [];

  const radarData = useMemo(
    () => [
      {
        subject: `Math (${Number(academicData?.["Matematika"]) || 0})`,
        A: Number(academicData?.["Matematika"]) || 0,
        fullMark: 100,
      },
      {
        subject: `English (${Number(academicData?.["Bahasa Inggris"]) || 0})`,
        A: Number(academicData?.["Bahasa Inggris"]) || 0,
        fullMark: 100,
      },
      {
        subject: `Geography (${Number(academicData?.["Geografi"]) || 0})`,
        A: Number(academicData?.["Geografi"]) || 0,
        fullMark: 100,
      },
      {
        subject: `History (${Number(academicData?.["Sejarah"]) || 0})`,
        A: Number(academicData?.["Sejarah"]) || 0,
        fullMark: 100,
      },
      {
        subject: `Biology (${Number(academicData?.["Biologi"]) || 0})`,
        A: Number(academicData?.["Biologi"]) || 0,
        fullMark: 100,
      },
      {
        subject: `Chemistry (${Number(academicData?.["Kimia"]) || 0})`,
        A: Number(academicData?.["Kimia"]) || 0,
        fullMark: 100,
      },
      {
        subject: `Physics (${Number(academicData?.["Fisika"]) || 0})`,
        A: Number(academicData?.["Fisika"]) || 0,
        fullMark: 100,
      },
    ],
    [academicData],
  ); // <--- Array dependency ini memberi tahu React kapan harus merender ulang radarData

  const calculateAverage = (list) => {
    const scores = list.map((key) => Number(academicData?.[key]) || 0);
    if (scores.length === 0) return "0.0";
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  const sainsScore = calculateAverage([
    "Matematika",
    "Fisika",
    "Kimia",
    "Biologi",
  ]);
  const sosialScore = calculateAverage([
    "Sejarah",
    "Geografi",
    "Bahasa Inggris",
  ]);
  const overallScore = (
    (parseFloat(sainsScore) + parseFloat(sosialScore)) /
    2
  ).toFixed(1);

  const handleDownloadPDF = () => {
    window.print();
  };

  const isTrue = (value) =>
    value === true || value === "Yes" || value === "true";

  // Referensi untuk kontainer grafik
  const chartScrollRef = useRef(null);

  // Efek untuk memusatkan posisi scroll saat komponen dirender
  useEffect(() => {
    if (chartScrollRef.current) {
      const container = chartScrollRef.current;
      // Menghitung titik tengah: (Total Lebar Konten - Lebar Layar yang Terlihat) / 2
      const centerPosition =
        (container.scrollWidth - container.clientWidth) / 2;
      container.scrollLeft = centerPosition;
    }
  }, [radarData]); // Efek ini akan berjalan ketika data radar sudah siap

  if (!finalData)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">
        Memuat Hasil Analisis AI...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16 pt-8 flex flex-col">
      {/* Tombol Kembali */}
      <div className="max-w-6xl mx-1 lg:mx-14 px-6 mb-6 print:hidden">
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-blue-600 font-medium flex items-center transition text-md"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Kembali
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-6">
        {/* HERO SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Hebat, {fullName}!
          </h1>
          <p className="text-slate-500 text-sm font-medium flex items-center mb-6">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l9-5-9-5-9 5 9 5z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6v6"
              ></path>
            </svg>
            {schoolName}
          </p>
          <p className="text-slate-600 leading-relaxed text-sm lg:text-base pr-4 lg:pr-24">
            {aiSummary}
          </p>
        </div>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* RADAR CHART */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center text-[16px] lg:text-[18px]">
                  <span className="text-blue-500 mr-2 flex items-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </span>
                  Radar Kemampuan
                </h2>
              </div>

              {/* 1. Wrapper overflow-x-auto untuk scrolling horizontal */}
              <div
                ref={chartScrollRef}
                className="w-full overflow-x-auto pb-4 scrollbar-hide"
              >
                {/* 2. Beri min-w-[500px] agar ukuran chart tetap dipertahankan pada mobile */}
                <div className="h-96 min-h-[350px] min-w-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%" // Anda bisa mengembalikan radius ke ukuran aslinya
                      data={radarData}
                      margin={{ top: 20, right: 30, bottom: 20, left: 30 }} // Tambahkan sedikit margin tepi
                    >
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: "#475569",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Skor"
                        dataKey="A"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        fill="#3b82f6"
                        fillOpacity={0.2}
                        activeDot={{ r: 6, fill: "#2563eb" }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* REKOMENDASI KARIR TERATAS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-[16px] lg:text-[18px] font-bold text-slate-800 mb-6 flex items-center">
                <span className="text-blue-500 mr-2 flex items-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </span>
                Rekomendasi Karir
              </h2>

              {/* === TOP 1 DAN 2 === */}
              {/* === TOP 1 DAN 2 === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {careers.slice(0, 2).map((career, index) => {
                  const confidencePercent = Math.round(
                    career?.confidence_score || 0,
                  );
                  const careerName = career?.career_name || "Nama Karir";
                  const careerDesc = career?.description || "Deskripsi Karir";
                  const majorsList = career?.related_majors || [];

                  // LOGIKA STYLING SERAGAM UNTUK TOP 1 & 2

                  // Border warna emas (amber) untuk keduanya
                  const cardBorderColor = "border-blue-300";
                  const cardHoverColor =
                    "hover:border-blue-400 hover:shadow-blue-100/60";
                  // Lencana peringkat warna biru untuk keduanya
                  const badgeStyle =
                    "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm";

                  return (
                    <div
                      key={index}
                      className={`border-2 rounded-2xl p-6 transition-all duration-300 bg-white flex flex-col h-full shadow-sm hover:shadow-md ${cardBorderColor} ${cardHoverColor}`}
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                        {/* Lencana Peringkat Biru */}
                        <span
                          className={`font-bold text-xs px-2.5 py-1 rounded-lg flex items-center ${badgeStyle}`}
                        >
                          #{index + 1}
                        </span>

                        {/* Lencana Kesesuaian */}
                        <span className="text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 text-center border border-green-200">
                          {getMatchText(confidencePercent)}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-800 text-lg mb-1.5">
                        {careerName}
                      </h3>

                      <p className="text-xs text-slate-500 mb-5 line-clamp-3 leading-relaxed flex-grow">
                        {careerDesc}
                      </p>

                      {majorsList.length > 0 && (
                        <div className="mt-auto p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-100/60 flex-grow-0">
                          <p className="text-xs font-bold text-blue-800 mb-2.5 flex items-center uppercase tracking-wider">
                            <svg
                              className="w-4 h-4 mr-1.5 opacity-80"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 14l9-5-9-5-9 5 9 5z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6v6"
                              ></path>
                            </svg>
                            Rekomendasi Jurusan
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {majorsList.map((major, i) => (
                              <span
                                key={i}
                                className="bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm"
                              >
                                {major?.major_name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* === PERINGKAT 3 DAN SETERUSNYA === */}
              {careers.length > 2 && (
                <div className="mt-4 flex flex-col">
                  {showAllCareers && (
                    <div className="mb-4 pt-4 border-t border-slate-100 space-y-3 animate-fadeIn">
                      {careers.slice(2).map((career, index) => {
                        const confidencePercent = Math.round(
                          career?.confidence_score || 0,
                        );
                        const careerName = career?.career_name || "Nama Karir";
                        const careerDesc =
                          career?.description || "Deskripsi Karir";
                        const majorsList = career?.related_majors || [];

                        return (
                          <div
                            key={index}
                            className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex flex-col md:flex-row md:items-start justify-between gap-4"
                          >
                            <div className="flex-1">
                              {/* Pembungkus Responsif: Berbaris ke bawah di Mobile, Berjejer ke samping di Desktop */}
                              <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2 mb-2.5">
                                {/* Kiri (Desktop) / Atas (Mobile): Nomor Peringkat & Nama Karir */}
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 font-bold text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                                    #{index + 3}
                                  </span>
                                  <h4 className="font-bold text-slate-700 text-sm">
                                    {careerName}
                                  </h4>
                                </div>

                                {/* Kanan (Desktop) / Bawah (Mobile): Tulisan Rekomendasi */}
                                <div className="mt-0.5 md:mt-0">
                                  <span className="inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full text-center">
                                    {getMatchText(confidencePercent)}
                                  </span>
                                </div>
                              </div>

                              {/* Deskripsi Karir */}
                              <p className="text-xs text-slate-500 leading-relaxed pr-2">
                                {careerDesc}
                              </p>
                            </div>

                            {/* Bagian Jurusan Terkait yang Diperbarui (Peringkat 3+) */}
                            {majorsList.length > 0 && (
                              <div className="md:min-w-[220px] border-t border-slate-200 md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 md:pl-5 md:border-l border-slate-200">
                                <p className="text-[10px] font-bold text-slate-500 mb-2.5 flex items-center uppercase tracking-wider">
                                  <svg
                                    className="w-4 h-4 mr-1.5 opacity-80"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 14l9-5-9-5-9 5 9 5z"
                                    ></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                    ></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6v6"
                                    ></path>
                                  </svg>
                                  Jurusan Terkait
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {majorsList.map((major, i) => (
                                    <span
                                      key={i}
                                      className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-200 shadow-sm hover:bg-white transition-colors"
                                    >
                                      {major?.major_name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => setShowAllCareers(!showAllCareers)}
                    className="w-full py-3 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition flex justify-center items-center border border-slate-200 outline-none"
                  >
                    {showAllCareers
                      ? "Sembunyikan Jalur Lain"
                      : "Lihat Semua Jalur"}
                    <svg
                      className={`w-4 h-4 ml-1.5 transition-transform duration-200 ${showAllCareers ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 text-center">
            {/* BOX STATISTIK */}
            <div className="grid grid-cols-3 gap-3 text-nowrap">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-center items-center min-h-[110px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  AVG SCIENCE
                </p>
                <p className="text-3xl font-bold text-slate-800 leading-none mt-2">
                  {sainsScore}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-center items-center min-h-[110px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  AVG SOCIAL
                </p>
                <p className="text-3xl font-bold text-slate-800 leading-none mt-2">
                  {sosialScore}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-center items-center min-h-[110px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  TOTAL SCORE
                </p>
                <p className="text-3xl font-bold text-blue-600 leading-none mt-2">
                  {overallScore}
                </p>
              </div>
            </div>

            {/* DETAIL ANALISIS AI */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    ></path>
                  </svg>
                </span>
                <h3 className="font-bold text-slate-800 text-sm">
                  Detail Analisis AI
                </h3>
              </div>

              <div className="p-2">
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === "alasan" ? "" : "alasan")
                  }
                  className="w-full text-left p-3 flex justify-between items-center text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg outline-none"
                >
                  Alasan Kesesuaian
                  <svg
                    className={`w-4 h-4 transition-transform ${openAccordion === "alasan" ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {openAccordion === "alasan" && (
                  <div className="px-3 pb-3 text-xs text-slate-500 leading-relaxed">
                    {alasanText}
                  </div>
                )}

                <button
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === "kekuatan" ? "" : "kekuatan",
                    )
                  }
                  className="w-full text-left p-3 flex justify-between items-center text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg outline-none"
                >
                  Kekuatan Utama
                  <svg
                    className={`w-4 h-4 transition-transform ${openAccordion === "kekuatan" ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {openAccordion === "kekuatan" && (
                  <div className="px-3 pb-3 text-xs text-slate-500 leading-relaxed">
                    {kekuatanText}
                  </div>
                )}

                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === "saran" ? "" : "saran")
                  }
                  className="w-full text-left p-3 flex justify-between items-center text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg outline-none"
                >
                  Saran Pengembangan
                  <svg
                    className={`w-4 h-4 transition-transform ${openAccordion === "saran" ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {openAccordion === "saran" && (
                  <div className="px-3 pb-3 text-xs text-slate-500 leading-relaxed">
                    {saranText}
                  </div>
                )}
              </div>
            </div>

            {/* PROFIL BELAJAR */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center">
                <span className="text-blue-500 mr-2 flex items-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                </span>
                Profil & Kebiasaan Belajar
              </h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Jam Belajar Mandiri
                  </span>
                  <span className="font-bold text-slate-700">
                    {behavioralData?.weekly_self_study_hours ?? 0} jam / minggu
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-medium">
                    Absensi / Tidak Hadir
                  </span>
                  <span className="font-bold text-slate-700">
                    {behavioralData?.absence_days ?? 0} hari
                  </span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-slate-400 font-medium">
                    Aktif Ekstrakurikuler
                  </span>
                  <span
                    className={`font-bold ${behavioralData?.extracurricular ? "text-green-600" : "text-slate-500"}`}
                  >
                    {behavioralData?.extracurricular ? "Ya (Aktif)" : "Tidak"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-slate-400 font-medium">
                    Pekerjaan Paruh Waktu
                  </span>
                  <span
                    className={`font-bold ${isTrue(behavioralData?.part_time_job) ? "text-blue-600" : "text-slate-500"}`}
                  >
                    {isTrue(behavioralData?.part_time_job) ? "Ya" : "Tidak"}
                  </span>
                </div>
              </div>
            </div>

            {/* REFERENSI AKADEMIK */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center">
                <span className="text-blue-500 mr-2 flex items-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    ></path>
                  </svg>
                </span>
                Referensi Akademik
              </h3>
              <div className="space-y-3">
                {referensiList.length > 0 ? (
                  referensiList.map((ref, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-100"
                    >
                      <h4 className="text-sm font-bold text-slate-800 mb-1">
                        {ref?.url ? (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-blue-600 hover:underline"
                          >
                            {ref?.title || "Referensi"}
                          </a>
                        ) : (
                          ref?.title || "Referensi"
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        {ref?.keterangan || ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic text-center p-4">
                    Belum ada referensi kampus.
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 print:hidden">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Tindakan Cepat
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-xl transition flex justify-center items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  Unduh Laporan PDF
                </button>
                <button
                  onClick={onRetry}
                  className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-xl transition flex justify-center items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  Coba Asesmen Ulang
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResultPage;
