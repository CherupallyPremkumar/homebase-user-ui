import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useWishlistQuery, useWishlistToggleMutation } from "@/features/profile/services/wishlistService";

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
  const [localIsInWishlist, setLocalIsInWishlist] = useState(false);

  // Use React Query for data
  const { data: wishlistItems } = useWishlistQuery(user?.email);
  const toggleMutation = useWishlistToggleMutation();

  const isApiConnected = !!user;
  const isInWishlist = isApiConnected
    ? wishlistItems?.some(p => p.id === productId) ?? false
    : localIsInWishlist;

  const [isAnimating, setIsAnimating] = useState(false);

  // Sync local storage for non-guest fallback
  useEffect(() => {
    if (!isApiConnected) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setLocalIsInWishlist(wishlist.includes(productId));
    }
  }, [productId, isApiConnected]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isApiConnected) {
      // API Toggle using Mutation
      try {
        const result = await toggleMutation.mutateAsync({ email: user.email, productId });

        if (result.added) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 600);
        }

        toast({
          title: result.added ? "Added to wishlist" : "Removed from wishlist",
          description: result.message,
        });
      } catch (err) {
        toast({ title: "Error", description: "Failed to update wishlist", variant: "destructive" });
      }
    } else {
      // LocalStorage Toggle
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

      if (localIsInWishlist) {
        const updated = wishlist.filter((id: number) => id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setLocalIsInWishlist(false);
        toast({
          title: "Removed from wishlist",
          description: `${productName} has been removed from your wishlist`,
        });
      } else {
        const updated = [...wishlist, productId];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setLocalIsInWishlist(true);
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

// Hook to get wishlist items (Legacy wrapper for backward compat if needed, or update consumers)
export const useWishlist = () => {
  // This hook was previously listening to storage events. 
  // We can leave it for now or update it to use React Query if consumed elsewhere.
  // For now, simple implementation for non-button consumers:
  const { user } = useAuth();
  const { data } = useWishlistQuery(user?.email);
  const [localIds, setLocalIds] = useState<number[]>([]);

  useEffect(() => {
    if (!user) {
      const load = () => {
        setLocalIds(JSON.parse(localStorage.getItem("wishlist") || "[]"));
      };
      load();
      window.addEventListener("storage", load);
      return () => window.removeEventListener("storage", load);
    }
  }, [user]);

  if (user) return data?.map(d => d.id) || [];
  return localIds;
};
