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
  Crown,
  Home,
  Grid,
  Compass,
  UserCheck,
  MessageCircle
} from 'lucide-react';
import { ActivePage, HomeConfig } from '../types';
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
  homeConfig?: HomeConfig;
}

const POPULAR_SEARCH_TAGS = [
  'Nasi Kuning',
  'Ayam Lalapan',
  'Pisang Nugget',
  'Buah Apel',
  'Kopi Aren',
  'Jasa Cuci AC'
];

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
  onLogout,
  homeConfig
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPerformSearch(searchQuery);
    setMobileMenuOpen(false);
  };

  const handleQuickKeyword = (keyword: string) => {
    onSearchChange(keyword);
    onPerformSearch(keyword);
  };

  const navLinks = [
    { page: 'home' as ActivePage, label: 'Beranda' },
    { page: 'products' as ActivePage, label: 'Katalog Produk' },
    { page: 'categories' as ActivePage, label: 'Kategori' },
    { page: 'register-umkm' as ActivePage, label: 'Daftar UMKM' },
    { page: 'about' as ActivePage, label: 'Tentang Darda' },
  ];

  return (
    <>
      {/* Shopee-Inspired Marketplace Header in Official Forest Green (#0F3D2E) */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#0F3D2E] to-[#144D3A] text-[#F8F4E9] shadow-md border-b border-[#1D634B]">
        {/* 1. Top Utility Bar — Simplified to 3 Menus: Home (Tentang darda.store), Seller Center, Login */}
        <div className="border-b border-white/10 text-[11px] sm:text-xs text-[#F8F4E9]/90 py-1.5 px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Menu 1 & 2 on Left: Home | Seller Center */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <button
                onClick={() => onNavigate('home')}
                className={`hover:text-[#D4AF37] transition-colors cursor-pointer font-semibold ${
                  activePage === 'home' ? 'text-[#D4AF37]' : ''
                }`}
              >
                Home
              </button>

              <span className="text-white/25">|</span>

              <button
                onClick={() => {
                  if (isSellerLoggedIn) onNavigate('seller-dashboard');
                  else if (isAdminLoggedIn) onNavigate('admin');
                  else onNavigate('login');
                }}
                className={`hover:text-[#D4AF37] transition-colors cursor-pointer font-medium ${
                  activePage === 'seller-dashboard' ? 'text-[#D4AF37] font-semibold' : ''
                }`}
              >
                Seller Center
              </button>
            </div>

            {/* Menu 3 on Right: Login */}
            <div className="flex items-center gap-2">
              <button
                id="nav-auth-btn"
                onClick={() => {
                  if (isAdminLoggedIn) onNavigate('admin');
                  else if (isSellerLoggedIn) onNavigate('seller-dashboard');
                  else onNavigate('login');
                }}
                className="text-[#D4AF37] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                {isAdminLoggedIn ? (
                  isSuperAdmin ? (
                    <>
                      <Crown className="w-3.5 h-3.5" />
                      <span>Super Admin</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Dashboard Admin</span>
                    </>
                  )
                ) : isSellerLoggedIn ? (
                  <>
                    <Store className="w-3.5 h-3.5" />
                    <span>Toko: {sellerUmkmName || 'Seller'}</span>
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
                  className="text-red-300 hover:text-red-200 font-semibold cursor-pointer"
                  title="Keluar"
                >
                  (Keluar)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Main Marketplace Search & Action Row (Shopee Desktop & Mobile UX) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
          <div className="flex items-center justify-between gap-2.5 sm:gap-6">
            {/* Brand Logo (Visible on Desktop & Compact Emblem on Mobile) */}
            <div
              id="brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="cursor-pointer select-none shrink-0 flex items-center"
            >
              <div className="hidden sm:block">
                <Logo size="md" variant="horizontal" lightMode={true} />
              </div>
              <div className="sm:hidden flex items-center">
                <Logo size="sm" variant="icon" lightMode={true} />
              </div>
            </div>

            {/* Central Wide Search Bar + Popular Keywords underneath (Shopee UX) */}
            <div className="flex-1 max-w-3xl">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                <div className="relative flex-1 flex items-center bg-white rounded-lg sm:rounded-xl p-0.5 sm:p-1 shadow-inner border border-[#E5DEC9] focus-within:ring-2 focus-within:ring-[#D4AF37]">
                  <Search className="w-4 h-4 text-[#0F3D2E]/50 ml-2.5 sm:ml-3 shrink-0 pointer-events-none" />
                  <input
                    id="desktop-search-input"
                    type="text"
                    placeholder={
                      homeConfig?.searchPlaceholder ||
                      'Cari di darda.store (Nasi Kuning, Ayam Lalapan, Pisang Nugget, Kopi Aren)...'
                    }
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-2 pr-2 py-1.5 sm:py-2 text-xs sm:text-sm bg-transparent text-[#0F3D2E] focus:outline-none placeholder:text-[#0F3D2E]/50"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="p-1 text-[#0F3D2E]/40 hover:text-[#0F3D2E]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-[#0F3D2E] hover:bg-[#2E7D32] text-[#F8F4E9] font-semibold text-xs transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label="Cari"
                  >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
                  </button>
                </div>
              </form>

              {/* Popular Search Keywords under Search Bar (Desktop — Mirrors Image 1) */}
              <div className="hidden md:flex items-center gap-3 mt-1.5 text-[11px] text-[#F8F4E9]/85 overflow-x-auto scrollbar-none">
                {(homeConfig?.popularTags && homeConfig.popularTags.length > 0
                  ? homeConfig.popularTags
                  : POPULAR_SEARCH_TAGS
                ).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickKeyword(tag)}
                    className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
                <span className="text-white/25">|</span>
                <button
                  type="button"
                  onClick={() => onNavigate('categories')}
                  className="text-[#D4AF37] font-semibold hover:underline whitespace-nowrap cursor-pointer"
                >
                  Semua Kategori →
                </button>
              </div>
            </div>

            {/* Right Icons: Cart Badge & Mobile Menu / Quick Chat */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {onOpenCart && (
                <button
                  id="btn-cart-nav"
                  onClick={onOpenCart}
                  className="relative p-2 sm:px-3.5 sm:py-2 rounded-xl hover:bg-white/10 text-[#F8F4E9] transition-all cursor-pointer flex items-center gap-2"
                  title="Keranjang Belanja Jamaah"
                  aria-label="Buka Keranjang Belanja"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#F8F4E9]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-extrabold bg-[#D4AF37] text-[#0F3D2E] px-1 rounded-full ring-2 ring-[#0F3D2E] tabular-nums">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:inline text-xs font-bold text-[#F8F4E9]">
                    Keranjang
                  </span>
                </button>
              )}

              {/* Mobile Menu Drawer Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#F8F4E9] hover:bg-white/10 transition-colors"
                aria-label="Menu Navigasi"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/15 bg-[#F8F4E9] text-[#0F3D2E] px-4 pt-3 pb-6 space-y-2 shadow-xl">
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
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                      isActive
                        ? 'bg-[#0F3D2E] text-white font-bold'
                        : isRegister
                        ? 'bg-[#2E7D32]/10 text-[#0F3D2E] border border-[#2E7D32]/30'
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
                <button
                  onClick={() => {
                    if (isAdminLoggedIn) onNavigate('admin');
                    else if (isSellerLoggedIn) onNavigate('seller-dashboard');
                    else onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0F3D2E] text-white"
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-[#D4AF37]" />
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
                  <span className="text-[11px] text-[#D4AF37]">
                    {isAdminLoggedIn || isSellerLoggedIn ? 'Aktif' : 'Masuk →'}
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
      </header>

      {/* Mobile Bottom Navigation Bar (Mirrors Shopee Mobile Bottom Tab Bar — NO Live/Video tab) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E5DEC9] shadow-[0_-2px_10px_rgba(15,61,46,0.06)] px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activePage === 'home' ? 'text-[#0F3D2E] font-bold' : 'text-[#0F3D2E]/55'
          }`}
        >
          <Home className={`w-5 h-5 ${activePage === 'home' ? 'text-[#2E7D32]' : ''}`} />
          <span className="text-[10px]">Beranda</span>
        </button>

        <button
          onClick={() => onNavigate('categories')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activePage === 'categories' ? 'text-[#0F3D2E] font-bold' : 'text-[#0F3D2E]/55'
          }`}
        >
          <Grid className={`w-5 h-5 ${activePage === 'categories' ? 'text-[#2E7D32]' : ''}`} />
          <span className="text-[10px]">Kategori</span>
        </button>

        <button
          onClick={() => onNavigate('products')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activePage === 'products' ? 'text-[#0F3D2E] font-bold' : 'text-[#0F3D2E]/55'
          }`}
        >
          <Compass className={`w-5 h-5 ${activePage === 'products' ? 'text-[#2E7D32]' : ''}`} />
          <span className="text-[10px]">Produk</span>
        </button>

        <button
          onClick={() => onNavigate('register-umkm')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activePage === 'register-umkm' ? 'text-[#0F3D2E] font-bold' : 'text-[#0F3D2E]/55'
          }`}
        >
          <Store className={`w-5 h-5 ${activePage === 'register-umkm' ? 'text-[#2E7D32]' : ''}`} />
          <span className="text-[10px]">Daftar UMKM</span>
        </button>

        <button
          onClick={() => {
            if (isAdminLoggedIn) onNavigate('admin');
            else if (isSellerLoggedIn) onNavigate('seller-dashboard');
            else onNavigate('login');
          }}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activePage === 'login' || activePage === 'admin' || activePage === 'seller-dashboard'
              ? 'text-[#0F3D2E] font-bold'
              : 'text-[#0F3D2E]/55'
          }`}
        >
          <UserCheck
            className={`w-5 h-5 ${
              activePage === 'login' || activePage === 'admin' || activePage === 'seller-dashboard'
                ? 'text-[#2E7D32]'
                : ''
            }`}
          />
          <span className="text-[10px]">
            {isAdminLoggedIn ? 'Admin' : isSellerLoggedIn ? 'Toko' : 'Saya'}
          </span>
        </button>
      </nav>
    </>
  );
};
