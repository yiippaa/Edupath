import React, { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { fetchWithAuth } from '../Utils/auth';

function ResultPage({ onRetry, onBack, resultData, academicData, behavioralData }) {
  const finalData = resultData?.data || resultData;

  const [openAccordion, setOpenAccordion] = useState('alasan'); 
  const [showAllCareers, setShowAllCareers] = useState(false);  

  // STATE DATA USER 
  const [userData, setUserData] = useState({
    full_name: localStorage.getItem('user_name') || 'Siswa',
    school_name: localStorage.getItem('user_school') || 'Sekolah Tidak Diketahui'
  });

  // FETCH DATA PROFIL MENGGUNAKAN fetchWithAuth
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const token = localStorage.getItem('user_token');
        if (!token) return; 

        // Pemanggilan API 
        const response = await fetchWithAuth('https://edupath-backend.vercel.app/api/v1/profiles/me');
        const result = await response.json();

        if (result.success && result.data) {
          setUserData({
            full_name: result.data.full_name || 'Siswa',
            school_name: result.data.school_name || 'Sekolah Tidak Diketahui'
          });
          
          localStorage.setItem('user_name', result.data.full_name);
          localStorage.setItem('user_school', result.data.school_name);
        }
      } catch (error) {
        console.error('Gagal menarik data profil di Result Page:', error);
      }
    };

    fetchLatestProfile();
  }, []);

  const fullName = finalData?.user_details?.full_name || finalData?.user?.full_name || userData.full_name;
  const schoolName = finalData?.user_details?.school_name || finalData?.user?.school_name || userData.school_name;

  const aiSummary = finalData?.ai_summary || "Berdasarkan analisis AI, kamu memiliki potensi besar.";
  const aiExplanation = finalData?.ai_explanation || {};
  const alasanText = aiExplanation.alasan || "Data alasan belum tersedia dari AI.";
  const kekuatanText = aiExplanation.kekuatan || "Data kekuatan belum tersedia dari AI.";
  const saranText = aiExplanation.saran || "Data saran pengembangan belum tersedia dari AI.";
  const referensiList = aiExplanation.referensi || [];

  const careers = finalData?.career_matches || [];

  const radarData = [
    { subject: `Math (${Number(academicData?.['Matematika']) || 0})`, A: Number(academicData?.['Matematika']) || 0, fullMark: 100 },
    { subject: `English (${Number(academicData?.['Bahasa Inggris']) || 0})`, A: Number(academicData?.['Bahasa Inggris']) || 0, fullMark: 100 },
    { subject: `Geography (${Number(academicData?.['Geografi']) || 0})`, A: Number(academicData?.['Geografi']) || 0, fullMark: 100 },
    { subject: `History (${Number(academicData?.['Sejarah']) || 0})`, A: Number(academicData?.['Sejarah']) || 0, fullMark: 100 },
    { subject: `Biology (${Number(academicData?.['Biologi']) || 0})`, A: Number(academicData?.['Biologi']) || 0, fullMark: 100 },
    { subject: `Chemistry (${Number(academicData?.['Kimia']) || 0})`, A: Number(academicData?.['Kimia']) || 0, fullMark: 100 },
    { subject: `Physics (${Number(academicData?.['Fisika']) || 0})`, A: Number(academicData?.['Fisika']) || 0, fullMark: 100 }
  ];

  const calculateAverage = (list) => {
    const scores = list.map(key => Number(academicData?.[key]) || 0);
    if (scores.length === 0) return "0.0";
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };
  
  const sainsScore = calculateAverage(['Matematika', 'Fisika', 'Kimia', 'Biologi']);
  const sosialScore = calculateAverage(['Sejarah', 'Geografi', 'Bahasa Inggris']);
  const overallScore = ((parseFloat(sainsScore) + parseFloat(sosialScore)) / 2).toFixed(1);

  const handleDownloadPDF = () => {
    window.print();
  };

  const isTrue = (value) => value === true || value === 'Yes' || value === 'true';

  if (!finalData) return <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">Memuat Hasil Analisis AI...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-16 pt-8">
      
      {/* Tombol Kembali */}
      <div className="max-w-6xl mx-auto px-6 mb-6 print:hidden">
        <button onClick={onBack} className="text-slate-500 hover:text-blue-600 font-medium flex items-center transition text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Dashboard
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-6">
        
        {/* HERO SECTION */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Hebat, {fullName}!</h1>
          <p className="text-slate-500 text-sm font-medium flex items-center mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6v6"></path></svg>
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
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                 <span className="text-blue-500 mr-2">🕸️</span> Profil Kemampuan (Radar)
              </h2>
              <div className="w-full h-87.5">
                <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar 
                      name="Skor" dataKey="A" stroke="#2563eb" strokeWidth={2.5} 
                      fill="#3b82f6" fillOpacity={0.2} activeDot={{ r: 6, fill: '#2563eb' }} 
                      label={{ fill: '#1d4ed8', fontSize: 11, fontWeight: '700', offset: 8 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* REKOMENDASI KARIR TERATAS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                 <span className="text-blue-500 mr-2">🎯</span> Rekomendasi Karir Teratas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careers.slice(0, 2).map((career, index) => {
                  const confidencePercent = Math.round(career?.confidence_score || 0);
                  const careerName = career?.career_name || "Nama Karir";
                  const careerDesc = career?.description || "Deskripsi Karir";
                  const majorsList = career?.related_majors || [];

                  return (
                    <div key={index} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-all bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-slate-400 font-bold text-sm bg-slate-100 px-2 py-0.5 rounded">#{index + 1}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                           {confidencePercent}% Match
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base mb-1">{careerName}</h3>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{careerDesc}</p>
                      
                      {majorsList.length > 0 && (
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Jurusan Terkait</p>
                          <div className="flex flex-wrap gap-1.5">
                            {majorsList.map((major, i) => (
                              <span key={i} className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-100">
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

              {careers.length > 2 && (
                <div className="mt-4 flex flex-col">
                  {showAllCareers && (
                    <div className="mb-4 pt-4 border-t border-slate-100 space-y-3 animate-fadeIn">
                      {careers.slice(2).map((career, index) => {
                        const confidencePercent = Math.round(career?.confidence_score || 0);
                        const careerName = career?.career_name || "Nama Karir";
                        const careerDesc = career?.description || "Deskripsi Karir";
                        const majorsList = career?.related_majors || [];

                        return (
                          <div key={index} className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-slate-400 font-bold text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded">#{index + 3}</span>
                                <h4 className="font-bold text-slate-700 text-sm">{careerName}</h4>
                                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{confidencePercent}% Match</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed pr-2">{careerDesc}</p>
                            </div>
                            
                            {majorsList.length > 0 && (
                              <div className="min-w-40">
                                <p className="text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Jurusan Terkait</p>
                                <div className="flex flex-wrap gap-1">
                                  {majorsList.map((major, i) => (
                                    <span key={i} className="bg-white text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200">
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
                    {showAllCareers ? 'Sembunyikan Jalur Lain' : 'Lihat Semua Jalur'}
                    <svg className={`w-4 h-4 ml-1.5 transition-transform duration-200 ${showAllCareers ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>

          </div>
          <div className="lg:col-span-1 space-y-6">
            
            {/* BOX STATISTIK */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AVG SCIENCE</p>
                <p className="text-2xl font-bold text-blue-600">{sainsScore}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AVG SOCIAL</p>
                <p className="text-2xl font-bold text-blue-600">{sosialScore}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL SCORE</p>
                <p className="text-2xl font-bold text-slate-800">{overallScore}</p>
              </div>
            </div>

            {/* DETAIL ANALISIS AI */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </span>
                <h3 className="font-bold text-slate-800 text-sm">Detail Analisis AI</h3>
              </div>
              
              <div className="p-2">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'alasan' ? '' : 'alasan')}
                  className="w-full text-left p-3 flex justify-between items-center text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg outline-none"
                >
                  Alasan Kesesuaian
                  <svg className={`w-4 h-4 transition-transform ${openAccordion === 'alasan' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {openAccordion === 'alasan' && (
                  <div className="px-3 pb-3 text-xs text-slate-500 leading-relaxed">
                    {alasanText}
                  </div>
                )}

                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'kekuatan' ? '' : 'kekuatan')}
                  className="w-full text-left p-3 flex justify-between items-center text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg outline-none"
                >
                  Kekuatan Utama
                  <svg className={`w-4 h-4 transition-transform ${openAccordion === 'kekuatan' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {openAccordion === 'kekuatan' && (
                  <div className="px-3 pb-3 text-xs text-slate-500 leading-relaxed">
                    {kekuatanText}
                  </div>
                )}

                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'saran' ? '' : 'saran')}
                  className="w-full text-left p-3 flex justify-between items-center text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg outline-none"
                >
                  Saran Pengembangan
                  <svg className={`w-4 h-4 transition-transform ${openAccordion === 'saran' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {openAccordion === 'saran' && (
                  <div className="px-3 pb-3 text-xs text-slate-500 leading-relaxed">
                    {saranText}
                  </div>
                )}
              </div>
            </div>

            {/* PROFIL BELAJAR */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
               <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center">
                 <span className="text-blue-500 mr-2">🚀</span> Profil & Kebiasaan Belajar
               </h3>
               <div className="space-y-3.5 text-xs">
                 <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                   <span className="text-slate-400 font-medium">Jam Belajar Mandiri</span>
                   <span className="font-bold text-slate-700">{behavioralData?.weekly_self_study_hours ?? 0} jam / minggu</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                   <span className="text-slate-400 font-medium">Absensi / Tidak Hadir</span>
                   <span className="font-bold text-slate-700">{behavioralData?.absence_days ?? 0} hari</span>
                 </div>
                 <div className="flex justify-between items-center pb-1">
                   <span className="text-slate-400 font-medium">Aktif Ekstrakurikuler</span>
                   <span className={`font-bold ${behavioralData?.extracurricular ? 'text-green-600' : 'text-slate-500'}`}>
                     {behavioralData?.extracurricular ? 'Ya (Aktif)' : 'Tidak'}
                   </span>
                 </div>
                 <div className="flex justify-between items-center pb-1">
                   <span className="text-slate-400 font-medium">Pekerjaan Paruh Waktu</span>
                   <span className={`font-bold ${isTrue(behavioralData?.part_time_job) ? 'text-blue-600' : 'text-slate-500'}`}>
                     {isTrue(behavioralData?.part_time_job) ? 'Ya' : 'Tidak'}
                   </span>
                 </div>
               </div>
            </div>

            {/* REFERENSI AKADEMIK */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center">
                <span className="text-blue-500 mr-2">🎓</span> Referensi Akademik
              </h3>
              <div className="space-y-3">
                {referensiList.length > 0 ? (
                  referensiList.map((ref, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800 mb-1">
                        {ref?.url ? (
                          <a href={ref.url} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:underline">
                            {ref?.title || "Referensi"}
                          </a>
                        ) : (
                          ref?.title || "Referensi"
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{ref?.keterangan || ""}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic text-center p-4">Belum ada referensi kampus.</div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 print:hidden">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Tindakan Cepat</h3>
              <div className="space-y-2.5">
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-xl transition flex justify-center items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Unduh Laporan PDF
                </button>
                <button 
                  onClick={onRetry}
                  className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-xl transition flex justify-center items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
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