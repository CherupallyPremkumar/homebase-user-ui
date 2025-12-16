import { useState, useEffect } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import { ProductDto } from "@/types/dto";
import { productService } from "@/features/products/services/productService";
import { useProducts } from "@/hooks/api/useProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Header } from "@/components/shared/Header";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/useToast";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const CategoryPage = () => {
    const [searchParams] = useSearchParams();
    const { data: allProducts = [], isLoading } = useProducts();
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductDto[]>([]);
    // const [loading, setLoading] = useState(true); // Derived from query
    const { addToCart } = useCart();

    // Filter states
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [showMadeToOrder, setShowMadeToOrder] = useState(false);
    const [showInStock, setShowInStock] = useState(false);
    const [sortBy, setSortBy] = useState("popularity");

    // UI states
    const [showPriceFilter, setShowPriceFilter] = useState(true);
    const [showRatingFilter, setShowRatingFilter] = useState(true);
    const [showAvailabilityFilter, setShowAvailabilityFilter] = useState(true);

    const { categoryId } = useParams<{ categoryId: string }>();
    const category = categoryId || "all";

    useEffect(() => {
        if (!isLoading) {
            const categoryFiltered = category === "all"
                ? allProducts
                : allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());

            setProducts(categoryFiltered);
            // setFilteredProducts(categoryFiltered); // Will be handled by applyFilters

            if (categoryFiltered.length > 0) {
                const prices = categoryFiltered.map(p => p.price);
                setPriceRange([Math.min(...prices), Math.max(...prices)]);
            }
        }
    }, [category, allProducts, isLoading]);

    useEffect(() => {
        applyFilters();
    }, [products, priceRange, selectedRatings, showMadeToOrder, showInStock, sortBy]);

    // Removed loadProducts as it is replaced by useProducts and the effect above

    const applyFilters = () => {
        let filtered = [...products];
        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        if (selectedRatings.length > 0) {
            filtered = filtered.filter(p => selectedRatings.some(r => (p.rating || 0) >= r));
        }
        if (showMadeToOrder) filtered = filtered.filter(p => p.isMadeToOrder);
        if (showInStock) filtered = filtered.filter(p => p.stock > 0);
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price-low": return a.price - b.price;
                case "price-high": return b.price - a.price;
                case "newest": return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                default: return (b.rating || 0) - (a.rating || 0);
            }
        });
        setFilteredProducts(filtered);
    };

    const handleAddToCart = async (productId: number) => {
        await addToCart(productId, 1);
    };

    const toggleRating = (rating: number) => {
        setSelectedRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);
    };

    const clearAllFilters = () => {
        const prices = products.map(p => p.price);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
        setSelectedRatings([]);
        setShowMadeToOrder(false);
        setShowInStock(false);
    };

    const hasActiveFilters = selectedRatings.length > 0 || showMadeToOrder || showInStock;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-6 flex justify-center items-center h-[calc(100vh-100px)]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Left Sidebar - Filters */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b">
                                <h3 className="font-bold text-lg">Filters</h3>
                                {hasActiveFilters && (
                                    <Button variant="link" size="sm" onClick={clearAllFilters} className="text-primary">CLEAR ALL</Button>
                                )}
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <button onClick={() => setShowPriceFilter(!showPriceFilter)} className="flex items-center justify-between w-full font-semibold text-sm mb-3">
                                    PRICE {showPriceFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                                {showPriceFilter && (
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-20 px-2 py-1 text-sm border rounded" />
                                        <span className="text-sm">to</span>
                                        <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])} className="w-20 px-2 py-1 text-sm border rounded" />
                                    </div>
                                )}
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-6">
                                <button onClick={() => setShowRatingFilter(!showRatingFilter)} className="flex items-center justify-between w-full font-semibold text-sm mb-3">
                                    CUSTOMER RATINGS {showRatingFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                                {showRatingFilter && (
                                    <div className="space-y-2">
                                        {[4, 3, 2, 1].map((rating) => (
                                            <div key={rating} className="flex items-center space-x-2">
                                                <Checkbox id={`rating-${rating}`} checked={selectedRatings.includes(rating)} onCheckedChange={() => toggleRating(rating)} />
                                                <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer">{rating}★ & above</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Availability Filter */}
                            <div className="mb-6">
                                <button onClick={() => setShowAvailabilityFilter(!showAvailabilityFilter)} className="flex items-center justify-between w-full font-semibold text-sm mb-3">
                                    AVAILABILITY {showAvailabilityFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                                {showAvailabilityFilter && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="in-stock" checked={showInStock} onCheckedChange={(checked) => setShowInStock(checked as boolean)} />
                                            <label htmlFor="in-stock" className="text-sm cursor-pointer">In Stock Only</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="made-to-order" checked={showMadeToOrder} onCheckedChange={(checked) => setShowMadeToOrder(checked as boolean)} />
                                            <label htmlFor="made-to-order" className="text-sm cursor-pointer">Made to Order</label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Right Content - Products */}
                    <main className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    <Link to="/" className="hover:text-primary">Home</Link> &gt; {category.charAt(0).toUpperCase() + category.slice(1)}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium">Sort By</span>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-1 text-sm">
                                        <option value="popularity">Popularity</option>
                                        <option value="price-low">Price -- Low to High</option>
                                        <option value="price-high">Price -- High to Low</option>
                                        <option value="newest">Newest First</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                <span className="text-sm text-muted-foreground ml-2">
                                    (Showing {filteredProducts.length} of {products.length} products)
                                </span>
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <p className="text-lg text-muted-foreground mb-4">No products found matching your filters</p>
                                <Button onClick={clearAllFilters} variant="outline">Clear All Filters</Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
