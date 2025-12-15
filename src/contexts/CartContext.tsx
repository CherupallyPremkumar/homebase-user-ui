import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { CartItemDto } from "@/types/dto";
import { toast } from "@/hooks/use-toast";
import { useCartQuery } from "@/hooks/api/useCartQuery";

interface CartContextType {
    cartItems: CartItemDto[];
    cartCount: number;
    cartTotal: number;
    loading: boolean;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const {
        cartItems,
        isLoading: loading,
        addToCart: addToCartMutation,
        updateQuantity: updateQuantityMutation,
        removeItem: removeItemMutation,
        clearCart: clearCartMutation,
        refreshCart: refetchCart,
    } = useCartQuery();

    // Derived values
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    const refreshCart = async () => {
        await refetchCart();
    };

    const addToCart = async (productId: number, quantity: number = 1) => {
        try {
            await addToCartMutation({ productId, quantity });
            toast({
                title: "Added to cart",
                description: "Product has been added to your cart",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add product to cart",
                variant: "destructive",
            });
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        try {
            if (quantity < 1) {
                await removeItem(itemId);
                return;
            }
            await updateQuantityMutation({ itemId, quantity });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update quantity",
                variant: "destructive",
            });
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await removeItemMutation(itemId);
            toast({
                title: "Removed",
                description: "Item removed from cart",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove item",
                variant: "destructive",
            });
        }
    };

    const clearCart = async () => {
        try {
            await clearCartMutation();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to clear cart",
                variant: "destructive",
            });
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                loading,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
