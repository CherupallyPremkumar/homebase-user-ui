import { useQuery } from "@tanstack/react-query";
import { productService } from "@/features/products/services/productService";
import { ProductDto } from "@/types/dto";

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: productService.getAllProducts,
        staleTime: 5 * 60 * 1000, // 5 minutes
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
