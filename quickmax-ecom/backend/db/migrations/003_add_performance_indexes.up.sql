-- Add indexes on frequently queried columns for better performance

-- Products table: index on category_id for filtering by category
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Orders table: index on user_id for fetching user orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Cart items table: index on cart_id for fetching cart contents
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- Reviews table: index on product_id for fetching product reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- Carts table: index on user_id for finding user's cart
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);

-- Wishlists table: index on user_id for fetching user wishlists
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);

-- Order items table: index on order_id for fetching order details
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
