import React, { useState } from 'react';
import { 
  Crown, 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Lock, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  X,
  Key,
  Info,
  Sparkles,
  Search
} from 'lucide-react';
import { AdminUser, AdminRole } from '../types';

interface AdminUsersTabProps {
  adminUsers: AdminUser[];
  currentAdminUser?: AdminUser | null;
  currentRole: AdminRole;
  onSaveAdminUser: (user: AdminUser) => Promise<void>;
  onDeleteAdminUser: (id: string) => Promise<void>;
  onSwitchRole?: (role: AdminRole) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  adminUsers,
  currentAdminUser,
  currentRole,
  onSaveAdminUser,
  onDeleteAdminUser,
  onSwitchRole
}) => {
  const isSuperAdmin = currentRole === 'super_admin';

  // Modal State for Add/Edit Admin
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'super_admin' | 'admin'>('all');

  // Open modal to add a new admin
  const handleOpenAdd = () => {
    setEditingUser({
      id: 'admin_' + Date.now(),
      name: '',
      email: '',
      username: '',
      role: 'admin',
      phone: '',
      title: 'Divisi Usaha & Operasional',
      password: '',
      status: 'active',
      created_at: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  // Open modal to edit existing admin
  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  // Save admin user
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      alert('Nama dan Email pengurus wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveAdminUser(editingUser);
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data pengurus.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete admin with safety guard
  const handleDelete = async (user: AdminUser) => {
    if (user.id === currentAdminUser?.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang digunakan saat ini.');
      return;
    }

    const confirmMsg = `Hapus akun pengurus "${user.name}" (${user.role === 'super_admin' ? 'Super Admin' : 'Admin'})? Tindakan ini tidak dapat dibatalkan.`;
    if (window.confirm(confirmMsg)) {
      await onDeleteAdminUser(user.id);
    }
  };

  // Toggle status
  const handleToggleStatus = async (user: AdminUser) => {
    if (user.id === currentAdminUser?.id) {
      alert('Anda tidak dapat menonaktifkan akun sendiri yang sedang aktif.');
      return;
    }

    const updated: AdminUser = {
      ...user,
      status: user.status === 'active' ? 'inactive' : 'active'
    };
    await onSaveAdminUser(updated);
  };

  // If user is regular admin and viewing this tab: show polite locked screen
  if (!isSuperAdmin) {
    return (
      <div className="bg-white rounded-3xl border border-amber-200/80 p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700 shadow-xs">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>Hak Akses Terbatas</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            Menu Khusus Super Admin
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Halaman <strong>Kelola Akun Pengurus</strong> hanya dapat diakses oleh <strong>Super Admin (Pimpinan DKM)</strong> untuk menjaga integritas dan keamanan sistem Darda Store.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs text-stone-700 space-y-2">
          <div className="font-bold flex items-center gap-2 text-[#064E3B]">
            <Info className="w-4 h-4" />
            <span>Sebagai Admin Operasional, Anda dapat mengelola:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-stone-600">
            <li>Persetujuan pendaftaran UMKM & kirim akun seller</li>
            <li>Penerbitan, pembaruan, dan stok produk jamaah</li>
            <li>Katalog kategori belanja masjid</li>
            <li>Memantau grafik kunjungan & interaksi pesanan</li>
          </ul>
        </div>

        {onSwitchRole && (
          <div className="pt-2">
            <button
              onClick={() => onSwitchRole('super_admin')}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span>Simulasikan / Uji Masuk Sebagai Super Admin</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Filter admin users
  const filteredUsers = adminUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Super Admin Authority description */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-emerald-50/40 rounded-3xl border border-amber-200/80 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-[#064E3B] text-white shadow-md">
            <Crown className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                Manajemen Pengurus & Level Akun
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-xl">
              Atur hak akses pimpinan dan operator harian Darda Store Masjid Darussalam Dua. Anda dapat menambah, menugaskan jabatan, dan mengatur status pengurus.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#D4AF37]" />
          <span>Tambah Akun Pengurus</span>
        </button>
      </div>

      {/* Role Comparison Matrix Card */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
            <span>Matriks Pembagian Wewenang Akun Darda Store</span>
          </h3>
          <span className="text-[11px] text-stone-500">SOP Keamanan DKM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Super Admin Box */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-600" />
                Level 1: Super Admin (Pimpinan DKM)
              </span>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                Akses Penuh
              </span>
            </div>
            <ul className="text-[11px] text-amber-900/90 space-y-1 pl-4 list-disc">
              <li>Kontrol penuh seluruh toko UMKM, katalog, & pendaftaran jamaah</li>
              <li>Menambah, mengedit, & mengelola akun admin pengurus lainnya</li>
              <li>Otoritas reset database & sinkronisasi data awal resmi</li>
              <li>Wewenang menghapus toko UMKM dan kategori master</li>
            </ul>
          </div>

          {/* Admin Operasional Box */}
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Level 2: Admin Pengurus (Operator Harian)
              </span>
              <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded-md">
                Operasional
              </span>
            </div>
            <ul className="text-[11px] text-emerald-900/90 space-y-1 pl-4 list-disc">
              <li>Verifikasi berkas pendaftaran jamaah & terbitkan toko UMKM</li>
              <li>Mengirim kredensial username & password via WhatsApp / Email</li>
              <li>Membantu edit produk, foto, dan kategori harian</li>
              <li><strong>Terkunci:</strong> Tidak dapat mengakses manajemen pengurus atau reset database</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, jabatan..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:border-transparent focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-medium">Filter Level:</span>
          <div className="inline-flex rounded-xl p-0.5 bg-stone-100 border border-stone-200 text-xs">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === 'all' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600'
              }`}
            >
              Semua ({adminUsers.length})
            </button>
            <button
              onClick={() => setRoleFilter('super_admin')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                roleFilter === 'super_admin' ? 'bg-white shadow-xs text-amber-800' : 'text-stone-600'
              }`}
            >
              <Crown className="w-3 h-3 text-amber-600" />
              <span>Super Admin</span>
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                roleFilter === 'admin' ? 'bg-white shadow-xs text-emerald-800' : 'text-stone-600'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Users Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => {
          const isCurrentActive = user.id === currentAdminUser?.id;
          const isUserSuper = user.role === 'super_admin';

          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-4 ${
                isUserSuper 
                  ? 'border-amber-300/80 hover:border-amber-400' 
                  : 'border-stone-200/80 hover:border-emerald-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                    isUserSuper 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                  }`}>
                    {isUserSuper ? (
                      <Crown className="w-5 h-5 text-amber-600" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900">
                        {user.name}
                      </h4>
                      {isCurrentActive && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Anda
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-500 font-medium block">
                      {user.title || 'Pengurus DKM'}
                    </span>
                  </div>
                </div>

                {/* Role Pill */}
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isUserSuper 
                      ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isUserSuper ? <Crown className="w-3 h-3 text-amber-600" /> : <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                    <span>{isUserSuper ? 'Super Admin' : 'Admin Pengurus'}</span>
                  </span>
                </div>
              </div>

              {/* Details and Credentials */}
              <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Akun:</span>
                  </span>
                  <span className="font-mono font-semibold text-stone-800">{user.email}</span>
                </div>

                {user.username && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Key className="w-3.5 h-3.5" />
                      <span>Username:</span>
                    </span>
                    <span className="font-mono font-semibold text-stone-800">{user.username}</span>
                  </div>
                )}

                {user.phone && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp:</span>
                    </span>
                    <span className="font-mono font-semibold text-stone-800">{user.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[11px]">
                  <span className="text-stone-500">Status Akun:</span>
                  <span className={`inline-flex items-center gap-1 font-bold ${
                    user.status === 'active' ? 'text-emerald-700' : 'text-stone-400'
                  }`}>
                    {user.status === 'active' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Aktif Dapat Masuk</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Dinonaktifkan</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(user)}
                  disabled={isCurrentActive}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    user.status === 'active'
                      ? 'border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40'
                      : 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                  title={isCurrentActive ? "Tidak dapat menonaktifkan akun sendiri" : undefined}
                >
                  {user.status === 'active' ? 'Nonaktifkan Akun' : 'Aktifkan Kembali'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(user)}
                    className="p-2 rounded-lg text-stone-600 hover:text-[#064E3B] hover:bg-emerald-50 border border-stone-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    title="Edit Profil & Jabatan"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(user)}
                    disabled={isCurrentActive}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title={isCurrentActive ? "Tidak dapat menghapus akun sendiri" : "Hapus Akun Pengurus"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Tambah / Edit Pengurus */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    {editingUser.id.startsWith('admin_') && !adminUsers.some(a => a.id === editingUser.id)
                      ? 'Tambah Akun Pengurus Baru'
                      : 'Perbarui Data Pengurus'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    DKM Masjid Darussalam Dua • Darda Store
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setEditingUser(null); }}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Level Role Choice */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  Tingkat Akses (Role)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser({ ...editingUser, role: 'super_admin' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      editingUser.role === 'super_admin'
                        ? 'border-amber-400 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Crown className="w-4 h-4 text-amber-600" />
                      <span>Super Admin</span>
                    </div>
                    <p className="text-[10px] text-amber-800 font-normal leading-tight">
                      Akses penuh ke seluruh sistem & kelola admin
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingUser({ ...editingUser, role: 'admin' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      editingUser.role === 'admin'
                        ? 'border-emerald-400 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Admin Pengurus</span>
                    </div>
                    <p className="text-[10px] text-emerald-800 font-normal leading-tight">
                      Operator harian pendaftaran, produk, & kategori
                    </p>
                  </button>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    placeholder="Contoh: H. Ahmad Syafar"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Jabatan di Masjid / Darda
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.title}
                    onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                    placeholder="Contoh: Ketua DKM / Divisi Usaha"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Email & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    placeholder="pengurus@masjid.id"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Username Login
                  </label>
                  <input
                    type="text"
                    value={editingUser.username || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    placeholder="contoh: admin_farhan"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>

              {/* WhatsApp & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="text"
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="Kosongkan jika default"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    Default: {editingUser.role === 'super_admin' ? 'darda2026' : 'admin123'}
                  </span>
                </div>
              </div>

              {/* Status toggle */}
              <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800 block">Status Keaktifan Akun</span>
                  <span className="text-[11px] text-stone-500">Jika nonaktif, akun tidak dapat digunakan login.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUser({
                    ...editingUser,
                    status: editingUser.status === 'active' ? 'inactive' : 'active'
                  })}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    editingUser.status === 'active'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {editingUser.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>

              {/* Submit buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingUser(null); }}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Akun Pengurus'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
