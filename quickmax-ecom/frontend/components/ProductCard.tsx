import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBackend } from "../lib/backend";
import { useUser } from "@clerk/clerk-react";
import type { ProductWithCategory } from "~backend/product/types";

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const backend = useBackend();
  const { isSignedIn } = useUser();

  const addToCart = useMutation({
    mutationFn: () =>
      backend.cart.add({ product_id: product.id, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ description: "Added to cart!" });
    },
    onError: (error) => {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to add to cart" });
    },
  });

  const addToWishlist = useMutation({
    mutationFn: () =>
      backend.wishlist.add({ product_id: product.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ description: "Added to wishlist!" });
    },
    onError: (error) => {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to add to wishlist" });
    },
  });

  const handleAddToCart = () => {
    if (!isSignedIn) {
      toast({ 
        variant: "destructive", 
        description: "Please sign in to add items to cart" 
      });
      return;
    }
    addToCart.mutate();
  };

  const handleAddToWishlist = () => {
    if (!isSignedIn) {
      toast({ 
        variant: "destructive", 
        description: "Please sign in to add items to wishlist" 
      });
      return;
    }
    addToWishlist.mutate();
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <Link to={`/products/${product.id}`}>
          <div className="relative overflow-hidden aspect-square">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="p-4">
          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg mb-1 hover:text-red-500 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-red-500">
              ₹{product.price.toFixed(2)}
            </span>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handleAddToWishlist}
                className="hover:bg-red-50 hover:border-red-500 hover:text-red-500"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={handleAddToCart}
                className="bg-red-500 hover:bg-red-600"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
