import { Category, Product, UMKM } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-kuliner',
    name: 'Kuliner',
    icon: 'Utensils',
    description: 'Makanan halal, kue basah, lauk pauk, minuman segar, dan camilan nikmat buatan jamaah.'
  },
  {
    id: 'cat-fashion',
    name: 'Fashion',
    icon: 'Shirt',
    description: 'Busana muslim, jilbab, gamis, sarung, koko, dan pakaian syar\'i berkualitas.'
  },
  {
    id: 'cat-rumah-tangga',
    name: 'Rumah Tangga',
    icon: 'Home',
    description: 'Kebutuhan harian rumah, sabun organik, wewangian aromaterapi, dan perabot.'
  },
  {
    id: 'cat-pertanian',
    name: 'Pertanian',
    icon: 'Sprout',
    description: 'Sayuran segar hidroponik, bibit tanaman, pupuk organik, dan madu murni.'
  },
  {
    id: 'cat-jasa',
    name: 'Jasa',
    icon: 'Wrench',
    description: 'Jasa desain grafis & kaligrafi, servis AC, katering aqiqah, dan les privat.'
  },
  {
    id: 'cat-lainnya',
    name: 'Lainnya',
    icon: 'Package',
    description: 'Buku islami, perlengkapan ibadah, cinderamata, dan produk unik lainnya.'
  }
];

export const INITIAL_UMKM: UMKM[] = [
  {
    id: 'umkm-1',
    business_name: 'Aisyah Bakery & Pastry',
    owner_name: 'Ibu Hj. Aisyah Rahmawati',
    category: 'Kuliner',
    whatsapp: '6281298765432',
    address: 'Jl. Pertamina, Ongkoe, Temmapaduae, Marusu, Kab. Maros',
    description: 'Spesialis aneka brownies panggang coklat legit, bolu kukus lembut, dan roti manis tanpa pengawet. Higienis, halal, dan dipanggang segar setiap subuh.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2026-01-15T08:00:00Z',
    rating: 4.9
  },
  {
    id: 'umkm-2',
    business_name: 'Madu Murni Al-Barakah',
    owner_name: 'Ustadz Ahmad Fauzi',
    category: 'Pertanian',
    whatsapp: '6281312345678',
    address: 'Jl. Melati Hijau No. 45, RT 03/05 (Depan Gerbang Masjid)',
    description: 'Madu hutan liar murni dan madu ternak nektar randu asli tanpa campuran. Dipanen dengan amanah dan teruji laboratorium untuk stamina & kesehatan keluarga.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2026-01-18T10:30:00Z',
    rating: 5.0
  },
  {
    id: 'umkm-3',
    business_name: 'Busana Muslim An-Nur',
    owner_name: 'Ibu Siti Khadijah',
    category: 'Fashion',
    whatsapp: '6281598765412',
    address: 'Jl. Pesantren No. 8, Sekitar Masjid Darussalam Dua',
    description: 'Menyediakan gamis syar\'i nyaman, koko katun premium, hijab voal halus, dan sajadah traveling empuk. Desain elegan, adem dipakai sholat dan silaturahmi.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2026-01-20T14:00:00Z',
    rating: 4.8
  },
  {
    id: 'umkm-4',
    business_name: 'Hidroponik Hijau Berkah',
    owner_name: 'Pak Bambang Supriyadi',
    category: 'Pertanian',
    whatsapp: '6281122334455',
    address: 'Greenhouse Rooftop Masjid Darussalam Dua',
    description: 'Sayuran segar bebas pestisida hasil binaan kemakmuran masjid: selada keriting, pakcoy, kangkung, dan bayam merah. Petik segar langsung antar ke rumah jamaah.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2026-02-01T09:00:00Z',
    rating: 4.9
  },
  {
    id: 'umkm-5',
    business_name: 'Dapur Sambal Bu Darda',
    owner_name: 'Ibu Maryam',
    category: 'Kuliner',
    whatsapp: '6281776543210',
    address: 'Jl. Cendrawasih No. 22 (Belakang Masjid)',
    description: 'Aneka sambal rumahan botolan: sambal cumi pedas gurih, sambal roa asap, dan sambal bawang. Menggunakan minyak berkualitas dan rempah pilihan.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2026-02-05T11:20:00Z',
    rating: 4.7
  },
  {
    id: 'umkm-6',
    business_name: 'Karya Kaligrafi & Desain Berkah',
    owner_name: 'Mas Fikri Ramadhan',
    category: 'Jasa',
    whatsapp: '6281987654300',
    address: 'Studio Digital Remaja Masjid Darussalam Dua',
    description: 'Jasa lukis kaligrafi kanvas, ukir kayu ayat suci, desain logo UMKM, kartu ucapan syukuran, serta cetak banner dakwah profesional.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2026-02-10T15:40:00Z',
    rating: 4.9
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Brownies Fudgy Panggang Premium',
    description: 'Brownies panggang dengan shiny crust renyah di luar dan fudgy coklat meleleh di dalam. Menggunakan dark chocolate import dan taburan almond serta choco chips. Cocok untuk suguhan tamu, hadiah silaturahmi, maupun buka puasa sunnah.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    category: 'Kuliner',
    umkm_id: 'umkm-1',
    status: 'published',
    created_at: '2026-02-12T08:00:00Z',
    is_featured: true,
    is_jumat_berkah: true,
    jumat_berkah_note: 'Paket Sedekah Snack Manis Jamaah Sholat Subuh & Jumat'
  },
  {
    id: 'prod-2',
    name: 'Bolu Gulung Keju Lembut Spesial',
    description: 'Bolu gulung aroma vanila mentega dengan olesan buttercream ringan dan parutan keju cheddar melimpah. Tekstur sangat lembut dan tidak seret di tenggorokan. 1 loyang panjang 22cm.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    category: 'Kuliner',
    umkm_id: 'umkm-1',
    status: 'published',
    created_at: '2026-02-13T09:15:00Z',
    is_featured: false
  },
  {
    id: 'prod-3',
    name: 'Madu Hutan Liar Riau Murni 500gr',
    description: 'Madu murni 100% dipanen dari sarang lebah Apis Dorsata di pedalaman hutan tropis. Berwarna gelap keemasan kaya antioksidan alami. Membantu meningkatkan imunitas dan stamina tubuh.',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    category: 'Pertanian',
    umkm_id: 'umkm-2',
    status: 'published',
    created_at: '2026-02-14T10:00:00Z',
    is_featured: true,
    is_jumat_berkah: true,
    jumat_berkah_note: 'Infaq Sebagian Keuntungan untuk Kas Masjid & Santri'
  },
  {
    id: 'prod-4',
    name: 'Madu Randu Segar Alami 250gr',
    description: 'Madu bunga randu beraroma wangi manis segar disukai anak-anak dan orang dewasa. Sangat baik untuk meredakan batuk pilek dan menjaga nafsu makan si kecil.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
    category: 'Pertanian',
    umkm_id: 'umkm-2',
    status: 'published',
    created_at: '2026-02-15T11:30:00Z',
    is_featured: false
  },
  {
    id: 'prod-5',
    name: 'Baju Koko Pria Katun Toyobo Premium',
    description: 'Koko modern cutting regular fit dengan bahan Katun Toyobo Fodu original. Serat kain halus, menyerap keringat, tidak mudah kusut, dan jahitan tepi rapi kelas butik. Pilihan warna Emerald, Putih Bersih, dan Abu Silver.',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    category: 'Fashion',
    umkm_id: 'umkm-3',
    status: 'published',
    created_at: '2026-02-16T13:00:00Z',
    is_featured: true
  },
  {
    id: 'prod-6',
    name: 'Gamis Syar\'i Polos Khadijah Series',
    description: 'Gamis anggun berbahan Cradenza Silk premium yang jatuh elegan dan berkilau mewah namun tetap syar\'i. Wudhu friendly dengan manset karet cantik serta resleting depan busui friendly.',
    price: 185000,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    category: 'Fashion',
    umkm_id: 'umkm-3',
    status: 'published',
    created_at: '2026-02-17T14:45:00Z',
    is_featured: false
  },
  {
    id: 'prod-7',
    name: 'Paket Sayur Segar Hidroponik (3 Jenis)',
    description: 'Paket hemat sayur segar bebas pestisida: Selada Romaine (250g), Pakcoy Baby (300g), dan Kangkung Crispy (300g). Dipanen langsung saat ada pesanan masuk, jaminan masih segar berakar.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    category: 'Pertanian',
    umkm_id: 'umkm-4',
    status: 'published',
    created_at: '2026-02-18T07:30:00Z',
    is_featured: true,
    is_jumat_berkah: true,
    jumat_berkah_note: 'Binaan Greenhouse Masjid Darussalam Dua'
  },
  {
    id: 'prod-8',
    name: 'Sambal Cumi Asin Cabe Ijo Botol 200g',
    description: 'Sambal racikan khas Ibu Maryam dengan potongan cumi asin segar yang kenyal dan cabe hijau rawit pedas mantap. Tanpa pengawet kimia, tahan hingga 2 bulan dalam kulkas.',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    category: 'Kuliner',
    umkm_id: 'umkm-5',
    status: 'published',
    created_at: '2026-02-19T16:20:00Z',
    is_featured: true
  },
  {
    id: 'prod-9',
    name: 'Jasa Lukis Kaligrafi Ayat Kursi Kanvas 60x90cm',
    description: 'Karya seni kaligrafi khat Tsuluts bertinta emas akrilik timbul dengan latar gradasi hijau zamrud elegan. Diberi pelapis vernis awet anti jamur dan pigura kayu minimalis siap gantung.',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    category: 'Jasa',
    umkm_id: 'umkm-6',
    status: 'published',
    created_at: '2026-02-20T11:00:00Z',
    is_featured: true
  },
  {
    id: 'prod-10',
    name: 'Paket Nasi Kotak Berkah Sedekah Jumat',
    description: 'Paket komplit nasi kuning wangi / nasi uduk gurih dengan lauk ayam goreng rempah, telur balado, orek tempe, dan sambal. Didedikasikan khusus untuk sedekah jamaah seusai Sholat Jumat atau kajian DKM.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    category: 'Kuliner',
    umkm_id: 'umkm-1',
    status: 'published',
    created_at: '2026-02-21T06:00:00Z',
    is_featured: true,
    is_jumat_berkah: true,
    jumat_berkah_note: 'Siap antar langsung ke Sekretariat DKM sebelum Adzan Jumat'
  }
];

export const INITIAL_BAZAR_EVENTS = [
  {
    id: 'bazar-2',
    title: 'Pojok Berkah & Kuliner Ba\'da Sholat Jumat',
    day: 'Setiap Hari Jumat',
    time: '11.30 - 13.30 WITA',
    location: 'Samping Koridor Sayap Kanan Masjid Darussalam Dua (Jl. Pertamina, Ongkoe, Temmapaduae, Marusu, Kabupaten Maros)',
    description: 'Lapak jajan halal, aneka minuman herbal hangat, madu murni, serta stan pembagian paket nasi sedekah jumat dari para muhsinin untuk jamaah.',
    status: 'periodic',
    icon: 'HeartHandshake'
  }
];
