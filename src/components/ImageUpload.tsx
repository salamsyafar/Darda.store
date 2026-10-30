import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Check, 
  X, 
  FolderDown, 
  HelpCircle,
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { convertGoogleDriveUrl } from '../utils/formatters';
import { compressImage } from '../utils/imageCompressor';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  presetCategory?: string;
}

const PRESET_IMAGES: { category: string; label: string; url: string }[] = [
  { category: 'Kuliner', label: 'Brownies Fudgy Coklat', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  { category: 'Kuliner', label: 'Bolu Gulung Keju', url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80' },
  { category: 'Kuliner', label: 'Kopi Susu Aren Botol', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80' },
  { category: 'Kuliner', label: 'Sambal Kemasan Botol', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  { category: 'Kuliner', label: 'Roti Bakar & Pastry', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { category: 'Pertanian', label: 'Madu Hutan Murni', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
  { category: 'Pertanian', label: 'Sayuran Hidroponik Segar', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { category: 'Fashion', label: 'Baju Koko Pria Muslim', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
  { category: 'Fashion', label: 'Gamis Syar\'i Anggun', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' },
  { category: 'Jasa', label: 'Seni Kaligrafi Islam', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
  { category: 'Rumah Tangga', label: 'Sabun Organik Herbal', url: 'https://images.unsplash.com/photo-1607006314177-3e1b3074dc59?auto=format&fit=crop&w=800&q=80' }
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Foto Produk / UMKM',
  presetCategory
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gdrive' | 'url' | 'presets'>('upload');
  const [inputUrl, setInputUrl] = useState(value);
  const [gdriveUrl, setGdriveUrl] = useState('');
  const [gdriveStatus, setGdriveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputUrl(value);
  }, [value]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WEBP).');
      return;
    }

    // Size limit check (max 15MB for raw file)
    if (file.size > 15 * 1024 * 1024) {
      alert('Ukuran file terlalu besar (maksimal 15MB).');
      return;
    }

    try {
      setIsCompressing(true);
      // Automatically optimize and compress image to < 150KB for snappy loading & safe database storage
      const compressedDataUrl = await compressImage(file, 1000, 1000, 0.82);
      onChange(compressedDataUrl);
    } catch (err) {
      console.warn('Kompresi gambar gagal, menggunakan fallback:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyGdrive = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gdriveUrl.trim()) return;

    const converted = convertGoogleDriveUrl(gdriveUrl);
    if (converted.startsWith('https://lh3.googleusercontent.com/d/')) {
      onChange(converted);
      setGdriveStatus('success');
    } else {
      // If it didn't extract or wasn't a recognized gdrive link
      if (converted.startsWith('http')) {
        onChange(converted);
        setGdriveStatus('success');
      } else {
        setGdriveStatus('error');
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setInputUrl('');
              setGdriveUrl('');
              setGdriveStatus('idle');
            }}
            className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Hapus Gambar
          </button>
        )}
      </div>

      {/* Navigation Tabs for Image Source */}
      <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-xl w-fit text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'upload' ? 'bg-white text-[#064E3B] shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Manual</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gdrive')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'gdrive' ? 'bg-white text-[#064E3B] shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FolderDown className="w-3.5 h-3.5 text-amber-600" />
          <span>Via Google Drive</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'url' ? 'bg-white text-[#064E3B] shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Link URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'presets' ? 'bg-white text-[#064E3B] shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Pilihan Siap Pakai</span>
        </button>
      </div>

      {/* TAB 1: Upload Manual via Drag/Drop & Click */}
      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#064E3B] bg-emerald-50/60'
              : 'border-stone-300 hover:border-[#064E3B] bg-stone-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            {isCompressing ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 className="w-8 h-8 text-[#064E3B] animate-spin" />
                <p className="text-xs font-semibold text-[#064E3B]">
                  Mengoptimalkan foto agar ringan & tajam...
                </p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-emerald-100/80 flex items-center justify-center text-[#064E3B]">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-stone-700">
                    <span className="text-[#064E3B] font-semibold underline">Pilih foto dari Galeri / HP / Komputer</span> atau geser foto ke sini
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Otomatis dioptimalkan untuk toko (JPG, PNG, WEBP)</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Via Google Drive */}
      {activeTab === 'gdrive' && (
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
          <div className="flex items-start gap-2 text-xs text-amber-900">
            <FolderDown className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-stone-800">
                Gunakan Foto dari Google Drive Anda
              </p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Pastikan akses link Google Drive telah disetel ke: <strong>"Siapa saja yang memiliki link" (Anyone with the link)</strong> agar foto dapat dilihat oleh jamaah di katalog.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                placeholder="Contoh: https://drive.google.com/file/d/1A2b3C.../view?usp=sharing"
                value={gdriveUrl}
                onChange={(e) => {
                  setGdriveUrl(e.target.value);
                  setGdriveStatus('idle');
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
              <FolderDown className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
            </div>
            <button
              type="button"
              onClick={() => handleApplyGdrive()}
              className="px-4 py-2 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
            >
              Pasang Foto
            </button>
          </div>

          {gdriveStatus === 'success' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-100/60 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Link Google Drive berhasil dikonversi dan terpasang!</span>
            </div>
          )}

          {gdriveStatus === 'error' && (
            <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Format link Google Drive tidak valid. Mohon periksa kembali link sharing Anda.</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Direct Link URL */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              placeholder="https://images.unsplash.com/... atau link foto web lain"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
            <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="button"
            onClick={() => {
              const converted = convertGoogleDriveUrl(inputUrl);
              onChange(converted);
            }}
            className="px-4 py-2 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-semibold rounded-xl cursor-pointer shrink-0"
          >
            Terapkan
          </button>
        </div>
      )}

      {/* TAB 4: Presets Siap Pakai */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-stone-50 rounded-2xl border border-stone-200/80">
          {PRESET_IMAGES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setInputUrl(preset.url);
              }}
              className="group relative rounded-xl overflow-hidden border border-stone-200 aspect-video text-left hover:ring-2 hover:ring-[#064E3B] transition-all cursor-pointer"
            >
              <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                <span className="text-[10px] font-medium text-white leading-tight truncate">
                  {preset.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Image Preview Box */}
      {value && (
        <div className="relative mt-2 rounded-2xl overflow-hidden border border-stone-200 aspect-video max-w-xs bg-stone-100 shadow-xs">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <span className="absolute bottom-2 right-2 bg-emerald-900/85 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-xs font-medium">
            <Check className="w-3 h-3 text-[#D4AF37]" /> Foto Terpasang
          </span>
        </div>
      )}
    </div>
  );
};
