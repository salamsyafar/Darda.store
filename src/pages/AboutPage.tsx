import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Target, 
  Eye, 
  Store, 
  MessageCircle, 
  Coins, 
  Users, 
  HelpCircle,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { ActivePage } from '../types';

interface AboutPageProps {
  onNavigate?: (page: ActivePage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const faqs: Array<{ q: string; a: React.ReactNode }> = [
    {
      q: 'Apa itu Darda Store?',
      a: 'DARDA STORE adalah platform katalog digital resmi binaan Masjid Darussalam Dua. Kata "DARDA" merupakan singkatan dari Darussalam Dua. Platform ini dirancang untuk mempromosikan produk dan jasa milik jamaah masjid secara profesional dan mudah diakses.'
    },
    {
      q: 'Apakah Darda Store menarik komisi penjualan?',
      a: 'Tidak. Seluruh transaksi berlangsung langsung antara pembeli dan penjual melalui WhatsApp tanpa ada potongan komisi atau biaya transaksi perantara. Misi kami murni untuk pemberdayaan ekonomi umat.'
    },
    {
      q: 'Bagaimana cara memesan produk?',
      a: 'Cukup pilih produk yang Anda inginkan di katalog, klik tombol "Pesan WA", dan Anda akan langsung diarahkan ke chat WhatsApp penjual dengan pesan pemesanan yang telah terformat rapi dan santun.'
    },
    {
      q: 'Bagaimana cara mendaftarkan toko / produk saya?',
      a: (
        <div className="space-y-3 pt-1">
          <p className="text-stone-700">
            Pendaftaran toko UMKM jamaah Masjid Darussalam Dua dapat dilakukan dengan <strong>2 cara mudah</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Cara 1: Daftar Langsung di Web */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-2">
              <div className="flex items-center gap-2 text-[#064E3B] font-bold text-xs sm:text-sm">
                <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-[11px] flex items-center justify-center font-bold">1</span>
                <span>Daftar Langsung di Web</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Isi formulir online mandiri di website Darda Store. Masukkan data nama toko, pemilik, kategori usaha, nomor WhatsApp, alamat, dan foto produk Anda. Pengurus DKM akan meninjau dan mengaktifkan toko Anda.
              </p>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('register-umkm')}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] hover:text-[#047857] hover:underline cursor-pointer"
                >
                  <span>Buka Formulir Pendaftaran Web</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cara 2: Via Admin */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-2">
              <div className="flex items-center gap-2 text-[#064E3B] font-bold text-xs sm:text-sm">
                <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>Daftar via Admin</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hubungi Admin DKM melalui chat WhatsApp atau datang langsung ke Kantor Sekretariat Masjid (Jl. Pertamina, Ongkoe). Tim pengurus akan membantu pendaftaran dan input katalog usaha Anda hingga aktif.
              </p>
              <a
                href="https://wa.me/6287877686424?text=Assalamu'alaikum%20Admin%20Darda%20Store%2C%20saya%20jamaah%20ingin%20mendaftarkan%20toko%2Fproduk%20saya%20melalui%20bantuan%20Admin."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Admin untuk Pendaftaran</span>
              </a>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Top Banner Story */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center mb-6">
          <Logo size="lg" variant="full" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/50">
          Tentang Darda Store
        </span>
        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
          Menghidupkan Pasar Berkah di Bawah Naungan Masjid
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          Platform digital mandiri yang didedikasikan untuk mengangkat potensi usaha mikro, kecil, dan menengah 
          (UMKM) seluruh jamaah Masjid Darussalam Dua.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vision */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#064E3B] to-[#043d2e] text-white space-y-4 shadow-md relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#D4AF37]">
            <Eye className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Visi Kami
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold">
            "Belanja Berkah, Dukung UMKM Jamaah"
          </h2>
          <p className="text-sm text-stone-200 leading-relaxed">
            Menjadi ekosistem digital komunitas masjid terdepan yang mewujudkan kemandirian ekonomi umat berlandaskan 
            prinsip syariah, kejujuran, dan persaudaraan islam (ukhuwah islamiyah).
          </p>
        </div>

        {/* Mission */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/80 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#064E3B]">
            <Target className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#064E3B]">
            Misi Kami
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
            Langkah Nyata Pemberdayaan
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-stone-600 pt-2">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
              <span>Menyediakan etalase digital profesional bagi setiap usaha rumahan jamaah masjid.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
              <span>Mempermudah warga sekitar masjid berbelanja kebutuhan pokok dan konsumsi halal berkualitas.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
              <span>Mendorong perputaran uang di lingkungan internal jamaah demi memperkuat daya tahan ekonomi keluarga.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Why Support UMKM Jamaah */}
      <div className="bg-stone-50 rounded-3xl border border-stone-200/80 p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            Mengapa Sangat Penting?
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Mengapa Harus Mendukung UMKM Jamaah?
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Rasulullah SAW bersabda mengenai keutamaan tolong menolong sesama muslim. Membeli produk jamaah bukan sekadar urusan jual beli, melainkan amal ibadah muamalah:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Pahala Silaturahmi</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Membeli dari saudara seiman menghidupkan cinta kasih dan mempererat hubungan antar jamaah sholat.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D4AF37] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Jaminan Halalan Thayyiban</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Pedagang binaan masjid berkomitmen menjaga kehalalan bahan dan kebersihan pengolahan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Kemandirian Finansial</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Membantu anak-anak jamaah bersekolah, orang tua berkarya, dan keluarga hidup mandiri.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D4AF37] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Infaq & Kemakmuran Masjid</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Sebagian keuntungan para pedagang senantiasa disalurkan kembali untuk infaq kegiatan masjid.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B]">
            Tanya Jawab
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
            Pertanyaan Umum (FAQ)
          </h2>
        </div>

        <div className="space-y-4 pt-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-stone-200/80 space-y-2">
              <h3 className="font-bold text-sm text-stone-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Official Admin Contact Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#064E3B] to-[#043d2e] text-white space-y-4 mt-8 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Layanan & Bantuan Pengurus
              </span>
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold">
                Kontak Resmi Admin Darda Store
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xl leading-relaxed">
                Punya pertanyaan mengenai program pemberdayaan ekonomi, ingin mendaftarkan produk, atau butuh bantuan teknis? Hubungi kami langsung melalui WhatsApp pengurus atau kunjungi Kantor Sekretariat Masjid: <strong className="text-white">Jl. Pertamina, Ongkoe, Temmapaduae, Marusu, Kabupaten Maros</strong>.
              </p>
            </div>
            <a
              href="https://wa.me/6287877686424?text=Assalamu'alaikum%20Admin%20Darda%20Store%2C%20saya%20ingin%20berkonsultasi%20mengenai%20Darda%20Store."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Admin</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
