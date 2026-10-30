/**
 * Formats a number to Indonesian Rupiah currency format.
 * Example: 35000 -> "Rp 35.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
}

/**
 * Normalizes Indonesian phone numbers into international WhatsApp format (starting with 62)
 * Handles:
 * "08123456789" -> "628123456789"
 * "+628123456789" -> "628123456789"
 * "628123456789" -> "628123456789"
 */
export function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  if (cleaned.startsWith('62')) {
    return cleaned;
  }
  return '62' + cleaned;
}

export interface OrderDetails {
  quantity?: number;
  fulfillment?: string;
  customerName?: string;
  customerNote?: string;
  isSedekahJumat?: boolean;
}

/**
 * Generates WhatsApp click-to-chat URL with the exact specified message template:
 * Directly routes to seller's WhatsApp with clean, polite, and detailed order specs.
 */
export function createProductWhatsAppUrl(
  phone: string,
  productName: string,
  umkmName?: string,
  price?: number,
  options?: OrderDetails
): string {
  const normalizedPhone = formatWhatsAppNumber(phone);
  const qty = options?.quantity || 1;
  const totalPrice = price ? price * qty : undefined;

  let message = `Assalamu'alaikum Warahmatullahi Wabarakatuh ${umkmName ? `*${umkmName}*` : ''},
Saya jamaah Darda Store (Masjid Darussalam Dua) ingin memesan:

📦 *Produk:* ${productName}`;

  if (price) {
    message += `\n🏷️ *Harga Satuan:* ${formatRupiah(price)}`;
  }
  
  message += `\n🔢 *Jumlah:* ${qty} pcs`;

  if (totalPrice) {
    message += `\n💰 *Total Pembayaran:* ${formatRupiah(totalPrice)}`;
  }

  if (options?.fulfillment) {
    message += `\n📍 *Opsi Pengambilan:* ${options.fulfillment}`;
  }

  if (options?.customerName) {
    message += `\n👤 *Nama Pemesan:* ${options.customerName}`;
  }

  if (options?.customerNote) {
    message += `\n📝 *Catatan:* ${options.customerNote}`;
  }

  if (options?.isSedekahJumat) {
    message += `\n✨ *Catatan Khusus:* Mohon dialokasikan untuk Program Sedekah/Jumat Berkah Masjid Darussalam Dua.`;
  }

  message += `\n\nApakah pesanan ini siap diproses? Terima kasih, Jazakumullah khairan katsiran.`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates general WhatsApp inquiry link for an UMKM
 */
export function createUmkmWhatsAppUrl(phone: string, umkmName: string): string {
  const normalizedPhone = formatWhatsAppNumber(phone);
  const message = `Assalamu'alaikum ${umkmName},
Saya melihat profil UMKM Anda di *DARDA STORE* (Masjid Darussalam Dua).
Bolehkah saya bertanya mengenai produk/layanan Anda?`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Converts Google Drive sharing links into direct embeddable image URLs.
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view...
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Check if it's a Google Drive URL
  if (!trimmed.includes('drive.google.com')) {
    return trimmed;
  }

  let fileId = '';
  // Pattern 1: /file/d/FILE_ID/...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    fileId = fileDMatch[1];
  } else {
    // Pattern 2: id=FILE_ID
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
  }

  if (fileId) {
    // Direct link format for images from Google Drive
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}

export interface MultiItemOrderOptions {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  fulfillment?: string;
  notes?: string;
}

/**
 * Generates WhatsApp click-to-chat URL for multiple items from one UMKM store
 */
export function createCartWhatsAppOrderUrl(
  phone: string,
  umkmName: string,
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    notes?: string;
    is_jumat_berkah?: boolean;
  }>,
  options?: MultiItemOrderOptions
): string {
  const normalizedPhone = formatWhatsAppNumber(phone);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let message = `Assalamu'alaikum Warahmatullahi Wabarakatuh *${umkmName}*,\n` +
    `Saya jamaah *DARDA STORE* (Masjid Darussalam Dua) ingin memesan beberapa produk dari toko Anda:\n\n` +
    `🛒 *DAFTAR PESANAN KERANJANG:*\n`;

  items.forEach((item, idx) => {
    const subtotal = item.price * item.quantity;
    message += `${idx + 1}. *${item.name}*\n` +
      `   • Jumlah: ${item.quantity} pcs × ${formatRupiah(item.price)}\n` +
      `   • Subtotal: ${formatRupiah(subtotal)}`;
    if (item.notes) {
      message += `\n   • Catatan: ${item.notes}`;
    }
    if (item.is_jumat_berkah) {
      message += `\n   • (Paket Sedekah/Jumat Berkah)`;
    }
    message += `\n`;
  });

  message += `\n💰 *TOTAL PEMBAYARAN:* ${formatRupiah(totalAmount)}`;

  if (options?.fulfillment) {
    const methodLabels: Record<string, string> = {
      masjid: 'Ambil di Pos UMKM / Sekretariat Masjid Darussalam Dua',
      antar: 'Kirim / Antar ke Rumah (Ongkoe, Temmapaduae, Marusu & Sekitar)',
      sedekah: 'Paket Sedekah (Langsung disalurkan ke jamaah/santri binaan)'
    };
    message += `\n📍 *Opsi Pengambilan:* ${methodLabels[options.fulfillment] || options.fulfillment}`;
  }

  if (options?.customerName) {
    message += `\n👤 *Nama Pemesan:* ${options.customerName}`;
  }

  if (options?.customerPhone) {
    message += `\n📞 *No. Kontak:* ${options.customerPhone}`;
  }

  if (options?.customerAddress && options.fulfillment === 'antar') {
    message += `\n🏠 *Alamat Pengiriman:* ${options.customerAddress}`;
  }

  if (options?.notes) {
    message += `\n📝 *Catatan Tambahan:* ${options.notes}`;
  }

  message += `\n\nMohon konfirmasi ketersediaan dan cara pembayarannya. Terima kasih, Jazakumullah khairan katsiran.`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
