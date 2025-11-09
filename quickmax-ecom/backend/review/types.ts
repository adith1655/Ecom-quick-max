export interface Review {
  id: number;
  product_id: number;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: Date;
  user_name?: string;
}
