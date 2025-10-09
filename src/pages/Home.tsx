import { useState, useEffect } from "react";
import { ProductDto, CartItemDto } from "@/types/dto";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import QuickViewModal from "@/components/QuickViewModal";
import { PriceRangeFilter } from "@/components/PriceRangeFilter";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/useTenant";
import { Loader2, ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "rating";

const Home = () => {
  const { tenant } = useTenant();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<SortOption>("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [showInStock, setShowInStock] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);

  useEffect(() => {
    if (tenant) {
      loadProducts();
      loadCartCount();
    }
  }, [tenant]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts(tenant?.id);
      setAllProducts(data);
      setProducts(data);
      
      // Calculate price range
      if (data.length > 0) {
        const prices = data.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
      }
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

  const applyFiltersAndSorting = (
    category: string,
    sort: SortOption,
    search: string,
    minPrice: number,
    maxPrice: number,
    inStockOnly: boolean,
    onSaleOnly: boolean
  ) => {
    let filtered = [...allProducts];

    // Category filter
    if (category !== "All") {
      filtered = filtered.filter(p => p.category === category);
    }

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Sale filter
    if (onSaleOnly) {
      filtered = filtered.filter(p => p.onSale || (p.discount && p.discount > 0));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setProducts(filtered);
    setDisplayedProducts(filtered.slice(0, itemsToShow));
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setItemsToShow(12);
    applyFiltersAndSorting(category, sortOption, searchQuery, priceRange.min, priceRange.max, showInStock, showOnSale);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    applyFiltersAndSorting(selectedCategory, sort, searchQuery, priceRange.min, priceRange.max, showInStock, showOnSale);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setItemsToShow(12);
    applyFiltersAndSorting(selectedCategory, sortOption, value, priceRange.min, priceRange.max, showInStock, showOnSale);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    applyFiltersAndSorting(selectedCategory, sortOption, searchQuery, min, max, showInStock, showOnSale);
  };

  const handleStockFilterChange = (checked: boolean) => {
    setShowInStock(checked);
    applyFiltersAndSorting(selectedCategory, sortOption, searchQuery, priceRange.min, priceRange.max, checked, showOnSale);
  };

  const handleSaleFilterChange = (checked: boolean) => {
    setShowOnSale(checked);
    applyFiltersAndSorting(selectedCategory, sortOption, searchQuery, priceRange.min, priceRange.max, showInStock, checked);
  };

  const handleLoadMore = () => {
    const newItemsToShow = itemsToShow + 12;
    setItemsToShow(newItemsToShow);
    setDisplayedProducts(products.slice(0, newItemsToShow));
  };

  const categories = ["All", ...Array.from(new Set(allProducts.map(p => p.category)))];

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
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
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

  const handleQuickView = (product: ProductDto) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItems={cartItems}
        onRemoveCartItem={handleRemoveCartItem}
        onUpdateCartQuantity={handleUpdateCartQuantity}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Filter & Sort Section */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Mobile Filter Drawer */}
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your product search
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <PriceRangeFilter
                    min={priceRange.min}
                    max={priceRange.max}
                    currentMin={priceRange.min}
                    currentMax={priceRange.max}
                    onRangeChange={handlePriceRangeChange}
                  />
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Availability</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock-mobile"
                        checked={showInStock}
                        onCheckedChange={handleStockFilterChange}
                      />
                      <label
                        htmlFor="in-stock-mobile"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In Stock Only
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="on-sale-mobile"
                        checked={showOnSale}
                        onCheckedChange={handleSaleFilterChange}
                      />
                      <label
                        htmlFor="on-sale-mobile"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        On Sale
                      </label>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex-1">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Best Rating</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-start gap-6">
            {/* Sidebar Filters */}
            <div className="w-64 space-y-6 bg-card border border-border rounded-lg p-4 shadow-sm sticky top-20">
              <PriceRangeFilter
                min={priceRange.min}
                max={priceRange.max}
                currentMin={priceRange.min}
                currentMax={priceRange.max}
                onRangeChange={handlePriceRangeChange}
              />
              
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm">Availability</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={showInStock}
                    onCheckedChange={handleStockFilterChange}
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    In Stock Only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="on-sale"
                    checked={showOnSale}
                    onCheckedChange={handleSaleFilterChange}
                  />
                  <label
                    htmlFor="on-sale"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    On Sale
                  </label>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter(category)}
                    className="transition-base text-xs sm:text-sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Best Rating</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                    <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Display */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className={
                    tenant?.layout?.productLayout === "list"
                      ? "space-y-4"
                      : tenant?.layout?.productLayout === "masonry"
                      ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
                      : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5"
                  }>
                    {displayedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onQuickView={handleQuickView}
                        layout={tenant?.layout?.productLayout || "grid"}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {displayedProducts.length < products.length && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                      >
                        Load More Products
                        <span className="text-muted-foreground">
                          ({displayedProducts.length} of {products.length})
                        </span>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {displayedProducts.length === 0 && !loading && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No products match your filters</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                      setShowInStock(false);
                      setShowOnSale(false);
                      applyFiltersAndSorting("All", sortOption, "", priceRange.min, priceRange.max, false, false);
                    }}
                    className="mt-2"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Products Display */}
        <div className="lg:hidden">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className="transition-base text-xs sm:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products Display */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className={
                tenant?.layout?.productLayout === "list"
                  ? "space-y-4"
                  : tenant?.layout?.productLayout === "masonry"
                  ? "columns-1 sm:columns-2 gap-4 space-y-4"
                  : "grid grid-cols-2 gap-3 sm:gap-4"
              }>
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    layout={tenant?.layout?.productLayout || "grid"}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {displayedProducts.length < products.length && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    Load More Products
                    <span className="text-muted-foreground text-xs">
                      ({displayedProducts.length} of {products.length})
                    </span>
                  </Button>
                </div>
              )}
            </>
          )}

          {displayedProducts.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products match your filters</p>
            </div>
          )}
        </div>
      </main>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Home;
