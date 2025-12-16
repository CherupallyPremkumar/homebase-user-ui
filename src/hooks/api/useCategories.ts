import { useQuery } from "@tanstack/react-query";
import { getCategories, CategoryDto } from "@/components/shared/categoryService";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 24 * 60 * 60 * 1000, // 24 hours - categories essentially never change
        gcTime: 24 * 60 * 60 * 1000, // Keep in garbage collection for 24 hours
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};
