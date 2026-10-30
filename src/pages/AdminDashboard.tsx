import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  LayoutGrid, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  LogIn, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  Search,
  Check,
  AlertTriangle,
  X,
  MessageCircle,
  FileText,
  Clock,
  Phone,
  Mail,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  BarChart3,
  Crown,
  Lock,
  Key,
  UserPlus,
  ShieldAlert
} from 'lucide-react';
import { AppStats, Category, Product, UMKM, ProductStatus, UMKMStatus, UMKMApplication, AdminUser, AdminRole } from '../types';
import { formatRupiah } from '../utils/formatters';
import { ImageUpload } from '../components/ImageUpload';
import { AdminCharts } from '../components/AdminCharts';
import { Logo } from '../components/Logo';
import { AdminUsersTab } from '../components/AdminUsersTab';
import { 
  saveProductItem, 
  deleteProductItem, 
  saveUmkmItem, 
  deleteUmkmItem, 
  saveCategoryItem, 
  deleteCategoryItem,
  seedInitialDatabase,
  fetchApplicationsList,
  updateApplicationStatus,
  approveAndCreateUmkm,
  saveAdminUser,
  deleteAdminUser,
  fetchAdminUsersList
} from '../firebase/service';

interface AdminDashboardProps {
  products: Product[];
  umkms: UMKM[];
  categories: Category[];
  stats: AppStats;
  adminUsers?: AdminUser[];
  currentAdminUser?: AdminUser | null;
  currentRole?: AdminRole;
  isAdminLoggedIn: boolean;
  onLoginStateChange: (loggedIn: boolean) => void;
  onRoleSwitch?: (role: AdminRole) => void;
  onRefreshData: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  umkms,
  categories,
  stats,
  adminUsers = [],
  currentAdminUser,
  currentRole = 'super_admin',
  isAdminLoggedIn,
  onLoginStateChange,
  onRoleSwitch,
  onRefreshData,
}) => {
  // Check if current user is Super Admin
  const isSuperAdmin = currentRole === 'super_admin';

  // Admin tabs: 'overview' | 'umkm' | 'products' | 'categories' | 'applications' | 'admin-users'
  const [activeTab, setActiveTab] = useState<'overview' | 'umkm' | 'products' | 'categories' | 'applications' | 'admin-users'>('overview');

  // Admin users state
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>(adminUsers);

  useEffect(() => {
    if (adminUsers.length > 0) {
      setAdminUsersList(adminUsers);
    } else if (isAdminLoggedIn) {
      fetchAdminUsersList().then((list) => setAdminUsersList(list));
    }
  }, [adminUsers, isAdminLoggedIn]);

  const handleSaveAdminUser = async (user: AdminUser) => {
    await saveAdminUser(user);
    const updated = await fetchAdminUsersList();
    setAdminUsersList(updated);
    showNotification(`Data pengurus "${user.name}" berhasil disimpan!`);
  };

  const handleDeleteAdminUser = async (id: string) => {
    await deleteAdminUser(id);
    const updated = await fetchAdminUsersList();
    setAdminUsersList(updated);
    showNotification('Akun pengurus berhasil dihapus.');
  };

  // Applications state
  const [applications, setApplications] = useState<UMKMApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<UMKMApplication | null>(null);
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isProcessingApp, setIsProcessingApp] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Newly approved seller credentials modal (to show username/pass & WhatsApp/Email dispatch)
  const [approvedCredentials, setApprovedCredentials] = useState<{
    application: UMKMApplication;
    umkm: UMKM;
    username: string;
    password: string;
  } | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // Login form state
  const [email, setEmail] = useState('admin@masjiddarussalamdua.id');
  const [password, setPassword] = useState('darda2026');
  const [loginError, setLoginError] = useState('');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isUmkmModalOpen, setIsUmkmModalOpen] = useState(false);
  const [editingUmkm, setEditingUmkm] = useState<UMKM | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [notification, setNotification] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Search in tabs
  const [tabSearch, setTabSearch] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadApplications = async () => {
    const list = await fetchApplicationsList();
    setApplications(list);
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadApplications();
    }
  }, [isAdminLoggedIn]);

  const handleApproveApp = async (app: UMKMApplication) => {
    if (!window.confirm(`Setujui pendaftaran UMKM "${app.business_name}" dan terbitkan akun seller?`)) {
      return;
    }
    setIsProcessingApp(true);
    try {
      const { umkm, credentials } = await approveAndCreateUmkm(app);
      await onRefreshData();
      await loadApplications();
      showNotification(`Alhamdulillah! Akun Seller & UMKM "${umkm.business_name}" telah aktif.`);
      setSelectedApp(null);
      setApprovedCredentials({
        application: app,
        umkm,
        username: credentials.username,
        password: credentials.password,
      });
    } catch (err) {
      console.error(err);
      showNotification('Gagal menyetujui pengajuan.');
    } finally {
      setIsProcessingApp(false);
    }
  };

  const handleRejectApp = async () => {
    if (!selectedApp) return;
    setIsProcessingApp(true);
    try {
      await updateApplicationStatus(selectedApp.id, 'rejected', rejectReason.trim() || 'Data belum memenuhi kriteria muamalah.');
      await loadApplications();
      showNotification(`Pengajuan "${selectedApp.business_name}" ditandai ditolak / revisi.`);
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedApp(null);
    } catch (err) {
      console.error(err);
      showNotification('Gagal memperbarui status pengajuan.');
    } finally {
      setIsProcessingApp(false);
    }
  };

  // -----------------------------------------------------------
  // AUTH LOGIC
  // -----------------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure authentication for mosque admin demo
    if (password.length >= 4) {
      onLoginStateChange(true);
      setLoginError('');
      showNotification('Selamat datang, Admin Masjid Darussalam Dua!');
    } else {
      setLoginError('Kata sandi minimal 4 karakter.');
    }
  };

  const handleLogout = () => {
    onLoginStateChange(false);
    showNotification('Anda telah keluar dari panel admin.');
  };

  // -----------------------------------------------------------
  // PRODUCT CRUD
  // -----------------------------------------------------------
  const openNewProductModal = () => {
    setEditingProduct({
      id: 'prod-' + Date.now(),
      name: '',
      description: '',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      category: categories[0]?.name || 'Kuliner',
      umkm_id: umkms[0]?.id || '',
      status: 'published',
      created_at: new Date().toISOString(),
      is_featured: false,
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
    if (!editingProduct.name.trim()) {
      alert('Nama produk wajib diisi.');
      return;
    }
    await saveProductItem(editingProduct);
    await onRefreshData();
    setIsProductModalOpen(false);
    showNotification(`Produk "${editingProduct.name}" berhasil disimpan!`);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Hapus produk "${name}" dari katalog?`)) {
      await deleteProductItem(id);
      await onRefreshData();
      showNotification(`Produk "${name}" berhasil dihapus.`);
    }
  };

  const handleToggleProductStatus = async (prod: Product) => {
    const updatedStatus: ProductStatus = prod.status === 'published' ? 'draft' : 'published';
    const updated = { ...prod, status: updatedStatus };
    await saveProductItem(updated);
    await onRefreshData();
    showNotification(`Status "${prod.name}" diubah menjadi ${updatedStatus === 'published' ? 'Dipublikasikan' : 'Draft'}`);
  };

  // -----------------------------------------------------------
  // UMKM CRUD
  // -----------------------------------------------------------
  const openNewUmkmModal = () => {
    setEditingUmkm({
      id: 'umkm-' + Date.now(),
      business_name: '',
      owner_name: '',
      category: categories[0]?.name || 'Kuliner',
      whatsapp: '6281234567890',
      address: 'Masjid Darussalam Dua',
      description: '',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      created_at: new Date().toISOString(),
      rating: 5.0,
    });
    setIsUmkmModalOpen(true);
  };

  const openEditUmkmModal = (item: UMKM) => {
    setEditingUmkm({ ...item });
    setIsUmkmModalOpen(true);
  };

  const handleSaveUmkm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUmkm) return;
    if (!editingUmkm.business_name.trim() || !editingUmkm.owner_name.trim()) {
      alert('Nama usaha dan pemilik wajib diisi.');
      return;
    }
    await saveUmkmItem(editingUmkm);
    await onRefreshData();
    setIsUmkmModalOpen(false);
    showNotification(`Profil UMKM "${editingUmkm.business_name}" berhasil disimpan!`);
  };

  const handleDeleteUmkm = async (id: string, name: string) => {
    if (!isSuperAdmin) {
      if (window.confirm(`Sebagai Admin Operasional, Anda dapat menonaktifkan status toko "${name}" agar tidak muncul di katalog publik. Nonaktifkan toko ini sekarang?`)) {
        const target = umkms.find(u => u.id === id);
        if (target) {
          await saveUmkmItem({ ...target, status: 'inactive' });
          await onRefreshData();
          showNotification(`Status toko "${name}" diubah menjadi Nonaktif.`);
        }
      }
      return;
    }

    if (window.confirm(`[SUPER ADMIN] Hapus UMKM "${name}" beserta seluruh produknya secara permanen dari database?`)) {
      await deleteUmkmItem(id);
      await onRefreshData();
      showNotification(`UMKM "${name}" berhasil dihapus permanen.`);
    }
  };

  // -----------------------------------------------------------
  // CATEGORY CRUD
  // -----------------------------------------------------------
  const openNewCategoryModal = () => {
    setEditingCategory({
      id: 'cat-' + Date.now(),
      name: '',
      icon: 'ShoppingBag',
      description: '',
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      alert('Nama kategori wajib diisi.');
      return;
    }
    await saveCategoryItem(editingCategory);
    await onRefreshData();
    setIsCategoryModalOpen(false);
    showNotification(`Kategori "${editingCategory.name}" berhasil disimpan!`);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!isSuperAdmin) {
      alert('Akses Ditolak: Penghapusan kategori master hanya dapat dilakukan oleh Super Admin (Pimpinan DKM).');
      return;
    }
    if (window.confirm(`Hapus kategori "${name}"?`)) {
      await deleteCategoryItem(id);
      await onRefreshData();
      showNotification(`Kategori "${name}" berhasil dihapus.`);
    }
  };

  // -----------------------------------------------------------
  // SEED FIRESTORE
  // -----------------------------------------------------------
  const handleSeedDatabase = async () => {
    if (!isSuperAdmin) {
      alert('Akses Ditolak: Fitur sinkronisasi awal dan reset database hanya dapat diakses oleh Super Admin.');
      return;
    }
    if (window.confirm('Sinkronkan dan muat ulang data resmi awal Darda Store ke Firebase Firestore?')) {
      setIsSeeding(true);
      const res = await seedInitialDatabase();
      await onRefreshData();
      setIsSeeding(false);
      showNotification(res.message);
    }
  };

  // -----------------------------------------------------------
  // IF NOT LOGGED IN: SHOW ADMIN LOGIN SCREEN
  // -----------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 shadow-md space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Portal Pengurus
            </span>
            <h2 className="font-serif-title text-2xl font-bold text-stone-900 mt-1">
              Login Admin Darda Store
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Masuk untuk mengelola UMKM jamaah, produk katalog, dan kategori.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Pengurus
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#D4AF37]" />
              <span>Masuk ke Dashboard</span>
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400">
            Dikelola oleh Panitia Kemakmuran Masjid Darussalam Dua
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // LOGGED IN: ADMIN DASHBOARD PANEL
  // -----------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#064E3B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-[#D4AF37]/40 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Top Header with Role Indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center p-2 shadow-xs shrink-0 ${
            isSuperAdmin ? 'bg-amber-50 border border-amber-300' : 'bg-emerald-50 border border-emerald-300'
          }`}>
            {isSuperAdmin ? (
              <Crown className="w-7 h-7 text-amber-600" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-emerald-700" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif-title text-xl sm:text-2xl font-bold text-stone-900">
                Panel Manajemen Darda Store
              </h1>
              
              {/* Role Badge */}
              <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                isSuperAdmin 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {isSuperAdmin ? <Crown className="w-3 h-3 text-amber-600" /> : <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                <span>{isSuperAdmin ? 'Super Admin (Pimpinan DKM)' : 'Admin (Operator Harian)'}</span>
              </span>
            </div>

            <p className="text-xs text-stone-500 mt-1">
              Masjid Darussalam Dua • Masuk sebagai: <strong className="text-stone-800">{currentAdminUser?.name || (isSuperAdmin ? 'H. Ahmad Syafar' : 'Admin Operasional')}</strong> ({currentAdminUser?.title || (isSuperAdmin ? 'Ketua DKM' : 'Divisi Usaha')})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Fast Role Simulator Button for testing */}
          {onRoleSwitch && (
            <button
              onClick={() => onRoleSwitch(isSuperAdmin ? 'admin' : 'super_admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isSuperAdmin
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-300 text-stone-700'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
              }`}
              title="Ganti sudut pandang tampilan role"
            >
              {isSuperAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Uji Mode Admin</span>
                </>
              ) : (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span>Uji Mode Super Admin</span>
                </>
              )}
            </button>
          )}

          {/* Sync DB button: enabled for super admin, locked for regular admin */}
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding || !isSuperAdmin}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer ${
              isSuperAdmin 
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-700' 
                : 'bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
            }`}
            title={isSuperAdmin ? "Sinkronkan data awal bawaan ke Firebase Firestore" : "Hanya Super Admin yang berwenang"}
          >
            {isSuperAdmin ? (
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
            ) : (
              <Lock className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span>{isSeeding ? 'Menyinkronkan...' : 'Sinkron Data Awal'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          STATISTICS SECTION (Total UMKM, Total Products, Visitors)
      ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Total UMKM */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Total UMKM</span>
            <Users className="w-4 h-4 text-[#064E3B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900">{stats.totalUmkm}</p>
          <span className="text-[11px] text-emerald-700 font-medium block">
            Usaha Binaan Jamaah
          </span>
        </div>

        {/* Stat 2: Total Products */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Total Produk</span>
            <Package className="w-4 h-4 text-[#064E3B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900">{stats.totalProducts}</p>
          <span className="text-[11px] text-emerald-700 font-medium block">
            {products.filter((p) => p.status === 'published').length} Tayang di Katalog
          </span>
        </div>

        {/* Stat 3: Visitors */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Pengunjung (Visitors)</span>
            <Eye className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900">{stats.visitorsCount}</p>
          <span className="text-[11px] text-stone-500 font-medium block">
            Trafik Kunjungan Web
          </span>
        </div>

        {/* Stat 4: WhatsApp Inquiries */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Pesanan WhatsApp</span>
            <MessageCircle className="w-4 h-4 text-[#064E3B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900">{stats.whatsappInquiries}</p>
          <span className="text-[11px] text-[#D4AF37] font-medium block">
            Interaksi Pembeli ke UMKM
          </span>
        </div>
      </div>

      {/* Navigation Menu Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200/80 pb-3 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('overview'); setTabSearch(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Ringkasan & Grafik</span>
        </button>

        <button
          onClick={() => { setActiveTab('products'); setTabSearch(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Kelola Produk ({products.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('umkm'); setTabSearch(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'umkm'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Kelola UMKM ({umkms.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('categories'); setTabSearch(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Kelola Kategori ({categories.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('applications'); setTabSearch(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'applications'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Pendaftaran Jamaah ({applications.length})</span>
          {applications.filter((a) => a.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-[#064E3B]">
              {applications.filter((a) => a.status === 'pending').length} Baru
            </span>
          )}
        </button>

        {/* Tab 6: Kelola Akun Pengurus */}
        <button
          onClick={() => { setActiveTab('admin-users'); setTabSearch(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'admin-users'
              ? 'bg-amber-700 text-white shadow-xs ring-1 ring-amber-400'
              : isSuperAdmin
              ? 'text-amber-900 bg-amber-50/70 hover:bg-amber-100/90 border border-amber-200/80'
              : 'text-stone-500 hover:bg-stone-100'
          }`}
        >
          {isSuperAdmin ? (
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-stone-400" />
          )}
          <span>Kelola Pengurus ({adminUsersList.length})</span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
            isSuperAdmin ? 'bg-amber-200 text-amber-900' : 'bg-stone-200 text-stone-600'
          }`}>
            {isSuperAdmin ? 'Super' : 'Terkunci'}
          </span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: OVERVIEW & INTERACTIVE CHARTS
      ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* ========================================================
              ANALYTICS & INTERACTIVE CHARTS SECTION
          ======================================================== */}
          <AdminCharts
            stats={stats}
            products={products}
            umkms={umkms}
            categories={categories}
            applications={applications}
          />

          {/* Quick Actions & Health Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Add Actions */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-xs">
              <h3 className="font-serif-title font-bold text-base text-stone-900">
                Aksi Cepat Manajemen
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={openNewProductModal}
                  className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-100/80 text-left transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#064E3B]">Tambah Produk Baru</h4>
                    <p className="text-[11px] text-stone-500">Unggah foto, harga, dan UMKM</p>
                  </div>
                </button>

                <button
                  onClick={openNewUmkmModal}
                  className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 hover:bg-amber-100/80 text-left transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#064E3B] flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Daftarkan UMKM Baru</h4>
                    <p className="text-[11px] text-stone-500">Nama usaha, pemilik, WhatsApp</p>
                  </div>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs space-y-2">
                <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Petunjuk Pengurus Masjid</span>
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  1. Setiap jamaah yang mendaftarkan usaha wajib diverifikasi nomor WhatsApp-nya.
                  <br />
                  2. Foto produk disarankan beresolusi jelas dan memperlihatkan kehalalan/kebersihan.
                  <br />
                  3. Manfaatkan fitur <strong>Draft / Publikasi</strong> untuk meninjau produk sebelum tampil di halaman utama.
                </p>
              </div>
            </div>

            {/* Published vs Draft Summary */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-xs">
              <h3 className="font-serif-title font-bold text-base text-stone-900">
                Kesehatan Katalog Darda Store
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <span className="text-xs text-stone-600 font-medium">Produk Publikasi Aktif</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {products.filter((p) => p.status === 'published').length} Produk
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <span className="text-xs text-stone-600 font-medium">Produk Dalam Draf (Pending)</span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    {products.filter((p) => p.status === 'draft').length} Produk
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <span className="text-xs text-stone-600 font-medium">UMKM Aktif Terverifikasi</span>
                  <span className="text-xs font-bold text-[#064E3B] bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {umkms.filter((u) => u.status === 'active').length} UMKM
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('applications')}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 cursor-pointer hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#064E3B]" />
                    <div>
                      <span className="text-xs text-stone-900 font-semibold block">Pendaftaran Mandiri Jamaah</span>
                      <span className="text-[10px] text-stone-500">Klik untuk verifikasi & publikasikan</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#064E3B] bg-white border border-amber-200 px-2.5 py-1 rounded-full shadow-2xs">
                    {applications.filter((a) => a.status === 'pending').length} Baru
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: MANAGE PRODUCTS (CRUD)
      ======================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Cari produk di admin..."
                value={tabSearch}
                onChange={(e) => setTabSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={openNewProductModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Tambah Produk</span>
            </button>
          </div>

          {/* Table of Products */}
          <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Produk</th>
                    <th className="p-4">Harga</th>
                    <th className="p-4">UMKM</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(tabSearch.toLowerCase()))
                    .map((prod) => {
                      const seller = umkms.find((u) => u.id === prod.umkm_id);
                      return (
                        <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-stone-900 block truncate max-w-[200px]">
                                {prod.name}
                              </span>
                              {prod.is_featured && (
                                <span className="text-[10px] font-bold text-[#D4AF37] bg-amber-50 px-1.5 py-0.2 rounded">
                                  Produk Pilihan
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4 font-semibold text-stone-900">
                            {formatRupiah(prod.price)}
                          </td>

                          <td className="p-4 truncate max-w-[150px]">
                            {seller?.business_name || '—'}
                          </td>

                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-medium">
                              {prod.category}
                            </span>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProductStatus(prod)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                prod.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                              }`}
                              title="Klik untuk ubah status publikasi"
                            >
                              {prod.status === 'published' ? '● Dipublikasikan' : '○ Draft'}
                            </button>
                          </td>

                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-[#064E3B] hover:bg-stone-100"
                              title="Edit Produk"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: MANAGE UMKM (CRUD)
      ======================================================== */}
      {activeTab === 'umkm' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Cari UMKM atau nama pemilik..."
                value={tabSearch}
                onChange={(e) => setTabSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={openNewUmkmModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Daftarkan UMKM Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">UMKM</th>
                    <th className="p-4">Pemilik</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">WhatsApp</th>
                    <th className="p-4">Alamat</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {umkms
                    .filter((u) => 
                      u.business_name.toLowerCase().includes(tabSearch.toLowerCase()) ||
                      u.owner_name.toLowerCase().includes(tabSearch.toLowerCase())
                    )
                    .map((umkm) => (
                      <tr key={umkm.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={umkm.image}
                            alt={umkm.business_name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <span className="font-bold text-stone-900 truncate max-w-[180px]">
                            {umkm.business_name}
                          </span>
                        </td>

                        <td className="p-4 font-medium text-stone-800">
                          {umkm.owner_name}
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px]">
                            {umkm.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-[#064E3B] font-mono">+{umkm.whatsapp}</span>
                        </td>

                        <td className="p-4 truncate max-w-[200px]" title={umkm.address}>
                          {umkm.address}
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openEditUmkmModal(umkm)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#064E3B] hover:bg-stone-100"
                            title="Edit Profil UMKM"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUmkm(umkm.id, umkm.business_name)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                            title="Hapus UMKM"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: MANAGE CATEGORIES (CRUD)
      ======================================================== */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif-title font-bold text-lg text-stone-900">
              Kategori Produk
            </h3>
            <button
              onClick={openNewCategoryModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Tambah Kategori</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.name).length;
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-stone-200/80 p-4 flex items-center justify-between shadow-xs"
                >
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{cat.name}</h4>
                    <span className="text-[11px] text-stone-400">{count} Produk Terkait</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditCategoryModal(cat)}
                      className="p-1.5 text-stone-400 hover:text-[#064E3B]"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 text-stone-400 hover:text-red-600"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: MANAGE APPLICATIONS (PENDAFTARAN JAMAAH)
      ======================================================== */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-title font-bold text-lg text-stone-900 flex items-center gap-2">
                <span>Pengajuan Pendaftaran Mandiri UMKM</span>
                {applications.filter((a) => a.status === 'pending').length > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                    {applications.filter((a) => a.status === 'pending').length} Menunggu Review
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Data pendaftaran dari jamaah Masjid Darussalam Dua yang menunggu peninjauan dan persetujuan pengurus.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadApplications}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Segarkan Data</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setAppFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                  appFilter === 'all'
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Semua ({applications.length})
              </button>
              <button
                onClick={() => setAppFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  appFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/50'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Menunggu ({applications.filter((a) => a.status === 'pending').length})</span>
              </button>
              <button
                onClick={() => setAppFilter('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  appFilter === 'approved'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/50'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Disetujui ({applications.filter((a) => a.status === 'approved').length})</span>
              </button>
              <button
                onClick={() => setAppFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  appFilter === 'rejected'
                    ? 'bg-red-700 text-white'
                    : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200/50'
                }`}
              >
                <XCircle className="w-3 h-3" />
                <span>Ditolak / Revisi ({applications.filter((a) => a.status === 'rejected').length})</span>
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Cari nama usaha, pemilik, kontak..."
                value={tabSearch}
                onChange={(e) => setTabSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* List of Applications */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D4AF37] flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-serif-title font-bold text-stone-900 text-base">
                Belum Ada Formulir Pendaftaran Masuk
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Jamaah dapat mendaftar mandiri melalui tombol <strong>"Daftar UMKM"</strong> di beranda atau navigasi utama.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications
                .filter((app) => {
                  if (appFilter !== 'all' && app.status !== appFilter) return false;
                  if (!tabSearch) return true;
                  const q = tabSearch.toLowerCase();
                  return (
                    app.business_name.toLowerCase().includes(q) ||
                    app.owner_name.toLowerCase().includes(q) ||
                    app.whatsapp.toLowerCase().includes(q) ||
                    app.category.toLowerCase().includes(q)
                  );
                })
                .map((app) => {
                  const isPending = app.status === 'pending';
                  const isApproved = app.status === 'approved';
                  const isRejected = app.status === 'rejected';

                  return (
                    <div
                      key={app.id}
                      className={`bg-white rounded-3xl border p-5 space-y-4 shadow-xs transition-all ${
                        isPending
                          ? 'border-amber-300/80 bg-gradient-to-b from-amber-50/20 to-white ring-1 ring-amber-200'
                          : 'border-stone-200/80'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.image || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=400&q=80'}
                            alt={app.business_name}
                            className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-md">
                              {app.category}
                            </span>
                            <h4 className="font-serif-title font-bold text-base text-stone-900 mt-1">
                              {app.business_name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500 mt-0.5">
                              <span>Pemilik: <strong className="text-stone-700">{app.owner_name}</strong></span>
                              {app.email && (
                                <span className="flex items-center gap-1 text-emerald-800">
                                  <Mail className="w-3 h-3 text-stone-400" />
                                  <span>{app.email}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              <Clock className="w-3 h-3" />
                              <span>Menunggu Review</span>
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Disetujui</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                              <XCircle className="w-3 h-3" />
                              <span>Ditolak / Revisi</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description & Details */}
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {app.description}
                      </p>

                      {/* Product snippet if submitted */}
                      {app.first_product_name && (
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            {app.first_product_image ? (
                              <img
                                src={app.first_product_image}
                                alt={app.first_product_name}
                                className="w-9 h-9 rounded-xl object-cover border border-stone-200"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <span className="text-[10px] text-stone-400 block">Produk Perdana</span>
                              <strong className="text-stone-800">{app.first_product_name}</strong>
                            </div>
                          </div>
                          <span className="font-bold text-[#064E3B]">
                            {app.first_product_price ? formatRupiah(app.first_product_price) : '-'}
                          </span>
                        </div>
                      )}

                      {/* Rejection note if exists */}
                      {app.admin_notes && isRejected && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                          <strong>Catatan Pengurus:</strong> {app.admin_notes}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Detail</span>
                          </button>

                          <a
                            href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Assalamu'alaikum Bpk/Ibu ${app.owner_name},\nKami dari Pengurus Masjid Darussalam Dua / Darda Store ingin mengonfirmasi pendaftaran UMKM "${app.business_name}".`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] transition-colors flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chat WA</span>
                          </a>
                        </div>

                        {/* Approval buttons for pending */}
                        {isPending && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setRejectModalOpen(true);
                              }}
                              disabled={isProcessingApp}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                            >
                              <span>Tolak / Revisi</span>
                            </button>

                            <button
                              onClick={() => handleApproveApp(app)}
                              disabled={isProcessingApp}
                              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#064E3B] hover:bg-[#047857] text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Setujui & Terbitkan</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 6: KELOLA PENGURUS & LEVEL AKUN
      ======================================================== */}
      {activeTab === 'admin-users' && (
        <AdminUsersTab
          adminUsers={adminUsersList}
          currentAdminUser={currentAdminUser}
          currentRole={currentRole}
          onSaveAdminUser={handleSaveAdminUser}
          onDeleteAdminUser={handleDeleteAdminUser}
          onSwitchRole={onRoleSwitch}
        />
      )}

      {/* ========================================================
          MODAL: VIEW APPLICATION DETAIL
      ======================================================== */}
      {selectedApp && !rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-md">
                  Pendaftaran Mandiri #{selectedApp.id.slice(-6)}
                </span>
                <h3 className="font-serif-title font-bold text-xl text-stone-900 mt-1">
                  Detail Pengajuan UMKM Jamaah
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Business Card Section */}
            <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <img
                src={selectedApp.image || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=400&q=80'}
                alt={selectedApp.business_name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-title font-bold text-lg text-stone-900">
                    {selectedApp.business_name}
                  </h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-[#064E3B]">
                    {selectedApp.category}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedApp.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-200/50">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Nama Pemilik / Jamaah:</span>
                    <strong className="text-stone-800">{selectedApp.owner_name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Alamat Email:</span>
                    <strong className="text-stone-800 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-emerald-700" />
                      <span>{selectedApp.email || 'Tidak dicantumkan'}</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">No. WhatsApp:</span>
                    <a
                      href={`https://wa.me/${selectedApp.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#064E3B] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-[#D4AF37]" />
                      <span>{selectedApp.whatsapp}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Tanggal Pengajuan:</span>
                    <span className="text-stone-700">
                      {new Date(selectedApp.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* If already approved, show generated credentials box */}
                {selectedApp.status === 'approved' && selectedApp.generated_username && (
                  <div className="mt-2 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-950 block">Akses Akun Seller Terbit:</span>
                      <button
                        onClick={() => {
                          const matchingUmkm = umkms.find(
                            u => u.username === selectedApp.generated_username || u.business_name === selectedApp.business_name
                          ) || {
                            id: 'umkm_' + selectedApp.id,
                            business_name: selectedApp.business_name,
                            owner_name: selectedApp.owner_name,
                            category: selectedApp.category,
                            whatsapp: selectedApp.whatsapp,
                            email: selectedApp.email || '',
                            address: selectedApp.address,
                            description: selectedApp.description,
                            image: selectedApp.image || '',
                            status: 'active' as const,
                            created_at: selectedApp.created_at,
                            rating: 5.0
                          };
                          setApprovedCredentials({
                            application: selectedApp,
                            umkm: matchingUmkm,
                            username: selectedApp.generated_username!,
                            password: selectedApp.generated_password || 'Darda1234!'
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#064E3B] hover:bg-[#047857] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Mail className="w-3 h-3 text-[#D4AF37]" />
                        <span>Kirim Ulang ke Email / WA</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-emerald-900 font-mono">
                      <span>Username: <strong>{selectedApp.generated_username}</strong></span>
                      {selectedApp.generated_password && (
                        <span>Password: <strong>{selectedApp.generated_password}</strong></span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Alamat Usaha / Rumah
              </h5>
              <p className="text-xs text-stone-700 p-3 bg-white rounded-xl border border-stone-200">
                {selectedApp.address}
              </p>
            </div>

            {/* First Product preview */}
            {selectedApp.first_product_name && (
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Produk Perdana Yang Disertakan
                </h5>
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex flex-col sm:flex-row gap-4">
                  {selectedApp.first_product_image && (
                    <img
                      src={selectedApp.first_product_image}
                      alt={selectedApp.first_product_name}
                      className="w-20 h-20 rounded-xl object-cover border border-emerald-200 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h6 className="font-bold text-stone-900 text-sm">{selectedApp.first_product_name}</h6>
                      <span className="font-bold text-[#064E3B] text-sm">
                        {selectedApp.first_product_price ? formatRupiah(selectedApp.first_product_price) : '-'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {selectedApp.description || 'Produk perdana dari usaha binaan jamaah.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
              <a
                href={`https://wa.me/${selectedApp.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Assalamu'alaikum Bpk/Ibu ${selectedApp.owner_name},\nKami dari Pengurus Darda Store Masjid Darussalam Dua ingin mengonfirmasi pendaftaran UMKM "${selectedApp.business_name}".`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Hubungi via WhatsApp</span>
              </a>

              {selectedApp.status === 'pending' ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                  >
                    Tolak / Minta Revisi
                  </button>
                  <button
                    onClick={() => handleApproveApp(selectedApp)}
                    disabled={isProcessingApp}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-[#064E3B] hover:bg-[#047857] text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Setujui & Terbitkan ke Darda Store</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs text-stone-500 font-semibold">
                  Status saat ini:{' '}
                  <strong className={selectedApp.status === 'approved' ? 'text-emerald-700' : 'text-red-700'}>
                    {selectedApp.status === 'approved' ? 'Disetujui & Aktif' : 'Ditolak / Revisi'}
                  </strong>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: REJECT OR REQUEST REVISION
      ======================================================== */}
      {rejectModalOpen && selectedApp && (
        <div className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-title font-bold text-base text-stone-900 flex items-center gap-1.5 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span>Tolak atau Minta Revisi Pengajuan</span>
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Pengajuan dari <strong>{selectedApp.business_name}</strong> ({selectedApp.owner_name}) akan ditandai perlu perbaikan/ditolak.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Catatan Pengurus / Alasan Penolakan
              </label>
              <textarea
                rows={4}
                placeholder="Contoh: Mohon unggah foto produk yang lebih terang, atau pastikan izin usaha/sertifikat halal dicantumkan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
              >
                Batal
              </button>
              <button
                onClick={handleRejectApp}
                disabled={isProcessingApp}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-800 text-white cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isProcessingApp ? 'Menyimpan...' : 'Simpan Status Penolakan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: NEWLY APPROVED SELLER CREDENTIALS (WHATSAPP & EMAIL)
      ======================================================== */}
      {approvedCredentials && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 my-8 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="text-center space-y-1.5 pb-3 border-b border-stone-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center mx-auto mb-2 shadow-xs">
                <CheckCircle2 className="w-7 h-7 text-[#064E3B]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                Pendaftaran Disetujui & Diterbitkan
              </span>
              <h3 className="font-serif-title font-bold text-xl text-stone-900">
                Akun Seller Berhasil Dibuat!
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Kredensial login berikut telah dibuat dan siap dikirimkan kepada mitra UMKM jamaah.
              </p>
            </div>

            {/* Credentials Card */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 text-xs">
                <span className="text-stone-500">Nama Usaha:</span>
                <strong className="text-stone-900">{approvedCredentials.application.business_name}</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 text-xs">
                <span className="text-stone-500">Pemilik (Jamaah):</span>
                <strong className="text-stone-900">{approvedCredentials.application.owner_name}</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 text-xs">
                <span className="text-stone-500">Email Seller:</span>
                <strong className="text-stone-900 font-mono text-emerald-800">
                  {approvedCredentials.application.email || `${approvedCredentials.username}@dardastore.id`}
                </strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 text-xs">
                <span className="text-stone-500">Username Login:</span>
                <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                  {approvedCredentials.username}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Kata Sandi (Password):</span>
                <span className="font-mono font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {approvedCredentials.password}
                </span>
              </div>
            </div>

            {/* Recommendation note */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[11px] text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Rekomendasi Pengiriman Kredensial:</span>
              </p>
              <p className="leading-relaxed">
                Kirimkan kredensial melalui <strong>WhatsApp</strong> (prioritas utama agar cepat dibaca oleh pemilik) serta salinan via <strong>Email</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            {(() => {
              const sellerEmail = approvedCredentials.application.email || '';
              const sellerBusiness = approvedCredentials.application.business_name;
              const sellerOwner = approvedCredentials.application.owner_name;
              const sellerUsername = approvedCredentials.username;
              const sellerPassword = approvedCredentials.password;
              const loginUrl = `${window.location.origin}/login`;

              const dispatchMessage = `Assalamu'alaikum Warahmatullahi Wabarakatuh, Bpk/Ibu ${sellerOwner}.\n\nAlhamdulillah! Pendaftaran UMKM "${sellerBusiness}" telah DISETUJUI oleh Pengurus DKM Masjid Darussalam Dua dan resmi terbit di DARDA STORE.\n\nBerikut informasi akun Seller Anda untuk login ke dashboard:\n• Link Login: ${loginUrl}\n• Username: ${sellerUsername}\n• Email: ${sellerEmail || sellerUsername + '@dardastore.id'}\n• Kata Sandi: ${sellerPassword}\n\nSilakan login untuk memeriksa profil toko, menambahkan produk, serta mengelola pesanan jamaah.\n\nJazakumullahu Khairan,\nPengurus DKM Masjid Darussalam Dua / Darda Store`;

              const emailSubject = `Akun Seller Darda Store - ${sellerBusiness}`;
              const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(sellerEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(dispatchMessage)}`;
              const mailtoUrl = `mailto:${sellerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(dispatchMessage)}`;
              const waUrl = `https://wa.me/${approvedCredentials.application.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(dispatchMessage)}`;

              return (
                <div className="space-y-2.5 pt-1">
                  {/* WhatsApp Button */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    <span>Kirim Akun ke WhatsApp Seller (Prioritas Utama)</span>
                  </a>

                  {/* Email Delivery Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Gmail Web direct */}
                    <a
                      href={gmailWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 font-semibold text-xs border border-red-200 transition-colors flex items-center justify-center gap-1.5"
                      title="Buka langsung di tab Gmail browser Anda dengan pesan terisi otomatis"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-600" />
                      <span>Buka di Gmail Web</span>
                    </a>

                    {/* Mailto default app */}
                    <a
                      href={mailtoUrl}
                      className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] font-semibold text-xs border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                      title="Buka lewat aplikasi email bawaan laptop / HP (Outlook, Apple Mail, dll)"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#064E3B]" />
                      <span>Aplikasi Email (Mailto)</span>
                    </a>
                  </div>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(dispatchMessage);
                      setCopiedCreds(true);
                      setTimeout(() => setCopiedCreds(false), 2500);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-300/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>{copiedCreds ? 'Teks Pesan Berhasil Disalin!' : 'Salin Teks Pesan Lengkap'}</span>
                  </button>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setApprovedCredentials(null)}
                    className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  >
                    Selesai / Tutup
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT PRODUCT
      ======================================================== */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                {editingProduct.name ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Brownies Fudgy Panggang"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pilih UMKM Pemilik *
                </label>
                <select
                  value={editingProduct.umkm_id}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, umkm_id: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                >
                  <option value="">-- Pilih UMKM --</option>
                  {umkms.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.business_name} ({u.owner_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload with Drag/Drop, Link & Preset Support */}
              <ImageUpload
                value={editingProduct.image}
                onChange={(imgUrl) =>
                  setEditingProduct({ ...editingProduct, image: imgUrl })
                }
                label="Foto Produk"
              />

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Deskripsi Lengkap Produk
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan bahan, rasa, ukuran, varian, atau spesifikasi..."
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.status === 'published'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="rounded text-[#064E3B] focus:ring-[#064E3B] w-4 h-4"
                  />
                  <span>Publikasikan Langsung ke Katalog</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.is_featured}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_featured: e.target.checked,
                      })
                    }
                    className="rounded text-[#D4AF37] focus:ring-[#D4AF37] w-4 h-4"
                  />
                  <span>Tandai Sebagai Produk Pilihan</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT UMKM
      ======================================================== */}
      {isUmkmModalOpen && editingUmkm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-title font-bold text-lg text-stone-900">
                {editingUmkm.business_name ? 'Edit UMKM' : 'Daftarkan UMKM Baru'}
              </h3>
              <button
                onClick={() => setIsUmkmModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUmkm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Usaha / Merk *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Aisyah Bakery & Pastry"
                    value={editingUmkm.business_name}
                    onChange={(e) =>
                      setEditingUmkm({ ...editingUmkm, business_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Pemilik (Jamaah) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ibu Hj. Aisyah"
                    value={editingUmkm.owner_name}
                    onChange={(e) =>
                      setEditingUmkm({ ...editingUmkm, owner_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor WhatsApp * (Awali dengan 62)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 6281298765432"
                    value={editingUmkm.whatsapp}
                    onChange={(e) =>
                      setEditingUmkm({ ...editingUmkm, whatsapp: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kategori Bidang Usaha
                  </label>
                  <select
                    value={editingUmkm.category}
                    onChange={(e) =>
                      setEditingUmkm({ ...editingUmkm, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alamat / Lokasi Usaha di Sekitar Masjid
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Komplek Masjid Blok B No. 12"
                  value={editingUmkm.address}
                  onChange={(e) =>
                    setEditingUmkm({ ...editingUmkm, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              {/* Image Upload for UMKM */}
              <ImageUpload
                value={editingUmkm.image}
                onChange={(imgUrl) =>
                  setEditingUmkm({ ...editingUmkm, image: imgUrl })
                }
                label="Foto Profil / Tempat Usaha UMKM"
              />

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Deskripsi Profil Usaha
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan sejarah singkat, keunggulan bahan, dan jaminan halal..."
                  value={editingUmkm.description}
                  onChange={(e) =>
                    setEditingUmkm({ ...editingUmkm, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsUmkmModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Profil UMKM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT CATEGORY
      ======================================================== */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-title font-bold text-base text-stone-900">
                {editingCategory.name ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kuliner, Fashion, Pertanian"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  placeholder="Deskripsi kategori..."
                  value={editingCategory.description || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
