export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_price: number;
  product_image_url: string;
}

export interface Cart {
  id: number;
  user_id: string;
  items: CartItem[];
  total: number;
}
