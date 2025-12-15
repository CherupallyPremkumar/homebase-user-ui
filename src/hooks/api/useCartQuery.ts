import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/features/cart/services/cartService";
import { CartItemDto } from "@/types/dto";

export const useCartQuery = () => {
    const queryClient = useQueryClient();

    const cartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: cartService.getCart,
        staleTime: 0, // Cart should always be fresh-ish, but relying on mutations to invalidate
    });

    const addToCartMutation = useMutation({
        mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
            cartService.addToCart(productId, quantity),
        onSuccess: (newItem) => {
            queryClient.setQueryData<CartItemDto[]>(["cart"], (oldData) => {
                return oldData ? [...oldData, newItem] : [newItem];
            });
        },
    });

    const updateQuantityMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
            cartService.updateCartItem(itemId, quantity),
        onSuccess: (updatedItem) => {
            queryClient.setQueryData<CartItemDto[]>(["cart"], (oldData) => {
                return oldData
                    ? oldData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                    : [];
            });
        },
    });

    const removeItemMutation = useMutation({
        mutationFn: (itemId: number) => cartService.removeFromCart(itemId),
        onSuccess: (_, itemId) => {
            queryClient.setQueryData<CartItemDto[]>(["cart"], (oldData) => {
                return oldData ? oldData.filter((item) => item.id !== itemId) : [];
            });
        },
    });

    const clearCartMutation = useMutation({
        mutationFn: cartService.clearCart,
        onSuccess: () => {
            queryClient.setQueryData<CartItemDto[]>(["cart"], []);
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
        refreshCart: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    };
};
