import { ProductDto } from "@/types/dto";
import productVase from "@/assets/product-vase.jpg";
import productWallHanging from "@/assets/product-wall-hanging.jpg";
import productPlanters from "@/assets/product-planters.jpg";
import productCushion from "@/assets/product-cushion.jpg";
import productCandlesticks from "@/assets/product-candlesticks.jpg";
import productBasket from "@/assets/product-basket.jpg";

// TODO: Replace with actual backend API endpoint
const API_BASE_URL = "/api";

// Mock data for development
const mockProducts: ProductDto[] = [
  // Sarees
  {
    id: 1,
    name: "Handwoven Pochampally Silk Saree - Red",
    description: "Authentic Pochampally silk saree with traditional ikat patterns. Each piece is handwoven by skilled artisans, making it truly unique.",
    price: 8999,
    imageUrl: productVase,
    category: "Sarees",
    stock: 3,
    rating: 4.9,
    isMadeToOrder: true,
    preparationTime: 15,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: "Pochampally Cotton Saree - Blue",
    description: "Lightweight cotton saree perfect for daily wear. Traditional patterns with modern colors.",
    price: 4999,
    imageUrl: productWallHanging,
    category: "Sarees",
    stock: 8,
    rating: 4.7,
    isMadeToOrder: true,
    preparationTime: 10,
    discount: 10,
    onSale: true,
  },
  {
    id: 3,
    name: "Pochampally Silk Saree - Green",
    description: "Elegant green silk saree with gold border. Ready to ship.",
    price: 7999,
    imageUrl: productPlanters,
    category: "Sarees",
    stock: 5,
    rating: 4.8,
    isMadeToOrder: false,
    discount: 15,
    onSale: true,
  },
  {
    id: 4,
    name: "Traditional Pochampally Saree - Yellow",
    description: "Bright yellow saree with intricate weaving. Perfect for festivals.",
    price: 6999,
    imageUrl: productCushion,
    category: "Sarees",
    stock: 2,
    rating: 4.9,
    isMadeToOrder: true,
    preparationTime: 12,
  },
  {
    id: 5,
    name: "Pochampally Silk Saree - Purple",
    description: "Royal purple silk saree with silver zari work.",
    price: 9999,
    imageUrl: productCandlesticks,
    category: "Sarees",
    stock: 1,
    rating: 5.0,
    isMadeToOrder: true,
    preparationTime: 20,
  },
  {
    id: 6,
    name: "Pochampally Cotton Saree - Pink",
    description: "Soft pink cotton saree with floral patterns. Comfortable and elegant.",
    price: 3999,
    imageUrl: productBasket,
    category: "Sarees",
    stock: 10,
    rating: 4.6,
    isMadeToOrder: false,
    discount: 20,
    onSale: true,
  },

  // Home Decor
  {
    id: 7,
    name: "Handcrafted Macramé Wall Hanging",
    description: "Bohemian macramé wall art featuring natural cotton rope in a modern geometric design. Ready to ship.",
    price: 2799,
    imageUrl: productWallHanging,
    category: "Decor",
    stock: 8,
    rating: 4.6,
    isMadeToOrder: false,
  },
  {
    id: 8,
    name: "Terracotta Plant Pot Set",
    description: "Set of 3 handmade terracotta pots with drainage holes and matching saucers. Perfect for your indoor garden.",
    price: 1999,
    imageUrl: productPlanters,
    category: "Decor",
    stock: 25,
    rating: 4.9,
    isMadeToOrder: false,
  },
  {
    id: 9,
    name: "Brass Candlestick Holders",
    description: "Pair of vintage-inspired brass candlestick holders with antique finish. Handcrafted by traditional metalworkers.",
    price: 2499,
    imageUrl: productCandlesticks,
    category: "Decor",
    stock: 12,
    rating: 4.5,
    isMadeToOrder: false,
    discount: 15,
    onSale: true,
  },
  {
    id: 10,
    name: "Ceramic Vase Set",
    description: "Set of 2 handmade ceramic vases with unique glazing. Perfect for flowers.",
    price: 3499,
    imageUrl: productVase,
    category: "Decor",
    stock: 6,
    rating: 4.7,
    isMadeToOrder: true,
    preparationTime: 7,
  },
  {
    id: 11,
    name: "Wooden Wall Art",
    description: "Hand-carved wooden wall decoration with traditional motifs.",
    price: 4999,
    imageUrl: productWallHanging,
    category: "Decor",
    stock: 4,
    rating: 4.8,
    isMadeToOrder: true,
    preparationTime: 14,
  },
  {
    id: 12,
    name: "Decorative Cushion Covers Set",
    description: "Set of 4 hand-embroidered cushion covers in vibrant colors.",
    price: 2999,
    imageUrl: productCushion,
    category: "Decor",
    stock: 15,
    rating: 4.4,
    isMadeToOrder: false,
    discount: 25,
    onSale: true,
  },

  // Handicrafts
  {
    id: 13,
    name: "Hand-Embroidered Cushion Cover",
    description: "Luxurious sage green velvet cushion cover with intricate hand embroidery. Made to order by local artisans.",
    price: 1899,
    imageUrl: productCushion,
    category: "Handicrafts",
    stock: 5,
    rating: 4.7,
    isMadeToOrder: true,
    preparationTime: 7,
  },
  {
    id: 14,
    name: "Handwoven Rattan Storage Basket",
    description: "Beautiful handwoven rattan basket with handles. Each basket takes 3-4 days to weave by skilled craftspeople.",
    price: 3299,
    imageUrl: productBasket,
    category: "Handicrafts",
    stock: 2,
    rating: 4.8,
    isMadeToOrder: true,
    preparationTime: 5,
  },
  {
    id: 15,
    name: "Clay Pottery Set",
    description: "Handmade clay pottery set including bowls and plates. Traditional craftsmanship.",
    price: 4599,
    imageUrl: productVase,
    category: "Handicrafts",
    stock: 7,
    rating: 4.6,
    isMadeToOrder: true,
    preparationTime: 10,
  },
  {
    id: 16,
    name: "Jute Shopping Bag",
    description: "Eco-friendly handwoven jute bag with leather handles.",
    price: 899,
    imageUrl: productBasket,
    category: "Handicrafts",
    stock: 20,
    rating: 4.3,
    isMadeToOrder: false,
  },
  {
    id: 17,
    name: "Bamboo Wind Chimes",
    description: "Handcrafted bamboo wind chimes with soothing sounds.",
    price: 1299,
    imageUrl: productWallHanging,
    category: "Handicrafts",
    stock: 12,
    rating: 4.5,
    isMadeToOrder: false,
    discount: 10,
    onSale: true,
  },
  {
    id: 18,
    name: "Handmade Paper Diary",
    description: "Beautiful diary with handmade paper and leather binding.",
    price: 1599,
    imageUrl: productBasket,
    category: "Handicrafts",
    stock: 18,
    rating: 4.7,
    isMadeToOrder: false,
  },

  // Food
  {
    id: 19,
    name: "Homemade Mango Pickle",
    description: "Traditional mango pickle made with authentic spices. Prepared fresh to order.",
    price: 499,
    imageUrl: productVase,
    category: "Food",
    stock: 30,
    rating: 4.8,
    isMadeToOrder: true,
    preparationTime: 2,
  },
  {
    id: 20,
    name: "Organic Honey (500g)",
    description: "Pure organic honey from local beekeepers. No additives.",
    price: 699,
    imageUrl: productCandlesticks,
    category: "Food",
    stock: 25,
    rating: 4.9,
    isMadeToOrder: false,
  },
  {
    id: 21,
    name: "Homemade Ghee (1kg)",
    description: "Pure cow ghee made using traditional methods.",
    price: 1299,
    imageUrl: productVase,
    category: "Food",
    stock: 15,
    rating: 5.0,
    isMadeToOrder: true,
    preparationTime: 1,
  },
  {
    id: 22,
    name: "Mixed Dry Fruits Pack",
    description: "Premium quality dry fruits including almonds, cashews, and raisins.",
    price: 899,
    imageUrl: productBasket,
    category: "Food",
    stock: 40,
    rating: 4.6,
    isMadeToOrder: false,
    discount: 15,
    onSale: true,
  },
  {
    id: 23,
    name: "Homemade Masala Powder Set",
    description: "Set of 5 authentic masala powders for traditional cooking.",
    price: 799,
    imageUrl: productCushion,
    category: "Food",
    stock: 35,
    rating: 4.7,
    isMadeToOrder: false,
  },
  {
    id: 24,
    name: "Fresh Homemade Sweets Box",
    description: "Assorted traditional sweets made fresh to order. Perfect for gifting.",
    price: 999,
    imageUrl: productVase,
    category: "Food",
    stock: 10,
    rating: 4.9,
    isMadeToOrder: true,
    preparationTime: 1,
    discount: 10,
    onSale: true,
  },
];

export const productService = {
  // GET /api/products?tenantId={tenantId}
  getAllProducts: async (tenantId?: string): Promise<ProductDto[]> => {
    // TODO: Implement actual API call to Spring Boot backend
    // Include tenant ID in request to get tenant-specific products
    // const response = await fetch(`${API_BASE_URL}/products?tenantId=${tenantId}`, {
    //   credentials: 'include',
    // });
    // if (!response.ok) throw new Error('Failed to fetch products');
    // return response.json();

    // Mock implementation - returns same products for all tenants
    // In real implementation, backend will filter by tenant
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProducts), 500);
    });
  },

  // GET /api/products/{id}?tenantId={tenantId}
  getProductById: async (id: number, tenantId?: string): Promise<ProductDto | null> => {
    // TODO: Implement actual API call to Spring Boot backend
    // const response = await fetch(`${API_BASE_URL}/products/${id}?tenantId=${tenantId}`, {
    //   credentials: 'include',
    // });
    // if (!response.ok) throw new Error('Failed to fetch product');
    // return response.json();

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === id);
        resolve(product || null);
      }, 300);
    });
  },

  // GET /api/products?category={category}&tenantId={tenantId}
  getProductsByCategory: async (category: string, tenantId?: string): Promise<ProductDto[]> => {
    // TODO: Implement actual API call to Spring Boot backend
    // const response = await fetch(
    //   `${API_BASE_URL}/products?category=${category}&tenantId=${tenantId}`,
    //   { credentials: 'include' }
    // );
    // if (!response.ok) throw new Error('Failed to fetch products');
    // return response.json();

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockProducts.filter(p => p.category === category);
        resolve(filtered);
      }, 400);
    });
  },
};
