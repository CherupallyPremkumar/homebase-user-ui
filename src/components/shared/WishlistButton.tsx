import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toggleWishlist as toggleWishlistApi, getWishlist as getWishlistApi } from "@/features/profile/services/wishlistService";

interface WishlistButtonProps {
  productId: number;
  productName: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  showLabel?: boolean;
  className?: string;
}

export const WishlistButton = ({
  productId,
  productName,
  size = "md",
  variant = "ghost",
  showLabel = false,
  className,
}: WishlistButtonProps) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        // API Check
        try {
          const items = await getWishlistApi(user.email);
          const exists = items.some(p => p.id === productId);
          setIsInWishlist(exists);
        } catch (e) { console.error(e); }
      } else {
        // LocalStorage Check
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setIsInWishlist(wishlist.includes(productId));
      }
    };
    checkStatus();
  }, [productId, user]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      // API Toggle
      try {
        const response = await toggleWishlistApi(user.email, productId);
        setIsInWishlist(response.added);
        if (response.added) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 600);
        }
        toast({
          title: response.added ? "Added to wishlist" : "Removed from wishlist",
          description: response.message,
        });

        // Dispatch storage event to update other components? 
        // Or we need a context. For now, we rely on page refresh for others or local state here.
        // Actually, trigger a custom event for the hook to pick up?
        window.dispatchEvent(new Event("wishlist-updated"));
      } catch (err) {
        toast({ title: "Error", description: "Failed to update wishlist", variant: "destructive" });
      }
    } else {
      // LocalStorage Toggle
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

      if (isInWishlist) {
        const updated = wishlist.filter((id: number) => id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsInWishlist(false);
        toast({
          title: "Removed from wishlist",
          description: `${productName} has been removed from your wishlist`,
        });
      } else {
        const updated = [...wishlist, productId];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setIsInWishlist(true);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        toast({
          title: "Added to wishlist",
          description: `${productName} has been added to your wishlist`,
        });
      }
      window.dispatchEvent(new Event("storage"));
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <Button
      variant={variant}
      size={showLabel ? (size === "lg" ? "lg" : size === "sm" ? "sm" : "default") : "icon"}
      onClick={toggleWishlist}
      className={cn(
        !showLabel && sizeClasses[size],
        "transition-all",
        isInWishlist && "text-destructive hover:text-destructive",
        className
      )}
    >
      <Heart
        className={cn(
          iconSizeClasses[size],
          isInWishlist && "fill-current",
          isAnimating && "animate-ping"
        )}
      />
      {showLabel && (
        <span className="ml-2">
          {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </Button>
  );
};

// Hook to get wishlist items
export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const items = await getWishlistApi(user.email);
          setWishlistIds(items.map(p => p.id));
        } catch (e) {
          console.error("Failed to load wishlist", e);
        }
      } else {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistIds(wishlist);
      }
    };

    loadWishlist();

    // Listen for storage changes & custom event
    window.addEventListener("storage", loadWishlist);
    window.addEventListener("wishlist-updated", loadWishlist);
    return () => {
      window.removeEventListener("storage", loadWishlist);
      window.removeEventListener("wishlist-updated", loadWishlist);
    };
  }, [user]);

  return wishlistIds;
};
