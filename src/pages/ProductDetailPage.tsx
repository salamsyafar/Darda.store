import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  MapPin, 
  Store, 
  User, 
  Tag, 
  ShieldCheck, 
  Share2, 
  Check, 
  ChevronRight,
  Info,
  Plus,
  Minus,
  Truck,
  Heart,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Product, UMKM, ActivePage, CartItem } from '../types';
import { formatRupiah, createProductWhatsAppUrl } from '../utils/formatters';
import { ProductCard } from '../components/ProductCard';
import { recordWhatsAppInquiry } from '../firebase/service';

interface ProductDetailPageProps {
  product: Product;
  umkm?: UMKM;
  relatedProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectUmkm: (umkmId: string) => void;
  onNavigate: (page: ActivePage) => void;
  onAddToCart?: (product: Product, quantity?: number, note?: string) => void;
  onOpenCart?: () => void;
  isInCart?: boolean;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  umkm,
  relatedProducts,
  onBack,
  onSelectProduct,
  onSelectUmkm,
  onNavigate,
  onAddToCart,
  onOpenCart,
  isInCart = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  
  // Interactive order configuration
  const [quantity, setQuantity] = useState(1);
  const [fulfillment, setFulfillment] = useState<'masjid' | 'antar' | 'sedekah'>('masjid');
  const [customerName, setCustomerName] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const fulfillmentLabels = {
    masjid: 'Ambil Mandiri di Masjid Darussalam Dua (Sekretariat: Jl. Pertamina, Ongkoe, Temmapaduae, Marusu, Kab. Maros)',
    antar: 'Kirim / Antar ke Rumah (Alamat Sekitar Marusu / Ongkoe)',
    sedekah: 'Salurkan sebagai Sedekah Makanan / Paket Berkah Jamaah Masjid'
  };

  // Direct seller routing
  const sellerPhone = umkm?.whatsapp || '6287877686424';

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity, customerNote);
      setJustAddedToCart(true);
      setTimeout(() => setJustAddedToCart(false), 2000);
    }
  };

  const handleWhatsAppOrder = () => {
    recordWhatsAppInquiry();
    const waUrl = createProductWhatsAppUrl(
      sellerPhone,
      product.name,
      umkm?.business_name,
      product.price,
      {
        quantity,
        fulfillment: fulfillmentLabels[fulfillment],
        customerName: customerName.trim() || undefined,
        customerNote: customerNote.trim() || undefined,
        isSedekahJumat: fulfillment === 'sedekah' || Boolean(product.is_jumat_berkah)
      }
    );
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#064E3B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
          <button onClick={() => onNavigate('home')} className="hover:text-stone-700">
            Beranda
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => onNavigate('products')} className="hover:text-stone-700">
            Produk
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-700 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs">
        {/* Left Column: Large Product Image (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#064E3B] shadow-sm backdrop-blur-xs">
                <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                {product.category}
              </span>
              {product.is_jumat_berkah && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  Jumat Berkah
                </span>
              )}
            </div>
          </div>

          {/* Jumat Berkah Special Info */}
          {product.is_jumat_berkah && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-900">Program Berkah Komunitas:</strong>
                <p className="mt-0.5 leading-relaxed">
                  {product.jumat_berkah_note || 'Produk ini mendukung kegiatan infaq dan sedekah jamaah Masjid Darussalam Dua.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Details & Ordering (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Badge */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                {product.category} • Produk UMKM Jamaah Terverifikasi
              </span>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                title="Bagikan Tautan Produk"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tautan Tersalin' : 'Bagikan'}</span>
              </button>
            </div>

            {/* Product Title */}
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Price Display */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#064E3B]/80 font-medium block">Harga Satuan</span>
                <span className="text-3xl font-bold text-[#064E3B]">
                  {formatRupiah(product.price)}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#064E3B] bg-white px-3 py-1 rounded-full border border-emerald-200">
                Tersedia untuk Dipesan
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Deskripsi Produk
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Seller Information Card with Direct Contact Verification */}
            {umkm && (
              <div 
                onClick={() => onSelectUmkm(umkm.id)}
                className="group p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-[#064E3B] transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-[#064E3B]" />
                    Toko Penjual (Mitra UMKM Binaan)
                  </span>
                  <span className="text-xs font-semibold text-[#064E3B] group-hover:underline">
                    Lihat Profil & Semua Produk →
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                    <img
                      src={umkm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                      alt={umkm.business_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-stone-900 text-sm group-hover:text-[#064E3B] truncate">
                        {umkm.business_name}
                      </h4>
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" title="Terverifikasi DKM Masjid" />
                    </div>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-stone-400" />
                      <span>Pemilik: <strong>{umkm.owner_name}</strong></span>
                      <span className="text-stone-300">•</span>
                      <span className="text-emerald-700 font-medium">WA: {umkm.whatsapp}</span>
                    </p>
                  </div>
                </div>

                {/* Business Location */}
                <div className="flex items-start gap-1.5 text-xs text-stone-600 pt-1 border-t border-stone-200/50">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span className="truncate">{umkm.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* INTERACTIVE ORDER BUILDER (LANGSUNG KE WA SELLER) */}
          {/* ========================================================= */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span>Atur Pesanan Anda</span>
              <span className="text-[10px] text-emerald-700 font-normal bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Langsung ke WA Seller
              </span>
            </h3>

            {/* Quantity Selector & Total Preview */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-700">Jumlah:</span>
                <div className="flex items-center bg-white border border-stone-300 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-stone-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right flex items-baseline sm:block justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200">
                <span className="text-[11px] text-stone-500 block">Total Perkiraan:</span>
                <span className="text-base sm:text-lg font-bold text-[#064E3B]">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            {/* Fulfillment Options (Khas Masjid & Komunitas) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Pilihan Cara Pengambilan:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFulfillment('masjid')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    fulfillment === 'masjid'
                      ? 'border-[#064E3B] bg-emerald-50/70 text-[#064E3B] font-bold shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <Store className="w-3.5 h-3.5 shrink-0" />
                    <span>Ambil di Masjid</span>
                  </div>
                  <span className="text-[10px] font-normal text-stone-500 leading-tight">
                    Di Pos UMKM / Sekretariat DKM
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillment('antar')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    fulfillment === 'antar'
                      ? 'border-[#064E3B] bg-emerald-50/70 text-[#064E3B] font-bold shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <Truck className="w-3.5 h-3.5 shrink-0" />
                    <span>Kirim ke Rumah</span>
                  </div>
                  <span className="text-[10px] font-normal text-stone-500 leading-tight">
                    Ongkoe, Marusu & Sekitar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillment('sedekah')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    fulfillment === 'sedekah'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <Heart className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Paket Sedekah</span>
                  </div>
                  <span className="text-[10px] font-normal text-stone-500 leading-tight">
                    Disalurkan ke Jamaah/Santri
                  </span>
                </button>
              </div>
            </div>

            {/* Optional Customer Note / Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama Anda (opsional)"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
              />
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Catatan pesanan (opsional, misal: tanpa cabai)"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
              />
            </div>

            {/* Direct Action Buttons: Add to Cart & WhatsApp */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              {onAddToCart && (
                <button
                  id="btn-detail-add-cart"
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-5 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer ${
                    justAddedToCart
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white hover:bg-emerald-50 border-[#064E3B] text-[#064E3B] shadow-2xs'
                  }`}
                >
                  {justAddedToCart ? (
                    <>
                      <Check className="w-5 h-5 text-white" />
                      <span>{quantity} Produk Masuk Keranjang!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 text-[#064E3B]" />
                      <span>+ Masukkan ke Keranjang</span>
                    </>
                  )}
                </button>
              )}

              {/* Direct WhatsApp Button */}
              <button
                id="btn-detail-order-wa"
                type="button"
                onClick={handleWhatsAppOrder}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>Pesan Langsung ke WA</span>
              </button>
            </div>

            {/* Quick Cart Notification / Open Cart Link */}
            {onOpenCart && justAddedToCart && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in">
                <span className="text-xs text-emerald-900 font-medium">
                  Produk siap dipesan bersama produk lainnya.
                </span>
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="text-xs font-bold text-[#064E3B] underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Keranjang</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Direct Routing Guarantee Note */}
            <div className="flex items-start gap-2 text-stone-600 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/70 text-xs">
              <Info className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong>Transparan & Bebas Komisi:</strong> Pesanan ini langsung terhubung ke nomor WhatsApp resmi pemilik toko: <span className="font-mono font-bold text-stone-800">{sellerPhone}</span> ({umkm?.owner_name || 'Penjual'}) tanpa perantara.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products from same UMKM or Category */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Koleksi Lainnya
              </span>
              <h3 className="font-serif-title text-2xl font-bold text-stone-900 mt-0.5">
                Produk Terkait dari {umkm?.business_name || 'Kategori Serupa'}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                umkm={umkm}
                onSelectProduct={onSelectProduct}
                onSelectUmkm={onSelectUmkm}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
