import React from 'react';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Category, Product } from '../types';
import { CategoryIcon } from '../components/CategoryIcon';

interface CategoriesPageProps {
  categories: Category[];
  products: Product[];
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  products,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
          Struktur Produk
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
          Kategori Produk & Jasa
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-2xl">
          Temukan aneka kebutuhan keluarga muslim berdasarkan kategori kurasi pengurus Masjid Darussalam Dua.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const catProducts = products.filter(
            (p) => p.category === cat.name && p.status === 'published'
          );
          const count = catProducts.length;

          return (
            <div
              key={cat.id}
              id={`category-card-${cat.id}`}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs hover:shadow-xl hover:border-[#064E3B] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
                    <CategoryIcon name={cat.name} className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-600">
                    {count} Produk
                  </span>
                </div>

                <h3 className="font-serif-title font-bold text-xl text-stone-900 mt-4 group-hover:text-[#064E3B] transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {cat.description || `Aneka ragam produk ${cat.name} bermutu persembahan jamaah masjid.`}
                </p>
              </div>

              {/* Sample product previews */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center -space-x-2 overflow-hidden">
                  {catProducts.slice(0, 3).map((prod) => (
                    <img
                      key={prod.id}
                      src={prod.image}
                      alt={prod.name}
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                  {count > 3 && (
                    <span className="flex items-center justify-center h-7 w-7 rounded-full bg-stone-200 text-[10px] font-bold text-stone-600 ring-2 ring-white">
                      +{count - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#064E3B] group-hover:translate-x-1 transition-transform">
                  <span>Lihat Produk</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
