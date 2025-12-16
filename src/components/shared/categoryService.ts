import { API_BASE_URL } from "@/lib/config";

export interface CategoryDto {
    title: string;
    href: string;
    description: string;
    subcategories: {
        title: string;
        href: string;
    }[];
}

export const getCategories = async (): Promise<CategoryDto[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
