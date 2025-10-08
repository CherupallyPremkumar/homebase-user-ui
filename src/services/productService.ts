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
  {
    id: 1,
    name: "Ceramic Vase Collection",
    description: "Handcrafted ceramic vases with organic shapes and earthy glazes. Perfect for fresh or dried flowers.",
    price: 3499,
    imageUrl: productVase,
    category: "Decor",
    stock: 15,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Woven Wall Hanging",
    description: "Macramé wall art featuring natural cotton rope in a modern geometric design.",
    price: 2799,
    imageUrl: productWallHanging,
    category: "Wall Art",
    stock: 8,
    rating: 4.6,
  },
  {
    id: 3,
    name: "Terracotta Plant Pot Set",
    description: "Set of 3 terracotta pots with drainage holes and matching saucers.",
    price: 1999,
    imageUrl: productPlanters,
    category: "Planters",
    stock: 25,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Velvet Cushion Cover",
    description: "Luxurious sage green velvet cushion cover with hidden zipper closure.",
    price: 1299,
    imageUrl: productCushion,
    category: "Textiles",
    stock: 30,
    rating: 4.7,
  },
  {
    id: 5,
    name: "Brass Candlestick Holders",
    description: "Pair of vintage-inspired brass candlestick holders with antique finish.",
    price: 2499,
    imageUrl: productCandlesticks,
    category: "Decor",
    stock: 12,
    rating: 4.5,
  },
  {
    id: 6,
    name: "Rattan Storage Basket",
    description: "Handwoven rattan basket with handles, perfect for storage or display.",
    price: 3299,
    imageUrl: productBasket,
    category: "Storage",
    stock: 10,
    rating: 4.8,
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
