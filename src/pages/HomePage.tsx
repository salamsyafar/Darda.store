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
  Clock,
  MapPin,
  Search,
  BookOpen,
  Grid
} from 'lucide-react';
import { ActivePage, Category, Product, UMKM } from '../types';
import { ProductCard } from '../components/ProductCard';
import { UmkmCard } from '../components/UmkmCard';
import { CategoryIcon } from '../components/CategoryIcon';
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
  const [activeFeedTab, setActiveFeedTab] = useState<string>('Semua');
  const [umkmSearch, setUmkmSearch] = useState('');

  // Published products only
  const publishedProducts = useMemo(() => {
    return products.filter((p) => p.status === 'published');
  }, [products]);

  // Special "Jumat Berkah & Paket Sedekah" products
  const jumatBerkahProducts = useMemo(() => {
    return publishedProducts.filter((p) => p.is_jumat_berkah).slice(0, 4);
  }, [publishedProducts]);

  // Filtered products for the main Shopee-style "Rekomendasi" feed
  const feedProducts = useMemo(() => {
    if (activeFeedTab === 'Semua') return publishedProducts;
    if (activeFeedTab === 'Unggulan') return publishedProducts.filter((p) => p.is_featured);
    if (activeFeedTab === 'Jumat Berkah') return publishedProducts.filter((p) => p.is_jumat_berkah);
    return publishedProducts.filter((p) => p.category === activeFeedTab);
  }, [publishedProducts, activeFeedTab]);

  // All active verified UMKM
  const allActiveUmkms = useMemo(() => {
    return umkms.filter((u) => u.status === 'active');
  }, [umkms]);

  const filteredUmkms = useMemo(() => {
    if (!umkmSearch.trim()) return allActiveUmkms;
    const q = umkmSearch.toLowerCase();
    return allActiveUmkms.filter(
      (u) =>
        u.business_name.toLowerCase().includes(q) ||
        u.owner_name.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q)
    );
  }, [allActiveUmkms, umkmSearch]);

  const getUmkm = (id: string) => umkms.find((u) => u.id === id);

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 pt-3 sm:pt-5 bg-[#F8F4E9]">
      {/* =====================================================================
          1. SHOPEE-STYLE ASYMMETRIC BANNER GRID + TRUST INFO BAR
          (Desktop: 2/3 Main Banner + 1/3 Stacked Dual Promo Banners)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3">
          {/* Left 2/3 Main Hero Banner */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F3D2E] via-[#15523E] to-[#0F3D2E] text-[#F8F4E9] p-5 sm:p-7 border border-[#1E6B52] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Decorative Arch */}
            <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none" />

            <div className="space-y-3 text-center sm:text-left z-10 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37] text-[#0F3D2E] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3 h-3" />
                <span>darda.store Pilih Lokal Jamaah</span>
              </div>

              <h1 className="font-serif-title text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Dari Masjid <span className="text-[#D4AF37]">Untuk UMKM</span>, Belanja Halal & Berkah
              </h1>

              <p className="text-xs sm:text-sm text-[#F8F4E9]/85 leading-relaxed max-w-lg">
                Tempat belanja produk lokal jamaah Masjid Darussalam Dua: kuliner rumahan, madu murni, sayur hidroponik rooftop, & busana muslim.
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  id="hero-btn-explore"
                  onClick={() => onNavigate('products')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c5a02f] text-[#0F3D2E] font-extrabold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Belanja Sekarang</span>
                </button>
                <button
                  id="hero-btn-register"
                  onClick={() => onNavigate('register-umkm')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition-all cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Buka Toko Gratis</span>
                </button>
              </div>
            </div>

            {/* Official darda.store Logo Card inside Main Banner */}
            <div className="w-40 sm:w-44 md:w-48 shrink-0 z-10">
              <div className="bg-white p-2.5 rounded-2xl border-2 border-[#D4AF37]/50 shadow-lg">
                <img
                  src="/assets/aistudio/ChatGPT_Image_Oct_30__2026__05_03_22_PM-3_49f7d29b.png"
                  alt="darda.store — Dari Masjid Untuk UMKM"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Right 1/3 Stacked Dual Promo Banners (Mirrors Image 1 Right Side) */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
            {/* Top Small Banner: Darda Mall 100% Halal & Terverifikasi */}
            <div
              onClick={() => onNavigate('products')}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white p-3.5 sm:p-5 border border-[#2E7D32] shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-all"
            >
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded-xs text-[9px] font-extrabold uppercase tracking-wider bg-[#D4AF37] text-[#0F3D2E]">
                  100% Amanah DKM
                </span>
                <h2 className="font-serif-title font-bold text-sm sm:text-lg leading-snug">
                  Produk Lokal Jamaah Terverifikasi
                </h2>
                <p className="text-[10px] sm:text-xs text-white/85 line-clamp-2">
                  Bebas komisi 0%, langsung terhubung ke WhatsApp pemilik usaha.
                </p>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#D4AF37] group-hover:translate-x-0.5 transition-transform">
                <span>Cek Katalog</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Bottom Small Banner: Darda Barokah / Jumat Berkah */}
            <div
              onClick={() => {
                setActiveFeedTab('Jumat Berkah');
                const el = document.getElementById('rekomendasi-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8D6E1F] via-[#B38E2C] to-[#D4AF37] text-[#0F3D2E] p-3.5 sm:p-5 border border-[#D4AF37] shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md transition-all"
            >
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded-xs text-[9px] font-extrabold uppercase tracking-wider bg-[#0F3D2E] text-[#D4AF37]">
                  Darda Barokah
                </span>
                <h2 className="font-serif-title font-bold text-sm sm:text-lg text-white leading-snug">
                  Paket Sedekah & Jumat Berkah
                </h2>
                <p className="text-[10px] sm:text-xs text-white/90 line-clamp-2">
                  Salurkan konsumsi jamaah & santri tahfidz Masjid Darussalam Dua.
                </p>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-extrabold text-[#0F3D2E] bg-white/90 px-2.5 py-1 rounded-lg w-fit">
                <span>Pilih Paket Berkah</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Strip Bar (Mirrors Shopee Wallet/Guarantee Bar under Banner in Image 2) */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E5DEC9] px-3 py-2.5 sm:px-5 sm:py-3 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 border-r border-[#EFE9D8] pr-2">
            <div className="w-7 h-7 rounded-lg bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            </div>
            <div className="truncate">
              <div className="font-bold text-[#0F3D2E] truncate">Terverifikasi DKM</div>
              <div className="text-[10px] text-[#2E7D32] font-medium truncate">Amanah & Halal</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:border-r border-[#EFE9D8] pr-2">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 text-[#0F3D2E] flex items-center justify-center shrink-0">
              <Coins className="w-4 h-4 text-[#B38E2C]" />
            </div>
            <div className="truncate">
              <div className="font-bold text-[#0F3D2E] truncate">0% Potongan</div>
              <div className="text-[10px] text-[#0F3D2E]/65 truncate">100% Untuk UMKM</div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-r border-[#EFE9D8] pr-2 pt-1 sm:pt-0 border-t sm:border-t-0">
            <div className="w-7 h-7 rounded-lg bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-[#0F3D2E] truncate">Langsung WA</div>
              <div className="text-[10px] text-[#0F3D2E]/65 truncate">Respon Cepat Penjual</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 text-[#0F3D2E] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4 text-[#0F3D2E]" />
            </div>
            <div className="truncate">
              <div className="font-bold text-[#0F3D2E] truncate">{allActiveUmkms.length} Toko Jamaah</div>
              <div className="text-[10px] text-[#2E7D32] font-medium truncate">{publishedProducts.length} Produk Aktif</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. KATEGORI PRODUK ICON STRIP (Replaces Image 3 Icon Strip)
          Elevated White Card with Rounded-Square Icon Boxes + Badge + Indicator
          (Note: NO Shopee Live & Video section below this, per user request #2)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E5DEC9] p-3.5 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-[#2E7D32]" />
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#0F3D2E]">
                Kategori Produk Jamaah
              </h2>
            </div>
            <button
              onClick={() => onNavigate('categories')}
              className="text-[11px] sm:text-xs font-bold text-[#2E7D32] hover:text-[#0F3D2E] flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Horizontal Scrollable / Grid Icon Strip (Matches Image 3 Visual Layout) */}
          <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
            {/* 1. Semua Produk Icon Box */}
            <button
              onClick={() => onNavigate('products')}
              className="group flex flex-col items-center shrink-0 w-[72px] sm:w-auto cursor-pointer"
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F8F4E9] border border-[#DED6C1] group-hover:border-[#2E7D32] group-hover:bg-[#0F3D2E] flex items-center justify-center transition-all shadow-2xs mb-2">
                <Compass className="w-6 h-6 text-[#0F3D2E] group-hover:text-[#D4AF37] transition-colors" />
                <span className="absolute -bottom-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase bg-[#2E7D32] text-white shadow-2xs">
                  SEMUA
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-[#0F3D2E] text-center leading-tight line-clamp-2">
                Semua Produk
              </span>
            </button>

            {/* 2. Dynamic Product Categories from Database */}
            {categories.map((cat, idx) => {
              const count = publishedProducts.filter((p) => p.category === cat.name).length;
              const isHighlight = idx === 0 || idx === 2;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.name)}
                  className="group flex flex-col items-center shrink-0 w-[72px] sm:w-auto cursor-pointer"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F8F4E9] border border-[#DED6C1] group-hover:border-[#2E7D32] group-hover:bg-[#0F3D2E] flex items-center justify-center transition-all shadow-2xs mb-2">
                    <CategoryIcon
                      name={cat.name}
                      className="w-6 h-6 text-[#2E7D32] group-hover:text-[#D4AF37] transition-colors"
                    />
                    <span
                      className={`absolute -bottom-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase shadow-2xs ${
                        isHighlight
                          ? 'bg-[#D4AF37] text-[#0F3D2E]'
                          : 'bg-[#0F3D2E] text-[#F8F4E9]'
                      }`}
                    >
                      {count} ITEM
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-[#0F3D2E] group-hover:text-[#2E7D32] text-center leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                </button>
              );
            })}

            {/* 3. Special Jumat Berkah Category Icon Box */}
            <button
              onClick={() => {
                setActiveFeedTab('Jumat Berkah');
                const el = document.getElementById('rekomendasi-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex flex-col items-center shrink-0 w-[72px] sm:w-auto cursor-pointer"
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37] group-hover:bg-[#0F3D2E] flex items-center justify-center transition-all shadow-2xs mb-2">
                <Sparkles className="w-6 h-6 text-[#B38E2C] group-hover:text-[#D4AF37] transition-colors" />
                <span className="absolute -bottom-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase bg-[#D4AF37] text-[#0F3D2E] shadow-2xs">
                  BERKAH
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-[#0F3D2E] text-center leading-tight line-clamp-2">
                Jumat Berkah
              </span>
            </button>
          </div>

          {/* Bottom Pill Indicator Bar (Matches Image 3 Bottom Indicator) */}
          <div className="flex items-center justify-center mt-2">
            <div className="w-9 h-1 rounded-full bg-[#E5DEC9] overflow-hidden flex">
              <div className="w-5 h-full bg-[#0F3D2E] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. PROGRAM JUMAT BERKAH & SEDEKAH (2-COLUMN MOBILE PRODUCT GRID)
      ===================================================================== */}
      {jumatBerkahProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-[#D4AF37]/70 p-3.5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-[#EFE9D8]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-[#0F3D2E] text-[#D4AF37]">
                  <Sparkles className="w-3.5 h-3.5" />
                  JUMAT BERKAH
                </span>
                <span className="hidden sm:inline text-xs font-semibold text-[#0F3D2E]/75">
                  Paket Sedekah Konsumsi Jamaah & Santri Tahfidz
                </span>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32] hover:text-[#0F3D2E] shrink-0 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2 Columns on Mobile (grid-cols-2), 4 Columns on Desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
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
          </div>
        </section>
      )}

      {/* =====================================================================
          4. SHOPEE-STYLE DAILY DISCOVER / REKOMENDASI PRODUK JAMAAH
          (Sticky Category Filter Bar + 2-Column Mobile Grid)
      ===================================================================== */}
      <section id="rekomendasi-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3">
        {/* Shopee-Style Sticky Section Header with Bottom Accent Bar */}
        <div className="sticky top-[56px] sm:top-[104px] z-30 bg-white rounded-xl border border-[#E5DEC9] shadow-2xs overflow-hidden">
          <div className="px-4 py-3 border-b-2 border-[#0F3D2E] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#0F3D2E]">
                Rekomendasi Produk Jamaah
              </h2>
            </div>
            <span className="text-[11px] text-[#0F3D2E]/60 font-medium tabular-nums">
              {feedProducts.length} Produk
            </span>
          </div>

          {/* Filter Tabs inside Header */}
          <div className="px-3 py-2 bg-[#F8F4E9]/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {['Semua', 'Unggulan', 'Jumat Berkah', ...categories.map((c) => c.name)].map((tab) => {
              const isActive = activeFeedTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFeedTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0F3D2E] text-[#D4AF37] shadow-2xs font-bold'
                      : 'bg-white text-[#0F3D2E]/80 border border-[#E5DEC9] hover:border-[#2E7D32]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Mobile Product Grid (Requirement #3: Tampilan produk di HP dua kolom) */}
        {feedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {feedProducts.map((prod) => (
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
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5DEC9] p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-[#0F3D2E]">
              Belum ada produk pada tab "{activeFeedTab}"
            </p>
            <button
              onClick={() => setActiveFeedTab('Semua')}
              className="text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white hover:bg-[#EFE9D8] text-[#0F3D2E] font-bold text-xs border border-[#DED6C1] shadow-2xs transition-all cursor-pointer"
          >
            <span>Lihat Seluruh Katalog ({publishedProducts.length} Produk)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2E7D32]" />
          </button>
        </div>
      </section>

      {/* =====================================================================
          5. MITRA TOKO UMKM TERVERIFIKASI DKM
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2">
        <div className="bg-white rounded-2xl border border-[#E5DEC9] p-4 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE9D8] pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2E7D32]">
                Toko Resmi Jamaah
              </span>
              <h2 className="font-serif-title text-lg sm:text-xl font-bold text-[#0F3D2E]">
                Mitra UMKM Terverifikasi Masjid Darussalam Dua
              </h2>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={umkmSearch}
                onChange={(e) => setUmkmSearch(e.target.value)}
                placeholder="Cari nama toko UMKM..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#DED6C1] bg-[#F8F4E9] text-xs text-[#0F3D2E] focus:ring-2 focus:ring-[#2E7D32] focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-[#2E7D32] absolute left-2.5 top-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredUmkms.map((umkm) => {
              const count = products.filter(
                (p) => p.umkm_id === umkm.id && p.status === 'published'
              ).length;
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
        </div>
      </section>

      {/* =====================================================================
          6. AGENDA POJOK BERKAH & ADAB MUAMALAH COMPACT BANNER
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Pojok Berkah Masjid */}
        <div className="lg:col-span-7 bg-[#0F3D2E] text-[#F8F4E9] rounded-2xl p-5 sm:p-6 border border-[#1B5E46] flex flex-col justify-between gap-4">
          {INITIAL_BAZAR_EVENTS.map((event) => (
            <div key={event.id} className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-[#0F3D2E]">
                  {event.day}
                </span>
                <span className="text-xs text-[#F8F4E9]/85 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {event.time}
                </span>
              </div>
              <h3 className="font-serif-title font-bold text-lg sm:text-xl text-white">
                {event.title}
              </h3>
              <p className="text-xs text-[#F8F4E9]/80 leading-relaxed">
                {event.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-[#F8F4E9]/75">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>{event.location}</span>
                </div>
                <button
                  onClick={() => {
                    const waUrl = `https://wa.me/6287877686424?text=${encodeURIComponent(
                      "Assalamu'alaikum Pengurus DKM Masjid Darussalam Dua,\nSaya berminat mendaftar lapak / berpartisipasi pada Pojok Berkah Jumat."
                    )}`;
                    window.open(waUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0F3D2E] font-bold text-xs cursor-pointer shrink-0"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Daftar Lapak Pojok Berkah</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Adab Muamalah & Daftar UMKM Callout */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D4AF37]/50 p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 text-[#0F3D2E] flex items-center justify-center shrink-0 border border-[#D4AF37]/40">
              <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">
                Adab Perniagaan Islami
              </span>
              <p className="text-xs italic font-serif text-[#0F3D2E] leading-relaxed">
                "Pedagang yang jujur dan dapat dipercaya (amanah) akan bersama para Nabi, orang-orang yang shiddiq, dan para syuhada." (HR. Tirmidzi)
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EFE9D8] flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-[#0F3D2E]">Punya Produk UMKM?</div>
              <div className="text-[11px] text-[#0F3D2E]/65">Gratis 100% khusus jamaah</div>
            </div>
            <button
              onClick={() => onNavigate('register-umkm')}
              className="px-4 py-2 rounded-xl bg-[#0F3D2E] hover:bg-[#2E7D32] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Daftar UMKM →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
