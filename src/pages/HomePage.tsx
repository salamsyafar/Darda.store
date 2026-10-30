import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Coins, 
  Store, 
  Compass, 
  TrendingUp, 
  MessageCircle,
  Award,
  CheckCircle2,
  Calendar,
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

  const latestProducts = useMemo(() => {
    return [...publishedProducts]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
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
    <div className="space-y-16 pb-20">
      {/* ========================================================
          1. HERO SECTION
          Headline: "Belanja Berkah, Dukung UMKM Jamaah"
      ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] to-[#043d2e] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle Islamic Geometric Backdrop Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="islamic-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 10 5 L 5 10 L 0 5 Z" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
                <circle cx="5" cy="5" r="1.5" fill="none" stroke="#D4AF37" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-grid)" />
          </svg>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Official Emblem & Badge */}
          <div className="flex flex-col items-center justify-center mb-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-[#D4AF37]/40 shadow-xl shadow-black/20 mb-3 hover:scale-105 transition-transform">
              <Logo size="md" variant="icon" />
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Katalog Resmi Masjid Darussalam Dua</span>
            </div>
          </div>

          {/* Darda Store Monogram / Brand Accent */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-[1px] w-8 sm:w-16 bg-[#D4AF37]/60" />
            <span className="font-brand text-xs sm:text-sm font-bold text-[#D4AF37] tracking-[0.35em] uppercase">
              DARDA STORE
            </span>
            <span className="h-[1px] w-8 sm:w-16 bg-[#D4AF37]/60" />
          </div>

          {/* Headline */}
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Belanja Berkah, Dukung UMKM Jamaah
          </h1>

          {/* Description */}
          <p className="mt-5 text-base sm:text-lg text-stone-200/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Temukan produk terbaik dari UMKM jamaah Masjid Darussalam Dua. 
            Mulai dari kuliner lezat, madu murni, sayur segar rooftop, hingga busana syar'i terpercaya.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              id="hero-btn-explore"
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#c29f30] text-[#064E3B] font-bold text-sm shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Jelajahi Produk</span>
            </button>

            <button
              id="hero-btn-register"
              onClick={() => onNavigate('register-umkm')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#D4AF37]" />
              <span>Daftarkan UMKM Anda</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-xs text-stone-300">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Terverifikasi DKM Masjid</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
              <span>Muamalah Berkah Amanah</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-4 h-4 text-[#D4AF37]" />
              <span>Bebas Biaya & Komisi</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Pesan Langsung ke WA Seller</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. KATEGORI PILIHAN
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Pilihan Kategori
            </span>
            <h2 className="font-serif-title text-2xl font-bold text-stone-900 mt-0.5">
              Kategori Produk
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#064E3B] hover:text-[#047857] hover:underline"
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
                className="group p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-[#064E3B] hover:shadow-md transition-all text-left flex flex-col justify-between h-32 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-white transition-colors flex items-center justify-center">
                  <CategoryIcon name={cat.name} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 text-sm group-hover:text-[#064E3B] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
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
          <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-emerald-900/5 to-amber-600/10 border-2 border-amber-300/80 p-6 sm:p-10 shadow-xs relative overflow-hidden">
            {/* Header with Mosque Icon */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Program Keberkahan Masjid</span>
                </div>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                  🌙 Jumat Berkah & Paket Sedekah Jamaah
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                  Pesan paket makanan, camilan berkah, sayuran rooftop, atau madu santri untuk disalurkan ke jamaah Sholat Jumat atau santri tahfidz Masjid Darussalam Dua.
                </p>
              </div>

              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E3B] hover:text-[#047857] hover:underline shrink-0"
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
            <div className="mt-8 pt-6 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Bisa request pengiriman langsung ke Pos DKM Masjid sebelum sholat Jumat dimulai.</span>
              </div>
              <span className="font-semibold text-[#064E3B] bg-white px-3 py-1 rounded-lg border border-amber-200">
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
              <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pilihan Favorit Jamaah</span>
              </div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Produk Unggulan
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] hover:text-[#047857] hover:underline cursor-pointer"
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
        <div className="bg-[#064E3B] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
          {/* Decorative Mosque Shape Overlay */}
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
                <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c29f30] text-[#064E3B] font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
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
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/15 transition-all shadow-lg"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#064E3B] shadow-xs">
                        {event.day}
                      </span>
                      <span className="text-xs text-stone-200 flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-lg border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{event.time}</span>
                      </span>
                    </div>

                    <h3 className="font-serif-title font-bold text-xl sm:text-2xl text-white">
                      {event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-2xl">
                      {event.description}
                    </p>

                    <div className="pt-2 flex items-start gap-2 text-xs text-stone-300">
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
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#064E3B] hover:bg-stone-100 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4 text-[#064E3B]" />
                      <span>Partisipasi Sedekah / Lapak</span>
                    </button>
                    <span className="text-[11px] text-center text-stone-300">
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
          Allows exploring ALL verified shops with search & category filter
      ======================================================== */}
      <section className="bg-stone-100/80 py-16 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-white px-3 py-1 rounded-full border border-stone-200">
              Pilar Ekonomi Jamaah
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900">
              Daftar Mitra UMKM Terverifikasi DKM
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>

            <select
              value={umkmCategoryFilter}
              onChange={(e) => setUmkmCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-700 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
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
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
              <Store className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">Tidak ada toko UMKM yang cocok dengan kata kunci</p>
              <button
                onClick={() => {
                  setUmkmSearch('');
                  setUmkmCategoryFilter('Semua');
                }}
                className="mt-3 text-xs text-[#064E3B] font-bold hover:underline"
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
        <div className="bg-amber-50/80 rounded-3xl border border-amber-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1 text-center md:text-left flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Adab Muamalah & Perniagaan Islami
            </span>
            <p className="text-sm italic font-serif text-stone-800 leading-relaxed">
              "Pedagang yang jujur dan dapat dipercaya (amanah) akan bersama para Nabi, orang-orang yang shiddiq, dan para syuhada."
            </p>
            <p className="text-xs text-stone-600 font-medium pt-1">
              (HR. Tirmidzi no. 1209, hadits hasan) • Berbelanja di Darda Store diniatkan untuk saling membantu dan memajukan saudara seiman.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. WHY DARDA STORE SECTION
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 lg:p-16 shadow-xs">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B] bg-emerald-50 px-3 py-1 rounded-full">
              Nilai Utama Kami
            </span>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-bold text-stone-900 mt-3">
              Mengapa Berbelanja di Darda Store?
            </h2>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              Platform ini dibangun atas asas tolong-menolong (ta'awun) dalam kebaikan dan ketakwaan, 
              menghubungkan kebutuhan harian jamaah langsung ke pedagang muslim terpercaya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Komunitas & Ukhuwah */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                Komunitas & Ukhuwah
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Setiap transaksi mempererat tali persaudaraan sesama jamaah Masjid Darussalam Dua 
                dan memperkuat ketahanan ekonomi keluarga.
              </p>
              <ul className="space-y-1.5 text-xs text-stone-700 pt-2 border-t border-stone-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Membeli dari tetangga & saudara seiman</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Kualitas produk dijaga dengan amanah</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: Nilai Islami & Berkah */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D4AF37] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                Keberkahan & Nilai Islami
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menjunjung tinggi etika muamalah syar'i: kejujuran timbangan, transparansi kondisi barang, 
                serta kehalalan bahan baku.
              </p>
              <ul className="space-y-1.5 text-xs text-stone-700 pt-2 border-t border-stone-200/60">
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
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                Simpel & Langsung WhatsApp
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tanpa perantara atau dompet digital yang membingungkan. Pesanan langsung masuk ke WhatsApp nomor resmi pemilik toko dengan rincian yang rapi.
              </p>
              <ul className="space-y-1.5 text-xs text-stone-700 pt-2 border-t border-stone-200/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Format pesan otomatis tersusun santun</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Bisa ambil di Pos DKM Masjid atau diantar</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Mosque Support Callout */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-stone-50 to-amber-50 border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-white px-2.5 py-1 rounded-md shadow-xs">
                Peluang Jamaah
              </span>
              <h4 className="font-serif-title font-bold text-lg sm:text-xl text-[#064E3B]">
                Punya Usaha atau Produk Sendiri?
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                Daftarkan usaha Anda di Darda Store. Gratis 100% tanpa potongan komisi, pesanan langsung masuk ke WhatsApp pribadi Anda!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('register-umkm')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#064E3B] text-white hover:bg-[#047857] text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Daftarkan UMKM Sekarang</span>
              </button>
              <button
                onClick={() => {
                  const waUrl = `https://wa.me/6287877686424?text=${encodeURIComponent(
                    "Assalamu'alaikum Admin Darda Store / Pengurus Masjid Darussalam Dua,\nSaya ingin berkonsultasi mengenai produk atau pendaftaran UMKM saya di DARDA STORE."
                  )}`;
                  window.open(waUrl, '_blank', 'noopener,noreferrer');
                }}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>Tanya Pengurus (WA: 087877686424)</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
