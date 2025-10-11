// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantRoutes } from "@/components/TenantRoutes";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import PaymentFailed from "./pages/PaymentFailed";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/404" />} />

            {/* Tenant-aware public login */}
            <Route
              path="/:tenant/login"
              element={
                <TenantProvider>
                  <TenantRoutes>
                    <Login />
                  </TenantRoutes>
                </TenantProvider>
              }
            />

            {/* Protected tenant-aware routes */}
            <Route
              path="/:tenant/*"
              element={
                <TenantProvider>
                  <TenantRoutes>
                    <ProtectedRoute>
                      <Routes>
                        <Route index element={<Home />} />
                        <Route
                          path="product/:id"
                          element={<ProductDetails />}
                        />
                        <Route path="cart" element={<Cart />} />
                        <Route path="checkout" element={<Checkout />} />
                        <Route
                          path="order/:orderId"
                          element={<OrderConfirmation />}
                        />
                        <Route
                          path="payment-failed"
                          element={<PaymentFailed />}
                        />
                        <Route path="orders" element={<MyOrders />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ProtectedRoute>
                  </TenantRoutes>
                </TenantProvider>
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
