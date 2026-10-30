import React from 'react';
import { MapPin, User, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { UMKM } from '../types';
import { createUmkmWhatsAppUrl } from '../utils/formatters';

interface UmkmCardProps {
  umkm: UMKM;
  productCount?: number;
  onSelectUmkm: (umkmId: string) => void;
}

export const UmkmCard: React.FC<UmkmCardProps> = ({
  umkm,
  productCount = 0,
  onSelectUmkm,
}) => {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = createUmkmWhatsAppUrl(umkm.whatsapp, umkm.business_name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`umkm-card-${umkm.id}`}
      onClick={() => onSelectUmkm(umkm.id)}
      className="group bg-white rounded-2xl border border-[#E5DEC9] p-5 shadow-xs hover:shadow-lg hover:border-[#2E7D32]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#F8F4E9] shrink-0 border border-[#E5DEC9]">
            <img
              src={umkm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
              alt={umkm.business_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[#0F3D2E]">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F8F4E9] text-[#2E7D32] border border-[#E5DEC9]">
                {umkm.category}
              </span>
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" title="Binaan Masjid Darussalam Dua" />
            </div>

            <h3 className="font-serif-title font-bold text-base text-[#0F3D2E] mt-1 truncate group-hover:text-[#2E7D32] transition-colors">
              {umkm.business_name}
            </h3>

            <p className="flex items-center gap-1 text-xs text-[#0F3D2E]/65 mt-0.5">
              <User className="w-3 h-3 text-[#2E7D32]" />
              <span className="truncate">{umkm.owner_name}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-[#0F3D2E]/75 mt-3 line-clamp-2 leading-relaxed">
          {umkm.description}
        </p>

        <div className="flex items-center gap-1.5 text-[11px] text-[#0F3D2E]/60 mt-3">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span className="truncate">{umkm.address}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EFE9D8] flex items-center justify-between">
        <span className="text-xs font-semibold text-[#0F3D2E]/70 tabular-nums">
          {productCount} Produk
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="p-2 rounded-xl bg-[#F8F4E9] hover:bg-[#2E7D32] text-[#0F3D2E] hover:text-white border border-[#E5DEC9] transition-colors"
            title="Hubungi via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0F3D2E] group-hover:text-[#2E7D32]"
          >
            <span>Lihat Profil</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
