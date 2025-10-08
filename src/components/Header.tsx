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
import { useTenant } from "@/hooks/useTenant";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  cartItemCount?: number;
}

export const Header = ({ cartItemCount = 0 }: HeaderProps) => {
  const { tenant, buildRoute } = useTenant();
  const { user, logout } = useAuth();

  if (!tenant) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md shadow-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          <Link to={buildRoute("/")} className="flex items-center space-x-2 group">
            {tenant.theme.logoUrl ? (
              <img 
                src={tenant.theme.logoUrl} 
                alt={tenant.name} 
                className="h-8 sm:h-10 w-auto transition-smooth group-hover:scale-105"
              />
            ) : (
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-gradient">
                {tenant.name}
              </h1>
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to={buildRoute("/")} 
              className="text-sm font-semibold text-foreground hover:text-primary transition-smooth relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Shop
            </Link>
            <Link 
              to={buildRoute("/orders")} 
              className="text-sm font-semibold text-foreground hover:text-primary transition-smooth flex items-center gap-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              <Package className="h-4 w-4" />
              My Orders
            </Link>
          </nav>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link to={buildRoute("/cart")}>
              <Button variant="outline" size="icon" className="relative hover:shadow-md">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 gradient-primary text-primary-foreground shadow-md"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:shadow-md">
                    <User className="h-5 w-5" />
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
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
