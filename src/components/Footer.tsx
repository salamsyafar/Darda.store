import React from 'react';
import { MapPin, Phone, Mail, Heart, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';
import { ActivePage } from '../types';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: Branding & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-stone-800/80 p-4 rounded-2xl w-fit border border-stone-700/60 shadow-inner">
              <Logo size="md" variant="horizontal" lightMode={true} showTagline={true} />
            </div>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              <strong className="text-white">DARDA STORE</strong> adalah platform katalog digital resmi 
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
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Katalog Semua Produk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Jelajahi Kategori
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register-umkm')}
                  className="hover:text-[#D4AF37] transition-colors text-emerald-400 font-semibold flex items-center gap-1.5"
                >
                  <span>Daftar Usaha UMKM</span>
                  <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold">
                    Gratis
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Tentang Darda Store
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-stone-400 hover:text-[#D4AF37] transition-colors flex items-center gap-1"
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
            <ul className="space-y-2.5 text-sm text-stone-400">
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
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Masjid Darussalam Dua, Jl. Pertamina, Ongkoe, Temmapaduae, Marusu, Kabupaten Maros</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a 
                  href="https://wa.me/6287877686424?text=Assalamu'alaikum%20Admin%20Darda%20Store%2C%20saya%20ingin%20bertanya%20seputar%20layanan%20masjid."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  +62 878-7768-6424 (Admin Darda Store)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>umkm@masjiddarussalamdua.id</span>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 text-xs">
              <span className="block font-semibold text-white">Ingin Mendaftarkan UMKM?</span>
              <span className="text-stone-400 text-[11px] block mt-0.5">
                Hubungi pengurus bidang ekonomi Masjid Darussalam Dua.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} DARDA STORE • Masjid Darussalam Dua. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1">
            <span>Dikelola dengan rasa cinta demi kebangkitan ekonomi umat</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
