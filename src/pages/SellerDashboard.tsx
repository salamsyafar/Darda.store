import React, { useState, useEffect } from 'react';
import { 
  UMKM, 
  Product, 
  Category, 
  SellerOrderNote,
  ProductStatus
} from '../types';
import { 
  saveProductItem, 
  deleteProductItem, 
  saveUmkmItem,
  fetchSellerOrdersList,
  saveSellerOrderItem,
  deleteSellerOrderItem
} from '../firebase/service';
import { formatRupiah } from '../utils/formatters';
import { ImageUpload } from '../components/ImageUpload';
import { Logo } from '../components/Logo';
import { 
  Store, 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Settings, 
  ClipboardList, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Phone,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Search,
  Loader2
} from 'lucide-react';

interface SellerDashboardProps {
  umkm: UMKM;
  products: Product[];
  categories: Category[];
  onRefreshData: () => Promise<void>;
  onLogout: () => void;
  onViewStorePublic: (umkmId: string) => void;
  onViewProductDetail: (product: Product) => void;
}

type SellerTab = 'products' | 'profile' | 'orders' | 'promotion';

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  umkm,
  products,
  categories,
  onRefreshData,
  onLogout,
  onViewStorePublic,
  onViewProductDetail
}) => {
  const [activeTab, setActiveTab] = useState<SellerTab>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // My store's products only
  const myProducts = products.filter(p => p.umkm_id === umkm.id);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Profile edit state
  const [profileForm, setProfileForm] = useState<UMKM>({ ...umkm });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<SellerOrderNote[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<SellerOrderNote>>({
    customer_name: '',
    customer_whatsapp: '',
    product_name: myProducts[0]?.name || '',
    quantity: 1,
    total_price: myProducts[0]?.price || 0,
    status: 'pending',
    notes: ''
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadOrders = async () => {
    const list = await fetchSellerOrdersList(umkm.id);
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
    setProfileForm({ ...umkm });
  }, [umkm.id]);

  // Statistics
  const totalProducts = myProducts.length;
  const publishedProducts = myProducts.filter(p => p.status === 'published').length;
  const draftProducts = myProducts.filter(p => p.status === 'draft').length;
  const totalCatalogValue = myProducts.reduce((acc, p) => acc + p.price, 0);

  // Product CRUD
  const openNewProductModal = () => {
    setEditingProduct({
      id: 'prod_' + Date.now(),
      name: '',
      description: '',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      category: categories[0]?.name || 'Kuliner',
      umkm_id: umkm.id,
      status: 'published',
      created_at: new Date().toISOString(),
      is_featured: false
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name.trim() || editingProduct.price <= 0) {
      alert('Nama produk dan harga yang valid wajib diisi.');
      return;
    }

    try {
      setIsSavingProduct(true);
      await saveProductItem(editingProduct);
      await onRefreshData();
      setIsProductModalOpen(false);
      showNotification(`Produk "${editingProduct.name}" berhasil disimpan!`);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Terjadi kendala saat menyimpan produk. Silakan coba lagi.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (prod: Product) => {
    if (window.confirm(`Hapus produk "${prod.name}" dari toko Anda?`)) {
      await deleteProductItem(prod.id);
      await onRefreshData();
      showNotification(`Produk "${prod.name}" berhasil dihapus.`);
    }
  };

  const handleToggleProductStatus = async (prod: Product) => {
    const newStatus: ProductStatus = prod.status === 'published' ? 'draft' : 'published';
    const updated: Product = { ...prod, status: newStatus };
    await saveProductItem(updated);
    await onRefreshData();
    showNotification(`Status "${prod.name}" diubah menjadi ${newStatus === 'published' ? 'Terbit di Katalog' : 'Disimpan Sebagai Draft'}`);
  };

  // Profile update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await saveUmkmItem(profileForm);
      await onRefreshData();
      showNotification('Profil toko berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      showNotification('Gagal memperbarui profil toko.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Order notes CRUD
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customer_name || !newOrder.product_name) {
      alert('Nama pelanggan dan produk wajib diisi.');
      return;
    }

    const orderItem: SellerOrderNote = {
      id: 'ord_' + Date.now(),
      umkm_id: umkm.id,
      customer_name: newOrder.customer_name || '',
      customer_whatsapp: newOrder.customer_whatsapp || '',
      product_name: newOrder.product_name || '',
      quantity: Number(newOrder.quantity) || 1,
      total_price: Number(newOrder.total_price) || 0,
      status: (newOrder.status as any) || 'pending',
      notes: newOrder.notes || '',
      created_at: new Date().toISOString()
    };

    await saveSellerOrderItem(orderItem);
    await loadOrders();
    setIsOrderModalOpen(false);
    setNewOrder({
      customer_name: '',
      customer_whatsapp: '',
      product_name: myProducts[0]?.name || '',
      quantity: 1,
      total_price: myProducts[0]?.price || 0,
      status: 'pending',
      notes: ''
    });
    showNotification('Catatan pesanan berhasil ditambahkan!');
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Hapus catatan pesanan ini?')) {
      await deleteSellerOrderItem(orderId);
      await loadOrders();
      showNotification('Catatan pesanan dihapus.');
    }
  };

  const handleUpdateOrderStatus = async (order: SellerOrderNote, newStatus: SellerOrderNote['status']) => {
    const updated = { ...order, status: newStatus };
    await saveSellerOrderItem(updated);
    await loadOrders();
    showNotification(`Status pesanan diperbarui menjadi "${newStatus}".`);
  };

  // Store Link Copier
  const storeUrl = `${window.location.origin}/#toko-${umkm.id}`;
  const handleCopyStoreLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showNotification('Tautan toko berhasil disalin ke clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 bg-[#064E3B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#D4AF37] animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* SELLER STORE HEADER BANNER */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#08634B] to-[#064E3B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-800">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 -bottom-16 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <Logo size="xl" variant="icon" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={umkm.image}
              alt={umkm.business_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-md shrink-0 bg-white"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D4AF37] text-[#064E3B]">
                  {umkm.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-700/80 text-emerald-100 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Toko Binaan Terverifikasi</span>
                </span>
              </div>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {umkm.business_name}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                Pemilik: <strong className="text-white">{umkm.owner_name}</strong> • WA: {umkm.whatsapp}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onViewStorePublic(umkm.id)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
              <span>Lihat Toko Publik</span>
            </button>

            <button
              onClick={handleCopyStoreLink}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c29f30] text-[#064E3B] text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Tersalin!' : 'Bagikan Link Toko'}</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-400/30 text-xs font-semibold transition-all cursor-pointer"
              title="Keluar dari Akun Seller"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STORE STATS CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
              Total Produk
            </span>
            <span className="text-2xl font-serif-title font-bold text-stone-900">
              {totalProducts}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
              Produk Terbit
            </span>
            <span className="text-2xl font-serif-title font-bold text-[#064E3B]">
              {publishedProducts}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <EyeOff className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
              Draft / Disimpan
            </span>
            <span className="text-2xl font-serif-title font-bold text-amber-700">
              {draftProducts}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#064E3B] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
              Nilai Katalog
            </span>
            <span className="text-base sm:text-lg font-serif-title font-bold text-stone-900 truncate block">
              {formatRupiah(totalCatalogValue)}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TABS NAVIGATION */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Katalog Produk Toko ({myProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Buku Pesanan ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profil & Info Toko</span>
        </button>

        <button
          onClick={() => setActiveTab('promotion')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'promotion'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Promosi & Link WhatsApp</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PRODUCT MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Cari produk toko Anda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              >
                <option value="all">Semua Status</option>
                <option value="published">Terbit Saja</option>
                <option value="draft">Draft Saja</option>
              </select>
            </div>

            <button
              onClick={openNewProductModal}
              id="seller-add-product-btn"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          {/* Product Cards Grid */}
          {myProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                Belum Ada Produk di Toko Anda
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Mulai tambahkan produk unggulan Anda ke etalase Darda Store agar jamaah dapat memesan langsung via WhatsApp.
              </p>
              <button
                onClick={openNewProductModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-[#047857] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Tambah Produk Perdana</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myProducts
                .filter(p => {
                  if (statusFilter !== 'all' && p.status !== statusFilter) return false;
                  if (!searchQuery) return true;
                  return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
                })
                .map((prod) => {
                  const isPub = prod.status === 'published';
                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Container */}
                        <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#064E3B] shadow-xs">
                              {prod.category}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1 ${
                                isPub
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-800 text-white'
                              }`}
                            >
                              {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{isPub ? 'Tayang' : 'Draft'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif-title font-bold text-base text-stone-900 group-hover:text-[#064E3B] transition-colors line-clamp-1">
                              {prod.name}
                            </h4>
                          </div>
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                          <div className="pt-2">
                            <span className="text-base font-bold text-[#064E3B]">
                              {formatRupiah(prod.price)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleProductStatus(prod)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                            isPub
                              ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                          }`}
                          title={isPub ? 'Ubah jadi Draft (Sembunyikan)' : 'Terbitkan ke Katalog'}
                        >
                          {isPub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{isPub ? 'Jadikan Draft' : 'Terbitkan'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onViewProductDetail(prod)}
                            className="p-2 rounded-xl text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer"
                            title="Lihat Tampilan Produk"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditProductModal(prod)}
                            className="p-2 rounded-xl text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Produk"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod)}
                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STORE ORDERS / BOOK */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                Buku Catatan Pesanan & Inquiry Jamaah
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Catat pemesanan yang masuk via WhatsApp jamaah untuk mempermudah rekap dan follow-up.
              </p>
            </div>

            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Catat Pesanan Masuk</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-3">
              <ClipboardList className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="font-serif-title font-bold text-stone-800 text-sm">
                Belum Ada Catatan Pesanan
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Ketika ada jamaah yang menghubungi dan memesan via WhatsApp, Anda dapat mencatat transaksinya di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((ord) => {
                const isPending = ord.status === 'pending';
                const isProcessing = ord.status === 'processing';
                const isCompleted = ord.status === 'completed';

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-stone-200/80 p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase font-bold">
                          {new Date(ord.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <h4 className="font-serif-title font-bold text-base text-stone-900 mt-0.5">
                          {ord.customer_name}
                        </h4>
                        <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-[#064E3B]" />
                          <span>{ord.customer_whatsapp || 'Tanpa no. WA'}</span>
                        </p>
                      </div>

                      <div>
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Pesanan Baru
                          </span>
                        )}
                        {isProcessing && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            Sedang Diproses
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Selesai
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-stone-800 block">{ord.product_name}</strong>
                        <span className="text-stone-500 text-[11px]">Jumlah: {ord.quantity} porsi / item</span>
                      </div>
                      <span className="font-bold text-[#064E3B] text-sm">
                        {formatRupiah(ord.total_price)}
                      </span>
                    </div>

                    {ord.notes && (
                      <p className="text-xs text-stone-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/50">
                        Catatan: {ord.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      {ord.customer_whatsapp && (
                        <a
                          href={`https://wa.me/${ord.customer_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Assalamu'alaikum Bpk/Ibu ${ord.customer_name},\nKami dari ${umkm.business_name} mengonfirmasi pesanan ${ord.product_name} (${ord.quantity}x).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat Pelanggan</span>
                        </a>
                      )}

                      <div className="flex items-center gap-1 ml-auto">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord, e.target.value as any)}
                          className="px-2 py-1 rounded-lg text-xs border border-stone-200 bg-white text-stone-700"
                        >
                          <option value="pending">Pesanan Baru</option>
                          <option value="processing">Diproses</option>
                          <option value="completed">Selesai</option>
                          <option value="cancelled">Batal</option>
                        </select>

                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                          title="Hapus Pesanan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: STORE PROFILE & SETTINGS */}
      {/* ========================================================= */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="font-serif-title font-bold text-xl text-stone-900">
              Pengaturan Profil Toko UMKM
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Perbarui identitas toko, deskripsi usaha, kontak WhatsApp, dan foto toko binaan Anda.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Usaha / Toko
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.business_name}
                  onChange={(e) => setProfileForm({ ...profileForm, business_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Pemilik / Jamaah
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.owner_name}
                  onChange={(e) => setProfileForm({ ...profileForm, owner_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor WhatsApp Pemesanan
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.whatsapp}
                  onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                  placeholder="Contoh: 6281234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Gunakan awalan 628... tanpa spasi.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kategori Utama Usaha
                </label>
                <select
                  value={profileForm.category}
                  onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Alamat Rumah / Lokasi Usaha
              </label>
              <input
                type="text"
                required
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Deskripsi Usaha & Cerita Produk
              </label>
              <textarea
                rows={3}
                value={profileForm.description}
                onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
              />
            </div>

            <div>
              <ImageUpload
                label="Foto Profil / Banner Toko UMKM"
                value={profileForm.image}
                onChange={(newUrl) => setProfileForm({ ...profileForm, image: newUrl })}
                presetCategory={profileForm.category}
              />
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PROMOTION & STORE LINK */}
      {/* ========================================================= */}
      {activeTab === 'promotion' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif-title font-bold text-xl text-stone-900">
                Bagikan Toko Anda ke Jamaah & Pelanggan
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Gunakan tautan resmi dan template pesan WhatsApp di bawah untuk mempromosikan produk Anda di grup pengajian, RT/RW, dan keluarga.
              </p>
            </div>

            {/* Link Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
              <span className="text-xs font-bold text-[#064E3B] block uppercase tracking-wider">
                Tautan Resmi Toko Darda Store Anda:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={storeUrl}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-stone-800 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyStoreLink}
                  className="px-4 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-[#047857] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* WA Message Template */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                Template Pesan Promosi WhatsApp Siap Kirim:
              </label>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2 leading-relaxed font-sans">
                <p>Assalamu'alaikum Warahmatullahi Wabarakatuh Bapak/Ibu Jamaah sekalian,</p>
                <p>
                  Mari dukung usaha jamaah Masjid Darussalam Dua. Kami dari <strong>{umkm.business_name}</strong> menyediakan aneka {umkm.category.toLowerCase()} halal dan berkah.
                </p>
                <p>
                  Kunjungi etalase katalog produk kami di Darda Store:{' '}
                  <span className="text-[#064E3B] font-semibold">{storeUrl}</span>
                </p>
                <p>Terima kasih, Jazakumullah Khairan Katsiran.</p>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Assalamu'alaikum Warahmatullahi Wabarakatuh Bapak/Ibu Jamaah sekalian,\n\nMari dukung usaha UMKM binaan Masjid Darussalam Dua. Kami dari *${umkm.business_name}* (${umkm.category}) menyediakan produk halal & berkah.\n\nKunjungi katalog lengkap kami di Darda Store:\n${storeUrl}\n\nJazakumullah Khairan Katsiran.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs cursor-pointer mt-2"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Bagikan ke WhatsApp Sekarang</span>
              </a>
            </div>

            {/* Islamic Trade Ethics */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-start gap-3 text-xs text-amber-900">
              <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold block text-stone-900">Prinsip Muamalah Berkah:</strong>
                <span>
                  "Pedagang yang jujur dan terpercaya akan bersama para nabi, orang-orang shiddiq, dan para syuhada." (HR. Tirmidzi). Jaga kejujuran kualitas, ketepatan timbangan, dan akad yang jelas bersama pelanggan.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 my-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                {editingProduct.id.startsWith('prod_') && !myProducts.some(p => p.id === editingProduct.id)
                  ? 'Tambah Produk Baru Toko'
                  : 'Edit Produk Toko'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Contoh: Brownies Kukus Lumer, Madu Randu 250ml"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    step={500}
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none font-semibold text-[#064E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Status Publikasi
                </label>
                <select
                  value={editingProduct.status}
                  onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as ProductStatus })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                >
                  <option value="published">Terbit (Tampil di Katalog Darda Store)</option>
                  <option value="draft">Draft (Simpan Sementara / Tidak Tayang)</option>
                </select>
              </div>

              <div>
                <ImageUpload
                  label="Foto Produk"
                  value={editingProduct.image}
                  onChange={(newUrl) => setEditingProduct({ ...editingProduct, image: newUrl })}
                  presetCategory={editingProduct.category}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Jelaskan keunggulan, bahan baku, berat/kemasan produk..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] disabled:opacity-60 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {isSavingProduct && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSavingProduct ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD ORDER RECORD */}
      {/* ========================================================= */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 my-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-title font-bold text-base text-stone-900">
                Catat Pesanan Masuk
              </h3>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Pembeli / Jamaah
                </label>
                <input
                  type="text"
                  required
                  value={newOrder.customer_name}
                  onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                  placeholder="Contoh: Bpk. Ahmad"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor WhatsApp Pembeli
                </label>
                <input
                  type="tel"
                  value={newOrder.customer_whatsapp}
                  onChange={(e) => setNewOrder({ ...newOrder, customer_whatsapp: e.target.value })}
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Produk Yang Dipesan
                </label>
                <select
                  value={newOrder.product_name}
                  onChange={(e) => {
                    const selProd = myProducts.find(p => p.name === e.target.value);
                    setNewOrder({ 
                      ...newOrder, 
                      product_name: e.target.value,
                      total_price: (selProd?.price || 0) * (newOrder.quantity || 1)
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                >
                  {myProducts.map((p) => (
                    <option key={p.id} value={p.name}>{p.name} ({formatRupiah(p.price)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newOrder.quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value, 10) || 1;
                      const selProd = myProducts.find(p => p.name === newOrder.product_name);
                      setNewOrder({ 
                        ...newOrder, 
                        quantity: qty,
                        total_price: (selProd?.price || 0) * qty
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Total Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={newOrder.total_price}
                    onChange={(e) => setNewOrder({ ...newOrder, total_price: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold text-[#064E3B] focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Catatan / Keterangan
                </label>
                <textarea
                  rows={2}
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  placeholder="Catatan pesanan, alamat antar, atau jam ambil..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
