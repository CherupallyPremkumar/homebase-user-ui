import { Link } from "react-router-dom";
import { ShoppingCart, Package, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useTenant } from "@/hooks/useTenant";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { MapPin, Loader2 } from "lucide-react";
import { CategoryNav } from "@/components/shared/CategoryNav";

interface HeaderProps {
  cartItems?: CartItemDto[];
  onRemoveCartItem?: (itemId: number) => void;
  onUpdateCartQuantity?: (itemId: number, quantity: number) => void;
}

export const Header = ({ cartItems = [], onRemoveCartItem, onUpdateCartQuantity }: HeaderProps) => {
  const { tenant, buildRoute } = useTenant();
  const { user, logout } = useAuth();
  const { city, pincode, loading, error, detectLocation } = useLocation();

  if (!tenant) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Main Header */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Logo */}
            <Link to={buildRoute("/")} className="flex items-center flex-shrink-0">
              {tenant.theme.logoUrl ? (
                <img
                  src={tenant.theme.logoUrl}
                  alt={tenant.name}
                  className="h-8 w-auto brightness-0 invert"
                />
              ) : (
                <h1 className="text-xl font-bold">
                  {tenant.name}
                </h1>
              )}
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
                onRemoveItem={onRemoveCartItem || (() => { })}
                onUpdateQuantity={onUpdateCartQuantity || (() => { })}
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
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={buildRoute("/profile")} className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={buildRoute("/orders")} className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-primary-foreground/10">
                  <Link to={buildRoute("/login")}>
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

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
