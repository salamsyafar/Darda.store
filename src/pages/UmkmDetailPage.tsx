import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  MessageCircle, 
  ShieldCheck, 
  Tag, 
  Package, 
  Share2, 
  Check 
} from 'lucide-react';
import { Product, UMKM } from '../types';
import { createUmkmWhatsAppUrl } from '../utils/formatters';
import { ProductCard } from '../components/ProductCard';

interface UmkmDetailPageProps {
  umkm: UMKM;
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  cartProductIds?: Set<string>;
}

export const UmkmDetailPage: React.FC<UmkmDetailPageProps> = ({
  umkm,
  products,
  onBack,
  onSelectProduct,
  onAddToCart,
  cartProductIds,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleWhatsApp = () => {
    const url = createUmkmWhatsAppUrl(umkm.whatsapp, umkm.business_name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const publishedProducts = products.filter((p) => p.status === 'published');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#064E3B] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar UMKM</span>
      </button>

      {/* UMKM Profile Banner & Header */}
      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs">
        {/* Cover pattern */}
        <div className="h-40 sm:h-52 bg-gradient-to-r from-[#064E3B] to-[#047857] relative p-6 flex items-end justify-end">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <rect width="100%" height="100%" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3,3" />
            </svg>
          </div>
          <button
            onClick={handleCopyLink}
            className="relative z-10 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-medium backdrop-blur-xs flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Avatar Image */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-stone-100 shrink-0">
              <img
                src={umkm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                alt={umkm.business_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Action Button on Top Right */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                id="umkm-btn-contact-wa"
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Hubungi Penjual via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Business Info Details */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#064E3B]">
                  <Tag className="w-3 h-3 text-[#D4AF37]" />
                  {umkm.category}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#B89628]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  UMKM Binaan Masjid Darussalam Dua
                </span>
              </div>

              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                {umkm.business_name}
              </h1>

              <p className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 mt-1">
                <User className="w-4 h-4 text-stone-400" />
                <span>Pemilik: <strong className="text-stone-800">{umkm.owner_name}</strong></span>
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 leading-relaxed max-w-3xl whitespace-pre-line">
              {umkm.description}
            </p>

            {/* Location & WhatsApp Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 max-w-2xl">
              <div className="flex items-start gap-2 text-xs text-stone-600">
                <MapPin className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-800">Alamat Usaha:</strong>
                  <span>{umkm.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-stone-600">
                <MessageCircle className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-800">Kontak WhatsApp:</strong>
                  <span>+{umkm.whatsapp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products from this UMKM */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Katalog Penjual
            </span>
            <h2 className="font-serif-title text-2xl font-bold text-stone-900 mt-0.5">
              Semua Produk dari {umkm.business_name}
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {publishedProducts.length} Produk Tersedia
          </span>
        </div>

        {publishedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {publishedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                umkm={umkm}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                isInCart={cartProductIds?.has(p.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center max-w-md mx-auto space-y-3">
            <Package className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-sm">
              Belum ada produk dipublikasikan
            </h3>
            <p className="text-xs text-stone-500">
              Produk dari UMKM ini sedang dalam proses pembaharuan oleh pengurus masjid.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
