import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import { WishlistItem } from "./types";

interface ListWishlistResponse {
  items: WishlistItem[];
}

// Lists all items in the user's wishlist
export const list = api<void, ListWishlistResponse>(
  { auth: true, expose: true, method: "GET", path: "/wishlist" },
  async () => {
    const { userID: user_id } = getAuthData()!;
    const items = await db.queryAll<WishlistItem>`
      SELECT 
        w.id,
        w.user_id,
        w.product_id,
        p.name as product_name,
        p.price as product_price,
        p.image_url as product_image_url,
        w.created_at
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ${user_id}
      ORDER BY w.created_at DESC
    `;

    return { items };
  }
);
