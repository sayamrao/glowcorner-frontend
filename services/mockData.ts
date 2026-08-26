import type {
  Product, Category, Banner, Review, Order, Address,
  SellerStats, AdminStats, User, CartItem, WishlistItem, Notification,
} from '~/types'

/* ===== Categories ===== */
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Remote Controlled', slug: 'remote-controlled', icon: '🏎️', productCount: 145, image: '' },
  { id: 'cat-2', name: 'Water Toys', slug: 'water-toys', icon: '🔫', productCount: 89, image: '' },
  { id: 'cat-3', name: 'Educational Toys', slug: 'educational-toys', icon: '🧩', productCount: 234, image: '' },
  { id: 'cat-4', name: 'Musical Toys', slug: 'musical-toys', icon: '🎹', productCount: 98, image: '' },
  { id: 'cat-5', name: 'Bubble Guns', slug: 'bubble-guns', icon: '🫧', productCount: 112, image: '' },
  { id: 'cat-6', name: 'Die Cast Model Cars', slug: 'die-cast-model-cars', icon: '🚗', productCount: 456, image: '' },
  { id: 'cat-7', name: 'Makeup', slug: 'makeup', icon: '💅', productCount: 78, image: '' },
  { id: 'cat-8', name: 'Money Box', slug: 'money-box', icon: '🏦', productCount: 45, image: '' },
]

/* ===== Products ===== */
const generateProducts = (): Product[] => {
  const products: Product[] = [
    {
      id: 'prod-1', slug: 'stunt-rc-car', name: '360° Remote Control Stunt Car',
      description: 'High-speed 4WD remote control car with 360-degree rotation and double-sided driving. Features anti-crash durable tires and cool LED lights for night driving. Perfect for indoor and outdoor play.',
      shortDescription: '4WD 360° rotation RC stunt car with LEDs',
      images: [
        { id: 'img-1', url: 'https://picsum.photos/seed/rccar1/600/600', alt: 'RC Stunt Car', isMain: true },
        { id: 'img-2', url: 'https://picsum.photos/seed/rccar2/600/600', alt: 'RC Car remote', isMain: false },
      ],
      variants: [
        { id: 'v-1', name: 'Neon Green', sku: 'RC-GRN', price: 3490, compareAtPrice: 4500, stock: 45, attributes: { color: 'Green' } },
        { id: 'v-2', name: 'Electric Blue', sku: 'RC-BLU', price: 3490, compareAtPrice: 4500, stock: 23, attributes: { color: 'Blue' } },
      ],
      price: 3490, compareAtPrice: 4500, currency: 'PKR',
      categoryId: 'cat-1', categoryName: 'Remote Controlled', sellerId: 'seller-1', sellerName: 'FamilyCorner Store',
      rating: 4.7, reviewCount: 234, stock: 68, isActive: true, isFeatured: true,
      tags: ['rc-car', 'remote-control', 'toys'],
      createdAt: '2025-12-01T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'prod-2', slug: 'splash-water-table', name: 'Splash & Learn Water Play Table',
      description: 'Interactive water table for toddlers featuring a water slide, spinning wheel, and pouring cups. Encourages sensory play and motor skill development. Made of durable, non-toxic plastic.',
      shortDescription: 'Interactive outdoor water play table',
      images: [
        { id: 'img-4', url: 'https://picsum.photos/seed/water1/600/600', alt: 'Water Table', isMain: true },
      ],
      variants: [],
      price: 5890, currency: 'PKR',
      categoryId: 'cat-2', categoryName: 'Water Toys', sellerId: 'seller-2', sellerName: 'Kidz Haven',
      rating: 4.5, reviewCount: 189, stock: 265, isActive: true, isFeatured: true,
      tags: ['water-toys', 'outdoor', 'toddler'],
      createdAt: '2025-11-20T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'prod-3', slug: 'wooden-sorting-blocks', name: 'Montessori Wooden Sorting Blocks',
      description: 'Classic wooden educational toy with 13 colorful geometric shapes. Helps develop hand-eye coordination, color recognition, and problem-solving skills. Crafted from smooth, sustainable wood.',
      shortDescription: 'Shape sorting cube for early learning',
      images: [
        { id: 'img-6', url: 'https://picsum.photos/seed/woodblock/600/600', alt: 'Wooden blocks', isMain: true },
      ],
      variants: [],
      price: 1990, compareAtPrice: 2500, currency: 'PKR',
      categoryId: 'cat-3', categoryName: 'Educational Toys', sellerId: 'seller-3', sellerName: 'Brainy Kids',
      rating: 4.8, reviewCount: 567, stock: 55, isActive: true, isFeatured: true,
      tags: ['wooden', 'montessori', 'educational'],
      createdAt: '2025-10-15T10:00:00Z', updatedAt: '2026-01-18T10:00:00Z',
    },
    {
      id: 'prod-4', slug: 'baby-piano-keyboard', name: 'Interactive Baby Piano Keyboard',
      description: 'Colorful mini piano featuring 8 instrument sounds, built-in melodies, and flashing lights. Perfectly sized for little hands. Great for introducing music and rhythm.',
      shortDescription: 'Musical keyboard with lights and sounds',
      images: [
        { id: 'img-8', url: 'https://picsum.photos/seed/piano1/600/600', alt: 'Baby piano', isMain: true },
      ],
      variants: [],
      price: 2290, compareAtPrice: 3200, currency: 'PKR',
      categoryId: 'cat-4', categoryName: 'Musical Toys', sellerId: 'seller-1', sellerName: 'FamilyCorner Store',
      rating: 4.6, reviewCount: 312, stock: 120, isActive: true, isFeatured: false,
      tags: ['piano', 'music', 'lights'],
      createdAt: '2025-11-05T10:00:00Z', updatedAt: '2026-01-12T10:00:00Z',
    },
    {
      id: 'prod-5', slug: 'gatling-bubble-machine', name: '69-Hole Gatling Bubble Machine Gun',
      description: 'Powerful bubble gun that shoots thousands of colorful bubbles per minute. Built-in LED lights make it magical at night. Includes rechargeable battery and bubble solution.',
      shortDescription: 'High-output LED bubble machine gun',
      images: [
        { id: 'img-9', url: 'https://picsum.photos/seed/bubble1/600/600', alt: 'Bubble gun', isMain: true },
      ],
      variants: [
        { id: 'v-10', name: 'Pink', sku: 'BG-PNK', price: 1490, stock: 19, attributes: { color: 'Pink' } },
        { id: 'v-11', name: 'Purple', sku: 'BG-PUR', price: 1490, stock: 12, attributes: { color: 'Purple' } },
      ],
      price: 1490, compareAtPrice: 2000, currency: 'PKR',
      categoryId: 'cat-5', categoryName: 'Bubble Guns', sellerId: 'seller-4', sellerName: 'Fun Times PK',
      rating: 4.4, reviewCount: 145, stock: 31, isActive: true, isFeatured: true,
      tags: ['bubbles', 'outdoor', 'summer'],
      createdAt: '2026-01-01T10:00:00Z', updatedAt: '2026-01-20T10:00:00Z',
    },
    {
      id: 'prod-6', slug: 'alloy-sports-car', name: '1:24 Scale Alloy Sports Car Model',
      description: 'Highly detailed die-cast metal car with openable doors, hood, and trunk. Features realistic engine sounds and working headlights. A perfect collectible or toy for car enthusiasts.',
      shortDescription: 'Detailed die-cast metal car with sounds',
      images: [
        { id: 'img-11', url: 'https://picsum.photos/seed/diecast/600/600', alt: 'Die cast car', isMain: true },
      ],
      variants: [
        { id: 'v-12', name: 'Matte Black', sku: 'DC-BLK', price: 2890, compareAtPrice: 3500, stock: 19, attributes: { color: 'Black' } },
        { id: 'v-13', name: 'Racing Red', sku: 'DC-RED', price: 2890, compareAtPrice: 3500, stock: 12, attributes: { color: 'Red' } },
      ],
      price: 2890, compareAtPrice: 3500, currency: 'PKR',
      categoryId: 'cat-6', categoryName: 'Die Cast Model Cars', sellerId: 'seller-3', sellerName: 'Brainy Kids',
      rating: 4.9, reviewCount: 89, stock: 31, isActive: true, isFeatured: true,
      tags: ['diecast', 'car', 'collectible'],
      createdAt: '2025-12-10T10:00:00Z', updatedAt: '2026-01-19T10:00:00Z',
    },
    {
      id: 'prod-7', slug: 'kids-pretend-makeup', name: 'Princess Pretend Play Makeup Kit',
      description: 'Safe, non-toxic, and washable pretend makeup set for kids. Includes fake lipsticks, brushes, eyeshadow palette, and a cute carrying case. Mess-free fun!',
      shortDescription: 'Washable pretend makeup set with case',
      images: [
        { id: 'img-12', url: 'https://picsum.photos/seed/makeupkit/600/600', alt: 'Pretend makeup', isMain: true },
      ],
      variants: [],
      price: 1890, compareAtPrice: 2400, currency: 'PKR',
      categoryId: 'cat-7', categoryName: 'Makeup', sellerId: 'seller-1', sellerName: 'FamilyCorner Store',
      rating: 4.6, reviewCount: 456, stock: 200, isActive: true, isFeatured: false,
      tags: ['pretend-play', 'makeup', 'girls'],
      createdAt: '2025-09-01T10:00:00Z', updatedAt: '2026-01-05T10:00:00Z',
    },
    {
      id: 'prod-8', slug: 'electronic-atm-piggy', name: 'Electronic ATM Piggy Bank',
      description: 'Smart money box that automatically rolls in paper bills and has a coin slot. Features a password lock, fingerprint simulation, and voice prompts. A fun way to teach kids about saving money.',
      shortDescription: 'Smart password-protected coin & bill bank',
      images: [
        { id: 'img-13', url: 'https://picsum.photos/seed/atm/600/600', alt: 'ATM piggy bank', isMain: true },
      ],
      variants: [
        { id: 'v-14', name: 'Blue', sku: 'ATM-BLU', price: 2490, stock: 35, attributes: { color: 'Blue' } },
        { id: 'v-15', name: 'Pink', sku: 'ATM-PNK', price: 2490, stock: 18, attributes: { color: 'Pink' } },
      ],
      price: 2490, currency: 'PKR',
      categoryId: 'cat-8', categoryName: 'Money Box', sellerId: 'seller-4', sellerName: 'Fun Times PK',
      rating: 4.8, reviewCount: 78, stock: 53, isActive: true, isFeatured: true,
      tags: ['piggy-bank', 'atm', 'educational'],
      createdAt: '2025-11-15T10:00:00Z', updatedAt: '2026-01-17T10:00:00Z',
    }
  ]

  return products
}

export const mockProducts: Product[] = generateProducts()

/* ===== Banners ===== */
export const mockBanners: Banner[] = [
  {
    id: 'ban-1', title: 'Family Corner - Up to 50% Off', subtitle: 'Everything for your family, all in one corner!',
    image: '/images/banner1.png', link: '/products', isActive: true,
  },
  // {
  //   id: 'ban-2', title: 'New Arrivals', subtitle: 'Discover the fastest RC cars',
  //   image: 'https://picsum.photos/seed/toys2/1200/400', link: '/products?category=remote-controlled', isActive: true,
  // },
  // {
  //   id: 'ban-3', title: 'Flash Sale — Ends Tonight!', subtitle: 'Extra 30% off on educational toys',
  //   image: 'https://picsum.photos/seed/toys3/1200/400', link: '/products?sale=true', isActive: true,
  // },
]

/* ===== Reviews ===== */
export const mockReviews: Review[] = [
  {
    id: 'rev-1', userId: 'u-1', userName: 'Ayesha Khan', productId: 'prod-1',
    rating: 5, title: 'Amazing RC Car!', comment: 'My son loves this car. It spins 360 degrees and drives over everything. The LED lights look great at night.',
    isVerifiedPurchase: true, helpfulCount: 23, createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'rev-2', userId: 'u-2', userName: 'Ali Hassan', productId: 'prod-1',
    rating: 4, title: 'Good but battery drains fast', comment: 'Works really well and is very durable. The only issue is the battery life is a bit short. Would recommend buying extra batteries.',
    isVerifiedPurchase: true, helpfulCount: 12, createdAt: '2026-01-08T10:00:00Z',
  },
  {
    id: 'rev-3', userId: 'u-3', userName: 'Fatima Noor', productId: 'prod-2',
    rating: 5, title: 'Best outdoor toy ever', comment: 'Keeps my toddler busy for hours! The water slide and spinning wheel are very engaging. Great quality plastic too.',
    isVerifiedPurchase: true, helpfulCount: 45, createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'rev-4', userId: 'u-4', userName: 'Ahmed Raza', productId: 'prod-3',
    rating: 4, title: 'Great educational block', comment: 'Perfect for learning shapes and colors. The wood is very smooth so it is safe for babies. Good value for money.',
    isVerifiedPurchase: true, helpfulCount: 34, createdAt: '2026-01-05T10:00:00Z',
  },
]

/* ===== Orders ===== */
export const mockOrders: Order[] = [
  {
    id: 'ord-1', orderNumber: 'GC-20260115-001',
    items: [
      { id: 'oi-1', productId: 'prod-1', productName: '360° Remote Control Stunt Car', productImage: 'https://picsum.photos/seed/rccar1/100/100', variantName: 'Neon Green', price: 3490, quantity: 2, total: 6980 },
      { id: 'oi-2', productId: 'prod-7', productName: 'Princess Pretend Play Makeup Kit', productImage: 'https://picsum.photos/seed/makeupkit/100/100', price: 1890, quantity: 1, total: 1890 },
    ],
    status: 'delivered', paymentMethod: 'cod', paymentStatus: 'paid',
    subtotal: 8870, shipping: 150, discount: 0, total: 9020,
    shippingAddress: { id: 'addr-1', name: 'Ayesha Khan', phone: '03001234567', street: '123 Clifton Block 5', city: 'Karachi', state: 'Sindh', zipCode: '75600', country: 'Pakistan', isDefault: true },
    trackingNumber: 'TCS-1234567890',
    createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'ord-2', orderNumber: 'GC-20260118-002',
    items: [
      { id: 'oi-3', productId: 'prod-3', productName: 'Montessori Wooden Sorting Blocks', productImage: 'https://picsum.photos/seed/woodblock/100/100', price: 1990, quantity: 1, total: 1990 },
    ],
    status: 'shipped', paymentMethod: 'jazzcash', paymentStatus: 'paid',
    subtotal: 1990, shipping: 0, discount: 0, total: 1990,
    shippingAddress: { id: 'addr-1', name: 'Ayesha Khan', phone: '03001234567', street: '123 Clifton Block 5', city: 'Karachi', state: 'Sindh', zipCode: '75600', country: 'Pakistan', isDefault: true },
    trackingNumber: 'LEP-9876543210',
    createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-01-19T10:00:00Z',
  },
]

/* ===== Addresses ===== */
export const mockAddresses: Address[] = [
  { id: 'addr-1', name: 'Ayesha Khan', phone: '03001234567', street: '123 Clifton Block 5', city: 'Karachi', state: 'Sindh', zipCode: '75600', country: 'Pakistan', isDefault: true },
  { id: 'addr-2', name: 'Ayesha Khan', phone: '03009876543', street: '45 Gulberg III', city: 'Lahore', state: 'Punjab', zipCode: '54000', country: 'Pakistan', isDefault: false },
]

/* ===== User ===== */
export const mockUser: User = {
  id: 'user-1', email: 'ayesha@example.com', name: 'Ayesha Khan', phone: '03001234567',
  role: 'customer', isVerified: true, createdAt: '2025-06-01T10:00:00Z',
}

export const mockSellerUser: User = {
  id: 'seller-1', email: 'seller@family.pk', name: 'FamilyCorner Store', phone: '03111234567',
  role: 'seller', isVerified: true, createdAt: '2025-01-01T10:00:00Z',
}

export const mockAdminUser: User = {
  id: 'admin-1', email: 'admin@familycorner.pk', name: 'Admin User', phone: '03211234567',
  role: 'admin', isVerified: true, createdAt: '2024-06-01T10:00:00Z',
}

/* ===== Wishlist ===== */
export const mockWishlist: WishlistItem[] = [
  { id: 'wl-1', productId: 'prod-5', product: mockProducts[4], addedAt: '2026-01-15T10:00:00Z' },
  { id: 'wl-2', productId: 'prod-8', product: mockProducts[7], addedAt: '2026-01-18T10:00:00Z' },
]

/* ===== Notifications ===== */
export const mockNotifications: Notification[] = [
  { id: 'n-1', type: 'order', title: 'Order Delivered', message: 'Your order GC-20260115-001 has been delivered.', isRead: false, actionUrl: '/dashboard/orders', createdAt: '2026-01-18T10:00:00Z' },
  { id: 'n-2', type: 'promo', title: 'Flash Sale!', message: 'Up to 50% off on educational toys & RC cars. Limited time!', isRead: false, actionUrl: '/products?sale=true', createdAt: '2026-01-17T10:00:00Z' },
  { id: 'n-3', type: 'system', title: 'Welcome to FamilyCorner', message: 'Your account has been verified successfully.', isRead: true, createdAt: '2025-06-01T10:00:00Z' },
]

/* ===== Seller Stats ===== */
export const mockSellerStats: SellerStats = {
  totalProducts: 24, totalOrders: 156, totalRevenue: 487500, pendingOrders: 8, averageRating: 4.6,
  monthlySales: [
    { month: 'Aug', amount: 35000 }, { month: 'Sep', amount: 42000 }, { month: 'Oct', amount: 58000 },
    { month: 'Nov', amount: 78000 }, { month: 'Dec', amount: 95000 }, { month: 'Jan', amount: 67000 },
  ],
}

/* ===== Admin Stats ===== */
export const mockAdminStats: AdminStats = {
  totalUsers: 15234, totalSellers: 89, totalProducts: 2456, totalOrders: 8734,
  totalRevenue: 12450000, pendingApprovals: 12, recentOrders: mockOrders,
}

/* ===== Cart Items ===== */
export const mockCartItems: CartItem[] = [
  {
    id: 'ci-1', productId: 'prod-1', productName: '360° Remote Control Stunt Car',
    productImage: 'https://picsum.photos/seed/rccar1/100/100', productSlug: 'stunt-rc-car',
    variantId: 'v-1', variantName: 'Neon Green', price: 3490, compareAtPrice: 4500, quantity: 1, maxQuantity: 45, sellerName: 'FamilyCorner Store',
  },
  {
    id: 'ci-2', productId: 'prod-2', productName: 'Splash & Learn Water Play Table',
    productImage: 'https://picsum.photos/seed/water1/100/100', productSlug: 'splash-water-table',
    variantId: undefined, variantName: undefined, price: 5890, quantity: 1, maxQuantity: 265, sellerName: 'Kidz Haven',
  },
]
