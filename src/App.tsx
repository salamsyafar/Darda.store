import React, { useState, useEffect } from 'react';
import { 
  ActivePage, 
  Category, 
  Product, 
  UMKM, 
  AppStats,
  CartItem,
  AdminUser,
  AdminRole,
  AuthRole
} from './types';
import { 
  fetchProductsList, 
  fetchUmkmList, 
  fetchCategoriesList, 
  fetchAppStats, 
  recordVisitor,
  fetchAdminUsersList
} from './firebase/service';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { UmkmDetailPage } from './pages/UmkmDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutPage } from './pages/AboutPage';
import { RegisterUmkmPage } from './pages/RegisterUmkmPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { SellerDashboard } from './pages/SellerDashboard';
import { MessageCircle, ArrowUp, ShoppingBag } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<AppStats>({
    totalUmkm: 0,
    totalProducts: 0,
    totalCategories: 0,
    visitorsCount: 142,
    whatsappInquiries: 48,
  });

  // Shopping Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('darda_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('darda_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed saving cart to localStorage', e);
    }
  }, [cartItems]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartProductIds = new Set(cartItems.map((item) => item.id));

  const handleAddToCart = (product: Product, quantity = 1, note?: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + quantity,
          notes: note || copy[existingIdx].notes
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            product,
            quantity,
            notes: note
          }
        ];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Selected item states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUmkmId, setSelectedUmkmId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Authentication role & session states
  const [authRole, setAuthRole] = useState<AuthRole | null>(() => {
    const savedRole = localStorage.getItem('darda_auth_role');
    if (savedRole === 'super_admin' || savedRole === 'admin' || savedRole === 'seller') {
      return savedRole as AuthRole;
    }
    if (localStorage.getItem('darda_admin_logged_in') === 'true') return 'super_admin';
    return null;
  });

  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('darda_current_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  const [sellerUmkmId, setSellerUmkmId] = useState<string | null>(() => {
    return localStorage.getItem('darda_seller_umkm_id') || null;
  });

  const isAdminLoggedIn = authRole === 'admin' || authRole === 'super_admin';
  const isSuperAdmin = authRole === 'super_admin';
  const isSellerLoggedIn = authRole === 'seller';

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load all data on mount
  const refreshAllData = async () => {
    try {
      const [pList, uList, cList, statData, aList] = await Promise.all([
        fetchProductsList(),
        fetchUmkmList(),
        fetchCategoriesList(),
        fetchAppStats(),
        fetchAdminUsersList(),
      ]);
      setProducts(pList);
      setUmkms(uList);
      setCategories(cList);
      setStats(statData);
      setAdminUsers(aList);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    recordVisitor();
    refreshAllData();
  }, []);

  // Scroll to top when page changes
  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    navigateTo('product-detail');
  };

  const handleSelectUmkm = (umkmId: string) => {
    setSelectedUmkmId(umkmId);
    navigateTo('umkm-detail');
  };

  const handleSelectCategory = (catName: string) => {
    setFilterCategory(catName);
    navigateTo('products');
  };

  const handlePerformSearch = (q: string) => {
    setSearchQuery(q);
    setFilterCategory('Semua');
    navigateTo('products');
  };

  const handleAdminLogin = (role: AdminRole = 'super_admin', adminUser?: AdminUser) => {
    setAuthRole(role);
    if (adminUser) {
      setCurrentAdminUser(adminUser);
      localStorage.setItem('darda_current_admin_user', JSON.stringify(adminUser));
    }
    localStorage.setItem('darda_auth_role', role);
    localStorage.setItem('darda_admin_logged_in', 'true');
    navigateTo('admin');
  };

  const handleSellerLogin = (umkmId: string) => {
    setAuthRole('seller');
    setSellerUmkmId(umkmId);
    localStorage.setItem('darda_auth_role', 'seller');
    localStorage.setItem('darda_seller_umkm_id', umkmId);
    navigateTo('seller-dashboard');
  };

  const handleLogout = () => {
    setAuthRole(null);
    setCurrentAdminUser(null);
    setSellerUmkmId(null);
    localStorage.removeItem('darda_auth_role');
    localStorage.removeItem('darda_admin_logged_in');
    localStorage.removeItem('darda_current_admin_user');
    localStorage.removeItem('darda_seller_umkm_id');
    navigateTo('login');
  };

  const handleAdminLoginStateChange = (loggedIn: boolean) => {
    if (loggedIn) {
      handleAdminLogin();
    } else {
      handleLogout();
    }
  };

  // Active seller UMKM
  const activeSellerUmkm = umkms.find((u) => u.id === sellerUmkmId) || umkms[0];

  // Find active UMKM for detail view
  const currentUmkm = umkms.find((u) => u.id === selectedUmkmId);

  // Find related products for product detail view
  const relatedProducts = selectedProduct
    ? products
        .filter(
          (p) =>
            p.id !== selectedProduct.id &&
            p.status === 'published' &&
            (p.umkm_id === selectedProduct.umkm_id || p.category === selectedProduct.category)
        )
        .slice(0, 4)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4E9] text-[#0F3D2E] selection:bg-[#0F3D2E] selection:text-[#D4AF37]">
      {/* Top Header Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPerformSearch={handlePerformSearch}
        isAdminLoggedIn={isAdminLoggedIn}
        isSuperAdmin={isSuperAdmin}
        isSellerLoggedIn={isSellerLoggedIn}
        sellerUmkmName={activeSellerUmkm?.business_name}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#0F3D2E] border-t-[#D4AF37] rounded-full animate-spin" />
            <p className="text-xs font-semibold text-[#0F3D2E] tracking-wider uppercase">
              Memuat Katalog darda.store...
            </p>
          </div>
        ) : (
          <>
            {/* 1. HOME PAGE */}
            {activePage === 'home' && (
              <HomePage
                categories={categories}
                products={products}
                umkms={umkms}
                onNavigate={navigateTo}
                onSelectProduct={handleSelectProduct}
                onSelectUmkm={handleSelectUmkm}
                onSelectCategory={handleSelectCategory}
                onAddToCart={handleAddToCart}
                cartProductIds={cartProductIds}
              />
            )}

            {/* 2. PRODUCTS CATALOG PAGE */}
            {activePage === 'products' && (
              <ProductsPage
                products={products}
                categories={categories}
                umkms={umkms}
                initialSearchQuery={searchQuery}
                initialCategory={filterCategory}
                onSelectProduct={handleSelectProduct}
                onSelectUmkm={handleSelectUmkm}
                onAddToCart={handleAddToCart}
                cartProductIds={cartProductIds}
              />
            )}

            {/* 3. PRODUCT DETAIL PAGE */}
            {activePage === 'product-detail' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                umkm={umkms.find((u) => u.id === selectedProduct.umkm_id)}
                relatedProducts={relatedProducts}
                onBack={() => navigateTo('products')}
                onSelectProduct={handleSelectProduct}
                onSelectUmkm={handleSelectUmkm}
                onNavigate={navigateTo}
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
                isInCart={cartProductIds.has(selectedProduct.id)}
              />
            )}

            {/* 4. UMKM DETAIL PAGE */}
            {activePage === 'umkm-detail' && currentUmkm && (
              <UmkmDetailPage
                umkm={currentUmkm}
                products={products.filter((p) => p.umkm_id === currentUmkm.id)}
                onBack={() => navigateTo('home')}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                cartProductIds={cartProductIds}
              />
            )}

            {/* 5. CATEGORIES PAGE */}
            {activePage === 'categories' && (
              <CategoriesPage
                categories={categories}
                products={products}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {/* 6. ABOUT PAGE */}
            {activePage === 'about' && <AboutPage onNavigate={navigateTo} />}

            {/* 7. SELF-REGISTRATION FOR JAMAAH */}
            {activePage === 'register-umkm' && (
              <RegisterUmkmPage
                categories={categories}
                onNavigate={navigateTo}
              />
            )}

            {/* 8. UNIFIED LOGIN PORTAL (ADMIN & SELLER) */}
            {activePage === 'login' && (
              <LoginPage
                umkms={umkms}
                adminUsers={adminUsers}
                onAdminLogin={handleAdminLogin}
                onSellerLogin={handleSellerLogin}
                onNavigate={navigateTo}
              />
            )}

            {/* 9. SELLER DASHBOARD (TATA KELOLA TOKO MITRA UMKM) */}
            {activePage === 'seller-dashboard' && (
              activeSellerUmkm ? (
                <SellerDashboard
                  umkm={activeSellerUmkm}
                  products={products}
                  categories={categories}
                  onRefreshData={refreshAllData}
                  onLogout={handleLogout}
                  onViewStorePublic={handleSelectUmkm}
                  onViewProductDetail={handleSelectProduct}
                />
              ) : (
                <LoginPage
                  umkms={umkms}
                  adminUsers={adminUsers}
                  onAdminLogin={handleAdminLogin}
                  onSellerLogin={handleSellerLogin}
                  onNavigate={navigateTo}
                />
              )
            )}

            {/* 10. ADMIN DASHBOARD (PENGATURAN KEBUTUHAN STORE OLEH PENGURUS) */}
            {activePage === 'admin' && (
              <AdminDashboard
                products={products}
                umkms={umkms}
                categories={categories}
                stats={stats}
                adminUsers={adminUsers}
                currentAdminUser={currentAdminUser}
                currentRole={authRole === 'super_admin' ? 'super_admin' : 'admin'}
                isAdminLoggedIn={isAdminLoggedIn}
                onLoginStateChange={handleAdminLoginStateChange}
                onRoleSwitch={(newRole) => {
                  setAuthRole(newRole);
                  localStorage.setItem('darda_auth_role', newRole);
                }}
                onRefreshData={refreshAllData}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Mosque Helpdesk WhatsApp Button (Bottom-Left) */}
      <a
        id="floating-helpdesk-wa"
        href={`https://wa.me/6287877686424?text=${encodeURIComponent(
          "Assalamu'alaikum Pengurus Darda Store Masjid Darussalam Dua, saya ingin bertanya seputar produk/UMKM jamaah."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-[#064E3B] text-white shadow-xl hover:bg-[#047857] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border-2 border-[#D4AF37]"
        title="Bantuan & Layanan Masjid via WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
        <span className="hidden group-hover:inline-block text-xs font-bold pr-1">
          Tanya Pengurus
        </span>
      </a>

      {/* Floating Shopping Cart Button (Bottom-Right) */}
      {totalCartCount > 0 && (
        <button
          id="floating-cart-btn"
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#064E3B] text-white shadow-2xl hover:bg-[#047857] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group border-2 border-[#D4AF37] animate-in fade-in slide-in-from-bottom-4 cursor-pointer"
          title="Buka Keranjang Belanja"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <span className="absolute -top-2.5 -right-2.5 bg-[#D4AF37] text-[#064E3B] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ring-2 ring-white">
              {totalCartCount > 99 ? '99+' : totalCartCount}
            </span>
          </div>
          <span className="text-xs font-bold pr-1 hidden sm:inline-block">
            Keranjang ({totalCartCount})
          </span>
        </button>
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        umkms={umkms}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onNavigateToProduct={handleSelectProduct}
        onNavigateToUmkm={handleSelectUmkm}
      />

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
