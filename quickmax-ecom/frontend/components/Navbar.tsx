import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useBackend } from "../lib/backend";

export default function Navbar() {
  const backend = useBackend();
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => backend.cart.get(),
    enabled: isSignedIn,
  });

  const cartItemCount = cart?.items?.length || 0;

  const NavLinks = () => (
    <>
      <Link to="/" className="text-gray-700 hover:text-red-500 transition-colors">
        Home
      </Link>
      <Link to="/products" className="text-gray-700 hover:text-red-500 transition-colors">
        Products
      </Link>
      <Link to="/orders" className="text-gray-700 hover:text-red-500 transition-colors">
        Orders
      </Link>
      <Link to="/admin" className="text-gray-700 hover:text-red-500 transition-colors">
        Admin
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-red-500">Quick Max</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <NavLinks />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="hover:text-red-500">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="hover:text-red-500">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isSignedIn ? (
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-red-500"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="hover:text-red-500">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
