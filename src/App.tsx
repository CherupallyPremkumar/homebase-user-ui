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
        <LocationProvider>
          <AuthProvider>
            <CartProvider>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }
              >
                <Routes>
                  {/* Public routes */}
                  <Route path="/api-test" element={<ApiTest />} />

                  {/* Public browsing routes - no login required */}
                  <Route path="/" element={<Home />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/products" element={<CategoryPage />} />
                  <Route path="/product" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />

                  {/* Protected routes - require login */}
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/order/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                  <Route path="/payment-failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </CartProvider>
          </AuthProvider>
        </LocationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
