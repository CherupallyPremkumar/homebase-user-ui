import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Package, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MiniCart } from "@/features/cart/components/MiniCart";
import { CartItemDto } from "@/types/dto";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useLocation as useLocationHook } from "@/hooks/useLocation";
import { MapPin, Loader2 } from "lucide-react";
import { CategoryNav } from "@/components/shared/CategoryNav";
import { LoginDialog } from "@/features/auth/components/LoginDialog";
import { useState, useEffect } from "react";

export const Header = () => {
  // @ts-ignore - googleLogin added to context but interface might lag
  const { user, logout, googleLogin } = useAuth();
  const { cartItems, removeItem, updateQuantity } = useCart();
  const { city, pincode, loading, error, detectLocation } = useLocationHook();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // Standard router hook for params:
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for login trigger (popup)
    if (searchParams.get("login") === "true" && !user) {
      setIsLoginOpen(true);
    }

    // Check for Google OAuth Callback
    const code = searchParams.get("code");
    // Ensure we only run this once and if we have the googleLogin function
    if (code && !user) {
      const handleCallback = async () => {
        try {
          if (googleLogin) {
            await googleLogin(code);
            // Clear params on success
            setSearchParams({}, { replace: true });
          }
        } catch (err) {
          console.error("Google Auth Failed", err);
          // Still clear params to avoid loop
          setSearchParams({}, { replace: true });
        }
      };
      if (googleLogin) {
        handleCallback();
      }
    }
  }, [searchParams, user, googleLogin]);

  const handleLoginSuccess = () => {
    // Check for returnUrl
    const returnUrl = searchParams.get("returnUrl");
    if (returnUrl) {
      navigate(decodeURIComponent(returnUrl), { replace: true });
    } else {
      setIsLoginOpen(false);
      // Clean up params if needed, or just leave it
      if (searchParams.get("login")) {
        setSearchParams({}, { replace: true });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Main Header */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <h1 className="text-xl font-bold">Homebase</h1>
            </Link>

            {/* Location Detection */}
            <div className="hidden md:flex items-center gap-1 text-white/90 hover:text-white cursor-pointer min-w-[140px]" onClick={() => detectLocation()}>
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-white/70">Delivering to</span>
                <span className="text-xs font-bold truncate max-w-[120px] flex items-center gap-1">
                  {loading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Detecting...
                    </>
                  ) : error ? (
                    "Set Location"
                  ) : city ? (
                    `${city} ${pincode ? pincode : ''}`
                  ) : (
                    "Update Location"
                  )}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pr-10 text-sm text-foreground bg-white rounded focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80">
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <MiniCart
                items={cartItems}
                onRemoveItem={removeItem}
                onUpdateQuantity={updateQuantity}
              />

              {/* Login/User */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-primary-foreground/10 gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        console.log("Navigating to profile...");
                        navigate("/profile");
                      }}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        console.log("Navigating to orders...");
                        navigate("/orders");
                      }}
                      className="cursor-pointer"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" className="text-white hover:bg-primary-foreground/10" onClick={() => setIsLoginOpen(true)}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginDialog
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Secondary Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-10">
            <CategoryNav />
          </div>
        </div>
      </div>
    </header>
  );
};
