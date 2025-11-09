import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface AddReviewRequest {
  product_id: number;
  rating: number;
  comment?: string;
}

// Adds a review for a product
export const add = api<AddReviewRequest, { success: boolean }>(
  { auth: true, expose: true, method: "POST", path: "/reviews/add" },
  async ({ product_id, rating, comment }) => {
    const { userID: user_id } = getAuthData()!;
    if (rating < 1 || rating > 5) {
      throw APIError.invalidArgument("rating must be between 1 and 5");
    }

    try {
      await db.exec`
        INSERT INTO reviews (product_id, user_id, rating, comment)
        VALUES (${product_id}, ${user_id}, ${rating}, ${comment || null})
      `;
      return { success: true };
    } catch (err) {
      throw APIError.alreadyExists("you have already reviewed this product");
    }
  }
);
