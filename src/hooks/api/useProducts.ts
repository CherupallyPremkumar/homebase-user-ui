import { useQuery } from "@tanstack/react-query";
import { productService } from "@/features/products/services/productService";
import { useLocation } from "@/hooks/useLocation";

export const useProducts = () => {
    const { city } = useLocation();

    return useQuery({
        queryKey: ["products", city],
        queryFn: () => productService.getAllProducts(city),
        staleTime: 5 * 60 * 1000,
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => productService.getProductById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
