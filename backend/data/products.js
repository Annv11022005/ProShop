const products = [
  {
    name: 'AeroFlex Mechanical Keyboard',
    subtitle: '75% Wireless Mechanical Keyboard',
    description:
      'A premium 75% mechanical keyboard designed for gaming and productivity with hot-swappable switches and RGB backlighting.',
    brand: 'AeroFlex',
    category: 'Mechanical Keyboard',

    image: [
      {
        url: 'https://images.unsplash.com/photo-1634824302616-2136eefe6384?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
      {
        url: 'https://images.unsplash.com/photo-1654618871718-9db01bf9f507?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
    ],

    variants: [
      {
        color: 'Black',
        size: '75%',
        sku: 'AFK-BLK-75',
        price: 1890000,
        originalPrice: 2000000,
        countInStock: 15,
      },
      {
        color: 'White',
        size: '75%',
        sku: 'AFK-WHT-75',
        price: 1990000,
        originalPrice: 2200000,
        countInStock: 10,
      },
    ],

    status: 'Active',
    rating: 4.5,
    numberViews: 120,
    isDeleted: false,
  },

  {
    name: 'KeyNova K87 Mechanical Keyboard',
    subtitle: 'Tenkeyless RGB Mechanical Keyboard',
    description:
      'A compact TKL mechanical keyboard with RGB lighting, hot-swappable switches and a durable aluminum frame.',
    brand: 'KeyNova',
    category: 'Mechanical Keyboard',

    image: [
      {
        url: 'https://images.unsplash.com/photo-1670594454664-42fa9837060c?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
      {
        url: 'https://images.unsplash.com/photo-1634824302616-2136eefe6384?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
    ],

    variants: [
      {
        color: 'Black',
        size: 'TKL',
        sku: 'KNK87-BLK',
        price: 1590000,
        originalPrice: 1800000,
        countInStock: 20,
      },
      {
        color: 'White',
        size: 'TKL',
        sku: 'KNK87-WHT',
        price: 1690000,
        originalPrice: 1900000,
        countInStock: 12,
      },
    ],

    status: 'Active',
    rating: 4.3,
    numberViews: 95,
    isDeleted: false,
  },

  {
    name: 'NovaType Pro 65',
    subtitle: 'Compact 65% Mechanical Keyboard',
    description:
      'A compact 65% mechanical keyboard designed for users who want a minimal desk setup without sacrificing functionality.',
    brand: 'NovaType',
    category: 'Mechanical Keyboard',

    image: [
      {
        url: 'https://images.unsplash.com/photo-1670594454664-42fa9837060c?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
      {
        url: 'https://images.unsplash.com/photo-1634824302616-2136eefe6384?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
    ],

    variants: [
      {
        color: 'Black',
        size: '65%',
        sku: 'NTP65-BLK',
        price: 1790000,
        originalPrice: 2000000,
        countInStock: 18,
      },
      {
        color: 'Blue',
        size: '65%',
        sku: 'NTP65-BLU',
        price: 1890000,
        originalPrice: 2100000,
        countInStock: 9,
      },
    ],

    status: 'Active',
    rating: 4.6,
    numberViews: 150,
    isDeleted: false,
  },

  {
    name: 'TypeCraft M75',
    subtitle: 'Wireless Gasket Mount Keyboard',
    description:
      'A premium gasket-mounted mechanical keyboard with wireless connectivity, customizable RGB lighting and a smooth typing experience.',
    brand: 'TypeCraft',
    category: 'Mechanical Keyboard',

    image: [
      {
        url: 'https://images.unsplash.com/photo-1654618871718-9db01bf9f507?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
      {
        url: 'https://images.unsplash.com/photo-1634824302616-2136eefe6384?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
    ],

    variants: [
      {
        color: 'Dark Gray',
        size: '75%',
        sku: 'TCM75-GRY',
        price: 2290000,
        originalPrice: 2500000,
        countInStock: 7,
      },
      {
        color: 'Cream',
        size: '75%',
        sku: 'TCM75-CRM',
        price: 2390000,
        originalPrice: 2600000,
        countInStock: 6,
      },
    ],

    status: 'Active',
    rating: 4.8,
    numberViews: 210,
    isDeleted: false,
  },

  {
    name: 'MechaCore X60',
    subtitle: 'Ultra Compact 60% Gaming Keyboard',
    description:
      'A compact gaming keyboard featuring fast mechanical switches, RGB lighting and a portable 60% layout.',
    brand: 'MechaCore',
    category: 'Mechanical Keyboard',

    image: [
      {
        url: 'https://images.unsplash.com/photo-1634824302616-2136eefe6384?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
      {
        url: 'https://images.unsplash.com/photo-1654618871718-9db01bf9f507?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
    ],

    variants: [
      {
        color: 'Black',
        size: '60%',
        sku: 'MCX60-BLK',
        price: 1390000,
        originalPrice: 1500000,
        countInStock: 25,
      },
      {
        color: 'White',
        size: '60%',
        sku: 'MCX60-WHT',
        price: 1490000,
        originalPrice: 1600000,
        countInStock: 16,
      },
    ],

    status: 'Active',
    rating: 4.2,
    numberViews: 80,
    isDeleted: false,
  },

  {
    name: 'KeyForge K98',
    subtitle: '98% Full-Function Mechanical Keyboard',
    description:
      'A 98% mechanical keyboard that combines a compact layout with a dedicated number pad, making it ideal for both work and gaming.',
    brand: 'KeyForge',
    category: 'Mechanical Keyboard',

    image: [
      {
        url: 'https://images.unsplash.com/photo-1670594454664-42fa9837060c?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
      {
        url: 'https://images.unsplash.com/photo-1634824302616-2136eefe6384?auto=format&fit=crop&w=1200&q=80',
        fileId: null,
      },
    ],

    variants: [
      {
        color: 'Black',
        size: '98%',
        sku: 'KFK98-BLK',
        price: 1990000,
        originalPrice: 2200000,
        countInStock: 11,
      },
      {
        color: 'White',
        size: '98%',
        sku: 'KFK98-WHT',
        price: 2090000,
        originalPrice: 2300000,
        countInStock: 8,
      },
    ],

    status: 'Active',
    rating: 4.4,
    numberViews: 110,
    isDeleted: false,
  },
];

export default products;
