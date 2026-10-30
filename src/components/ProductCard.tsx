import React, { useState } from 'react';
import { MessageCircle, Store, Tag, Sparkles, ShoppingBag, Check } from 'lucide-react';
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
      className="group relative flex flex-col bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#2E7D32]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-[#F8F4E9] overflow-hidden">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Tag Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F8F4E9]/95 text-[#0F3D2E] border border-[#E5DEC9] shadow-2xs backdrop-blur-xs">
            <Tag className="w-3 h-3 text-[#2E7D32]" />
            {product.category}
          </span>
          {product.is_jumat_berkah && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-[#0F3D2E] shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              Jumat Berkah
            </span>
          )}
        </div>

        {product.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#0F3D2E] text-[#D4AF37] shadow-xs">
              Pilihan
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller / UMKM name */}
          <div
            onClick={handleSellerClick}
            className="flex items-center gap-1.5 text-xs text-[#0F3D2E]/65 hover:text-[#2E7D32] mb-1.5 transition-colors w-fit"
          >
            <Store className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span className="font-medium truncate max-w-[180px]">
              {umkm?.business_name || 'UMKM Jamaah'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-[#0F3D2E] text-base leading-snug line-clamp-2 group-hover:text-[#2E7D32] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EFE9D8] flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-[#0F3D2E]/55 block">Harga</span>
            <span className="text-base font-extrabold text-[#0F3D2E] tabular-nums">
              {formatRupiah(product.price)}
            </span>
          </div>

          {/* Action Buttons: Add to Cart & WhatsApp */}
          <div className="flex items-center gap-1.5">
            {onAddToCart && (
              <button
                id={`btn-cart-${product.id}`}
                type="button"
                onClick={handleAddToCartClick}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  justAdded || isInCart
                    ? 'bg-[#2E7D32]/10 border-[#2E7D32] text-[#2E7D32]'
                    : 'bg-[#F8F4E9] hover:bg-[#EFE9D8] border-[#DED6C1] text-[#0F3D2E]'
                }`}
                title={justAdded ? 'Berhasil Ditambahkan!' : isInCart ? 'Sudah di Keranjang (Klik untuk tambah)' : 'Tambah ke Keranjang'}
                aria-label="Tambah ke Keranjang"
              >
                {justAdded ? (
                  <Check className="w-4 h-4 text-[#2E7D32]" />
                ) : (
                  <ShoppingBag className={`w-4 h-4 ${isInCart ? 'text-[#2E7D32]' : 'text-[#0F3D2E]'}`} />
                )}
              </button>
            )}

            {/* WhatsApp Action Button */}
            <button
              id={`btn-wa-${product.id}`}
              type="button"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F3D2E] hover:bg-[#2E7D32] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              title="Pesan langsung lewat WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Pesan WA</span>
              <span className="sm:hidden">WA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
