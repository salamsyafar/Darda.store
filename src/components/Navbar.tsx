import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles, 
  HeartHandshake,
  Store,
  LogIn,
  LogOut,
  Crown
} from 'lucide-react';
import { ActivePage } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPerformSearch: (q: string) => void;
  isAdminLoggedIn?: boolean;
  isSuperAdmin?: boolean;
  isSellerLoggedIn?: boolean;
  sellerUmkmName?: string;
  cartCount?: number;
  onOpenCart?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  searchQuery,
  onSearchChange,
  onPerformSearch,
  isAdminLoggedIn = false,
  isSuperAdmin = false,
  isSellerLoggedIn = false,
  sellerUmkmName = '',
  cartCount = 0,
  onOpenCart,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPerformSearch(searchQuery);
    setShowSearchModal(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { page: 'home' as ActivePage, label: 'Beranda' },
    { page: 'products' as ActivePage, label: 'Katalog Produk' },
    { page: 'categories' as ActivePage, label: 'Kategori' },
    { page: 'register-umkm' as ActivePage, label: 'Daftar UMKM' },
    { page: 'about' as ActivePage, label: 'Tentang Darda' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F4E9]/95 backdrop-blur-md border-b border-[#E5DEC9] shadow-2xs">
      {/* Top Banner in Official Forest Green (#0F3D2E) */}
      <div className="bg-[#0F3D2E] text-[#F8F4E9] text-xs py-1.5 px-4 border-b border-[#195843]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wider uppercase text-[#D4AF37] text-[10px]">
              DARI MASJID UNTUK UMKM
            </span>
            <span className="text-[#F8F4E9]/40">•</span>
            <span className="font-medium tracking-wide text-[#F8F4E9]/90 truncate">
              Masjid Darussalam Dua
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[#F8F4E9]/85 text-[11px]">
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
              100% Produk Halal & Berkah
            </span>
            <span className="text-[#F8F4E9]/30">•</span>
            <button
              onClick={() => {
                if (isAdminLoggedIn) onNavigate('admin');
                else if (isSellerLoggedIn) onNavigate('seller-dashboard');
                else onNavigate('login');
              }}
              className="text-[#D4AF37] hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dashboard Admin (Aktif)</span>
                </>
              ) : isSellerLoggedIn ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span>Dashboard Toko: {sellerUmkmName || 'Seller'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </>
              )}
            </button>
            {onLogout && (isAdminLoggedIn || isSellerLoggedIn) && (
              <button
                onClick={onLogout}
                className="text-[#F8F4E9]/70 hover:text-red-300 transition-colors ml-1 cursor-pointer"
                title="Keluar / Logout"
              >
                (Keluar)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div 
            id="brand-logo-btn"
            onClick={() => onNavigate('home')} 
            className="cursor-pointer select-none py-2 shrink-0"
          >
            <Logo size="md" variant="horizontal" />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                id="desktop-search-input"
                type="text"
                placeholder="Cari produk (contoh: Brownies, Madu, Gamis)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm bg-white border border-[#DED6C1] text-[#0F3D2E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all placeholder:text-[#0F3D2E]/45 shadow-2xs"
              />
              <Search className="w-4 h-4 text-[#2E7D32] absolute left-3.5 top-3.5 pointer-events-none" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = activePage === item.page;
              const isRegister = item.page === 'register-umkm';
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => onNavigate(item.page)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-white bg-[#0F3D2E] font-semibold shadow-2xs'
                      : isRegister
                      ? 'text-[#0F3D2E] bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 font-semibold border border-[#2E7D32]/30'
                      : 'text-[#0F3D2E]/80 hover:text-[#0F3D2E] hover:bg-[#EFE9D8]'
                  }`}
                >
                  {isRegister && <Store className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#2E7D32]'}`} />}
                  <span>{item.label}</span>
                  {isRegister && (
                    <span className="text-[9px] bg-[#2E7D32] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Gratis
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="md:hidden p-2.5 rounded-xl text-[#0F3D2E] hover:bg-[#EFE9D8]"
              aria-label="Cari Produk"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            {onOpenCart && (
              <button
                id="btn-cart-nav"
                onClick={onOpenCart}
                className="relative p-2.5 rounded-xl bg-white text-[#0F3D2E] hover:border-[#2E7D32] border border-[#DED6C1] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Keranjang Belanja Jamaah"
                aria-label="Buka Keranjang Belanja"
              >
                <ShoppingBag className="w-5 h-5 text-[#2E7D32]" />
                <span className="hidden sm:inline text-xs font-bold text-[#0F3D2E]">Keranjang</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center text-[10px] font-extrabold bg-[#D4AF37] text-[#0F3D2E] px-1.5 py-0.2 rounded-full ring-2 ring-white tabular-nums">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Login / Role Dashboard Access */}
            <button
              id="nav-auth-btn"
              onClick={() => {
                if (isAdminLoggedIn) onNavigate('admin');
                else if (isSellerLoggedIn) onNavigate('seller-dashboard');
                else onNavigate('login');
              }}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activePage === 'login' || activePage === 'admin' || activePage === 'seller-dashboard'
                  ? 'bg-[#D4AF37] text-[#0F3D2E] shadow-xs ring-2 ring-[#0F3D2E]'
                  : 'bg-[#0F3D2E] text-[#F8F4E9] hover:bg-[#2E7D32] shadow-xs'
              }`}
            >
              {isAdminLoggedIn ? (
                isSuperAdmin ? (
                  <>
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                    <span>Super Admin</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Dashboard Admin</span>
                  </>
                )
              ) : isSellerLoggedIn ? (
                <>
                  <Store className="w-4 h-4 text-[#D4AF37]" />
                  <span>Dashboard Toko</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#D4AF37]" />
                  <span>Login</span>
                </>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[#0F3D2E] hover:bg-[#EFE9D8] transition-colors"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5DEC9] bg-[#F8F4E9] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk atau UMKM..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border border-[#DED6C1] text-[#0F3D2E] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              />
              <Search className="w-4 h-4 text-[#2E7D32] absolute left-3.5 top-3.5" />
            </div>
          </form>

          <div className="grid gap-1">
            {navLinks.map((item) => {
              const isActive = activePage === item.page;
              const isRegister = item.page === 'register-umkm';
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#0F3D2E] text-white font-bold'
                      : isRegister
                      ? 'bg-[#2E7D32]/10 text-[#0F3D2E] font-semibold border border-[#2E7D32]/30'
                      : 'text-[#0F3D2E] hover:bg-[#EFE9D8]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isRegister && <Store className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#2E7D32]'}`} />}
                    <span>{item.label}</span>
                  </div>
                  {isRegister && !isActive && (
                    <span className="text-[10px] bg-[#2E7D32] text-white px-2 py-0.5 rounded-full font-bold">
                      Gratis
                    </span>
                  )}
                  {isActive && <Sparkles className="w-4 h-4 text-[#D4AF37]" />}
                </button>
              );
            })}

            <div className="pt-2 border-t border-[#E5DEC9] space-y-2">
              {onOpenCart && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenCart();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold bg-white text-[#0F3D2E] border border-[#DED6C1]"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#2E7D32]" />
                    <span>Keranjang Belanja Jamaah</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="text-xs bg-[#D4AF37] text-[#0F3D2E] font-extrabold px-2.5 py-0.5 rounded-full">
                      {cartCount} item
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  if (isAdminLoggedIn) onNavigate('admin');
                  else if (isSellerLoggedIn) onNavigate('seller-dashboard');
                  else onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold bg-[#0F3D2E] text-white"
              >
                <div className="flex items-center gap-2">
                  {isAdminLoggedIn && isSuperAdmin ? (
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                  ) : isAdminLoggedIn ? (
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <LogIn className="w-4 h-4 text-[#D4AF37]" />
                  )}
                  <span>
                    {isAdminLoggedIn
                      ? isSuperAdmin
                        ? 'Dashboard Super Admin'
                        : 'Dashboard Admin Store'
                      : isSellerLoggedIn
                      ? `Dashboard Toko: ${sellerUmkmName || 'Seller'}`
                      : 'Login (Admin & Seller)'}
                  </span>
                </div>
                <span className="text-xs text-[#D4AF37]">
                  {isAdminLoggedIn || isSellerLoggedIn ? 'Aktif' : 'Masuk'}
                </span>
              </button>

              {onLogout && (isAdminLoggedIn || isSellerLoggedIn) && (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 rounded-xl"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar dari Akun</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-[#0F3D2E]/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
          <div className="bg-[#F8F4E9] w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-[#DED6C1] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-title font-bold text-lg text-[#0F3D2E]">
                Pencarian Produk & UMKM
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1.5 rounded-lg text-[#0F3D2E]/60 hover:text-[#0F3D2E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Ketik nama produk, kue, fashion, atau UMKM..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DED6C1] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-base text-[#0F3D2E]"
                />
                <Search className="w-5 h-5 text-[#2E7D32] absolute left-3 top-3.5" />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-[#0F3D2E]/70 hover:bg-[#EFE9D8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#0F3D2E] text-white hover:bg-[#2E7D32]"
                >
                  Cari Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
