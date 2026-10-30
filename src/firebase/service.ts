import { 
  collection, 
  getDocs, 
  getDoc,
  getDocFromServer,
  doc, 
  setDoc, 
  updateDoc,
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './config';
import { Category, Product, UMKM, AppStats, UMKMApplication, SellerOrderNote, AdminUser, HomeConfig } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_UMKM } from '../data/initialData';

// Validate Firestore Connection on module load
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Connection check timeout')), 3000)
    );
    await Promise.race([
      getDocFromServer(doc(db, 'stats', 'connection-check')),
      timeoutPromise
    ]);
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('timeout'))) {
      console.info("Firestore client operating with local cache / forced long-polling mode.");
    }
    return false;
  }
}
testFirestoreConnection().catch(() => {});

// Local storage fallback keys for high resilience
const STORAGE_KEYS = {
  UMKM: 'darda_umkm_data',
  PRODUCTS: 'darda_products_data',
  CATEGORIES: 'darda_categories_data',
  APPLICATIONS: 'darda_applications_data',
  VISITORS: 'darda_visitors_count',
  INQUIRIES: 'darda_inquiries_count',
  ORDERS: 'darda_seller_orders',
  ADMIN_USERS: 'darda_admin_users_data',
  HOME_CONFIG: 'darda_home_config_data'
};

// ----------------------------------------------------
// 1. UMKM SERVICES
// ----------------------------------------------------

export async function fetchUmkmList(): Promise<UMKM[]> {
  try {
    const umkmCol = collection(db, 'umkm');
    const snapshot = await getDocs(umkmCol);
    if (!snapshot.empty) {
      const list: UMKM[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<UMKM, 'id'>) });
      });
      localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetchUmkmList error, using local fallback:', err);
  }

  // Fallback to localStorage or initial data
  const cached = localStorage.getItem(STORAGE_KEYS.UMKM);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return INITIAL_UMKM;
}

export async function saveUmkmItem(item: UMKM): Promise<void> {
  // 1. Update local cache immediately
  let localUmkm: UMKM[] = [];
  const rawCached = localStorage.getItem(STORAGE_KEYS.UMKM);
  if (rawCached) {
    try {
      localUmkm = JSON.parse(rawCached);
    } catch {
      localUmkm = [...INITIAL_UMKM];
    }
  } else {
    localUmkm = [...INITIAL_UMKM];
  }

  const existingIdx = localUmkm.findIndex(u => u.id === item.id);
  if (existingIdx >= 0) {
    localUmkm[existingIdx] = { ...item };
  } else {
    localUmkm.unshift({ ...item });
  }
  localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(localUmkm));

  // 2. Save to Firestore
  try {
    const docRef = doc(db, 'umkm', item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    console.warn('Firestore saveUmkmItem failed, saved locally:', err);
  }
}

export async function deleteUmkmItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'umkm', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteUmkmItem failed:', err);
  }

  const cached = await fetchUmkmList();
  const updated = cached.filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(updated));
}

// ----------------------------------------------------
// 2. PRODUCT SERVICES
// ----------------------------------------------------

export async function fetchProductsList(): Promise<Product[]> {
  try {
    const prodCol = collection(db, 'products');
    const snapshot = await getDocs(prodCol);
    if (!snapshot.empty) {
      const list: Product[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
      });
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetchProductsList error, using local fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return INITIAL_PRODUCTS;
}

export async function saveProductItem(item: Product): Promise<void> {
  // 1. Immediately update localStorage cache to guarantee instant local persistence
  let localProducts: Product[] = [];
  const rawCached = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (rawCached) {
    try {
      localProducts = JSON.parse(rawCached);
    } catch {
      localProducts = [...INITIAL_PRODUCTS];
    }
  } else {
    localProducts = [...INITIAL_PRODUCTS];
  }

  const existingIdx = localProducts.findIndex(p => p.id === item.id);
  if (existingIdx >= 0) {
    localProducts[existingIdx] = { ...item };
  } else {
    localProducts.unshift({ ...item });
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(localProducts));

  // 2. Synchronize to Firestore
  try {
    const docRef = doc(db, 'products', item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    console.warn('Firestore saveProductItem sync failed (offline or permission), stored locally:', err);
  }
}

export async function deleteProductItem(id: string): Promise<void> {
  // Update local cache immediately
  let localProducts: Product[] = [];
  const rawCached = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (rawCached) {
    try {
      localProducts = JSON.parse(rawCached);
    } catch {
      localProducts = [...INITIAL_PRODUCTS];
    }
  } else {
    localProducts = [...INITIAL_PRODUCTS];
  }

  const updated = localProducts.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));

  // Sync delete to Firestore
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteProductItem failed, deleted locally:', err);
  }
}

// ----------------------------------------------------
// 3. CATEGORY SERVICES
// ----------------------------------------------------

export async function fetchCategoriesList(): Promise<Category[]> {
  try {
    const catCol = collection(db, 'categories');
    const snapshot = await getDocs(catCol);
    if (!snapshot.empty) {
      const list: Category[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
      });
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetchCategoriesList error, using local fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return INITIAL_CATEGORIES;
}

export async function saveCategoryItem(item: Category): Promise<void> {
  try {
    const docRef = doc(db, 'categories', item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    console.warn('Firestore saveCategoryItem failed:', err);
  }

  const cached = await fetchCategoriesList();
  const index = cached.findIndex(c => c.id === item.id);
  if (index >= 0) {
    cached[index] = item;
  } else {
    cached.push(item);
  }
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cached));
}

export async function deleteCategoryItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'categories', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteCategoryItem failed:', err);
  }

  const cached = await fetchCategoriesList();
  const updated = cached.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
}

// ----------------------------------------------------
// 4. REGISTRATION / APPLICATIONS SERVICES
// ----------------------------------------------------

export async function fetchApplicationsList(): Promise<UMKMApplication[]> {
  try {
    const appCol = collection(db, 'applications');
    const snapshot = await getDocs(appCol);
    if (!snapshot.empty) {
      const list: UMKMApplication[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<UMKMApplication, 'id'>) });
      });
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetchApplicationsList error, using local fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return [];
}

export async function submitApplication(
  data: Omit<UMKMApplication, 'id' | 'created_at' | 'status'>
): Promise<UMKMApplication> {
  const id = 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newApp: UMKMApplication = {
    ...data,
    id,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  try {
    const docRef = doc(db, 'applications', id);
    await setDoc(docRef, newApp);
  } catch (err) {
    console.warn('Firestore submitApplication failed, storing locally:', err);
  }

  const cached = await fetchApplicationsList();
  cached.unshift(newApp);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(cached));

  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  adminNotes?: string
): Promise<void> {
  try {
    const docRef = doc(db, 'applications', id);
    const updatePayload: Partial<UMKMApplication> = { status };
    if (adminNotes !== undefined) {
      updatePayload.admin_notes = adminNotes;
    }
    await setDoc(docRef, updatePayload, { merge: true });
  } catch (err) {
    console.warn('Firestore updateApplicationStatus failed:', err);
  }

  const cached = await fetchApplicationsList();
  const index = cached.findIndex(a => a.id === id);
  if (index >= 0) {
    cached[index].status = status;
    if (adminNotes !== undefined) {
      cached[index].admin_notes = adminNotes;
    }
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(cached));
  }
}

export async function approveAndCreateUmkm(
  application: UMKMApplication,
  credentials?: { username: string; password: string }
): Promise<{ umkm: UMKM; product?: Product; credentials: { username: string; password: string } }> {
  // Generate credentials if not provided
  const baseUsername = application.email 
    ? application.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
    : application.business_name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
  
  const finalUsername = credentials?.username || (baseUsername + Math.floor(100 + Math.random() * 900));
  const finalPassword = credentials?.password || ('Darda' + Math.floor(1000 + Math.random() * 9000) + '!');

  // 1. Create UMKM entry
  const umkmId = 'umkm_' + Date.now();
  const newUmkm: UMKM = {
    id: umkmId,
    business_name: application.business_name,
    owner_name: application.owner_name,
    category: application.category,
    whatsapp: application.whatsapp,
    email: application.email || `${finalUsername}@dardastore.id`,
    username: finalUsername,
    password: finalPassword,
    address: application.address,
    description: application.description,
    image: application.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    created_at: new Date().toISOString(),
    rating: 5.0
  };

  await saveUmkmItem(newUmkm);

  // 2. If first product details are provided, create initial product
  let newProduct: Product | undefined;
  if (application.first_product_name && application.first_product_price) {
    const prodId = 'prod_' + Date.now();
    newProduct = {
      id: prodId,
      name: application.first_product_name,
      description: application.description || `Produk unggulan dari ${application.business_name}`,
      price: application.first_product_price,
      image: application.first_product_image || application.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      category: application.category,
      umkm_id: umkmId,
      status: 'published',
      created_at: new Date().toISOString(),
      is_featured: false
    };
    await saveProductItem(newProduct);
  }

  // 3. Mark application as approved with credentials saved
  const docRef = doc(db, 'applications', application.id);
  const updatedApp: Partial<UMKMApplication> = {
    status: 'approved',
    admin_notes: 'Telah disetujui dan diterbitkan oleh Pengurus Masjid',
    generated_username: finalUsername,
    generated_password: finalPassword
  };

  try {
    await updateDoc(docRef, updatedApp);
  } catch {
    // If updateDoc fails, fallback to local storage
    const local = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (local) {
      const parsed: UMKMApplication[] = JSON.parse(local);
      const updated = parsed.map(a => a.id === application.id ? { ...a, ...updatedApp } : a);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    }
  }

  return { 
    umkm: newUmkm, 
    product: newProduct, 
    credentials: { username: finalUsername, password: finalPassword } 
  };
}

// ----------------------------------------------------
// 5. DATABASE SEEDING
// ----------------------------------------------------

export async function seedInitialDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    // Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      const docRef = doc(db, 'categories', cat.id);
      await setDoc(docRef, cat, { merge: true });
    }

    // Seed UMKM
    for (const umkm of INITIAL_UMKM) {
      const docRef = doc(db, 'umkm', umkm.id);
      await setDoc(docRef, umkm, { merge: true });
    }

    // Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      const docRef = doc(db, 'products', prod.id);
      await setDoc(docRef, prod, { merge: true });
    }

    // Update local cache
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(INITIAL_UMKM));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));

    return { success: true, message: 'Data awal Darda Store berhasil disinkronkan ke Firebase Firestore!' };
  } catch (err: unknown) {
    console.error('Error seeding database:', err);
    // Even if Firestore network fails, initialize local cache
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.UMKM, JSON.stringify(INITIAL_UMKM));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return { success: true, message: 'Data awal dimuat dan disimpan di memori lokal.' };
  }
}

// ----------------------------------------------------
// 5. STATS & ANALYTICS
// ----------------------------------------------------

export function recordVisitor(): number {
  const current = parseInt(localStorage.getItem(STORAGE_KEYS.VISITORS) || '142', 10);
  const updated = current + 1;
  localStorage.setItem(STORAGE_KEYS.VISITORS, updated.toString());

  // Asynchronously update Firestore stats
  setDoc(doc(db, 'stats', 'general'), {
    visitorsCount: updated,
    updatedAt: new Date().toISOString()
  }, { merge: true }).catch(() => {});

  return updated;
}

export function recordWhatsAppInquiry(): number {
  const current = parseInt(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '48', 10);
  const updated = current + 1;
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, updated.toString());

  // Asynchronously update Firestore stats
  setDoc(doc(db, 'stats', 'general'), {
    whatsappInquiries: updated,
    updatedAt: new Date().toISOString()
  }, { merge: true }).catch(() => {});

  return updated;
}

export async function fetchAppStats(): Promise<AppStats> {
  const umkms = await fetchUmkmList();
  const products = await fetchProductsList();
  const categories = await fetchCategoriesList();
  let visitorsCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISITORS) || '142', 10);
  let whatsappInquiries = parseInt(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '48', 10);

  try {
    const statsDoc = await getDoc(doc(db, 'stats', 'general'));
    if (statsDoc.exists()) {
      const data = statsDoc.data();
      if (typeof data.visitorsCount === 'number') visitorsCount = data.visitorsCount;
      if (typeof data.whatsappInquiries === 'number') whatsappInquiries = data.whatsappInquiries;
    }
  } catch (err) {
    console.warn('Firestore fetchAppStats error, using cached stats:', err);
  }

  return {
    totalUmkm: umkms.length,
    totalProducts: products.length,
    totalCategories: categories.length,
    visitorsCount,
    whatsappInquiries
  };
}

// ----------------------------------------------------
// 6. SELLER ORDER & MANAGEMENT SERVICES
// ----------------------------------------------------

export async function fetchSellerOrdersList(umkmId: string): Promise<SellerOrderNote[]> {
  try {
    const ordersCol = collection(db, 'seller_orders');
    const q = query(ordersCol, where('umkm_id', '==', umkmId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list: SellerOrderNote[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<SellerOrderNote, 'id'>) });
      });
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetchSellerOrdersList error, checking local:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (cached) {
    try {
      const allOrders: SellerOrderNote[] = JSON.parse(cached);
      return allOrders.filter(o => o.umkm_id === umkmId);
    } catch {
      // ignore
    }
  }
  return [];
}

export async function saveSellerOrderItem(order: SellerOrderNote): Promise<void> {
  try {
    const docRef = doc(db, 'seller_orders', order.id);
    await setDoc(docRef, order, { merge: true });
  } catch (err) {
    console.warn('Firestore saveSellerOrderItem failed:', err);
  }

  let allOrders: SellerOrderNote[] = [];
  const cached = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (cached) {
    try {
      allOrders = JSON.parse(cached);
    } catch {
      allOrders = [];
    }
  }

  const idx = allOrders.findIndex(o => o.id === order.id);
  if (idx >= 0) {
    allOrders[idx] = order;
  } else {
    allOrders.unshift(order);
  }
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));
}

export async function deleteSellerOrderItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'seller_orders', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteSellerOrderItem failed:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (cached) {
    try {
      const allOrders: SellerOrderNote[] = JSON.parse(cached);
      const filtered = allOrders.filter(o => o.id !== id);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }
}

// ----------------------------------------------------
// 8. ADMIN & SUPER ADMIN USERS SERVICES
// ----------------------------------------------------

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin_super_1',
    name: 'H. Ahmad Syafar',
    email: 'salamsyafar@gmail.com',
    username: 'superadmin',
    role: 'super_admin',
    phone: '087877686424',
    title: 'Ketua DKM / Pimpinan Utama',
    password: 'darda2026',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    last_login: new Date().toISOString()
  },
  {
    id: 'admin_op_1',
    name: 'Ustadz Farhan',
    email: 'pengurus@dardastore.id',
    username: 'admin',
    role: 'admin',
    phone: '081234567890',
    title: 'Divisi UMKM & Operasional Harian',
    password: 'admin123',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    last_login: new Date().toISOString()
  }
];

export async function fetchAdminUsersList(): Promise<AdminUser[]> {
  try {
    const colRef = collection(db, 'admin_users');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list: AdminUser[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Omit<AdminUser, 'id'>) });
      });
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(list));
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetchAdminUsersList error, using local fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  // Seed default admin users to localStorage
  localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
  return INITIAL_ADMIN_USERS;
}

export async function saveAdminUser(user: AdminUser): Promise<void> {
  try {
    const docRef = doc(db, 'admin_users', user.id);
    await setDoc(docRef, user, { merge: true });
  } catch (err) {
    console.warn('Firestore saveAdminUser failed:', err);
  }

  let allAdmins: AdminUser[] = [];
  const cached = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
  if (cached) {
    try {
      allAdmins = JSON.parse(cached);
    } catch {
      allAdmins = [];
    }
  } else {
    allAdmins = [...INITIAL_ADMIN_USERS];
  }

  const idx = allAdmins.findIndex(a => a.id === user.id);
  if (idx >= 0) {
    allAdmins[idx] = user;
  } else {
    allAdmins.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(allAdmins));
}

export async function deleteAdminUser(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'admin_users', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteAdminUser failed:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
  if (cached) {
    try {
      const allAdmins: AdminUser[] = JSON.parse(cached);
      const filtered = allAdmins.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }
}

// ----------------------------------------------------
// 9. HOME PAGE CMS & LAYOUT CONFIGURATION SERVICES
// ----------------------------------------------------

export const DEFAULT_HOME_CONFIG: HomeConfig = {
  searchPlaceholder: 'Cari di darda.store (Nasi Kuning, Ayam Lalapan, Pisang Nugget, Kopi Aren)...',
  popularTags: [
    'Nasi Kuning',
    'Ayam Lalapan',
    'Pisang Nugget',
    'Buah Apel',
    'Kopi Aren',
    'Jasa Cuci AC'
  ],
  heroBadge: '✨ DARDA.STORE | MARKETPLACE UMKM JAMAAH',
  heroTitle: 'Dari Masjid',
  heroTitleHighlight: 'Untuk UMKM',
  heroTitleSuffix: ', Belanja Halal & Berkah',
  heroSubtitle:
    'Temukan beragam produk pilihan UMKM. Dari kuliner rumahan, cemilan, sayuran hidroponik, buah-buahan, busana muslim, hingga aneka macam jasa. Semua dalam satu tempat, untuk belanja yang lebih bermakna dan berkah',
  heroPrimaryCta: '🛍️ Mulai Belanja',
  heroSecondaryCta: 'Buka Toko Gratis',
  showSecondaryCta: true,
  heroLogoPosition: 'right',

  showPromoBanners: true,
  promo1Badge: '100% Amanah DKM',
  promo1Title: 'Produk Lokal Jamaah Terverifikasi',
  promo1Desc: 'Bebas komisi 0%, langsung terhubung ke WhatsApp pemilik usaha.',
  promo1Cta: 'Cek Katalog',
  promo2Badge: 'Darda Barokah',
  promo2Title: 'Paket Sedekah & Jumat Berkah',
  promo2Desc: 'Salurkan konsumsi jamaah & santri tahfidz Masjid Darussalam Dua.',
  promo2Cta: 'Pilih Paket Berkah',

  categorySectionTitle: 'Kategori Produk Jamaah',
  jumatBerkahBadge: 'JUMAT BERKAH',
  jumatBerkahSubtitle: 'Paket Sedekah Konsumsi Jamaah & Santri Tahfidz',
  recommendationSectionTitle: 'Rekomendasi Produk Jamaah',
  umkmSectionBadge: 'Toko Resmi Jamaah',
  umkmSectionTitle: 'Mitra UMKM Terverifikasi Masjid Darussalam Dua',
  adabBadge: 'Adab Perniagaan Islami',
  adabQuote:
    '"Pedagang yang jujur dan dapat dipercaya (amanah) akan bersama para Nabi, orang-orang yang shiddiq, dan para syuhada." (HR. Tirmidzi)',
  adabCtaTitle: 'Punya Produk UMKM?',
  adabCtaSubtitle: 'Gratis 100% khusus jamaah',

  sections: [
    {
      id: 'hero',
      label: 'Banner Utama & Promo Pendamping',
      description: 'Area hero copywriting utama, tombol CTA, kartu logo, dan 2 banner promo samping.',
      enabled: true,
    },
    {
      id: 'trust_bar',
      label: 'Baris Info Keunggulan (Trust Bar)',
      description: '4 poin keunggulan: Terverifikasi DKM, 0% Potongan, Langsung WA, Jumlah Toko.',
      enabled: true,
    },
    {
      id: 'categories',
      label: 'Kategori Produk Jamaah',
      description: 'Deretan ikon kategori produk di bawah banner utama.',
      enabled: true,
    },
    {
      id: 'jumat_berkah',
      label: 'Program Jumat Berkah & Sedekah',
      description: 'Katalog khusus produk paket sedekah konsumsi jamaah & santri.',
      enabled: true,
    },
    {
      id: 'recommendations',
      label: 'Rekomendasi Produk Jamaah (Katalog Utama)',
      description: 'Daftar produk utama dengan tab filter kategori (2 kolom di HP).',
      enabled: true,
    },
    {
      id: 'umkm_stores',
      label: 'Mitra Toko UMKM Terverifikasi',
      description: 'Daftar profil toko resmi milik jamaah Masjid Darussalam Dua.',
      enabled: true,
    },
    {
      id: 'bazar_adab',
      label: 'Agenda Pojok Berkah & Adab Perniagaan',
      description: 'Informasi jadwal bazar masjid dan kutipan hadits adab perniagaan.',
      enabled: true,
    },
  ],
  updatedAt: new Date().toISOString(),
};

function normalizeHeroTitleConfig(config: HomeConfig): { config: HomeConfig; migrated: boolean } {
  // Replace legacy "Belanja dari Jamaah, Berkah untuk Semua." or "Dari Masjid Untuk UMKM, Berkah untuk Semua."
  // with "Dari Masjid Untuk UMKM, Belanja Halal & Berkah"
  const isLegacyHighlight =
    config.heroTitleHighlight?.trim() === 'Berkah untuk Semua.' ||
    config.heroTitleHighlight?.trim() === 'Berkah untuk Semua';
  const isLegacyTitle =
    config.heroTitle?.trim() === 'Belanja dari Jamaah,' ||
    config.heroTitle?.trim() === 'Dari Masjid Untuk UMKM,' ||
    config.heroTitle?.trim() === 'Dari Masjid Untuk UMKM';

  if (isLegacyHighlight || isLegacyTitle) {
    return {
      config: {
        ...config,
        heroTitle: 'Dari Masjid',
        heroTitleHighlight: 'Untuk UMKM',
        heroTitleSuffix: ', Belanja Halal & Berkah',
      },
      migrated: true,
    };
  }

  return { config, migrated: false };
}

export async function fetchHomeConfig(): Promise<HomeConfig> {
  try {
    const docRef = doc(db, 'stats', 'home_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Partial<HomeConfig>;
      const rawMerged: HomeConfig = {
        ...DEFAULT_HOME_CONFIG,
        ...data,
        sections:
          Array.isArray(data.sections) && data.sections.length > 0
            ? data.sections
            : DEFAULT_HOME_CONFIG.sections,
        popularTags:
          Array.isArray(data.popularTags) && data.popularTags.length > 0
            ? data.popularTags
            : DEFAULT_HOME_CONFIG.popularTags,
      };
      const { config: merged, migrated } = normalizeHeroTitleConfig(rawMerged);
      localStorage.setItem(STORAGE_KEYS.HOME_CONFIG, JSON.stringify(merged));
      if (migrated) {
        setDoc(docRef, merged, { merge: true }).catch(() => {});
      }
      return merged;
    }
  } catch (err) {
    console.warn('Firestore fetchHomeConfig error, using local fallback:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEYS.HOME_CONFIG);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as Partial<HomeConfig>;
      const rawMerged: HomeConfig = {
        ...DEFAULT_HOME_CONFIG,
        ...parsed,
        sections:
          Array.isArray(parsed.sections) && parsed.sections.length > 0
            ? parsed.sections
            : DEFAULT_HOME_CONFIG.sections,
        popularTags:
          Array.isArray(parsed.popularTags) && parsed.popularTags.length > 0
            ? parsed.popularTags
            : DEFAULT_HOME_CONFIG.popularTags,
      };
      const { config: merged } = normalizeHeroTitleConfig(rawMerged);
      localStorage.setItem(STORAGE_KEYS.HOME_CONFIG, JSON.stringify(merged));
      return merged;
    } catch {
      // ignore
    }
  }

  return DEFAULT_HOME_CONFIG;
}

export async function saveHomeConfig(config: HomeConfig): Promise<void> {
  const payload: HomeConfig = {
    ...config,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.HOME_CONFIG, JSON.stringify(payload));

  try {
    const docRef = doc(db, 'stats', 'home_config');
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn('Firestore saveHomeConfig failed, saved locally:', err);
  }
}


