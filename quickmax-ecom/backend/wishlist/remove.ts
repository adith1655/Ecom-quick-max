import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface RemoveFromWishlistRequest {
  product_id: number;
}

// Removes a product from the wishlist
export const remove = api<RemoveFromWishlistRequest, { success: boolean }>(
  { auth: true, expose: true, method: "DELETE", path: "/wishlist/remove" },
  async ({ product_id }) => {
    const { userID: user_id } = getAuthData()!;
    await db.exec`
      DELETE FROM wishlists 
      WHERE user_id = ${user_id} AND product_id = ${product_id}
    `;

    return { success: true };
  }
);
