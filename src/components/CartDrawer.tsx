import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Store, 
  MessageCircle, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  Heart, 
  ChevronRight,
  ShieldCheck,
  PackageOpen
} from 'lucide-react';
import { CartItem, FulfillmentMethod, Product, UMKM } from '../types';
import { formatRupiah, createCartWhatsAppOrderUrl } from '../utils/formatters';
import { recordWhatsAppInquiry } from '../firebase/service';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  umkms: UMKM[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigateToProduct: (product: Product) => void;
  onNavigateToUmkm: (umkmId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  umkms,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateToProduct,
  onNavigateToUmkm,
}) => {
  // Global customer inputs for checkout
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('darda_customer_name') || '';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    return localStorage.getItem('darda_customer_phone') || '';
  });
  const [customerAddress, setCustomerAddress] = useState(() => {
    return localStorage.getItem('darda_customer_address') || '';
  });

  // Fulfillment per UMKM (default 'masjid')
  const [fulfillmentMap, setFulfillmentMap] = useState<Record<string, FulfillmentMethod>>({});
  // Notes per UMKM
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  // Active expanded store tab for multiple stores
  const [activeStoreTab, setActiveStoreTab] = useState<string>('all');

  // Group items by UMKM
  const storeGroups = useMemo(() => {
    const map = new Map<string, { umkm: UMKM; items: CartItem[]; totalPrice: number; totalQty: number }>();

    cartItems.forEach((item) => {
      const umkmId = item.product.umkm_id;
      const existingUmkm = umkms.find((u) => u.id === umkmId) || {
        id: umkmId,
        business_name: 'Mitra Usaha Jamaah',
        owner_name: 'Jamaah Masjid',
        category: item.product.category,
        whatsapp: '6287877686424',
        address: 'Kompleks Masjid Darussalam Dua',
        description: '',
        image: '',
        status: 'active' as const,
        created_at: ''
      };

      if (!map.has(umkmId)) {
        map.set(umkmId, {
          umkm: existingUmkm,
          items: [],
          totalPrice: 0,
          totalQty: 0
        });
      }

      const group = map.get(umkmId)!;
      group.items.push(item);
      group.totalPrice += item.product.price * item.quantity;
      group.totalQty += item.quantity;
    });

    return Array.from(map.values());
  }, [cartItems, umkms]);

  const grandTotalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const grandTotalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const handleSetFulfillment = (umkmId: string, method: FulfillmentMethod) => {
    setFulfillmentMap((prev) => ({ ...prev, [umkmId]: method }));
  };

  const handleSetNote = (umkmId: string, note: string) => {
    setNotesMap((prev) => ({ ...prev, [umkmId]: note }));
  };

  const handleCheckoutStore = (group: typeof storeGroups[0]) => {
    recordWhatsAppInquiry();

    // Save profile to localStorage for next time
    if (customerName) localStorage.setItem('darda_customer_name', customerName);
    if (customerPhone) localStorage.setItem('darda_customer_phone', customerPhone);
    if (customerAddress) localStorage.setItem('darda_customer_address', customerAddress);

    const fulfillment = fulfillmentMap[group.umkm.id] || 'masjid';
    const storeNote = notesMap[group.umkm.id] || '';

    const waUrl = createCartWhatsAppOrderUrl(
      group.umkm.whatsapp || '6287877686424',
      group.umkm.business_name,
      group.items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        notes: i.notes,
        is_jumat_berkah: i.product.is_jumat_berkah
      })),
      {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        fulfillment,
        notes: storeNote.trim()
      }
    );

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-4.5 bg-[#064E3B] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-[#D4AF37]/40">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-base font-bold flex items-center gap-1.5 leading-tight">
                  <span>Keranjang Belanja Jamaah</span>
                  {grandTotalItems > 0 && (
                    <span className="text-xs bg-[#D4AF37] text-[#064E3B] font-extrabold px-2 py-0.5 rounded-full">
                      {grandTotalItems}
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-emerald-200">
                  Darda Store • Masjid Darussalam Dua
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Empty State */}
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#064E3B] border border-emerald-200/80 flex items-center justify-center mx-auto shadow-2xs">
                  <PackageOpen className="w-8 h-8 text-[#064E3B]" />
                </div>
                <div className="space-y-1 max-w-xs mx-auto">
                  <h3 className="font-bold text-base text-stone-900">
                    Keranjang Belanja Masih Kosong
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Pilih produk halal & berkah favorit dari para jamaah dan mitra UMKM untuk dimasukkan ke keranjang.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Mulai Jelajahi Produk
                </button>
              </div>
            ) : (
              <>
                {/* Info Bar Multi-store Notification */}
                {storeGroups.length > 1 && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-amber-900">Pesanan dari {storeGroups.length} Toko UMKM Berbeda</strong>
                      <span className="text-[11px] text-stone-600 leading-snug block mt-0.5">
                        Karena produk dikelola langsung oleh masing-masing pemilik usaha jamaah, Anda dapat memesan ke tiap toko dengan 1 kali klik WhatsApp per toko.
                      </span>
                    </div>
                  </div>
                )}

                {/* Customer Data Quick Box (Auto remembered) */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <span>Identitas Pemesan</span>
                      <span className="text-[10px] text-stone-400 font-normal">(Otomatis tersimpan)</span>
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-600 mb-1">Nama Pemesan</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nama Anda (contoh: Pak Agus)"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-600 mb-1">No. WhatsApp</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0812xxxx (opsional)"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-stone-600 mb-1">
                      Alamat / Patokan Rumah (jika memilih opsi kirim/antar)
                    </label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Contoh: Jl. Pertamina No. 12 (Belakang Masjid Darussalam)"
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Store Groups */}
                <div className="space-y-6">
                  {storeGroups.map((group, groupIdx) => {
                    const currentFulfillment = fulfillmentMap[group.umkm.id] || 'masjid';
                    const currentNote = notesMap[group.umkm.id] || '';

                    return (
                      <div 
                        key={group.umkm.id} 
                        className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-[#064E3B]/40 transition-all"
                      >
                        {/* Store Header */}
                        <div className="p-3.5 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between gap-3">
                          <div 
                            onClick={() => {
                              onNavigateToUmkm(group.umkm.id);
                              onClose();
                            }}
                            className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0"
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                              <img
                                src={group.umkm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'}
                                alt={group.umkm.business_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="truncate">
                              <h3 className="font-bold text-xs text-stone-900 group-hover:text-[#064E3B] flex items-center gap-1 truncate">
                                <span>{group.umkm.business_name}</span>
                                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                              </h3>
                              <p className="text-[10px] text-stone-500 truncate">
                                Pemilik: {group.umkm.owner_name}
                              </p>
                            </div>
                          </div>

                          <span className="text-[11px] font-semibold text-stone-500 shrink-0 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                            {group.items.length} jenis produk
                          </span>
                        </div>

                        {/* List of Products in this Store */}
                        <div className="p-4 divide-y divide-stone-100">
                          {group.items.map((item) => (
                            <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                              {/* Product Thumbnail */}
                              <div 
                                onClick={() => {
                                  onNavigateToProduct(item.product);
                                  onClose();
                                }}
                                className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 cursor-pointer group"
                              >
                                <img
                                  src={item.product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h4 
                                  onClick={() => {
                                    onNavigateToProduct(item.product);
                                    onClose();
                                  }}
                                  className="text-xs font-bold text-stone-900 hover:text-[#064E3B] truncate cursor-pointer"
                                >
                                  {item.product.name}
                                </h4>
                                <div className="flex items-baseline gap-1.5 mt-0.5">
                                  <span className="text-xs font-bold text-[#064E3B]">
                                    {formatRupiah(item.product.price)}
                                  </span>
                                  {item.product.is_jumat_berkah && (
                                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                                      Jumat Berkah
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Quantity Stepper & Remove */}
                              <div className="flex items-center gap-2">
                                <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                                  <button
                                    type="button"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 rounded text-stone-600 hover:bg-white hover:text-[#064E3B] transition-colors cursor-pointer"
                                    title="Kurangi"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-xs font-bold text-stone-800 min-w-[24px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 rounded text-stone-600 hover:bg-white hover:text-[#064E3B] transition-colors cursor-pointer"
                                    title="Tambah"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => onRemoveItem(item.id)}
                                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus dari keranjang"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Store Options: Fulfillment & Note */}
                        <div className="p-4 bg-stone-50/70 border-t border-stone-200/70 space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                              Metode Pengambilan untuk Toko Ini:
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSetFulfillment(group.umkm.id, 'masjid')}
                                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                                  currentFulfillment === 'masjid'
                                    ? 'bg-emerald-50 border-[#064E3B] text-[#064E3B] shadow-2xs'
                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                }`}
                              >
                                <Store className="w-3 h-3" />
                                <span>Ambil di Masjid</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetFulfillment(group.umkm.id, 'antar')}
                                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                                  currentFulfillment === 'antar'
                                    ? 'bg-emerald-50 border-[#064E3B] text-[#064E3B] shadow-2xs'
                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                }`}
                              >
                                <Truck className="w-3 h-3" />
                                <span>Antar ke Rumah</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetFulfillment(group.umkm.id, 'sedekah')}
                                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                                  currentFulfillment === 'sedekah'
                                    ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-2xs'
                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                }`}
                              >
                                <Heart className="w-3 h-3 text-amber-600" />
                                <span>Paket Sedekah</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <input
                              type="text"
                              value={currentNote}
                              onChange={(e) => handleSetNote(group.umkm.id, e.target.value)}
                              placeholder={`Catatan untuk ${group.umkm.business_name} (opsional)...`}
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#064E3B] focus:outline-none bg-white"
                            />
                          </div>

                          {/* Subtotal & WhatsApp Button for THIS store */}
                          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] text-stone-500 block">Subtotal Toko:</span>
                              <span className="text-sm font-bold text-[#064E3B]">
                                {formatRupiah(group.totalPrice)}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCheckoutStore(group)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Kirim Pesanan ke WA Penjual</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clear Cart Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs text-stone-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kosongkan Seluruh Keranjang</span>
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Footer Checkout Summary Bar */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Total Keseluruhan ({grandTotalItems} item):</span>
                  <span className="text-xl font-bold text-[#064E3B]">
                    {formatRupiah(grandTotalPrice)}
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {storeGroups.length} Toko UMKM
                </span>
              </div>

              {/* Single or Multi store prompt */}
              {storeGroups.length === 1 ? (
                <button
                  type="button"
                  onClick={() => handleCheckoutStore(storeGroups[0])}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Kirim Semua Pesanan ke WhatsApp Penjual</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </button>
              ) : (
                <p className="text-center text-[11px] text-stone-500">
                  💡 Klik tombol hijau di tiap kotak toko di atas untuk mengirim rincian pesanan ke masing-masing penjual WhatsApp.
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
