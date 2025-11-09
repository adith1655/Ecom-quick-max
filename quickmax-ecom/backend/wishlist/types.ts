export interface WishlistItem {
  id: number;
  user_id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  product_image_url: string;
  created_at: Date;
}
