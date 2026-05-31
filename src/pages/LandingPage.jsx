import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPageIlustration from "../assets/ilustration1.png";

function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [initials, setInitials] = useState("");

  // status login setiap kali Landing Page dibuka
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const fullName = localStorage.getItem("user_name");

    if (token) {
      setIsLoggedIn(true);

      if (fullName) {
        // Mengambil nama depan
        const nameParts = fullName.trim().split(" ");
        setFirstName(
          nameParts.length > 1
            ? `${nameParts[0]} ${nameParts[1]}`
            : nameParts[0]
        );

        // Membuat inisial
        const ini =
          nameParts.length > 1
            ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
            : nameParts[0][0].toUpperCase();
        setInitials(ini);
      } else {
        setFirstName("Siswa");
        setInitials("S");
      }
    }
  }, []);

  return (
    <div className="bg-surface-background text-on-surface antialiased pt-[80px] min-h-screen flex flex-col font-sans">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
          <div className="flex justify-between gap-10">
            <div className="font-h2 text-h2 text-primary tracking-tight font-bold">
              EduPath
            </div>
            <nav className="hidden md:flex items-center space-x-8 font-body-md text-body-md">
              <a
                className="text-text-secondary dark:text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                About
              </a>
              <a
                className="text-text-secondary dark:text-on-surface-variant hover:text-primary transition-colors"
                href="#features"
              >
                How it Works
              </a>
              <a
                className="text-text-secondary dark:text-on-surface-variant hover:text-primary transition-colors"
                href="#footer"
              >
                Contact
              </a>
            </nav>
          </div>

          <div className="flex items-center">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 hover:bg-slate-200 p-1.5 lg:pl-4 rounded-full transition group"
              >
                <span className="font-bold text-slate-700 hidden md:block">
                  {firstName}
                </span>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md group-hover:shadow-lg transition">
                  {initials}
                </div>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 hover:bg-slate-200 p-2 rounded-full transition text-slate-600 font-medium"
                title="Log In"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-gutter py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h1 className="font-display text-[40px] lg:text-[48px] font-extrabold text-text-primary leading-[1.2] tracking-tight">
              Temukan Jalur Karier dan Jurusan yang Paling Sesuai Untukmu
            </h1>
            <p className="font-body-lg text-lg text-text-secondary max-w-xl">
              Gunakan kekuatan pemetaan AI untuk menganalisis minat, bakat, dan
              nilai akademis Anda. Kami membantu mengurangi kebingungan dalam
              memilih masa depan dengan memberikan rekomendasi berbasis data
              yang tenang dan dapat diandalkan.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate("/onboarding")}
                  className="bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-10 rounded-full shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                >
                  Mulai Asesmen Sekarang
                  <span
                    className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    arrow_forward
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-10 rounded-full shadow-lg transition-all cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-surface-white text-primary border-2 border-primary font-bold py-4 px-10 rounded-full shadow-sm hover:bg-surface-container-low transition-all cursor-pointer"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center items-center relative md:h-[500px]">
            <img
              src={LandingPageIlustration}
              alt="Ilustrasi siswa belajar dengan EduPath AI"
              className="w-full h-auto rounded-3xl object-cover drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </section>

        {/* Features Z-Pattern Section */}
        <section
          id="features"
          className="bg-surface-container-low py-12 lg:py-24"
        >
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="font-h1 text-[32px] font-bold text-text-primary mb-4">
                Kenapa Memilih EduPath?
              </h2>
              <p className="font-body-md text-text-secondary">
                Pendekatan komprehensif untuk masa depan yang lebih jelas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Berbasis AI */}
              <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-6">
                <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary-container">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    smart_toy
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-h2 text-xl font-bold text-text-primary">
                    Berbasis AI
                  </h3>
                  <p className="font-body-md text-text-secondary leading-relaxed">
                    Algoritma cerdas kami memproses data kompleks Anda untuk
                    memberikan prediksi dan rekomendasi yang sangat akurat.
                    Pendekatan ini memastikan setiap rekomendasi didasarkan pada
                    analisis pola yang mendalam.
                  </p>
                </div>
              </div>

              {/* Card 2: Holistic Assessment */}
              <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-6">
                <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center text-on-secondary-container">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    psychology
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-h2 text-xl font-bold text-text-primary">
                    Penilaian Holistik
                  </h3>
                  <p className="font-body-md text-text-secondary leading-relaxed">
                    Evaluasi menyeluruh yang mencakup nilai rapor, tes
                    kepribadian, dan minat karir untuk gambaran lengkap potensi
                    Anda. Kami tidak hanya melihat angka, tetapi memahami siapa
                    Anda sebenarnya.
                  </p>
                </div>
              </div>

              {/* Card 3: Visualisasi Interaktif */}
              <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start space-y-6">
                <div className="w-16 h-16 bg-purple-700 rounded-2xl flex items-center justify-center text-on-tertiary">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    insert_chart
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-h2 text-xl font-bold text-text-primary">
                    Visualisasi Interaktif
                  </h3>
                  <p className="font-body-md text-text-secondary leading-relaxed">
                    Lihat hasil Anda melalui grafik radar dan chart yang bersih
                    dan mudah dipahami, mengubah prediksi abstrak menjadi
                    wawasan konkret. Pahami kekuatan Anda dalam hitungan detik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Mission Section */}
        <section className="relative py-16 lg:py-32 bg-primary overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Students collaborating"
              className="w-full h-full object-cover opacity-20 mix-blend-multiply"
              src={LandingPageIlustration}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/70"></div>
          </div>
          <div className="relative z-10 max-w-container-max mx-auto px-gutter text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="font-label-md text-md font-bold uppercase tracking-[0.2em] text-primary-fixed">
                Misi Kami
              </div>
              <h2 className="font-display text-4xl lg:text-6xl font-bold text-on-primary leading-[1.1] tracking-tight">
                Mengakhiri Era <br />
                <span className="text-secondary-fixed">"Salah Jurusan"</span>
              </h2>
              <div className="space-y-6 text-on-primary/90 font-body-lg leading-[1.8] max-w-3xl mx-auto mt-8">
                <p>
                  Menurut data riset pendidikan nasional, hampir{" "}
                  <span className="text-surface-white font-bold">
                    70% mahasiswa
                  </span>{" "}
                  merasa salah memilih jurusan di tahun pertama mereka. Hal ini
                  berdampak pada motivasi belajar dan potensi karier di masa
                  depan.
                </p>
                <p>
                  EduPath lahir dari keresahan tersebut. Dengan memadukan model{" "}
                  <strong className="text-surface-white font-bold">
                    Deep Learning
                  </strong>{" "}
                  dan metrik psikometrik teruji, kami membangun sistem yang
                  bertindak sebagai penasihat akademik pribadi Anda—objektif,
                  presisi, dan bebas dari bias emosional.
                </p>
              </div>
              <div className="pt-8">
                <span className="inline-flex items-center gap-2 text-primary-fixed font-bold text-body-lg cursor-default"></span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="footer"
        className="w-full bg-surface-container-high border-t border-border-subtle transition-opacity duration-200 mt-auto"
      >
        <div className="max-w-container-max mx-auto px-gutter py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="font-h2 text-h2 text-primary tracking-tight font-bold">
                EduPath
              </div>
              <p className="font-body-md text-text-secondary max-w-sm">
                Platform penasihat akademik profesional berbasis AI yang
                mengarahkan potensi Anda melalui presisi data yang tak
                terbantahkan.
              </p>
            </div>
            <div>
              <h4 className="font-label-md text-text-primary mb-6 uppercase tracking-wider font-bold">
                Bantuan
              </h4>
              <ul className="space-y-4 font-body-md text-text-secondary">
                <li>
                  <span className="text-text-secondary cursor-default">
                    FAQ
                  </span>
                </li>
                <li>
                  <span className="text-text-secondary cursor-default">
                    Contact Support
                  </span>
                </li>
                <li>
                  <span className="text-text-secondary cursor-default">
                    Help Center
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-text-primary mb-6 uppercase tracking-wider font-bold">
                Legal
              </h4>
              <ul className="space-y-4 font-body-md text-text-secondary">
                <li>
                  <span className="text-text-secondary cursor-default">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="text-text-secondary cursor-default">
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="text-text-secondary cursor-default">
                    Cookie Policy
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-caption text-text-secondary">
            <p>© 2026 EduPath. Professional Academic Advisory Platform.</p>
            <p className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{
                  fontVariationSettings:
                    "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                }}
              >
                public
              </span>{" "}
              Global Edition
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
