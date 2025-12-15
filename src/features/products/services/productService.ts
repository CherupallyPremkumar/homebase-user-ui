import { ProductDto } from "@/types/dto";
import { SellerDto } from "@/types/seller";
import productVase from "@/assets/product-vase.jpg";
import productWallHanging from "@/assets/product-wall-hanging.jpg";
import productPlanters from "@/assets/product-planters.jpg";
import productCushion from "@/assets/product-cushion.jpg";
import productCandlesticks from "@/assets/product-candlesticks.jpg";
import productBasket from "@/assets/product-basket.jpg";

import { API_BASE_URL } from "@/lib/config";

// Mock Sellers for marketplace
const mockSellers: Record<string, SellerDto> = {
  seller1: {
    id: "seller1",
    name: "Royal Weaves",
    rating: 4.8,
    totalRatings: 1234,
    location: "Hyderabad, India",
    verified: true,
    description: "Authentic Pochampally handloom sarees since 1985",
  },
  seller2: {
    id: "seller2",
    name: "Artisan Crafts",
    rating: 4.6,
    totalRatings: 856,
    location: "Jaipur, India",
    verified: true,
    description: "Traditional Indian handicrafts and home decor",
  },
  seller3: {
    id: "seller3",
    name: "Heritage Foods",
    rating: 4.9,
    totalRatings: 2341,
    location: "Kerala, India",
    verified: true,
    description: "Authentic homemade pickles and traditional foods",
  },
  seller4: {
    id: "seller4",
    name: "Decor Studio",
    rating: 4.5,
    totalRatings: 567,
    location: "Mumbai, India",
    verified: false,
    description: "Modern home decor and furnishings",
  },
};

// Mock products with seller information
const mockProducts: ProductDto[] = [
  // Sarees - Seller: Royal Weaves
  {
    id: 1,
    name: "Handwoven Pochampally Silk Saree - Red",
    description: "Authentic Pochampally silk saree with traditional ikat patterns.",
    price: 8999,
    imageUrl: productVase,
    category: "Sarees",
    stock: 3,
    rating: 4.9,
    isMadeToOrder: true,
    preparationTime: 15,
    seller: mockSellers.seller1,
  },
  {
    id: 2,
    name: "Pochampally Cotton Saree - Blue",
    description: "Lightweight cotton saree perfect for daily wear.",
    price: 4999,
    imageUrl: productWallHanging,
    category: "Sarees",
    stock: 8,
    rating: 4.7,
    isMadeToOrder: true,
    preparationTime: 10,
    discount: 10,
    onSale: true,
    seller: mockSellers.seller1,
  },
  {
    id: 3,
    name: "Pochampally Silk Saree - Green",
    description: "Elegant green silk saree with gold border.",
    price: 7999,
    imageUrl: productPlanters,
    category: "Sarees",
    stock: 5,
    rating: 4.8,
    isMadeToOrder: false,
    discount: 15,
    onSale: true,
    seller: mockSellers.seller1,
  },
  {
    id: 4,
    name: "Traditional Pochampally Saree - Yellow",
    description: "Bright yellow saree with intricate weaving.",
    price: 6999,
    imageUrl: productCushion,
    category: "Sarees",
    stock: 2,
    rating: 4.9,
    isMadeToOrder: true,
    preparationTime: 12,
    seller: mockSellers.seller1,
  },

  // Home Decor - Seller: Artisan Crafts
  {
    id: 7,
    name: "Handcrafted Macramé Wall Hanging",
    description: "Bohemian macramé wall art in modern geometric design.",
    price: 2799,
    imageUrl: productWallHanging,
    category: "Decor",
    stock: 8,
    rating: 4.6,
    isMadeToOrder: false,
    seller: mockSellers.seller2,
  },
  {
    id: 8,
    name: "Terracotta Plant Pot Set",
    description: "Set of 3 handmade terracotta pots with drainage holes.",
    price: 1999,
    imageUrl: productPlanters,
    category: "Decor",
    stock: 25,
    rating: 4.9,
    isMadeToOrder: false,
    seller: mockSellers.seller2,
  },
  {
    id: 9,
    name: "Brass Candlestick Holders",
    description: "Vintage-inspired brass candlestick holders.",
    price: 2499,
    imageUrl: productCandlesticks,
    category: "Decor",
    stock: 12,
    rating: 4.5,
    isMadeToOrder: false,
    discount: 15,
    onSale: true,
    seller: mockSellers.seller2,
  },

  // Handicrafts - Seller: Artisan Crafts
  {
    id: 13,
    name: "Hand-Embroidered Cushion Cover",
    description: "Sage green velvet cushion cover with intricate embroidery.",
    price: 1899,
    imageUrl: productCushion,
    category: "Handicrafts",
    stock: 5,
    rating: 4.7,
    isMadeToOrder: true,
    preparationTime: 7,
    seller: mockSellers.seller2,
  },
  {
    id: 14,
    name: "Handwoven Rattan Storage Basket",
    description: "Beautiful handwoven rattan basket with handles.",
    price: 3299,
    imageUrl: productBasket,
    category: "Handicrafts",
    stock: 2,
    rating: 4.8,
    isMadeToOrder: true,
    preparationTime: 5,
    seller: mockSellers.seller2,
  },

  // Food - Seller: Heritage Foods
  {
    id: 19,
    name: "Homemade Mango Pickle",
    description: "Traditional mango pickle made with authentic spices.",
    price: 499,
    imageUrl: productVase,
    category: "Food",
    stock: 30,
    rating: 4.8,
    isMadeToOrder: true,
    preparationTime: 2,
    seller: mockSellers.seller3,
  },
  {
    id: 20,
    name: "Organic Honey (500g)",
    description: "Pure organic honey from local beekeepers.",
    price: 699,
    imageUrl: productCandlesticks,
    category: "Food",
    stock: 25,
    rating: 4.9,
    isMadeToOrder: false,
    seller: mockSellers.seller3,
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
    seller: mockSellers.seller3,
  },

  // Modern Decor - Seller: Decor Studio
  {
    id: 10,
    name: "Ceramic Vase Set",
    description: "Set of 2 handmade ceramic vases with unique glazing.",
    price: 3499,
    imageUrl: productVase,
    category: "Decor",
    stock: 6,
    rating: 4.7,
    isMadeToOrder: true,
    preparationTime: 7,
    seller: mockSellers.seller4,
  },
  {
    id: 12,
    name: "Decorative Cushion Covers Set",
    description: "Set of 4 hand-embroidered cushion covers.",
    price: 2999,
    imageUrl: productCushion,
    category: "Decor",
    stock: 15,
    rating: 4.4,
    isMadeToOrder: false,
    discount: 25,
    onSale: true,
    seller: mockSellers.seller4,
  },
];

export const productService = {
  // GET /api/products
  getAllProducts: async (): Promise<ProductDto[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  // GET /api/products/{id}
  getProductById: async (id: number): Promise<ProductDto | null> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  // GET /api/products?category={category}
  getProductsByCategory: async (category: string): Promise<ProductDto[]> => {
    const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },
};

// Export mock data for development/fallback
export { mockProducts, mockSellers };
