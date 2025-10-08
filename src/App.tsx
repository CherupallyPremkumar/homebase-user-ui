import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import { TenantRoutes } from "@/components/TenantRoutes";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import PaymentFailed from "./pages/PaymentFailed";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TenantProvider>
          <TenantRoutes>
            <Routes>
              {/* Tenant-aware routes - support both /route and /tenant/route */}
              <Route path="/" element={<Home />} />
              <Route path="/:tenant" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/:tenant/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/:tenant/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/:tenant/checkout" element={<Checkout />} />
              <Route path="/order/:orderId" element={<OrderConfirmation />} />
              <Route path="/:tenant/order/:orderId" element={<OrderConfirmation />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />
              <Route path="/:tenant/payment-failed" element={<PaymentFailed />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/:tenant/orders" element={<MyOrders />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TenantRoutes>
        </TenantProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
