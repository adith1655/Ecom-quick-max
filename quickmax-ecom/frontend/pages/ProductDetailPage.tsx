import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Heart, Star } from "lucide-react";
import backend from "~backend/client";
import { useBackend } from "../lib/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id!);
  const authBackend = useBackend();
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => backend.product.get({ id: productId }),
  });

  const { data: reviewData } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => backend.review.list({ product_id: productId }),
  });

  const addToCart = useMutation({
    mutationFn: () =>
      authBackend.cart.add({ product_id: productId, quantity: 1 }),
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
    mutationFn: () => authBackend.wishlist.add({ product_id: productId }),
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

  const handleSubmitReview = () => {
    if (!isSignedIn) {
      toast({ 
        variant: "destructive", 
        description: "Please sign in to submit a review" 
      });
      return;
    }
    submitReview.mutate();
  };

  const submitReview = useMutation({
    mutationFn: () =>
      authBackend.review.add({
        product_id: productId,
        rating,
        comment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast({ description: "Review submitted!" });
      setComment("");
      setRating(5);
    },
    onError: () => {
      toast({ variant: "destructive", description: "Failed to submit review" });
    },
  });

  if (!product) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(reviewData?.average_rating || 0)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({reviewData?.total_reviews || 0} reviews)
            </span>
          </div>
          <div className="text-4xl font-bold text-red-500 mb-6">
            ₹{product.price.toFixed(2)}
          </div>
          <div className="flex space-x-4">
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToWishlist}
              className="hover:bg-red-50 hover:border-red-500 hover:text-red-500"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        r <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4"
              rows={4}
            />
            <Button
              onClick={handleSubmitReview}
              className="bg-red-500 hover:bg-red-600"
            >
              Submit Review
            </Button>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {reviewData?.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{review.user_name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
            {reviewData?.reviews.length === 0 && (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
