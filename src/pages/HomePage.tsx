import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Coins, 
  Store, 
  Compass, 
  MessageCircle,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Heart,
  Search,
  BookOpen
} from 'lucide-react';
import { ActivePage, Category, Product, UMKM } from '../types';
import { ProductCard } from '../components/ProductCard';
import { UmkmCard } from '../components/UmkmCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { Logo } from '../components/Logo';
import { INITIAL_BAZAR_EVENTS } from '../data/initialData';

interface HomePageProps {
  categories: Category[];
  products: Product[];
  umkms: UMKM[];
  onNavigate: (page: ActivePage) => void;
  onSelectProduct: (product: Product) => void;
  onSelectUmkm: (umkmId: string) => void;
  onSelectCategory: (categoryName: string) => void;
  onAddToCart?: (product: Product) => void;
  cartProductIds?: Set<string>;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  products,
  umkms,
  onNavigate,
  onSelectProduct,
  onSelectUmkm,
  onSelectCategory,
  onAddToCart,
  cartProductIds,
}) => {
  const [umkmSearch, setUmkmSearch] = useState('');
  const [umkmCategoryFilter, setUmkmCategoryFilter] = useState('Semua');

  // Published products only
  const publishedProducts = useMemo(() => {
    return products.filter((p) => p.status === 'published');
  }, [products]);

  const featuredProducts = useMemo(() => {
    return publishedProducts.filter((p) => p.is_featured).slice(0, 4);
  }, [publishedProducts]);

  // Special "Jumat Berkah & Paket Sedekah" products
  const jumatBerkahProducts = useMemo(() => {
    return publishedProducts.filter((p) => p.is_jumat_berkah).slice(0, 4);
  }, [publishedProducts]);

  // All active verified UMKM
  const allActiveUmkms = useMemo(() => {
    return umkms.filter((u) => u.status === 'active');
  }, [umkms]);

  // Filtered UMKM for the exploration section
  const filteredUmkms = useMemo(() => {
    return allActiveUmkms.filter((u) => {
      if (umkmCategoryFilter !== 'Semua' && u.category !== umkmCategoryFilter) {
        return false;
      }
      if (umkmSearch.trim()) {
        const q = umkmSearch.toLowerCase();
        return (
          u.business_name.toLowerCase().includes(q) ||
          u.owner_name.toLowerCase().includes(q) ||
          u.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allActiveUmkms, umkmSearch, umkmCategoryFilter]);

  // Helper to find umkm by id
  const getUmkm = (id: string) => umkms.find((u) => u.id === id);

  return (
    <div className="space-y-16 pb-20 bg-[#F8F4E9]">
      {/* ========================================================
          1. HERO SECTION — MATCHING DARDA.STORE BRAND SHOWCASE
          Palette: Forest Green (#0F3D2E), Fresh Green (#2E7D32),
          Warm Gold (#D4AF37), Cream (#F8F4E9)
      ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F4E9] via-[#F5EFE0] to-[#F8F4E9] border-b border-[#E5DEC9] pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Left Islamic Arch Architectural Motif (Matching Brand Showcase) */}
        <svg
          className="absolute left-0 bottom-0 h-[85%] w-auto text-[#ECE4CE] pointer-events-none select-none opacity-80"
          viewBox="0 0 260 600"
          fill="none"
          preserveAspectRatio="xMinYMax slice"
        >
          <path
            d="M0 40 C95 90 140 160 140 250 C195 265 240 330 240 420 L240 600 L0 600 Z"
            fill="currentColor"
          />
          <path
            d="M0 140 C65 180 100 235 100 310 C145 325 180 380 180 455 L180 600"
            stroke="#F8F4E9"
            strokeWidth="14"
          />
        </svg>

        {/* Right Islamic Arch Architectural Motif (Matching Brand Showcase) */}
        <svg
          className="absolute right-0 bottom-0 h-[75%] w-auto text-[#ECE4CE] pointer-events-none select-none opacity-80"
          viewBox="0 0 260 600"
          fill="none"
          preserveAspectRatio="xMaxYMax slice"
        >
          <path
            d="M260 120 C175 165 135 230 135 310 C80 325 35 385 35 465 L35 600 L260 600 Z"
            fill="currentColor"
          />
          <path
            d="M260 220 C200 255 170 305 170 375 C125 390 95 440 95 510 L95 600"
            stroke="#F8F4E9"
            strokeWidth="12"
          />
        </svg>

        {/* Subtle Top-Right Palm Frond Natural Shadow Ambience */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-[#2E7D32]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Brand Lockup, Headline & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#DED6C1] text-xs font-bold text-[#0F3D2E] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                <span>Katalog Resmi UMKM Masjid Darussalam Dua</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-[#0F3D2E] leading-[1.12] text-balance">
                  Dari Masjid <span className="text-[#2E7D32]">Untuk UMKM</span>, Belanja Berkah Setiap Hari
                </h1>
                <p className="text-base sm:text-lg text-[#0F3D2E]/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Temukan produk halal & berkualitas karya jamaah Masjid Darussalam Dua. Mulai dari kuliner rumahan, madu murni, sayuran segar hidroponik rooftop, hingga busana muslim terpercaya.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  id="hero-btn-explore"
                  onClick={() => onNavigate('products')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#0F3D2E] hover:bg-[#2E7D32] text-[#F8F4E9] font-bold text-sm shadow-lg shadow-[#0F3D2E]/15 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                  <span>Jelajahi Katalog Produk</span>
                </button>

                <button
                  id="hero-btn-register"
                  onClick={() => onNavigate('register-umkm')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white hover:bg-[#EFE9D8] text-[#0F3D2E] font-bold text-sm border border-[#DED6C1] shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-[#2E7D32]" />
                  <span>Daftarkan UMKM Jamaah</span>
                </button>
              </div>

              {/* 4 Trust Indicators */}
              <div className="pt-6 border-t border-[#E5DEC9] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#0F3D2E]/85 font-semibold">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>Terverifikasi DKM</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Muamalah Amanah</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Coins className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>0% Komisi Masjid</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <MessageCircle className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>Langsung WA Seller</span>
                </div>
              </div>
            </div>

            {/* Right Column: Official darda.store Brand Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-white rounded-3xl p-3 sm:p-4 border border-[#E2DAC4] shadow-xl shadow-[#0F3D2E]/8">
                <div className="relative overflow-hidden rounded-2xl bg-[#F8F4E9] border border-[#EDE6D3]">
                  <img
                    src="/assets/aistudio/Darda.store_Islamic_Brand_Showcase_ba51a77d.png"
                    alt="darda.store — Dari Masjid Untuk UMKM Official Brand Identity"
                    className="w-full h-auto object-cover select-none"
                  />
                </div>

                {/* Bottom Caption Bar inside Showcase Card */}
                <div className="mt-3 px-2 py-1.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-brand font-extrabold text-[#0F3D2E]">darda.</span>
                    <span className="font-brand font-semibold text-[#2E7D32] -ml-2">store</span>
                    <span className="text-[#0F3D2E]/40">•</span>
                    <span className="text-[11px] font-medium text-[#0F3D2E]/75">
                      Masjid Darussalam Dua
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#0F3D2E] border border-white shadow-2xs" title="Forest Green #0F3D2E" />
                    <span className="w-3 h-3 rounded-full bg-[#2E7D32] border border-white shadow-2xs" title="Fresh Green #2E7D32" />
                    <span className="w-3 h-3 rounded-full bg-[#D4AF37] border border-white shadow-2xs" title="Warm Gold #D4AF37" />
                    <span className="w-3 h-3 rounded-full bg-[#F8F4E9] border border-[#DED6C1] shadow-2xs" title="Cream #F8F4E9" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. KATEGORI PILIHAN
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
              Pilihan Kategori
            </span>
            <h2 className="font-serif-title text-2xl font-bold text-[#0F3D2E] mt-0.5">
              Kategori Produk Jamaah
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0F3D2E] hover:text-[#2E7D32] hover:underline cursor-pointer"
          >
            <span>Semua Kategori</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const count = publishedProducts.filter((p) => p.category === cat.name).length;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="group p-5 rounded-2xl bg-white border border-[#E5DEC9] hover:border-[#2E7D32] hover:shadow-md transition-all text-left flex flex-col justify-between h-32 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F8F4E9] text-[#0F3D2E] group-hover:bg-[#0F3D2E] group-hover:text-[#D4AF37] transition-colors flex items-center justify-center border border-[#E5DEC9]">
                  <CategoryIcon name={cat.name} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F3D2E] text-sm group-hover:text-[#2E7D32] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#0F3D2E]/60 block mt-0.5 tabular-nums">
                    {count} Produk
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. FITUR KHAS MASJID: JUMAT BERKAH & PAKET SEDEKAH JAMAAH
      ======================================================== */}
      {jumatBerkahProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border-2 border-[#D4AF37]/60 p-6 sm:p-10 shadow-xs relative overflow-hidden">
            {/* Header with Mosque Icon */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D4AF37] text-[#0F3D2E] shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Program Keberkahan Masjid</span>
                </div>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#0F3D2E] mt-2">
                  Jumat Berkah & Paket Sedekah Jamaah
                </h2>
                <p className="text-xs sm:text-sm text-[#0F3D2E]/75 max-w-2xl leading-relaxed">
                  Pesan paket makanan, camilan berkah, sayuran rooftop, atau madu santri untuk disalurkan ke jamaah Sholat Jumat atau santri tahfidz Masjid Darussalam Dua.
                </p>
              </div>

              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:text-[#0F3D2E] hover:underline shrink-0 cursor-pointer"
              >
                <span>Lihat Semua Paket Berkah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Product Cards for Jumat Berkah */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {jumatBerkahProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  umkm={getUmkm(prod.umkm_id)}
                  onSelectProduct={onSelectProduct}
                  onSelectUmkm={onSelectUmkm}
                  onAddToCart={onAddToCart}
                  isInCart={cartProductIds?.has(prod.id)}
                />
              ))}
            </div>

            {/* Info note */}
            <div className="mt-8 pt-6 border-t border-[#E5DEC9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#0F3D2E]/80">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Bisa request pengiriman langsung ke Pos DKM Masjid sebelum sholat Jumat dimulai.</span>
              </div>
              <span className="font-bold text-[#0F3D2E] bg-[#F8F4E9] px-3.5 py-1.5 rounded-xl border border-[#DED6C1]">
                Pahala Berlipat & Menghidupkan UMKM Jamaah
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          4. FEATURED PRODUCTS (PRODUK UNGGULAN)
      ======================================================== */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Pilihan Favorit Jamaah</span>
              </div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#0F3D2E] mt-1">
                Produk Unggulan
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F3D2E] hover:text-[#2E7D32] hover:underline cursor-pointer"
            >
              <span>Lihat Semua Produk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                umkm={getUmkm(prod.umkm_id)}
                onSelectProduct={onSelectProduct}
                onSelectUmkm={onSelectUmkm}
                onAddToCart={onAddToCart}
                isInCart={cartProductIds?.has(prod.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          5. FITUR KHAS MASJID: PAPAN AGENDA & BAZAR MASJID
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F3D2E] text-[#F8F4E9] rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden border border-[#1B5E46]">
          {/* Decorative Mosque Arch Overlay */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
            <Store className="w-96 h-96" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-white/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  Agenda Berkah Jamaah
                </span>
                <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2">
                  Papan Agenda: Pojok Berkah Masjid Darussalam Dua
                </h2>
                <p className="text-[#F8F4E9]/80 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                  Semarakkan perputaran ekonomi umat dan silaturahmi jamaah ba'da sholat di lingkungan Masjid Darussalam Dua.
                </p>
              </div>

              <button
                onClick={() => {
                  const waUrl = `https://wa.me/6287877686424?text=${encodeURIComponent(
                    "Assalamu'alaikum Pengurus DKM Masjid Darussalam Dua,\nSaya jamaah berminat untuk mendaftar stan / lapak pada Pojok Berkah Jumat berikutnya. Bagaimana prosedurnya?"
                  )}`;
                  window.open(waUrl, '_blank', 'noopener,noreferrer');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c29f30] text-[#0F3D2E] font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>Daftar Lapak Pojok Berkah</span>
              </button>
            </div>

            {/* Pojok Berkah Event Highlight Card */}
            <div className="w-full">
              {INITIAL_BAZAR_EVENTS.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/15 transition-all shadow-lg"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#0F3D2E] shadow-xs">
                        {event.day}
                      </span>
                      <span className="text-xs text-[#F8F4E9] flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-lg border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{event.time}</span>
                      </span>
                    </div>

                    <h3 className="font-serif-title font-bold text-xl sm:text-2xl text-white">
                      {event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#F8F4E9]/85 leading-relaxed max-w-2xl">
                      {event.description}
                    </p>

                    <div className="pt-2 flex items-start gap-2 text-xs text-[#F8F4E9]/75">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5">
                    <button
                      onClick={() => {
                        const waUrl = `https://wa.me/6287877686424?text=${encodeURIComponent(
                          "Assalamu'alaikum Pengurus DKM Masjid Darussalam Dua,\nSaya ingin berpartisipasi atau menyalurkan sedekah makanan pada Pojok Berkah Ba'da Sholat Jumat."
                        )}`;
                        window.open(waUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F8F4E9] text-[#0F3D2E] hover:bg-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4 text-[#2E7D32]" />
                      <span>Partisipasi Sedekah / Lapak</span>
                    </button>
                    <span className="text-[11px] text-center text-[#F8F4E9]/70">
                      Sekretariat DKM Masjid Darussalam Dua
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. JELAJAHI MITRA UMKM TERVERIFIKASI (VERIFIED UMKM EXPLORATION)
      ======================================================== */}
      <section className="bg-[#EFE9D8]/70 py-16 border-y border-[#E2DAC4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-white px-3.5 py-1 rounded-full border border-[#DED6C1]">
              Pilar Ekonomi Jamaah
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#0F3D2E]">
              Daftar Mitra UMKM Terverifikasi DKM
            </h2>
            <p className="text-xs sm:text-sm text-[#0F3D2E]/75">
              Semua toko di bawah ini telah terverifikasi amanah oleh Pengurus Masjid Darussalam Dua. Klik untuk melihat katalog produk mereka atau chat WhatsApp langsung ke pemilik toko!
            </p>
          </div>

          {/* Search & Category Filter for UMKM */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={umkmSearch}
                onChange={(e) => setUmkmSearch(e.target.value)}
                placeholder="Cari toko UMKM atau nama pemilik..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED6C1] bg-white text-xs text-[#0F3D2E] focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#2E7D32] absolute left-3 top-3" />
            </div>

            <select
              value={umkmCategoryFilter}
              onChange={(e) => setUmkmCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#DED6C1] bg-white text-xs font-semibold text-[#0F3D2E] focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
            >
              <option value="Semua">Semua Kategori Usaha</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* UMKM Cards Grid */}
          {filteredUmkms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUmkms.map((umkm) => {
                const count = products.filter((p) => p.umkm_id === umkm.id && p.status === 'published').length;
                return (
                  <UmkmCard
                    key={umkm.id}
                    umkm={umkm}
                    productCount={count}
                    onSelectUmkm={onSelectUmkm}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E5DEC9] p-8">
              <Store className="w-10 h-10 text-[#0F3D2E]/30 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#0F3D2E]">Tidak ada toko UMKM yang cocok dengan kata kunci</p>
              <button
                onClick={() => {
                  setUmkmSearch('');
                  setUmkmCategoryFilter('Semua');
                }}
                className="mt-3 text-xs text-[#2E7D32] font-bold hover:underline"
              >
                Reset Pencarian Toko
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          7. ADAB MUAMALAH & DOA KEBERKAHAN
      ======================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#D4AF37]/50 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 text-[#0F3D2E] flex items-center justify-center shrink-0 border border-[#D4AF37]/40">
            <BookOpen className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div className="space-y-1 text-center md:text-left flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
              Adab Muamalah & Perniagaan Islami
            </span>
            <p className="text-sm italic font-serif text-[#0F3D2E] leading-relaxed">
              "Pedagang yang jujur dan dapat dipercaya (amanah) akan bersama para Nabi, orang-orang yang shiddiq, dan para syuhada."
            </p>
            <p className="text-xs text-[#0F3D2E]/70 font-medium pt-1">
              (HR. Tirmidzi no. 1209, hadits hasan) • Berbelanja di darda.store diniatkan untuk saling membantu dan memajukan saudara seiman.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. WHY DARDA STORE SECTION
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E5DEC9] p-8 sm:p-12 lg:p-16 shadow-xs">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="flex justify-center mb-4">
              <Logo size="md" variant="full" showTagline={true} />
            </div>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-bold text-[#0F3D2E] mt-3">
              Mengapa Berbelanja di darda.store?
            </h2>
            <p className="text-sm text-[#0F3D2E]/75 mt-3 leading-relaxed">
              Platform ini dibangun atas asas tolong-menolong (ta'awun) dalam kebaikan dan ketakwaan, 
              menghubungkan kebutuhan harian jamaah langsung ke pedagang muslim terpercaya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Komunitas & Ukhuwah */}
            <div className="p-6 rounded-2xl bg-[#F8F4E9] border border-[#E5DEC9] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-[#0F3D2E]">
                Komunitas & Ukhuwah
              </h3>
              <p className="text-xs text-[#0F3D2E]/75 leading-relaxed">
                Setiap transaksi mempererat tali persaudaraan sesama jamaah Masjid Darussalam Dua 
                dan memperkuat ketahanan ekonomi keluarga.
              </p>
              <ul className="space-y-1.5 text-xs text-[#0F3D2E] pt-2 border-t border-[#E5DEC9]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Membeli dari tetangga & saudara seiman</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Kualitas produk dijaga dengan amanah</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: Nilai Islami & Berkah */}
            <div className="p-6 rounded-2xl bg-[#F8F4E9] border border-[#E5DEC9] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 text-[#0F3D2E] flex items-center justify-center border border-[#D4AF37]/40">
                <Award className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-[#0F3D2E]">
                Keberkahan & Nilai Islami
              </h3>
              <p className="text-xs text-[#0F3D2E]/75 leading-relaxed">
                Menjunjung tinggi etika muamalah syar'i: kejujuran timbangan, transparansi kondisi barang, 
                serta kehalalan bahan baku.
              </p>
              <ul className="space-y-1.5 text-xs text-[#0F3D2E] pt-2 border-t border-[#E5DEC9]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Bebas riba dan tanpa potongan komisi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Doa keberkahan dari pedagang yang sholeh</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3: Kemudahan & WhatsApp Langsung */}
            <div className="p-6 rounded-2xl bg-[#F8F4E9] border border-[#E5DEC9] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-[#0F3D2E]">
                Simpel & Langsung WhatsApp
              </h3>
              <p className="text-xs text-[#0F3D2E]/75 leading-relaxed">
                Tanpa perantara atau dompet digital yang membingungkan. Pesanan langsung masuk ke WhatsApp nomor resmi pemilik toko dengan rincian yang rapi.
              </p>
              <ul className="space-y-1.5 text-xs text-[#0F3D2E] pt-2 border-t border-[#E5DEC9]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Format pesan otomatis tersusun santun</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Bisa ambil di Pos DKM Masjid atau diantar</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Mosque Support Callout */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#F8F4E9] border border-[#D4AF37]/50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-white px-2.5 py-1 rounded-md border border-[#DED6C1]">
                Dari Masjid Untuk UMKM
              </span>
              <h4 className="font-serif-title font-bold text-lg sm:text-xl text-[#0F3D2E]">
                Punya Usaha atau Produk Sendiri?
              </h4>
              <p className="text-xs sm:text-sm text-[#0F3D2E]/75 max-w-xl">
                Daftarkan usaha Anda di darda.store. Gratis 100% tanpa potongan komisi, pesanan langsung masuk ke WhatsApp pribadi Anda!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('register-umkm')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F3D2E] text-white hover:bg-[#2E7D32] text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Daftarkan UMKM Sekarang</span>
              </button>
              <button
                onClick={() => {
                  const waUrl = `https://wa.me/6287877686424?text=${encodeURIComponent(
                    "Assalamu'alaikum Admin darda.store / Pengurus Masjid Darussalam Dua,\nSaya ingin berkonsultasi mengenai produk atau pendaftaran UMKM saya di darda.store."
                  )}`;
                  window.open(waUrl, '_blank', 'noopener,noreferrer');
                }}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white border border-[#DED6C1] text-[#0F3D2E] hover:bg-[#EFE9D8] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Tanya Pengurus (WA: 087877686424)</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
