export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number | null;
  stock: number;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: Date;
}

export interface ProductWithCategory extends Product {
  category_name: string | null;
}
