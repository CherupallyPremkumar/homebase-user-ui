import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ProductDto } from "@/types/dto";
// import { productService } from "../services/productService";
import { useProduct, useProducts } from "@/hooks/api/useProducts";
import { Header } from "@/components/shared/Header";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductBadge, getProductBadges } from "./ProductBadge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/useToast";
import { ShoppingCart, ArrowLeft, Loader2, Clock, Star, MapPin, BadgeCheck } from "lucide-react";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { AnimatedRating } from "@/components/shared/AnimatedRating";
import { ProductReviews } from "./ProductReviews";
import { SocialShare } from "@/components/shared/SocialShare";
import { ProductRecommendations } from "./ProductRecommendations";
import { RecentlyViewed, addToRecentlyViewed } from "./RecentlyViewed";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import QuickViewModal from "./QuickViewModal";

const ProductDetails = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("v");
  const navigate = useNavigate();
  const productId = id ? parseInt(id) : 0;

  /*
   * useProduct returns ProductViewDto { product, reviews }
   */
  const { data: productView, isLoading: loadingProduct, error } = useProduct(productId);
  const product = productView?.product;
  const reviews = productView?.reviews || [];

  const { data: allProducts = [] } = useProducts();

  const loading = loadingProduct; // For compatibility with existing code if needed

  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (productView?.product) {
      // document.title = `${product?.name} | Handmade`;
      addToRecentlyViewed(productView.product);
    }
  }, [productView]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
  };

  const handleQuickView = (product: ProductDto) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Product not found
          </h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ProductImageCarousel
              images={product.images && product.images.length > 0 ? product.images : [product.imageUrl]}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isMadeToOrder ? (
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-none px-3 py-1 text-sm">
                  Made to Order
                </Badge>
              ) : (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none px-3 py-1 text-sm">
                  Ready to Ship
                </Badge>
              )}
              {getProductBadges(product).map((badge, index) => (
                <ProductBadge key={index} type={badge} value={badge === 'sale' ? product.discount : undefined} className="text-sm px-3 py-1" />
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <AnimatedRating rating={product.rating} />
              <span className="text-sm text-muted-foreground">({product.rating} rating)</span>
            </div>

            {/* Seller Info - Amazon Style */}
            {product.seller && (
              <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sold by:</span>
                    <span className="font-semibold text-foreground">{product.seller.name}</span>
                    {product.seller.verified && (
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.seller.rating} ({product.seller.totalRatings.toLocaleString()} ratings)</span>
                  </div>
                  {product.seller.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{product.seller.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{(product.price / 100).toFixed(2)}
                </span>
                {product.discount && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{((product.price * (100 + product.discount)) / 10000).toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="text-sm">
                      {product.discount}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {product.isMadeToOrder && product.preparationTime && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900">Made just for you</h4>
                    <p className="text-sm text-amber-800">
                      Please allow approximately <span className="font-bold">{product.preparationTime} days</span> for preparation.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Quantity</span>
                <QuantitySelector value={quantity} max={product.stock} onChange={setQuantity} />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2 text-lg h-12"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock === 0 ? "Out of Stock" : product.isMadeToOrder ? "Request Order" : "Add to Cart"}
                </Button>
                <WishlistButton productId={product.id} productName={product.name} size="lg" className="w-full sm:w-auto h-12 px-4" showLabel />
                <SocialShare title={product.name} description={product.description} />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Separator className="my-12" />
        <section className="bg-white rounded-lg shadow-sm border border-border p-6 sm:p-8">
          <ProductReviews
            product={product}
            reviews={reviews}
          />
        </section>

        {/* Recommendations */}
        <Separator className="my-12" />
        <ProductRecommendations currentProduct={product} allProducts={allProducts} maxItems={4} onAddToCart={handleAddToCart} onQuickView={handleQuickView} />

        {/* Recently Viewed */}
        <Separator className="my-12" />
        <RecentlyViewed currentProductId={product.id} maxItems={4} onAddToCart={handleAddToCart} onQuickView={handleQuickView} />
      </main>

      {selectedProduct && (
        <QuickViewModal product={selectedProduct} open={quickViewOpen} onOpenChange={setQuickViewOpen} onAddToCart={handleAddToCart} />
      )}
    </div>
  );
};

export default ProductDetails;
