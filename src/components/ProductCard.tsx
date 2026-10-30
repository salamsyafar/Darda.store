import React, { useState } from 'react';
import { MessageCircle, Store, Sparkles, ShoppingBag, Check, ShieldCheck } from 'lucide-react';
import { Product, UMKM } from '../types';
import { formatRupiah, createProductWhatsAppUrl } from '../utils/formatters';
import { recordWhatsAppInquiry } from '../firebase/service';

interface ProductCardProps {
  product: Product;
  umkm?: UMKM;
  onSelectProduct: (product: Product) => void;
  onSelectUmkm?: (umkmId: string) => void;
  onAddToCart?: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  umkm,
  onSelectProduct,
  onSelectUmkm,
  onAddToCart,
  isInCart = false,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordWhatsAppInquiry();
    const phone = umkm?.whatsapp || '6287877686424';
    const waUrl = createProductWhatsAppUrl(
      phone,
      product.name,
      umkm?.business_name,
      product.price,
      {
        isSedekahJumat: Boolean(product.is_jumat_berkah)
      }
    );
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const handleSellerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectUmkm && product.umkm_id) {
      onSelectUmkm(product.umkm_id);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#2E7D32] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Square 1:1 Product Image (Shopee Marketplace Standard for 2-Column Mobile) */}
      <div className="relative aspect-square w-full bg-[#F8F4E9] overflow-hidden">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-Left Marketplace Ribbon Badge */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {product.is_featured && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-[#0F3D2E] text-[#D4AF37] shadow-2xs">
              Star+ Jamaah
            </span>
          )}
          {product.is_jumat_berkah && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-xs text-[9px] sm:text-[10px] font-bold bg-[#D4AF37] text-[#0F3D2E] shadow-2xs">
              <Sparkles className="w-2.5 h-2.5" />
              Jumat Berkah
            </span>
          )}
        </div>

        {/* Top-Right Category Pill */}
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[9px] sm:text-[10px] font-semibold bg-white/90 text-[#0F3D2E] border border-[#E5DEC9] backdrop-blur-xs">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Body (Compact on Mobile so 2 Columns fit cleanly) */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between gap-2">
        <div className="space-y-1.5">
          {/* Product Name (2-line clamp like Shopee) */}
          <h3 className="font-medium text-[#0F3D2E] text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.1rem] sm:min-h-[2.5rem] group-hover:text-[#2E7D32] transition-colors">
            {product.is_jumat_berkah && (
              <span className="inline-block mr-1 px-1 py-0.2 text-[9px] font-bold bg-[#2E7D32] text-white rounded-xs align-middle">
                BERKAH
              </span>
            )}
            {product.name}
          </h3>

          {/* Voucher / Halal Tag Row (Mirrors Shopee's micro-promo border tags) */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-xs text-[9px] font-semibold border border-[#2E7D32]/40 text-[#2E7D32] bg-[#2E7D32]/5">
              <ShieldCheck className="w-2.5 h-2.5" />
              Halal & Amanah
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[9px] font-semibold border border-[#D4AF37]/60 text-[#0F3D2E] bg-[#D4AF37]/15">
              0% Komisi
            </span>
          </div>
        </div>

        {/* Price + Action Row */}
        <div className="pt-1.5 border-t border-[#EFE9D8] space-y-2">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-sm sm:text-base font-extrabold text-[#0F3D2E] tabular-nums truncate">
              {formatRupiah(product.price)}
            </span>
          </div>

          {/* Seller / Store Name + Action Buttons */}
          <div className="flex items-center justify-between gap-1.5">
            <div
              onClick={handleSellerClick}
              className="flex items-center gap-1 text-[10px] sm:text-xs text-[#0F3D2E]/65 hover:text-[#2E7D32] truncate min-w-0 flex-1"
            >
              <Store className="w-3 h-3 text-[#2E7D32] shrink-0" />
              <span className="truncate">{umkm?.business_name || 'UMKM Jamaah'}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {onAddToCart && (
                <button
                  id={`btn-cart-${product.id}`}
                  type="button"
                  onClick={handleAddToCartClick}
                  className={`p-1.5 sm:p-2 rounded-lg border text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                    justAdded || isInCart
                      ? 'bg-[#2E7D32]/15 border-[#2E7D32] text-[#2E7D32]'
                      : 'bg-[#F8F4E9] hover:bg-[#EFE9D8] border-[#DED6C1] text-[#0F3D2E]'
                  }`}
                  title={justAdded ? 'Berhasil Ditambahkan!' : 'Tambah ke Keranjang'}
                  aria-label="Tambah ke Keranjang"
                >
                  {justAdded ? (
                    <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                  ) : (
                    <ShoppingBag className={`w-3.5 h-3.5 ${isInCart ? 'text-[#2E7D32]' : 'text-[#0F3D2E]'}`} />
                  )}
                </button>
              )}

              <button
                id={`btn-wa-${product.id}`}
                type="button"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg bg-[#0F3D2E] hover:bg-[#2E7D32] text-white text-[10px] sm:text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Pesan langsung lewat WhatsApp"
              >
                <MessageCircle className="w-3 h-3 text-[#D4AF37] shrink-0" />
                <span>Pesan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
