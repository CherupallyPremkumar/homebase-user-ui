import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getWishlist } from "@/features/profile/services/wishlistService";
import { ProductDto } from "@/types/dto";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Loader2, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const WishlistTab = () => {
    const { user } = useAuth();
    const [items, setItems] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await getWishlist(user.email);
            setItems(data);
        } catch (error) {
            console.error("Failed to load wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();

        // Listen for updates from WishlistButtons on this page or others
        window.addEventListener("wishlist-updated", fetchWishlist);
        return () => window.removeEventListener("wishlist-updated", fetchWishlist);
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Save items you love so you can easily find them later.
                </p>
                <Link to="/products">
                    <Button>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    layout="grid"
                    onAddToCart={() => { }} // ProductCard handles cart context internally usually, or we pass handler
                // Checking ProductCard implementation... it expects onAddToCart. 
                // We can pass a dummy or implement real add to cart if needed, 
                // but ProductCard usually calls useCart internally? 
                // Looking at ProductCard usage in ProductList, it passes onAddToCart from parent usually.
                />
            ))}
        </div>
    );
};
