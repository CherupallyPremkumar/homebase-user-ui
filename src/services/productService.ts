import { ProductDto } from "@/types/dto";

// Use environment variable for API base URL
const API_BASE_URL = process.env.API_BASE_URL || "/api";

const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorMessage = await response.text();
    console.error(`Error fetching ${url}: ${errorMessage}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const productService = {
  getAllProducts: async (): Promise<ProductDto[]> => {
    return fetchWithErrorHandling(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'X-Tenant-ID': localStorage.getItem("X-Tenant-ID") || '',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("authToken") || ''}`
      },
      credentials: 'include',
    });
  },

  getProductById: async (id: number): Promise<ProductDto | null> => {
    return fetchWithErrorHandling(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'X-Tenant-ID': localStorage.getItem("X-Tenant-ID") || '',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("authToken") || ''}`
      },
      credentials: 'include',
    });
  },

  getProductsByCategory: async (category: string, tenantId?: string): Promise<ProductDto[]> => {
    const url = new URL(`${API_BASE_URL}/products`);
    url.searchParams.append('category', category);
    if (tenantId) {
      url.searchParams.append('tenantId', tenantId);
    }

    return fetchWithErrorHandling(url.toString(), {
      method: 'GET',
      headers: {
        'X-Tenant-ID': localStorage.getItem("X-Tenant-ID") || '',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("authToken") || ''}`
      },
      credentials: 'include',
    });
  },
};
