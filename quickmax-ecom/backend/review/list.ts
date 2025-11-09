import { api } from "encore.dev/api";
import db from "../db";
import { Review } from "./types";

interface ListReviewsResponse {
  reviews: Review[];
  average_rating: number;
  total_reviews: number;
}

// Retrieves all reviews for a product
export const list = api<{ product_id: number }, ListReviewsResponse>(
  { expose: true, method: "GET", path: "/reviews/:product_id" },
  async ({ product_id }) => {
    const reviews = await db.queryAll<Review>`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ${product_id}
      ORDER BY r.created_at DESC
    `;

    const stats = await db.queryRow<{ avg: string; count: string }>`
      SELECT AVG(rating) as avg, COUNT(*) as count
      FROM reviews
      WHERE product_id = ${product_id}
    `;

    return {
      reviews,
      average_rating: parseFloat(stats?.avg || "0"),
      total_reviews: parseInt(stats?.count || "0"),
    };
  }
);
