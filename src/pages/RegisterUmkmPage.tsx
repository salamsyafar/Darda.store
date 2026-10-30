import React, { useState } from 'react';
import { 
  Store, 
  User, 
  Phone, 
  Mail,
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowLeft, 
  Send, 
  Package, 
  HelpCircle,
  Clock,
  Check
} from 'lucide-react';
import { Category, ActivePage, UMKMApplication } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import { Logo } from '../components/Logo';
import { submitApplication } from '../firebase/service';

interface RegisterUmkmPageProps {
  categories: Category[];
  onNavigate: (page: ActivePage) => void;
}

export const RegisterUmkmPage: React.FC<RegisterUmkmPageProps> = ({
  categories,
  onNavigate,
}) => {
  // Form State
  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Kuliner');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [businessImage, setBusinessImage] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80');

  // Optional 1st Product
  const [includeProduct, setIncludeProduct] = useState(true);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productImage, setProductImage] = useState('https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80');

  // Agreements
  const [agreeHalal, setAgreeHalal] = useState(false);
  const [agreeMosqueCommunity, setAgreeMosqueCommunity] = useState(false);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<UMKMApplication | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const formatWhatsAppNumber = (val: string) => {
    let clean = val.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (!clean.startsWith('62') && clean.length > 0) {
      clean = '62' + clean;
    }
    return clean;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!ownerName.trim()) {
      setErrorMessage('Mohon cantumkan nama lengkap Anda sebagai pemilik usaha.');
      return;
    }
    if (!businessName.trim()) {
      setErrorMessage('Mohon cantumkan nama usaha / merk produk Anda.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Mohon cantumkan alamat email yang valid untuk pengiriman informasi akun seller.');
      return;
    }
    const cleanWa = formatWhatsAppNumber(whatsapp);
    if (cleanWa.length < 10) {
      setErrorMessage('Mohon masukkan nomor WhatsApp yang valid (contoh: 081234567890).');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Mohon cantumkan alamat tempat tinggal / usaha Anda.');
      return;
    }
    if (!agreeHalal || !agreeMosqueCommunity) {
      setErrorMessage('Mohon setujui akad komitmen halal dan keanggotaan komunitas jamaah.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        owner_name: ownerName.trim(),
        business_name: businessName.trim(),
        category,
        email: email.trim().toLowerCase(),
        whatsapp: cleanWa,
        address: address.trim(),
        description: description.trim() || `Usaha binaan jamaah Masjid Darussalam Dua oleh ${ownerName.trim()}`,
        image: businessImage,
        ...(includeProduct && productName.trim() && productPrice ? {
          first_product_name: productName.trim(),
          first_product_price: parseInt(productPrice, 10) || 0,
          first_product_image: productImage || businessImage
        } : {})
      };

      const result = await submitApplication(payload);
      setSubmittedApp(result);
    } catch (err: unknown) {
      console.error('Gagal mengajukan pendaftaran:', err);
      setErrorMessage('Terjadi kendala saat mengirim pengajuan. Silakan coba kembali atau hubungi pengurus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp link for notifying Mosque Admin
  const mosqueAdminWa = '6287877686424';
  const getConfirmationWaUrl = () => {
    if (!submittedApp) return '';
    const text = encodeURIComponent(
      `Assalamu'alaikum Pengurus Masjid Darussalam Dua / Darda Store,\n\nSaya telah mengisi Formulir Pendaftaran Mandiri UMKM:\n- Nama Pemilik: ${submittedApp.owner_name}\n- Nama Usaha: ${submittedApp.business_name}\n- Kategori: ${submittedApp.category}\n- No. WA: ${submittedApp.whatsapp}\n- Kode Registrasi: ${submittedApp.id}\n\nMohon bantuannya untuk peninjauan dan aktivasi di katalog Darda Store. Terima kasih, Jazakumullah khairan.`
    );
    return `https://wa.me/${mosqueAdminWa}?text=${text}`;
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#064E3B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </button>
          <span className="text-xs font-medium text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Program Mandiri Jamaah
          </span>
        </div>

        {/* Success Modal / Screen */}
        {submittedApp ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-sm text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-5">
              <Logo size="lg" variant="full" />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#064E3B] border border-emerald-200 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <CheckCircle2 className="w-8 h-8 text-[#064E3B]" />
            </div>

            <span className="text-xs font-semibold tracking-wider uppercase text-[#D4AF37] block mb-1">
              Alhamdulillah! Pendaftaran Berhasil Terkirim
            </span>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              Data Usaha Anda Telah Masuk Antrean Review
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mb-6 leading-relaxed max-w-lg mx-auto">
              Jazakumullah khairan <strong className="text-stone-900">{submittedApp.owner_name}</strong>. 
              Pengajuan untuk <strong className="text-stone-900">{submittedApp.business_name}</strong> telah 
              tersimpan di sistem database Darda Store.
            </p>

            {/* Registration Summary Card */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left mb-6 space-y-2.5 text-xs text-stone-700">
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">ID Pengajuan:</span>
                <span className="font-mono font-bold text-stone-800">{submittedApp.id}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">Nama Usaha / Merk:</span>
                <span className="font-semibold text-stone-800">{submittedApp.business_name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">Email Seller:</span>
                <span className="font-semibold text-stone-800">{submittedApp.email || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">Kategori Usaha:</span>
                <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">{submittedApp.category}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500">Status Peninjauan:</span>
                <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Menunggu Persetujuan Pengurus
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Waktu Kirim:</span>
                <span>{new Date(submittedApp.created_at).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Next Steps Notification */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 text-left mb-8 flex gap-3.5">
              <ShieldCheck className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950 space-y-1.5">
                <p className="font-bold">Alur Peninjauan & Aktivasi Akun:</p>
                <p className="leading-relaxed">
                  1. Formulir Anda sedang dalam tahap <strong>peninjauan oleh Pengurus/Admin Masjid Darussalam Dua</strong>.
                </p>
                <p className="leading-relaxed">
                  2. Setiap pengajuan yang <strong>disetujui (Approve)</strong> oleh Admin akan secara otomatis mendapatkan <strong>Username dan Password</strong> login untuk mengelola toko dan katalog produk.
                </p>
                <p className="leading-relaxed">
                  3. Kredensial akun akan dikirimkan langsung oleh Pengurus ke <strong>WhatsApp ({submittedApp.whatsapp})</strong> serta salinan ke email Anda ({submittedApp.email || '-'}).
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={getConfirmationWaUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all shadow-xs"
              >
                <Phone className="w-4 h-4" />
                Konfirmasi ke Pengurus via WhatsApp
              </a>

              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#064E3B] hover:bg-[#047857] text-white transition-all shadow-xs"
              >
                <Package className="w-4 h-4 text-[#D4AF37]" />
                Lihat Katalog Darda Store
              </button>
            </div>
          </div>
        ) : (
          /* Main Registration Form View */
          <div>
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#064E3B] to-[#043e30] rounded-3xl p-6 sm:p-10 text-white shadow-sm mb-8 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] mb-3 backdrop-blur-xs">
                  <Store className="w-3.5 h-3.5" />
                  Pemberdayaan UMKM Jamaah
                </div>
                <h1 className="font-serif-title text-2xl sm:text-4xl font-bold tracking-tight mb-2">
                  Formulir Pendaftaran Mandiri UMKM
                </h1>
                <p className="text-stone-200 text-sm sm:text-base leading-relaxed mb-4">
                  Dukung perputaran ekonomi umat. Daftarkan usaha atau produk olahan Anda di 
                  <strong> Darda Store</strong> agar mudah ditemukan dan dipesan oleh seluruh jamaah Masjid Darussalam Dua.
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-stone-200">
                  <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    100% Gratis Tanpa Biaya Pendaftaran
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Pemesanan Langsung ke WhatsApp Anda
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Binaan Pengurus Masjid Darussalam Dua
                  </div>
                </div>
              </div>

              {/* Decorative motif with Official Logo Emblem */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none hidden md:flex items-center justify-center p-6">
                <Logo size="xl" variant="icon" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Column */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
                {errorMessage && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* BAGIAN 1: IDENTITAS PEMILIK & KONTAK */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <h2 className="font-serif-title text-base font-bold text-stone-900">
                        Identitas Pemilik & Kontak Jamaah
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Nama Lengkap Jamaah <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Bpk. Ahmad Fauzi"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                          />
                          <User className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Alamat Email Aktif <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder="contoh: ahmad.fauzi@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                          />
                          <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1">
                          Untuk pengiriman informasi akun seller saat disetujui.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="081234567890"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                          />
                          <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1">
                          Untuk menerima pesanan jamaah & kiriman kredensial dari admin.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Alamat Tinggal / Usaha <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Jl. Darussalam No. 12, RT 03"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                          />
                          <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BAGIAN 2: PROFIL USAHA */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <h2 className="font-serif-title text-base font-bold text-stone-900">
                        Profil Usaha / Merk Dagang
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Nama Usaha / Merk <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Dapur Berkah Ummi, Madu Murni Al-Ikhlas"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Kategori Bidang Usaha <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] bg-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Deskripsi Singkat Usaha & Nilai Tambah
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Jelaskan produk apa saja yang Anda sediakan, kebersihan, rasa, bahan yang dipakai, atau keunggulan layanan..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                      />
                    </div>

                    {/* Image Upload for UMKM */}
                    <div>
                      <ImageUpload
                        label="Foto Tempat Usaha / Logo / Banner UMKM"
                        value={businessImage}
                        onChange={setBusinessImage}
                      />
                    </div>
                  </div>

                  {/* BAGIAN 3: PRODUK PERDANA (OPSIONAL / DISARANKAN) */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <h2 className="font-serif-title text-base font-bold text-stone-900">
                          Produk Pertama yang Ingin Ditampilkan
                        </h2>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeProduct}
                          onChange={(e) => setIncludeProduct(e.target.checked)}
                          className="rounded text-[#064E3B] focus:ring-[#064E3B]"
                        />
                        <span>Sertakan 1 produk sekarang</span>
                      </label>
                    </div>

                    {includeProduct && (
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Nama Produk Unggulan
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Brownies Panggang Premium (Isi 12)"
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Harga Produk (Rp)
                            </label>
                            <input
                              type="number"
                              placeholder="35000"
                              value={productPrice}
                              onChange={(e) => setProductPrice(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] bg-white"
                            />
                          </div>
                        </div>

                        <ImageUpload
                          label="Foto Produk Unggulan"
                          value={productImage}
                          onChange={setProductImage}
                        />
                      </div>
                    )}
                  </div>

                  {/* BAGIAN 4: AKAD & KOMITMEN KEJUJURAN */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <h2 className="font-serif-title text-base font-bold text-stone-900">
                        Akad Komitmen & Kebersihan
                      </h2>
                    </div>

                    <div className="space-y-2.5 text-xs text-stone-700">
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={agreeHalal}
                          onChange={(e) => setAgreeHalal(e.target.checked)}
                          className="mt-0.5 rounded text-[#064E3B] focus:ring-[#064E3B]"
                        />
                        <span className="leading-relaxed">
                          <strong>Jaminan Halal & Thayyib:</strong> Saya menyatakan bahwa produk yang saya jual halal dari segi bahan, pengolahan, dan tidak melanggar syariat Islam.
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={agreeMosqueCommunity}
                          onChange={(e) => setAgreeMosqueCommunity(e.target.checked)}
                          className="mt-0.5 rounded text-[#064E3B] focus:ring-[#064E3B]"
                        />
                        <span className="leading-relaxed">
                          <strong>Kejujuran & Muamalah Baik:</strong> Saya berkomitmen untuk jujur dalam timbangan, deskripsi produk, serta melayani sesama jamaah dengan ramah dan amanah.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-stone-500">
                      Pengajuan akan ditinjau oleh tim pengurus Masjid Darussalam Dua dalam 1x24 jam.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm bg-[#064E3B] hover:bg-[#047857] text-white transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Menyimpan Pengajuan...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#D4AF37]" />
                          <span>Kirim Pendaftaran UMKM</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs sticky top-28">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Pratinjau Profil di Web
                    </span>
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                      Live Preview
                    </span>
                  </div>

                  {/* Card Simulation */}
                  <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-xs">
                    <div className="aspect-video w-full bg-stone-100 relative">
                      <img
                        src={businessImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'}
                        alt="Preview Usaha"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#064E3B] font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                        {category || 'Kuliner'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-serif-title font-bold text-base text-stone-900 leading-tight">
                        {businessName || 'Nama Usaha Anda'}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <User className="w-3 h-3 text-[#D4AF37]" />
                        {ownerName || 'Nama Pemilik Usaha'}
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {description || 'Deskripsi usaha dan keunggulan produk Anda akan muncul di sini...'}
                      </p>
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {address ? (address.length > 25 ? address.substring(0, 25) + '...' : address) : 'Lingkungan Masjid'}
                        </span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> WhatsApp Siap
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* First product preview if enabled */}
                  {includeProduct && productName && (
                    <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                      <img
                        src={productImage || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=200&q=80'}
                        alt="Product preview"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {productName}
                        </p>
                        <p className="text-xs font-bold text-[#064E3B]">
                          Rp {(parseInt(productPrice, 10) || 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Approval flow guidance card */}
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Alur Persetujuan Akun Seller</span>
                    </div>
                    <ul className="text-[11px] text-amber-950/90 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Pengajuan Anda akan ditinjau oleh Admin Masjid.</li>
                      <li>Setelah disetujui, Anda akan mendapatkan <strong>Username & Password</strong> resmi.</li>
                      <li>Kredensial login dikirimkan ke <strong>WhatsApp</strong> dan salinan ke <strong>Email</strong> Anda.</li>
                    </ul>
                  </div>

                  {/* Mosque endorsement notice */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
                    <HeartHandshake className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-emerald-950 leading-relaxed">
                      Program ini murni dipersembahkan oleh DKM Masjid Darussalam Dua untuk membantu memperluas rezeki keluarga jamaah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
