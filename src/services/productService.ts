import { ProductDto } from "@/types/dto";
import { getTenantId, API_ENDPOINTS, buildUrl, getFetchOptions, handleApiError } from "@/config/api";

/**
 * ✅ Production-Ready Product Service
 * Uses getTenantId() dynamically instead of direct localStorage
 * Includes consistent error handling and secure headers
 */

export const productService = {
  /**
   * GET /api/products
   * Fetch all products for the current tenant
   */
  getAllProducts: async (): Promise<ProductDto[]> => {
    try {
      const tenantId = getTenantId();
      const url = buildUrl(API_ENDPOINTS.user.products, { tenantId });
      const response = await fetch(url, getFetchOptions("GET"));

      if (!response.ok) {
        await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
      throw new Error("Unable to load products. Please try again later.");
    }
  },

  /**
   * GET /api/products/{id}
   * Fetch single product by ID
   */
  getProductById: async (id: number): Promise<ProductDto | null> => {
    try {
      const tenantId = getTenantId();
      const url = buildUrl(`${API_ENDPOINTS.user.products}/${id}`, { tenantId });
      const response = await fetch(url, getFetchOptions("GET"));

      if (!response.ok) {
        if (response.status === 404) return null;
        await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Failed to fetch product ID ${id}:`, error);
      throw new Error("Unable to fetch product details. Please try again.");
    }
  },

  /**
   * GET /api/products?category={category}
   * Fetch products by category
   */
  getProductsByCategory: async (category: string): Promise<ProductDto[]> => {
    try {
      const tenantId = getTenantId();
      const url = buildUrl(API_ENDPOINTS.user.products, { tenantId, category });
      const response = await fetch(url, getFetchOptions("GET"));

      if (!response.ok) {
        await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Failed to fetch products for category ${category}:`, error);
      throw new Error("Unable to load category products. Please try again later.");
    }
  },
};