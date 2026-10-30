import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  ShoppingBag, 
  Users, 
  Info, 
  LayoutGrid, 
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Banner with Islamic touch */}
      <div className="bg-[#064E3B] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-medium tracking-wide">
              Masjid Darussalam Dua • Program Pemberdayaan Ekonomi Umat
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-stone-200 text-[11px]">
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
              100% Produk Halal & Berkah
            </span>
            <span>•</span>
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
                className="text-stone-300 hover:text-red-300 transition-colors ml-1"
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
            className="cursor-pointer select-none py-2"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm bg-stone-100 border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
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
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#064E3B] bg-emerald-50 font-semibold'
                      : isRegister
                      ? 'text-[#064E3B] bg-emerald-50/80 hover:bg-emerald-100 font-semibold border border-emerald-200/60'
                      : 'text-stone-600 hover:text-[#064E3B] hover:bg-stone-50'
                  }`}
                >
                  {isRegister && <Store className="w-3.5 h-3.5 text-[#064E3B]" />}
                  <span>{item.label}</span>
                  {isRegister && (
                    <span className="text-[9px] bg-[#D4AF37] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Baru
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="md:hidden p-2.5 rounded-xl text-stone-600 hover:text-[#064E3B] hover:bg-stone-100"
              aria-label="Cari Produk"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            {onOpenCart && (
              <button
                id="btn-cart-nav"
                onClick={onOpenCart}
                className="relative p-2.5 rounded-xl text-stone-700 hover:text-[#064E3B] hover:bg-emerald-50/80 border border-stone-200/80 transition-all cursor-pointer flex items-center gap-1.5"
                title="Keranjang Belanja Jamaah"
                aria-label="Buka Keranjang Belanja"
              >
                <ShoppingBag className="w-5 h-5 text-[#064E3B]" />
                <span className="hidden sm:inline text-xs font-bold text-stone-700">Keranjang</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center text-[10px] font-extrabold bg-[#D4AF37] text-[#064E3B] px-1.5 py-0.2 rounded-full ring-2 ring-white">
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
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePage === 'login' || activePage === 'admin' || activePage === 'seller-dashboard'
                  ? 'bg-[#D4AF37] text-[#064E3B] shadow-sm ring-2 ring-[#064E3B]'
                  : 'bg-[#064E3B] text-white hover:bg-[#047857] shadow-xs'
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
              className="lg:hidden p-2.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk atau UMKM..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-stone-100 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
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
                      ? 'bg-emerald-50 text-[#064E3B] font-bold'
                      : isRegister
                      ? 'bg-emerald-50/70 text-[#064E3B] font-semibold border border-emerald-200/60'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isRegister && <Store className="w-4 h-4 text-[#064E3B]" />}
                    <span>{item.label}</span>
                  </div>
                  {isRegister && !isActive && (
                    <span className="text-[10px] bg-[#D4AF37] text-white px-2 py-0.5 rounded-full font-bold">
                      Gratis
                    </span>
                  )}
                  {isActive && <Sparkles className="w-4 h-4 text-[#D4AF37]" />}
                </button>
              );
            })}

            <div className="pt-2 border-t border-stone-100 space-y-2">
              {onOpenCart && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenCart();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-50 text-[#064E3B] border border-emerald-200"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#064E3B]" />
                    <span>Keranjang Belanja Jamaah</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="text-xs bg-[#D4AF37] text-[#064E3B] font-extrabold px-2.5 py-0.5 rounded-full">
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
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold bg-[#064E3B] text-white"
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
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-xl"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                Pencarian Produk & UMKM
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#064E3B] text-base"
                />
                <Search className="w-5 h-5 text-stone-400 absolute left-3 top-3.5" />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#064E3B] text-white hover:bg-[#047857]"
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
