import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Store, Sparkles, Filter } from 'lucide-react';
import { Category, Product, UMKM } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CategoryIcon } from '../components/CategoryIcon';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  umkms: UMKM[];
  initialSearchQuery?: string;
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onSelectUmkm: (umkmId: string) => void;
  onAddToCart?: (product: Product) => void;
  cartProductIds?: Set<string>;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  umkms,
  initialSearchQuery = '',
  initialCategory = 'Semua',
  onSelectProduct,
  onSelectUmkm,
  onAddToCart,
  cartProductIds,
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedUmkmId, setSelectedUmkmId] = useState<string>('all');
  const [onlyJumatBerkah, setOnlyJumatBerkah] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Map umkm by id for fast lookups
  const umkmMap = useMemo(() => {
    const map = new Map<string, UMKM>();
    umkms.forEach((u) => map.set(u.id, u));
    return map;
  }, [umkms]);

  const activeUmkmsList = useMemo(() => {
    return umkms.filter((u) => u.status === 'active');
  }, [umkms]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Only published products in catalog
        if (prod.status !== 'published') return false;

        // UMKM filter
        if (selectedUmkmId !== 'all' && prod.umkm_id !== selectedUmkmId) {
          return false;
        }

        // Jumat Berkah filter
        if (onlyJumatBerkah && !prod.is_jumat_berkah) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'Semua' && prod.category !== selectedCategory) {
          return false;
        }

        // Search query filter (matches product name OR UMKM business name)
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchesProdName = prod.name.toLowerCase().includes(q);
          const umkm = umkmMap.get(prod.umkm_id);
          const matchesUmkmName = umkm?.business_name.toLowerCase().includes(q) || false;
          const matchesCategory = prod.category.toLowerCase().includes(q);

          if (!matchesProdName && !matchesUmkmName && !matchesCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        // default: newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, selectedCategory, selectedUmkmId, onlyJumatBerkah, search, sortBy, umkmMap]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('Semua');
    setSelectedUmkmId('all');
    setOnlyJumatBerkah(false);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-stone-200/80 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
          Katalog Digital UMKM
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
          Jelajahi Produk Jamaah
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-2xl">
          Temukan aneka kreasi produk halal, madu alami, kuliner rumahan, dan busana berkualitas langsung dari pedagang Masjid Darussalam Dua.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        {/* Search input & Sort dropdown */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              id="product-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama produk atau nama UMKM..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toko UMKM & Sort Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
            {/* Filter by UMKM */}
            <div className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#064E3B]" />
              <select
                value={selectedUmkmId}
                onChange={(e) => setSelectedUmkmId(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#064E3B] max-w-[180px] sm:max-w-[220px]"
              >
                <option value="all">Semua Toko Mitra UMKM</option>
                {activeUmkmsList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.business_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              >
                <option value="newest">Terbaru</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Horizontal Pills & Jumat Berkah */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory('Semua');
              setOnlyJumatBerkah(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'Semua' && !onlyJumatBerkah
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Semua Produk
          </button>

          {/* Jumat Berkah Special Pill */}
          <button
            onClick={() => setOnlyJumatBerkah(!onlyJumatBerkah)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              onlyJumatBerkah
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>🌙 Jumat Berkah & Sedekah</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <CategoryIcon name={cat.name} className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Indicator */}
        {(selectedCategory !== 'Semua' || search || selectedUmkmId !== 'all' || onlyJumatBerkah) && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 bg-stone-100 px-3.5 py-2 rounded-xl w-fit">
            <span>Filter aktif:</span>
            {selectedCategory !== 'Semua' && (
              <span className="font-semibold text-[#064E3B] bg-white px-2 py-0.5 rounded-md border border-stone-200">
                Kategori: {selectedCategory}
              </span>
            )}
            {selectedUmkmId !== 'all' && (
              <span className="font-semibold text-[#064E3B] bg-white px-2 py-0.5 rounded-md border border-stone-200 flex items-center gap-1">
                <Store className="w-3 h-3" />
                Toko: {umkmMap.get(selectedUmkmId)?.business_name || 'UMKM Terpilih'}
              </span>
            )}
            {onlyJumatBerkah && (
              <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Jumat Berkah & Sedekah
              </span>
            )}
            {search && (
              <span className="font-semibold text-[#064E3B] bg-white px-2 py-0.5 rounded-md border border-stone-200">
                Pencarian: "{search}"
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-red-600 hover:underline font-medium ml-2 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>Menampilkan <strong>{filteredProducts.length}</strong> produk tersedia</span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              umkm={umkmMap.get(prod.umkm_id)}
              onSelectProduct={onSelectProduct}
              onSelectUmkm={onSelectUmkm}
              onAddToCart={onAddToCart}
              isInCart={cartProductIds?.has(prod.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif-title font-bold text-lg text-stone-900">
            Tidak ada produk ditemukan
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Tidak ada produk yang cocok dengan pencarian kata kunci atau filter kategori yang dipilih.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-semibold hover:bg-[#047857] shadow-xs"
          >
            Bersihkan Filter & Cari Ulang
          </button>
        </div>
      )}
    </div>
  );
};
