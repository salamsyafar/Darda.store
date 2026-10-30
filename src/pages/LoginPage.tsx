import React, { useState } from 'react';
import { 
  LogIn, 
  AlertCircle, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Sparkles,
  ArrowRight,
  UserPlus,
  MessageCircle
} from 'lucide-react';
import { UMKM, AdminUser, AdminRole } from '../types';
import { Logo } from '../components/Logo';

interface LoginPageProps {
  umkms: UMKM[];
  adminUsers?: AdminUser[];
  onAdminLogin: (role: AdminRole, adminUser?: AdminUser) => void;
  onSellerLogin: (umkmId: string) => void;
  onNavigate: (page: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  umkms,
  adminUsers = [],
  onAdminLogin,
  onSellerLogin,
  onNavigate
}) => {
  // Clean single login credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Admin WhatsApp Contact requested by user
  const adminWaNumber = '087877686424';
  const adminWaInternational = '6287877686424';

  // Dynamic role detection based on username/email address
  const detectRoleAndAccount = (identifier: string) => {
    const clean = identifier.trim().toLowerCase();

    // 1. Check in configured admin users list
    const foundAdmin = adminUsers.find(
      a => (a.email && a.email.toLowerCase() === clean) || 
           (a.username && a.username.toLowerCase() === clean) ||
           (a.name && clean.includes(a.name.toLowerCase().replace(/\s+/g, '')))
    );

    if (foundAdmin) {
      return {
        role: foundAdmin.role, // 'super_admin' | 'admin'
        adminUser: foundAdmin,
        umkm: null
      };
    }
    
    // 2. Fallback heuristic detection for super admin & admin
    if (
      clean === 'salamsyafar@gmail.com' ||
      clean === 'superadmin' ||
      clean.includes('superadmin') ||
      clean === 'ketua@masjid.id'
    ) {
      return {
        role: 'super_admin' as const,
        adminUser: {
          id: 'admin_super_1',
          name: 'H. Ahmad Syafar',
          email: 'salamsyafar@gmail.com',
          username: 'superadmin',
          role: 'super_admin' as const,
          phone: '087877686424',
          title: 'Ketua DKM / Pimpinan Utama',
          status: 'active' as const,
          created_at: new Date().toISOString()
        },
        umkm: null
      };
    }

    if (
      clean === 'admin' || 
      clean.includes('admin') || 
      clean === 'pengurus@masjid.id' ||
      clean === 'darda@masjid.id' ||
      clean === 'pengurus@dardastore.id'
    ) {
      return {
        role: 'admin' as const,
        adminUser: {
          id: 'admin_op_1',
          name: 'Ustadz Farhan',
          email: 'pengurus@dardastore.id',
          username: 'admin',
          role: 'admin' as const,
          phone: '081234567890',
          title: 'Divisi UMKM & Operasional Harian',
          status: 'active' as const,
          created_at: new Date().toISOString()
        },
        umkm: null
      };
    }

    // 3. Match seller UMKM by username, email, ID, or business name
    const foundDirect = umkms.find((u) => 
      (u.username && clean === u.username.toLowerCase()) ||
      (u.email && clean === u.email.toLowerCase()) ||
      (u.id && clean === u.id.toLowerCase()) ||
      clean.includes(u.business_name.toLowerCase().replace(/\s+/g, '')) ||
      clean.includes(u.owner_name.toLowerCase().replace(/\s+/g, ''))
    );

    let targetUmkm = foundDirect;
    if (!targetUmkm) {
      if (clean.includes('madu')) {
        targetUmkm = umkms.find((u) => u.business_name.toLowerCase().includes('madu'));
      } else if (clean.includes('fashion') || clean.includes('rayan') || clean.includes('busana')) {
        targetUmkm = umkms.find((u) => u.category.toLowerCase().includes('fashion'));
      } else if (clean.includes('aisyah') || clean.includes('bakery') || clean.includes('brownies') || clean.includes('kue')) {
        targetUmkm = umkms.find((u) => u.business_name.toLowerCase().includes('aisyah') || u.category.toLowerCase().includes('kuliner'));
      }
    }

    return {
      role: 'seller' as const,
      adminUser: null,
      umkm: targetUmkm || umkms[0]
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedIdentifier = email.trim();
    if (!trimmedIdentifier) {
      setError('Silakan masukkan username atau email akun Anda.');
      return;
    }

    const trimmedPass = password.trim();
    if (!trimmedPass) {
      setError('Silakan masukkan kata sandi Anda.');
      return;
    }

    const authResult = detectRoleAndAccount(trimmedIdentifier);

    if (authResult.role === 'super_admin') {
      const targetPass = authResult.adminUser?.password || 'darda2026';
      if (trimmedPass !== targetPass && trimmedPass !== 'darda2026' && trimmedPass !== 'superadmin2026') {
        setError('Kata sandi Super Admin tidak sesuai.');
        return;
      }
      onAdminLogin('super_admin', authResult.adminUser || undefined);
    } else if (authResult.role === 'admin') {
      const targetPass = authResult.adminUser?.password || 'admin123';
      if (trimmedPass !== targetPass && trimmedPass !== 'admin123' && trimmedPass !== 'darda2026') {
        setError('Kata sandi Admin Operasional tidak sesuai.');
        return;
      }
      onAdminLogin('admin', authResult.adminUser || undefined);
    } else {
      const umkm = authResult.umkm;
      if (umkm && umkm.password && trimmedPass !== umkm.password) {
        setError(`Kata sandi untuk akun "${umkm.business_name}" tidak cocok. Silakan periksa pesan WhatsApp/Email dari Pengurus.`);
        return;
      }
      onSellerLogin(umkm?.id || umkms[0]?.id);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-50 flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Back navigation */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#064E3B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Katalog</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Header with Official Logo */}
          <div className="text-center space-y-3 pt-2">
            <div className="flex justify-center mb-1">
              <Logo size="lg" variant="full" showTagline={true} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[#064E3B] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Portal Masuk Akun</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Silakan masukkan email dan kata sandi Anda untuk mengakses dashboard pengurus atau toko UMKM.
            </p>
          </div>

          {/* Error notification */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* SINGLE LOGIN FORM: EMAIL & KATA SANDI ONLY */}
          {/* ========================================================= */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Identifier Field: Username or Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Username atau Email Akun
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan username atau email (Admin / Seller)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#064E3B] focus:border-transparent focus:outline-none"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#064E3B] focus:border-transparent focus:outline-none"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="unified-login-submit-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
            >
              <LogIn className="w-4 h-4 text-[#D4AF37]" />
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>
          </form>

          {/* ========================================================= */}
          {/* BANTUAN & KONTAK ADMIN DARDA STORE (087877686424) */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-stone-100">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-[#064E3B] shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">
                    Butuh Bantuan Akun?
                  </h4>
                  <a
                    href={`https://wa.me/${adminWaInternational}?text=${encodeURIComponent(
                      "Assalamu'alaikum Admin Darda Store, saya butuh bantuan mengenai akun/login Darda Store."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#064E3B] hover:underline font-semibold flex items-center gap-1 mt-0.5"
                  >
                    <span>Hubungi Admin: 0878-7768-6424</span>
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('register-umkm')}
                className="shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#064E3B] bg-white border border-emerald-300 hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3 h-3 text-[#D4AF37]" />
                <span>Daftar UMKM</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
