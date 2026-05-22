import React, { useState, useEffect } from 'react';
// IMPORT FETCH OTOMATIS & LOADING PAGE
import { fetchWithAuth } from '../Utils/auth';
import LoadingPage from './LoadingPage';

function PsychometricForm({ onBack, academicData, onSubmitSuccess, onProfileClick }) { 
  const [studyHours, setStudyHours] = useState(10);
  const [absentDays, setAbsentDays] = useState('');
  
  const [partTimeJob, setPartTimeJob] = useState('No'); 
  const [extracurricular, setExtracurricular] = useState('No');
  
  const [isLoading, setIsLoading] = useState(false);

  const [initials, setInitials] = useState('U');

  useEffect(() => {
    const fullName = localStorage.getItem('user_name');
    if (fullName) {
      const nameParts = fullName.trim().split(' ');
      const ini = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
        : nameParts[0][0].toUpperCase();
      setInitials(ini);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // <--- INI AKAN MEMICU LOADING PAGE MUNCUL

    const payload = {
      math_score: Number(academicData?.['Matematika'] ?? 92), 
      physics_score: Number(academicData?.['Fisika'] ?? 60),
      chemistry_score: Number(academicData?.['Kimia'] ?? 78),
      biology_score: Number(academicData?.['Biologi'] ?? 72),
      history_score: Number(academicData?.['Sejarah'] ?? 65),
      english_score: Number(academicData?.['Bahasa Inggris'] ?? 95),
      geography_score: Number(academicData?.['Geografi'] ?? 65),
      
      weekly_self_study_hours: Number(studyHours),
      absence_days: Number(absentDays),
      
      part_time_job: partTimeJob === 'Yes', 
      extracurricular: extracurricular === 'Yes' 
    };

    console.log("Data siap dikirim ke backend:", payload);

    try {
      const API_URL = 'https://edupath-backend.vercel.app/api/v1';

      // 1. Submit Assessment (MENGGUNAKAN fetchWithAuth)
      const assessRes = await fetchWithAuth(`${API_URL}/assessments`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (!assessRes.ok) throw new Error('Gagal submit assessment');
      const assessData = await assessRes.json();
      const assessmentId = assessData.data.assessment_id;

      // 2. Generate Prediction (MENGGUNAKAN fetchWithAuth)
      const predictRes = await fetchWithAuth(`${API_URL}/recommendations/predict`, {
        method: 'POST',
        body: JSON.stringify({ assessment_id: assessmentId })
      });
      if (!predictRes.ok) throw new Error('Gagal memicu AI prediction');
      const predictData = await predictRes.json();
      const recommendationId = predictData.data.recommendation_id;

      // 3. Get Recommendation Details (MENGGUNAKAN fetchWithAuth)
      const resultRes = await fetchWithAuth(`${API_URL}/recommendations/${recommendationId}`);
      if (!resultRes.ok) throw new Error('Gagal mengambil detail hasil');
      const finalResult = await resultRes.json();

      // Buat delay buatan 1.5 detik agar Loading Page sempat dibaca walau internet sangat cepat
      setTimeout(() => {
        if (onSubmitSuccess) onSubmitSuccess(finalResult, payload);
      }, 1500);

    } catch (error) {
      console.warn("API Backend gagal. Menggunakan simulasi lokal.");
      
      setTimeout(() => {
        const mockAPIResponse = {
          success: true,
          data: {
            user_details: {
              full_name: localStorage.getItem('user_name') || "Siswa",
              school_name: localStorage.getItem('user_school') || "Telkom University"
            },
            ai_summary: "Berdasarkan simulasi lokal, profil Anda menunjukkan determinasi belajar yang sangat baik.",
            ai_explanation: {
                alasan: `Simulasi menyimpulkan nilai Matematika (${payload.math_score}) dan Fisika (${payload.physics_score}) sangat krusial.`,
                kekuatan: `Kekuatan utama pada nilai Bahasa Inggris (${payload.english_score}).`,
                saran: `Pertahankan jam belajar mandiri yang tinggi.`,
                referensi: [{ title: "Simulasi EduPath", url: "#", keterangan: "Data dummy" }]
            },
            cognitive_profile: [
              { subject: "Logika & Analitik", value: payload.math_score },
              { subject: "Literasi Sains", value: payload.physics_score },
              { subject: "Wawasan Sosial", value: payload.history_score },
              { subject: "Komunikasi Verbal", value: payload.english_score },
              { subject: "Manajemen Diri", value: 90 },
              { subject: "Interpersonal", value: payload.extracurricular ? 95 : 70 }
            ],
            career_matches: [
              {
                rank: 1, confidence_score: 95,
                career_name: "Simulasi Data Scientist", description: "Ini adalah simulasi.",
                related_majors: [{ major_name: "Sains Data" }]
              }
            ]
          }
        };
        if (onSubmitSuccess) onSubmitSuccess(mockAPIResponse, payload);
        
        // Kita letakkan setIsLoading(false) di dalam catch, karena jika API sukses,
        // halaman akan langsung berpindah via onSubmitSuccess (jadi tidak perlu set false).
        setIsLoading(false); 
      }, 3500); // Simulasi agak lama agar loading animasi terlihat

    }
  };

  const handleGoHome = () => {
    if (onBack) onBack('home'); 
  };

  // =======================================================
  // KUNCI UTAMA: Cegat render jika sedang loading
  // =======================================================
  if (isLoading) {
    return <LoadingPage />;
  }

  // Tampilan Form Utama (hanya akan dirender jika isLoading === false)
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center w-full">
        <div className="flex items-center text-blue-700 font-bold text-lg">
          <span className="mr-2">🎓</span> EduPath
        </div>
        
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-500">
          <button onClick={handleGoHome} className="text-blue-600 font-bold text-lg hover:text-blue-700 transition">
            Home
          </button>
        </nav>

        <div 
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm cursor-pointer hover:bg-slate-800 transition"
          title="Lihat Profil"
        >
          {initials}
        </div>
      </header>

      <main className="flex-1 flex justify-center py-12 px-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
          
          <div className="mb-10">
            <div className="flex justify-between items-end mb-2 text-sm font-medium">
              <span className="text-slate-600">Langkah 2 dari 2</span>
              <span className="text-blue-600">Psikometri & Kebiasaan</span>
            </div>
            <div className="w-full bg-blue-600 rounded-full h-1.5 relative"></div>
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-bold text-slate-800 mb-2">Profil Perilaku</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Bantu kami memahami kebiasaan belajar dan rutinitas harian Anda untuk menghasilkan rekomendasi yang lebih akurat.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-slate-700">Jam belajar mandiri (mingguan)</label>
                <span className="text-sm font-bold text-blue-600">{studyHours} jam</span>
              </div>
              <input 
                type="range" min="0" max="40" 
                value={studyHours} onChange={(e) => setStudyHours(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>0</span><span>40+</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah absen / tidak hadir (Semester Ini)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <input 
                  type="number" min="0" placeholder="e.g. 2"
                  value={absentDays} onChange={(e) => setAbsentDays(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-3">Apakah Anda saat ini memiliki pekerjaan paruh waktu?</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setPartTimeJob('Yes')}
                  className={`flex items-center p-3 border rounded-lg transition-all ${
                    partTimeJob === 'Yes' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                    partTimeJob === 'Yes' ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {partTimeJob === 'Yes' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className={`text-sm font-medium ${partTimeJob === 'Yes' ? 'text-blue-800' : 'text-slate-600'}`}>Ya</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setPartTimeJob('No')}
                  className={`flex items-center p-3 border rounded-lg transition-all ${
                    partTimeJob === 'No' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                    partTimeJob === 'No' ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {partTimeJob === 'No' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className={`text-sm font-medium ${partTimeJob === 'No' ? 'text-blue-800' : 'text-slate-600'}`}>Tidak</span>
                </button>
              </div>
            </div>

            <div className="mb-12">
              <label className="block text-sm font-medium text-slate-700 mb-3">Apakah Anda aktif mengikuti kegiatan ekstrakurikuler?</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setExtracurricular('Yes')}
                  className={`flex items-center p-3 border rounded-lg transition-all ${
                    extracurricular === 'Yes' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                    extracurricular === 'Yes' ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {extracurricular === 'Yes' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className={`text-sm font-medium ${extracurricular === 'Yes' ? 'text-blue-800' : 'text-slate-600'}`}>Ya</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setExtracurricular('No')}
                  className={`flex items-center p-3 border rounded-lg transition-all ${
                    extracurricular === 'No' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                    extracurricular === 'No' ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {extracurricular === 'No' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className={`text-sm font-medium ${extracurricular === 'No' ? 'text-blue-800' : 'text-slate-600'}`}>Tidak</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button 
                type="button" onClick={() => onBack('step1')} disabled={isLoading}
                className={`px-6 py-3 border border-slate-300 text-slate-600 font-medium rounded-lg transition hover:bg-slate-50`}
              >
                Kembali
              </button>
              <button 
                type="submit" disabled={isLoading}
                className={`font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center text-white bg-[#0f763b] hover:bg-green-800`}
              >
                Kirim & Analisis Data
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PsychometricForm;