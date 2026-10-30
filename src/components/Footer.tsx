import React from 'react';
import { MapPin, Phone, Mail, Heart, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';
import { ActivePage } from '../types';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#09261C] text-[#F8F4E9]/85 pt-16 pb-12 border-t border-[#17523E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#17523E]">
          {/* Col 1 & 2: Branding & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0F3D2E] p-4 rounded-2xl w-fit border border-[#1E634B] shadow-inner">
              <Logo size="md" variant="horizontal" lightMode={true} showTagline={true} />
            </div>

            <p className="text-sm text-[#F8F4E9]/75 leading-relaxed max-w-sm">
              <strong className="text-white">darda.store</strong> — <span className="text-[#D4AF37] font-semibold">Dari Masjid Untuk UMKM</span>. Platform katalog digital resmi 
              milik <span className="text-[#D4AF37]">Masjid Darussalam Dua</span> yang didedikasikan untuk 
              mempromosikan dan memberdayakan produk serta jasa UMKM binaan jamaah secara profesional.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Amanah, Berkah, Tanpa Riba, Langsung ke Penjual</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-serif-title text-base font-bold text-white mb-4 tracking-wide">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Katalog Semua Produk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Jelajahi Kategori
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register-umkm')}
                  className="hover:text-[#D4AF37] transition-colors text-[#5FD068] font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Daftar Usaha UMKM</span>
                  <span className="text-[10px] bg-[#2E7D32] text-white px-1.5 py-0.5 rounded font-bold">
                    Gratis
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Tentang darda.store
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-[#F8F4E9]/70 hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Login (Admin & Seller)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div>
            <h4 className="font-serif-title text-base font-bold text-white mb-4 tracking-wide">
              Kategori Unggulan
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F8F4E9]/75">
              <li>Kuliner & Makanan Halal</li>
              <li>Busana Muslim & Fashion</li>
              <li>Kebutuhan Rumah Tangga</li>
              <li>Pertanian & Madu Alami</li>
              <li>Jasa Kaligrafi & Desain</li>
              <li>Perlengkapan Ibadah</li>
            </ul>
          </div>

          {/* Col 5: Mosque Secretariat */}
          <div>
            <h4 className="font-serif-title text-base font-bold text-white mb-4 tracking-wide">
              Sekretariat Masjid
            </h4>
            <ul className="space-y-3 text-xs text-[#F8F4E9]/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Masjid Darussalam Dua, Jl. Pertamina, Ongkoe, Temmapaduae, Marusu, Kabupaten Maros</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a 
                  href="https://wa.me/6287877686424?text=Assalamu'alaikum%20Admin%20darda.store%2C%20saya%20ingin%20bertanya%20seputar%20layanan%20masjid."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  +62 878-7768-6424 (Admin darda.store)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>umkm@masjiddarussalamdua.id</span>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-[#0F3D2E] border border-[#1E634B] text-xs">
              <span className="block font-semibold text-white">Ingin Mendaftarkan UMKM?</span>
              <span className="text-[#F8F4E9]/75 text-[11px] block mt-0.5">
                Hubungi pengurus bidang ekonomi Masjid Darussalam Dua.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F4E9]/60">
          <p>© {new Date().getFullYear()} darda.store — Dari Masjid Untuk UMKM • Masjid Darussalam Dua.</p>
          <div className="flex items-center gap-1">
            <span>Dikelola dengan amanah demi kebangkitan ekonomi umat</span>
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37] inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
