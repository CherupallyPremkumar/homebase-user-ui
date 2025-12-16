import { ProductDto, ProductViewDto } from "@/types/dto";
import { apiClient } from "@/lib/apiClient";

/**
 * Pagination response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Product Service
 * All product data comes from backend API
 */
export const productService = {
  // GET /api/products with pagination
  getAllProducts: async (
    city?: string | null,
    page: number = 1,
    pageSize: number = 24
  ): Promise<PaginatedResponse<ProductDto>> => {
    let url = `/products?page=${page}&pageSize=${pageSize}`;
    if (city) {
      url += `&city=${encodeURIComponent(city)}`;
    }
    return apiClient.get<PaginatedResponse<ProductDto>>(url);
  },

  // GET /api/products/{id}
  getProductById: async (id: number): Promise<ProductViewDto | null> => {
    return apiClient.get<ProductViewDto>(`/products/${id}`);
  },

  // GET /api/products?category={category} with pagination
  getProductsByCategory: async (
    category: string,
    page: number = 1,
    pageSize: number = 24
  ): Promise<PaginatedResponse<ProductDto>> => {
    return apiClient.get<PaginatedResponse<ProductDto>>(
      `/products?category=${category}&page=${page}&pageSize=${pageSize}`
    );
  },
};
