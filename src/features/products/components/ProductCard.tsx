import { Link } from "react-router-dom";
import { ProductDto } from "@/types/dto";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Eye, Package } from "lucide-react";
import { ProductBadge, getProductBadges } from "./ProductBadge";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { CheckoutPreview } from "@/features/checkout/components/CheckoutPreview";
import { ShippingBadge } from "@/features/checkout/components/ShippingCalculator";
import { useState } from "react";

interface ProductCardProps {
  product: ProductDto;
  onAddToCart?: (productId: number) => void;
  onQuickView?: (product: ProductDto) => void;
  layout?: "grid" | "list" | "masonry";
}

export const ProductCard = ({ product, onAddToCart, onQuickView, layout = "grid" }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const badges = getProductBadges(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(product.id);
      }
      setQuantity(1); // Reset quantity after adding
    }
  };

  // List layout - horizontal card
  if (layout === "list") {
    return (
      <Card className="overflow-hidden hover-lift group bg-card border-border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={`/product/${product.id}`} className="flex-shrink-0">
            <div className="w-full sm:w-48 h-48 overflow-hidden bg-muted relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            </div>
          </Link>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-display font-semibold text-lg text-foreground hover:text-primary transition-base">
                  {product.name}
                </h3>
              </Link>
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium text-foreground">{product.rating}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="space-y-1">
                <p className="text-xl font-display font-bold text-primary">
                  ₹{(product.price / 100).toFixed(2)}
                </p>
                {isLowStock && !isOutOfStock && (
                  <Badge variant="outline" className="text-xs border-warning text-warning">
                    Only {product.stock} left
                  </Badge>
                )}
              </div>

              <Button
                size="default"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.(product.id);
                }}
                disabled={isOutOfStock}
                className="gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Masonry layout - varied height cards
  if (layout === "masonry") {
    return (
      <Card className="overflow-hidden hover-lift group break-inside-avoid mb-4 bg-card border-border shadow-sm">
        <Link to={`/product/${product.id}`}>
          <div className="w-full overflow-hidden bg-muted relative" style={{ aspectRatio: Math.random() > 0.5 ? '3/4' : '4/3' }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-smooth group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
          </div>
        </Link>

        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <Link to={`/product/${product.id}`}>
              <h3 className="font-display font-semibold text-base text-foreground hover:text-primary transition-base line-clamp-2">
                {product.name}
              </h3>
            </Link>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-lg font-display font-bold text-primary">
                ₹{(product.price / 100).toFixed(2)}
              </p>
              {isLowStock && !isOutOfStock && (
                <Badge variant="outline" className="text-xs border-warning text-warning">
                  Only {product.stock} left
                </Badge>
              )}
            </div>

            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product.id);
              }}
              disabled={isOutOfStock}
              className="gap-2 w-full"
            >
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock ? "Out" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default grid layout - e-commerce style
  return (
    <div className="group relative bg-white rounded border border-border hover:shadow-lg transition-shadow duration-200">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />

          {/* Wishlist Button */}
          <WishlistButton
            productId={product.id}
            productName={product.name}
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md"
          />

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 text-xs font-bold rounded">
              {product.discount}% OFF
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 bg-success text-white px-2 py-0.5 rounded text-xs font-semibold">
              <Star className="h-3 w-3 fill-white" />
              {product.rating}
            </div>
            <span className="text-xs text-muted-foreground">(2.5k)</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            ₹{(product.price / 100).toFixed(0)}
          </span>
          {product.discount && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ₹{((product.price * (100 + product.discount)) / 10000).toFixed(0)}
              </span>
              <span className="text-xs text-success font-semibold">
                {product.discount}% off
              </span>
            </>
          )}
        </div>

        {/* Delivery/Preparation Info */}
        {product.isMadeToOrder ? (
          <p className="text-xs text-muted-foreground">
            ⏱️ Made to order • {product.preparationTime} days
          </p>
        ) : (
          <p className="text-xs text-success font-semibold">
            ✓ Free delivery
          </p>
        )}

        {/* Stock Warning */}
        {isLowStock && !isOutOfStock && (
          <p className="text-xs text-destructive font-semibold">
            Only {product.stock} left!
          </p>
        )}
      </div>
    </div>
  );
};
