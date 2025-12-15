import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { CartItemDto } from "@/types/dto";
import { cartService } from "@/features/cart/services/cartService";
import { toast } from "@/hooks/use-toast";

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
    const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Derived values
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Load cart on mount
    const refreshCart = useCallback(async () => {
        try {
            const data = await cartService.getCart();
            setCartItems(data);
        } catch (error) {
            console.error("Failed to load cart", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (productId: number, quantity: number = 1) => {
        try {
            await cartService.addToCart(productId, quantity);
            await refreshCart();
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
            await cartService.updateCartItem(itemId, quantity);
            // Optimistic update
            setCartItems((items) =>
                items.map((item) =>
                    item.id === itemId
                        ? { ...item, quantity, subtotal: item.price * quantity }
                        : item
                )
            );
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update quantity",
                variant: "destructive",
            });
            await refreshCart(); // Revert on error
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await cartService.removeFromCart(itemId);
            setCartItems((items) => items.filter((item) => item.id !== itemId));
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
            // Remove all items one by one (or implement bulk delete in service)
            for (const item of cartItems) {
                await cartService.removeFromCart(item.id);
            }
            setCartItems([]);
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
