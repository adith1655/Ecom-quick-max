import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface AddToWishlistRequest {
  product_id: number;
}

// Adds a product to the wishlist
export const add = api<AddToWishlistRequest, { success: boolean }>(
  { auth: true, expose: true, method: "POST", path: "/wishlist/add" },
  async ({ product_id }) => {
    const { userID: user_id } = getAuthData()!;
    try {
      await db.exec`
        INSERT INTO wishlists (user_id, product_id)
        VALUES (${user_id}, ${product_id})
      `;
      return { success: true };
    } catch (err) {
      throw APIError.alreadyExists("product already in wishlist");
    }
  }
);
