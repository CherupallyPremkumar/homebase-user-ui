import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { TenantRoutes } from "@/components/TenantRoutes";
import { LocationProvider } from "@/contexts/LocationContext";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import Home from "@/features/home/pages/Home";
import ProductDetails from "@/features/products/components/ProductDetails";
import Cart from "@/features/cart/components/CartPage";
import Checkout from "@/features/checkout/components/CheckoutPage";
import OrderConfirmation from "@/features/checkout/components/OrderConfirmation";
import PaymentFailed from "@/features/checkout/components/PaymentFailed";
import MyOrders from "@/features/orders/components/MyOrders";
import Profile from "@/features/profile/components/ProfilePage";
import Login from "@/features/auth/components/LoginForm";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TenantProvider>
          <LocationProvider>
            <AuthProvider>
              <TenantRoutes>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />


                  {/* Public browsing routes - no login required */}
                  <Route path="/" element={<Home />} />

                  <Route path="/product/:id" element={<ProductDetails />} />

                  <Route path="/cart" element={<Cart />} />


                  {/* Protected routes - require login */}
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

                  <Route path="/order/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />

                  <Route path="/payment-failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />

                  <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TenantRoutes>
            </AuthProvider>
          </LocationProvider>
        </TenantProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
