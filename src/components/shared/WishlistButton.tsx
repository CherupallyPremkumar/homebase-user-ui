import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsInWishlist(wishlist.includes(productId));
  }, [productId]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    
    if (isInWishlist) {
      // Remove from wishlist
      const updated = wishlist.filter((id: number) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsInWishlist(false);
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist`,
      });
    } else {
      // Add to wishlist
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
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    const loadWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistIds(wishlist);
    };

    loadWishlist();
    
    // Listen for storage changes
    window.addEventListener("storage", loadWishlist);
    return () => window.removeEventListener("storage", loadWishlist);
  }, []);

  return wishlistIds;
};
