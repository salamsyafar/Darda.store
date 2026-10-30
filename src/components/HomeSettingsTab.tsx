import React, { useState, useEffect } from 'react';
import {
  Home,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Type,
  LayoutList,
  Sparkles,
  Search,
  Plus,
  X,
  CheckCircle2,
  Megaphone,
  Layers
} from 'lucide-react';
import { HomeConfig, HomeSectionItem } from '../types';
import { DEFAULT_HOME_CONFIG } from '../firebase/service';

interface HomeSettingsTabProps {
  homeConfig: HomeConfig;
  onSaveHomeConfig: (newConfig: HomeConfig) => Promise<void>;
}

export const HomeSettingsTab: React.FC<HomeSettingsTabProps> = ({
  homeConfig,
  onSaveHomeConfig,
}) => {
  const [form, setForm] = useState<HomeConfig>(homeConfig);
  const [newTagInput, setNewTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'positions' | 'hero' | 'header' | 'sections'>('positions');

  useEffect(() => {
    setForm(homeConfig);
  }, [homeConfig]);

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const updated = [...form.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setForm({ ...form, sections: updated });
  };

  const handleToggleSection = (index: number) => {
    const updated = form.sections.map((sec, i) =>
      i === index ? { ...sec, enabled: !sec.enabled } : sec
    );
    setForm({ ...form, sections: updated });
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (form.popularTags.includes(trimmed)) {
      setNewTagInput('');
      return;
    }
    setForm({
      ...form,
      popularTags: [...form.popularTags, trimmed],
    });
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm({
      ...form,
      popularTags: form.popularTags.filter((t) => t !== tagToRemove),
    });
  };

  const handleMoveTag = (index: number, direction: 'up' | 'down') => {
    const updated = [...form.popularTags];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setForm({ ...form, popularTags: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveHomeConfig(form);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = async () => {
    if (window.confirm('Kembalikan seluruh teks, copywriting, dan urutan posisi halaman Home ke pengaturan awal (default)?')) {
      setForm(DEFAULT_HOME_CONFIG);
      await onSaveHomeConfig(DEFAULT_HOME_CONFIG);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action & Sub-navigation Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Fitur Khusus Super Admin
              </span>
              <h2 className="font-serif-title text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
                Kelola Halaman Home (Teks, Copywriting & Posisi)
              </h2>
              <p className="text-xs text-stone-500">
                Atur susunan tata letak section dari atas ke bawah, ubah teks banner utama, kata kunci pencarian header, hingga judul setiap blok beranda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0F3D2E] hover:bg-[#165a43] text-[#F8F4E9] text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Home'}</span>
            </button>
          </div>
        </div>

        {/* Sub-tab Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('positions')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeSubTab === 'positions'
                ? 'bg-[#0F3D2E] text-white border-[#0F3D2E] shadow-2xs'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <LayoutList className="w-4 h-4 text-[#D4AF37]" />
            <span>1. Posisi & Tata Letak</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('hero')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeSubTab === 'hero'
                ? 'bg-[#0F3D2E] text-white border-[#0F3D2E] shadow-2xs'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Megaphone className="w-4 h-4 text-[#D4AF37]" />
            <span>2. Copywriting Banner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('header')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeSubTab === 'header'
                ? 'bg-[#0F3D2E] text-white border-[#0F3D2E] shadow-2xs'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Search className="w-4 h-4 text-[#D4AF37]" />
            <span>3. Teks Pencarian Header</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('sections')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeSubTab === 'sections'
                ? 'bg-[#0F3D2E] text-white border-[#0F3D2E] shadow-2xs'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Type className="w-4 h-4 text-[#D4AF37]" />
            <span>4. Teks Section & Hadits</span>
          </button>
        </div>
      </div>

      {/* =================================================================
          SUB-TAB 1: POSISI & URUTAN SECTION BERANDA
      ================================================================= */}
      {activeSubTab === 'positions' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif-title font-bold text-base text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F3D2E]" />
              <span>Urutan Posisi Section di Halaman Home (Atas ke Bawah)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Gunakan tombol panah <strong>Naik / Turun</strong> untuk memindahkan posisi bagian di halaman depan, atau klik tombol <strong>Tampil / Sembunyi</strong>.
            </p>
          </div>

          <div className="space-y-2.5">
            {form.sections.map((section: HomeSectionItem, index: number) => (
              <div
                key={section.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                  section.enabled
                    ? 'bg-stone-50/70 border-stone-200/90'
                    : 'bg-stone-100/60 border-stone-200 opacity-60'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-extrabold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900">
                        {section.label}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          section.enabled
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {section.enabled ? 'Ditampilkan' : 'Disembunyikan'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">{section.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-35 text-stone-700 cursor-pointer disabled:cursor-not-allowed"
                    title="Pindahkan ke Atas"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSection(index, 'down')}
                    disabled={index === form.sections.length - 1}
                    className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-35 text-stone-700 cursor-pointer disabled:cursor-not-allowed"
                    title="Pindahkan ke Bawah"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSection(index)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      section.enabled
                        ? 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                        : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {section.enabled ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tampilkan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Layout Options inside Hero Banner */}
          <div className="pt-4 border-t border-stone-200/80 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                Posisi Kartu Logo di Dalam Banner Utama (Hero)
              </label>
              <select
                value={form.heroLogoPosition}
                onChange={(e) =>
                  setForm({
                    ...form,
                    heroLogoPosition: e.target.value as 'right' | 'left' | 'hidden',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
              >
                <option value="right">Di Sebelah Kanan Teks Copywriting (Default)</option>
                <option value="left">Di Sebelah Kiri Teks Copywriting</option>
                <option value="hidden">Sembunyikan Kartu Logo di Banner</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                Tampilan 2 Kartu Promo Samping (Sebelah Kanan Banner Utama)
              </label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, showPromoBanners: !form.showPromoBanners })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    form.showPromoBanners
                      ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
                      : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  {form.showPromoBanners ? '✓ Tampilkan 2 Banner Samping' : 'Disembunyikan (Banner Utama Lebar Penuh)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          SUB-TAB 2: COPYWRITING BANNER UTAMA & PROMO SAMPING
      ================================================================= */}
      {activeSubTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Hero Main Copywriting */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-serif-title font-bold text-base text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Copywriting Banner Utama (Hero)</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Teks Badge Atas (Label Emas)
              </label>
              <input
                type="text"
                value={form.heroBadge}
                onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                placeholder="✨ DARDA.STORE | MARKETPLACE UMKM JAMAAH"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Judul Awal (Warna Putih)
                </label>
                <input
                  type="text"
                  value={form.heroTitle}
                  onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                  placeholder="Dari Masjid"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Judul Sorotan (Warna Emas)
                </label>
                <input
                  type="text"
                  value={form.heroTitleHighlight}
                  onChange={(e) => setForm({ ...form, heroTitleHighlight: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                  placeholder="Untuk UMKM"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Judul Baris Kedua (Warna Putih)
                </label>
                <input
                  type="text"
                  value={(form.heroTitleSuffix ?? '').replace(/^\s*,\s*/, '')}
                  onChange={(e) => setForm({ ...form, heroTitleSuffix: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                  placeholder="Belanja Halal & Berkah"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Paragraf Deskripsi Copywriting
              </label>
              <textarea
                rows={4}
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Teks Tombol Utama (CTA 1)
                </label>
                <input
                  type="text"
                  value={form.heroPrimaryCta}
                  onChange={(e) => setForm({ ...form, heroPrimaryCta: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
                  placeholder="🛍️ Mulai Belanja"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    Teks Tombol Kedua (CTA 2)
                  </label>
                  <label className="inline-flex items-center gap-1 text-[11px] text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showSecondaryCta}
                      onChange={(e) => setForm({ ...form, showSecondaryCta: e.target.checked })}
                      className="rounded text-[#0F3D2E]"
                    />
                    <span>Tampilkan</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={form.heroSecondaryCta}
                  onChange={(e) => setForm({ ...form, heroSecondaryCta: e.target.value })}
                  disabled={!form.showSecondaryCta}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none disabled:bg-stone-100"
                  placeholder="Buka Toko Gratis"
                />
              </div>
            </div>
          </div>

          {/* Right: 2 Side Promo Banners */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <h3 className="font-serif-title font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
              Copywriting 2 Kartu Promo Pendamping
            </h3>

            {/* Promo Card 1 */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
              <div className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                Kartu Promo Samping 1 (Atas)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Badge</label>
                  <input
                    type="text"
                    value={form.promo1Badge}
                    onChange={(e) => setForm({ ...form, promo1Badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Teks Link</label>
                  <input
                    type="text"
                    value={form.promo1Cta}
                    onChange={(e) => setForm({ ...form, promo1Cta: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Judul Kartu 1</label>
                <input
                  type="text"
                  value={form.promo1Title}
                  onChange={(e) => setForm({ ...form, promo1Title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={form.promo1Desc}
                  onChange={(e) => setForm({ ...form, promo1Desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                />
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                Kartu Promo Samping 2 (Bawah)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Badge</label>
                  <input
                    type="text"
                    value={form.promo2Badge}
                    onChange={(e) => setForm({ ...form, promo2Badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Teks Tombol</label>
                  <input
                    type="text"
                    value={form.promo2Cta}
                    onChange={(e) => setForm({ ...form, promo2Cta: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Judul Kartu 2</label>
                <input
                  type="text"
                  value={form.promo2Title}
                  onChange={(e) => setForm({ ...form, promo2Title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={form.promo2Desc}
                  onChange={(e) => setForm({ ...form, promo2Desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          SUB-TAB 3: HEADER PENCARIAN & KATA KUNCI POPULER
      ================================================================= */}
      {activeSubTab === 'header' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-serif-title font-bold text-base text-stone-900">
              Pengaturan Kolom Pencarian & Kata Kunci Produk di Header
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Sesuaikan teks placeholder pada kolom pencarian dan daftar kata kunci produk UMKM yang tampil di bawah bar pencarian.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Teks Placeholder Kolom Pencarian Header
            </label>
            <input
              type="text"
              value={form.searchPlaceholder}
              onChange={(e) => setForm({ ...form, searchPlaceholder: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-700">
              Daftar Kata Kunci Cepat di Bawah Kolom Pencarian ({form.popularTags.length} Item)
            </label>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Tambah kata kunci baru (misal: Kue Tradisional)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0F3D2E] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F3D2E] text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Tambah</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
              {form.popularTags.map((tag, idx) => (
                <div
                  key={tag + idx}
                  className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                >
                  <span className="font-semibold text-stone-800 truncate">
                    {idx + 1}. {tag}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveTag(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                      title="Geser Kiri/Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveTag(idx, 'down')}
                      disabled={idx === form.popularTags.length - 1}
                      className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                      title="Geser Kanan/Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                      title="Hapus Kata Kunci"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          SUB-TAB 4: JUDUL SECTION & KUTIPAN ADAB PERNIAGAAN
      ================================================================= */}
      {activeSubTab === 'sections' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
          <h3 className="font-serif-title font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
            Judul Section & Copywriting Blok Beranda
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Judul Section Kategori Produk
              </label>
              <input
                type="text"
                value={form.categorySectionTitle}
                onChange={(e) => setForm({ ...form, categorySectionTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Judul Section Rekomendasi Produk Utama
              </label>
              <input
                type="text"
                value={form.recommendationSectionTitle}
                onChange={(e) => setForm({ ...form, recommendationSectionTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Badge Section Jumat Berkah
              </label>
              <input
                type="text"
                value={form.jumatBerkahBadge}
                onChange={(e) => setForm({ ...form, jumatBerkahBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Subjudul Section Jumat Berkah
              </label>
              <input
                type="text"
                value={form.jumatBerkahSubtitle}
                onChange={(e) => setForm({ ...form, jumatBerkahSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Label Kecil Section Mitra UMKM
              </label>
              <input
                type="text"
                value={form.umkmSectionBadge}
                onChange={(e) => setForm({ ...form, umkmSectionBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Judul Utama Section Mitra UMKM
              </label>
              <input
                type="text"
                value={form.umkmSectionTitle}
                onChange={(e) => setForm({ ...form, umkmSectionTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
              Blok Kutipan Adab Perniagaan & Ajakan Daftar UMKM
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Judul Badge Adab
                </label>
                <input
                  type="text"
                  value={form.adabBadge}
                  onChange={(e) => setForm({ ...form, adabBadge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Judul Ajakan Daftar UMKM
                </label>
                <input
                  type="text"
                  value={form.adabCtaTitle}
                  onChange={(e) => setForm({ ...form, adabCtaTitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Subjudul Ajakan Daftar UMKM
                </label>
                <input
                  type="text"
                  value={form.adabCtaSubtitle}
                  onChange={(e) => setForm({ ...form, adabCtaSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Kutipan Hadits / Pesan Muamalah
              </label>
              <textarea
                rows={2}
                value={form.adabQuote}
                onChange={(e) => setForm({ ...form, adabQuote: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between bg-[#0F3D2E] text-white px-6 py-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>Perubahan langsung diterapkan ke halaman Home setelah disimpan.</span>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c5a02f] text-[#0F3D2E] text-xs font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>
    </form>
  );
};
