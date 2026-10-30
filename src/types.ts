export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export type UMKMStatus = 'active' | 'inactive';

export interface UMKM {
  id: string;
  business_name: string;
  owner_name: string;
  category: string;
  whatsapp: string; // e.g., "6281234567890"
  email?: string;
  username?: string;
  password?: string;
  address: string;
  description: string;
  image: string;
  status: UMKMStatus;
  created_at: string;
  rating?: number;
}

export type ProductStatus = 'published' | 'draft';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  umkm_id: string;
  status: ProductStatus;
  created_at: string;
  is_featured?: boolean;
  is_jumat_berkah?: boolean;
  jumat_berkah_note?: string;
}

export interface MosqueBazarEvent {
  id: string;
  title: string;
  day: string;
  time: string;
  location: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'periodic';
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon identifier
  description?: string;
}

export interface AppStats {
  totalUmkm: number;
  totalProducts: number;
  totalCategories: number;
  visitorsCount: number;
  whatsappInquiries: number;
}

export type ActivePage = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'umkm-detail' 
  | 'categories' 
  | 'about' 
  | 'register-umkm'
  | 'admin'
  | 'seller-dashboard'
  | 'login';

export type AdminRole = 'super_admin' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: AdminRole;
  phone?: string;
  title: string; // e.g. "Ketua DKM / Pimpinan Utama", "Divisi UMKM & Operasional"
  password?: string;
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
}

export type AuthRole = 'super_admin' | 'admin' | 'seller';

export interface AuthSession {
  role: AuthRole;
  email?: string;
  name?: string;
  adminTitle?: string;
  sellerUmkmId?: string;
  sellerUmkmName?: string;
}

export interface SellerOrderNote {
  id: string;
  umkm_id: string;
  customer_name: string;
  customer_whatsapp: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface UMKMApplication {
  id: string;
  owner_name: string;
  business_name: string;
  category: string;
  whatsapp: string;
  email?: string;
  generated_username?: string;
  generated_password?: string;
  address: string;
  description: string;
  image: string;
  first_product_name?: string;
  first_product_price?: number;
  first_product_image?: string;
  status: ApplicationStatus;
  created_at: string;
  admin_notes?: string;
}

export type FulfillmentMethod = 'masjid' | 'antar' | 'sedekah';

export interface CartItem {
  id: string; // product id
  product: Product;
  quantity: number;
  selectedFulfillment?: FulfillmentMethod;
  notes?: string;
}

export interface CartStoreGroup {
  umkm: UMKM;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}
