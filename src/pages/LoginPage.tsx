import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
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
  onAdminLogin: (role?: AdminRole, adminUser?: AdminUser) => void;
  onSellerLogin: (umkmId: string) => void;
  onNavigate: (page: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  umkms,
  adminUsers = [],
  onAdminLogin,
  onSellerLogin,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanInput = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanInput || !cleanPass) {
      setError('Mohon masukkan Username / Email dan Kata Sandi Anda.');
      return;
    }

    // 1. Check against Admin Users stored in database / state
    const matchedAdmin = adminUsers.find(
      (a) =>
        a.status === 'active' &&
        (a.email.toLowerCase() === cleanInput || a.username.toLowerCase() === cleanInput) &&
        a.password === cleanPass
    );

    if (matchedAdmin) {
      onAdminLogin(matchedAdmin.role, matchedAdmin);
      return;
    }

    // 2. Fallback Super Admin Credentials (DKM Pimpinan)
    const isFallbackSuperAdmin =
      (cleanInput === 'admin@masjiddarussalamdua.id' ||
        cleanInput === 'superadmin' ||
        cleanInput === 'salamsyafar@gmail.com') &&
      (cleanPass === 'darda2026' || cleanPass === 'Bismillah2026' || cleanPass === 'superadmin123');

    if (isFallbackSuperAdmin) {
      onAdminLogin('super_admin', {
        id: 'admin-super-1',
        name: 'H. Ahmad Syafar (Ketua DKM)',
        username: 'superadmin',
        email: cleanInput.includes('@') ? cleanInput : 'admin@masjiddarussalamdua.id',
        password: cleanPass,
        role: 'super_admin',
        title: 'Ketua DKM & Pimpinan Utama Darda Store',
        whatsapp: '6287877686424',
        status: 'active',
        created_at: new Date().toISOString(),
      });
      return;
    }

    // 3. Fallback Regular Admin Credentials (Pengurus Operasional)
    const isFallbackRegularAdmin =
      (cleanInput === 'operator@masjiddarussalamdua.id' ||
        cleanInput === 'admin_operasional' ||
        cleanInput === 'admin' ||
        cleanInput === 'pengurus@masjiddarussalamdua.id') &&
      (cleanPass === 'admin123' || cleanPass === 'darda2026' || cleanPass === 'pengurus123');

    if (isFallbackRegularAdmin) {
      onAdminLogin('admin', {
        id: 'admin-op-1',
        name: 'Ust. Farhan Ramadhan',
        username: 'admin_operasional',
        email: 'operator@masjiddarussalamdua.id',
        password: cleanPass,
        role: 'admin',
        title: 'Pengurus Divisi Ekonomi & Kurasi Produk',
        whatsapp: '6287877686424',
        status: 'active',
        created_at: new Date().toISOString(),
      });
      return;
    }

    // 4. Check UMKM Seller credentials (matches username, email, or WhatsApp number)
    const matchedUmkm = umkms.find((u) => {
      const uEmail = (u.email || '').trim().toLowerCase();
      const uUsername = (u.username || '').trim().toLowerCase();
      const uWa = (u.whatsapp || '').replace(/\D/g, '');
      const inputDigits = cleanInput.replace(/\D/g, '');

      const identifierMatch =
        (uUsername && uUsername === cleanInput) ||
        (uEmail && uEmail === cleanInput) ||
        (inputDigits.length >= 9 && uWa.endsWith(inputDigits.slice(-9)));

      const passMatch = (u.password || 'umkm123') === cleanPass;
      return identifierMatch && passMatch;
    });

    if (matchedUmkm) {
      if (matchedUmkm.status !== 'active') {
        setError('Akun toko Anda sedang dinonaktifkan sementara. Silakan hubungi Pengurus DKM.');
        return;
      }
      onSellerLogin(matchedUmkm.id);
      return;
    }

    setError(
      'Username/Email atau Kata Sandi tidak sesuai. Pastikan Anda telah disetujui oleh Admin DKM.'
    );
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F4E9] flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E5DEC9] shadow-xl shadow-[#0F3D2E]/5 p-8 sm:p-10 space-y-7 relative overflow-hidden">
          {/* Top Accent Stripe in Official Brand Palette */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0F3D2E] via-[#2E7D32] to-[#D4AF37]" />

          {/* Logo & Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="flex justify-center mb-3">
              <Logo size="lg" variant="full" showTagline={true} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F4E9] border border-[#E5DEC9] text-[#2E7D32] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Portal Akses Terpadu</span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#0F3D2E]">
              Login darda.store
            </h1>
            <p className="text-xs sm:text-sm text-[#0F3D2E]/70 max-w-sm mx-auto leading-relaxed">
              Masukkan Username atau Email beserta Password Anda. Sistem otomatis mengenali akses Pengurus DKM maupun Mitra UMKM.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-2">
                Username / Email Akun
              </label>
              <div className="relative">
                <input
                  id="login-email-input"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username, Email, atau No. WhatsApp..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#F8F4E9]/60 border border-[#DED6C1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-sm text-[#0F3D2E] transition-all"
                />
                <Mail className="w-4 h-4 text-[#2E7D32] absolute left-4 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F3D2E] uppercase tracking-wider mb-2">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun..."
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#F8F4E9]/60 border border-[#DED6C1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-sm text-[#0F3D2E] transition-all"
                />
                <Lock className="w-4 h-4 text-[#2E7D32] absolute left-4 top-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 p-1 text-[#0F3D2E]/50 hover:text-[#0F3D2E]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-sm text-[#F8F4E9] bg-[#0F3D2E] hover:bg-[#2E7D32] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </form>

          {/* ========================================================= */}
          {/* BANTUAN & KONTAK ADMIN DARDA STORE (087877686424) */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-[#EFE9D8]">
            <div className="p-3.5 rounded-2xl bg-[#F8F4E9] border border-[#E5DEC9] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-[#0F3D2E]">
                  Lupa Password atau Butuh Bantuan Akun?
                </p>
                <p className="text-[11px] text-[#0F3D2E]/70">
                  Hubungi Admin DKM: <strong>0878-7768-6424</strong>
                </p>
              </div>
              <a
                href="https://wa.me/6287877686424?text=Assalamu'alaikum%20Admin%20darda.store%2C%20saya%20butuh%20bantuan%20mengenai%20login%20akun%20toko%20UMKM%20saya."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#0F3D2E] text-white text-xs font-bold shadow-xs transition-all shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Chat Admin WA</span>
              </a>
            </div>
          </div>

          {/* Register Callout for New Sellers */}
          <div className="pt-2 border-t border-[#EFE9D8] text-center">
            <p className="text-xs text-[#0F3D2E]/75 mb-2.5">
              Belum punya akun toko UMKM di darda.store?
            </p>
            <button
              type="button"
              onClick={() => onNavigate('register-umkm')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F3D2E] hover:text-[#2E7D32] bg-[#F8F4E9] hover:bg-[#EFE9D8] px-4 py-2.5 rounded-xl border border-[#DED6C1] transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Ajukan Pendaftaran UMKM Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
