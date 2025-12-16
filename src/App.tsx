import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load components
const Home = lazy(() => import("@/features/home/pages/Home"));
const ProductDetails = lazy(() => import("@/features/products/components/ProductDetails"));
const Cart = lazy(() => import("@/features/cart/components/CartPage"));
const CategoryPage = lazy(() => import("@/features/products/pages/CategoryPage"));
const Checkout = lazy(() => import("@/features/checkout/components/CheckoutPage"));
const OrderConfirmation = lazy(() => import("@/features/checkout/components/OrderConfirmation"));
const PaymentFailed = lazy(() => import("@/features/checkout/components/PaymentFailed"));
const MyOrders = lazy(() => import("@/features/orders/components/MyOrders"));
const Profile = lazy(() => import("@/features/profile/components/ProfilePage"));
const ApiTest = lazy(() => import("@/pages/ApiTest"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="min-h-screen bg-background flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading...</p>
                      </div>
                    </div>
                  }
                >
                  <Routes>
                    {/* Public browsing routes - no login required */}
                    <Route path="/" element={<Home />} />
                    <Route path="/product" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/products" element={<CategoryPage />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />

                    {/* Protected routes - require login */}
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/payment-failed" element={<PaymentFailed />} />
                    <Route
                      path="/my-orders"
                      element={
                        <ProtectedRoute>
                          <MyOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Public routes */}
                    <Route path="/api-test" element={<ApiTest />} />

                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
