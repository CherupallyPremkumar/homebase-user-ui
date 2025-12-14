import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ProductDto, CartItemDto } from "@/types/dto";
import { productService } from "@/features/products/services/productService";
import { cartService } from "@/features/cart/services/cartService";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Header } from "@/components/shared/Header";
import { toast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/useTenant";
import { Loader2, ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CategoryPage from "@/features/products/pages/CategoryPage";

const Home = () => {
  const { tenant, buildRoute } = useTenant();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const category = searchParams.get("category");

  // If category is selected, show category page instead
  if (category) {
    return <CategoryPage />;
  }

  const heroSlides = [
    {
      title: "Black Friday Week",
      subtitle: "New deals up to 45% off",
      bgColor: "from-orange-500 to-orange-600",
    },
    {
      title: "Handmade Sarees",
      subtitle: "Authentic Pochampally silk sarees",
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      title: "Home Decor",
      subtitle: "Artisanal crafts for your home",
      bgColor: "from-green-500 to-green-600",
    },
  ];

  useEffect(() => {
    if (tenant) {
      loadProducts();
      loadCartCount();
    }
  }, [tenant]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts(tenant?.id);
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const cart = await cartService.getCart(tenant?.id);
      setCartItems(cart);
    } catch (error) {
      console.error("Failed to load cart", error);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await cartService.addToCart(productId, 1, tenant?.id);
      const updatedCart = await cartService.getCart(tenant?.id);
      setCartItems(updatedCart);
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

  const handleRemoveCartItem = async (itemId: number) => {
    try {
      await cartService.removeFromCart(itemId, tenant?.id);
      const updatedCart = await cartService.getCart(tenant?.id);
      setCartItems(updatedCart);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCartQuantity = async (itemId: number, quantity: number) => {
    try {
      if (quantity < 1) {
        await handleRemoveCartItem(itemId);
        return;
      }
      await cartService.updateCartItem(itemId, quantity, tenant?.id);
      const updatedCart = await cartService.getCart(tenant?.id);
      setCartItems(updatedCart);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, ProductDto[]>);

  const onSaleProducts = products.filter(p => p.discount && p.discount > 0);
  const madeToOrderProducts = products.filter(p => p.isMadeToOrder);

  const categories = [
    { name: "Sarees", icon: "🥻", color: "from-pink-50 to-purple-50" },
    { name: "Decor", icon: "🏺", color: "from-blue-50 to-cyan-50" },
    { name: "Handicrafts", icon: "🧺", color: "from-amber-50 to-orange-50" },
    { name: "Food", icon: "🍯", color: "from-green-50 to-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItems={cartItems}
        onRemoveCartItem={handleRemoveCartItem}
        onUpdateCartQuantity={handleUpdateCartQuantity}
      />

      {/* Hero Carousel */}
      <div className="relative bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative h-[280px] overflow-hidden rounded-b-lg">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
              >
                <div className={`h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-center text-white`}>
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-xl">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Category Tiles */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={buildRoute(`/?category=${category.name.toLowerCase()}`)}
                  className="flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl`}>
                    {category.icon}
                  </div>
                  <span className="text-xs font-medium text-center">{category.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Deals & Offers - Horizontal Scroll */}
          {onSaleProducts.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Best Value Deals on Fashion</h2>
                <Button variant="ghost" className="text-primary gap-1" asChild>
                  <Link to={buildRoute("/?sale=true")}>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {onSaleProducts.map((product) => (
                  <div key={product.id} className="flex-none w-48 snap-start">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Made to Order - Horizontal Scroll */}
          {madeToOrderProducts.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Handmade & Made to Order</h2>
                <Button variant="ghost" className="text-primary gap-1" asChild>
                  <Link to={buildRoute("/?madetoorder=true")}>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {madeToOrderProducts.map((product) => (
                  <div key={product.id} className="flex-none w-48 snap-start">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Category Sections - Horizontal Scroll */}
          {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
            <section key={category} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{category}</h2>
                <Button variant="ghost" className="text-primary gap-1" asChild>
                  <Link to={buildRoute(`/?category=${category.toLowerCase()}`)}>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {categoryProducts.map((product) => (
                  <div key={product.id} className="flex-none w-48 snap-start">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      )}
    </div>
  );
};

export default Home;
