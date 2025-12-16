import { useQuery } from "@tanstack/react-query";
import { getCategories, CategoryDto } from "@/components/shared/categoryService";
import { CACHE_TIMES } from "@/lib/constants";

export const useCategories = () => {
    return useQuery<CategoryDto[]>({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: CACHE_TIMES.VERY_LONG, // 24 hours - categories rarely change
        gcTime: 24 * 60 * 60 * 1000, // Keep in garbage collection for 24 hours
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};
