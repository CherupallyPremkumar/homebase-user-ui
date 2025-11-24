import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductDto } from "@/types/dto";
import { productService } from "../services/productService";
import { cartService } from "@/features/cart/services/cartService";
import { Header } from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductBadge, getProductBadges } from "./ProductBadge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/useTenant";
import { ShoppingCart, ArrowLeft, Loader2, Package, Clock } from "lucide-react";
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenant, buildRoute } = useTenant();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    if (id && tenant) {
      loadProduct(parseInt(id));
      loadAllProducts();
      loadCartCount();
    }
  }, [id, tenant]);

  const loadProduct = async (productId: number) => {
    try {
      const data = await productService.getProductById(productId, tenant?.id);
      setProduct(data);

      // Add to recently viewed
      addToRecentlyViewed(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAllProducts = async () => {
    try {
      const data = await productService.getAllProducts(tenant?.id);
      setAllProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  const loadCartCount = async () => {
    try {
      const cart = await cartService.getCart(tenant?.id);
      setCartItemCount(cart.length);
    } catch (error) {
      console.error("Failed to load cart count", error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await cartService.addToCart(product.id, 1, tenant?.id);
      setCartItemCount((prev) => prev + 1);
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

  const handleQuickView = (product: ProductDto) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={[]} />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={[]} />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={[]} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(buildRoute("/"))}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images with Zoom */}
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
              <div className="flex items-center gap-1">
                <AnimatedRating rating={product.rating} />
                <span className="text-sm text-muted-foreground ml-1">
                  ({product.rating} rating)
                </span>
              </div>
              <Separator orientation="vertical" className="h-5" />
              <Button variant="link" className="p-0 h-auto text-primary">
                Read Reviews
              </Button>
            </div>

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
                      This item is handmade to order. Please allow approximately <span className="font-bold">{product.preparationTime} days</span> for preparation before shipping.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Quantity</span>
                <QuantitySelector
                  value={quantity}
                  max={product.stock}
                  onChange={setQuantity}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2 text-lg h-12"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock === 0
                    ? "Out of Stock"
                    : product.isMadeToOrder
                      ? "Request Order"
                      : "Add to Cart"}
                </Button>
                <WishlistButton
                  productId={product.id}
                  productName={product.name}
                  size="lg"
                  className="w-full sm:w-auto h-12 px-4"
                  showLabel
                />
                <SocialShare
                  title={product.name}
                  description={product.description}
                />
              </div>
            </div>

            <div className="bg-muted rounded-lg p-6 space-y-2">
              <h3 className="font-display font-semibold text-foreground">
                Product Details
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Free shipping on orders over ₹999</li>
                <li>• Easy returns within 30 days</li>
                <li>• Handcrafted with care</li>
                <li>• Sustainable materials</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Separator className="my-12" />
        <div className="max-w-4xl mx-auto">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* Recommendations Section */}
        <Separator className="my-12" />
        <ProductRecommendations
          currentProduct={product}
          allProducts={allProducts}
          maxItems={4}
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
        />

        {/* Recently Viewed Section */}
        <Separator className="my-12" />
        <RecentlyViewed
          currentProductId={product.id}
          maxItems={4}
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
        />
      </main>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default ProductDetails;
