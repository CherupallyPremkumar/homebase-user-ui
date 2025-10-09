import { Link } from "react-router-dom";
import { ProductDto } from "@/types/dto";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/hooks/useTenant";
import { ShoppingCart, Star, Eye, Package } from "lucide-react";
import { ProductLayoutType } from "@/types/tenant";
import { ProductBadge, getProductBadges } from "@/components/ProductBadge";
import { WishlistButton } from "@/components/WishlistButton";
import { QuantitySelector } from "@/components/QuantitySelector";
import { CheckoutPreview } from "@/components/CheckoutPreview";
import { ShippingBadge } from "@/components/ShippingCalculator";
import { useState } from "react";

interface ProductCardProps {
  product: ProductDto;
  onAddToCart?: (productId: number) => void;
  onQuickView?: (product: ProductDto) => void;
  layout?: ProductLayoutType;
}

export const ProductCard = ({ product, onAddToCart, onQuickView, layout = "grid" }: ProductCardProps) => {
  const { buildRoute } = useTenant();
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
          <Link to={buildRoute(`/product/${product.id}`)} className="flex-shrink-0">
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
              <Link to={buildRoute(`/product/${product.id}`)}>
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
        <Link to={buildRoute(`/product/${product.id}`)}>
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
            <Link to={buildRoute(`/product/${product.id}`)}>
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

  // Default grid layout - compact card
  return (
    <Card className="overflow-hidden hover-lift group h-full flex flex-col bg-card border-border shadow-sm">
      <Link to={buildRoute(`/product/${product.id}`)} className="relative">
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-smooth group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
          
          {/* Badges */}
          {badges.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {badges.map((badgeType, index) => (
                <ProductBadge
                  key={`${badgeType}-${index}`}
                  type={badgeType}
                  value={badgeType === "sale" ? product.discount : undefined}
                />
              ))}
            </div>
          )}
          
          {/* Quick View Button */}
          {onQuickView && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all gap-1 shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
            >
              <Eye className="h-3 w-3" />
              <span className="hidden sm:inline">Quick View</span>
            </Button>
          )}
          
          {/* Wishlist Button */}
          <WishlistButton
            productId={product.id}
            productName={product.name}
            size="sm"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-background/95"
          />
        </div>
      </Link>
      
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <div className="space-y-1 flex-1">
          <Link to={buildRoute(`/product/${product.id}`)}>
            <h3 className="font-display font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-base line-clamp-2">
              {product.name}
            </h3>
          </Link>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">{product.rating}</span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 hidden sm:block">
            {product.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-base sm:text-lg font-display font-bold text-primary">
              ₹{(product.price / 100).toFixed(2)}
            </p>
            {isLowStock && !isOutOfStock && (
              <Badge variant="outline" className="text-xs border-warning text-warning">
                Only {product.stock} left
              </Badge>
            )}
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <QuantitySelector
              value={quantity}
              max={product.stock}
              onChange={setQuantity}
              size="sm"
              className="w-full"
            />
          )}

          {/* Shipping Badge */}
          <ShippingBadge productPrice={product.price * quantity} />

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              {isOutOfStock ? "Out" : `Add ${quantity > 1 ? `(${quantity})` : ''}`}
            </Button>
            
            {!isOutOfStock && (
              <CheckoutPreview
                product={product}
                quantity={quantity}
                trigger={
                  <Button size="sm" variant="outline" className="gap-1">
                    <Package className="h-3 w-3" />
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
