import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/features/cart/services/cartService";
import { CartItemDto } from "@/types/dto";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getGuestId } from "@/lib/utils";
import { CACHE_TIMES } from "@/lib/constants";


export const useCartQuery = () => {
    const queryClient = useQueryClient();
    const { user, isLoading: authLoading } = useAuth();

    // Determine effective user ID
    // If user is logged in, use their email (or ID if available)
    // If not, use the persistent guest ID
    const effectiveUserId = user?.email || getGuestId();

    const cartQuery = useQuery<CartItemDto[]>({
        queryKey: ["cart", effectiveUserId],
        queryFn: () => cartService.getCart(effectiveUserId),
        staleTime: CACHE_TIMES.ALWAYS_FRESH, // Always refetch cart data
        enabled: !authLoading, // Wait for auth to settle
    });

    const addToCartMutation = useMutation({
        mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
            cartService.addToCart(productId, quantity, effectiveUserId),
        onSuccess: (newItem) => {
            queryClient.setQueryData<CartItemDto[]>(["cart", effectiveUserId], (oldData) => {
                return oldData ? [...oldData, newItem] : [newItem];
            });
            // Also invalidate to be safe
            queryClient.invalidateQueries({ queryKey: ["cart", effectiveUserId] });
        },
    });

    const updateQuantityMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
            cartService.updateCartItem(itemId, quantity),
        onSuccess: (updatedItem) => {
            queryClient.setQueryData<CartItemDto[]>(["cart", effectiveUserId], (oldData) => {
                return oldData
                    ? oldData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                    : [];
            });
        },
    });

    const removeItemMutation = useMutation({
        mutationFn: (itemId: number) => cartService.removeFromCart(itemId),
        onSuccess: (_, itemId) => {
            queryClient.setQueryData<CartItemDto[]>(["cart", effectiveUserId], (oldData) => {
                return oldData ? oldData.filter((item) => item.id !== itemId) : [];
            });
        },
    });

    const clearCartMutation = useMutation({
        mutationFn: () => cartService.clearCart(effectiveUserId),
        onSuccess: () => {
            queryClient.setQueryData<CartItemDto[]>(["cart", effectiveUserId], []);
        },
    });

    return {
        cartItems: cartQuery.data || [],
        isLoading: cartQuery.isLoading,
        isError: cartQuery.isError,
        addToCart: addToCartMutation.mutateAsync,
        updateQuantity: updateQuantityMutation.mutateAsync,
        removeItem: removeItemMutation.mutateAsync,
        clearCart: clearCartMutation.mutateAsync,
        refreshCart: () => queryClient.invalidateQueries({ queryKey: ["cart", effectiveUserId] }),
    };
};
