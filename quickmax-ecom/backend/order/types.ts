export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
  product_image_url?: string;
}

export interface Order {
  id: number;
  user_id: string;
  total: number;
  status: string;
  delivery_address: string;
  delivery_phone: string;
  delivery_name: string;
  created_at: Date;
  items?: OrderItem[];
}
