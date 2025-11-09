import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { useBackend } from "../lib/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const backend = useBackend();
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => backend.wishlist.list(),
    enabled: isSignedIn,
  });

  const removeItem = useMutation({
    mutationFn: (product_id: number) =>
      backend.wishlist.remove({ product_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ description: "Removed from wishlist" });
    },
  });

  const addToCart = useMutation({
    mutationFn: (product_id: number) =>
      backend.cart.add({ product_id, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ description: "Added to cart!" });
    },
    onError: (error) => {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to add to cart" });
    },
  });

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save items you love for later!</p>
          <Link to="/products">
            <Button className="bg-red-500 hover:bg-red-600">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <Link to={`/products/${item.product_id}`}>
                <img
                  src={item.product_image_url}
                  alt={item.product_name}
                  className="w-full h-48 object-cover rounded mb-4 hover:opacity-90 transition-opacity"
                />
              </Link>
              <h3 className="font-semibold text-lg mb-2">{item.product_name}</h3>
              <p className="text-red-500 font-bold text-xl mb-4">
                ${item.product_price.toFixed(2)}
              </p>
              <div className="flex space-x-2">
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={() => addToCart.mutate(item.product_id)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeItem.mutate(item.product_id)}
                  className="hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
