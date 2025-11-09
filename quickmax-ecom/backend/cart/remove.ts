import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface RemoveFromCartRequest {
  product_id: number;
}

// Removes a product from the cart
export const remove = api<RemoveFromCartRequest, { success: boolean }>(
  { auth: true, expose: true, method: "DELETE", path: "/cart/remove" },
  async ({ product_id }) => {
    const { userID: user_id } = getAuthData()!;
    const cart = await db.queryRow<{ id: number }>`
      SELECT id FROM carts WHERE user_id = ${user_id}
    `;

    if (cart) {
      await db.exec`
        DELETE FROM cart_items 
        WHERE cart_id = ${cart.id} AND product_id = ${product_id}
      `;

      await db.exec`
        UPDATE carts SET updated_at = NOW() WHERE id = ${cart.id}
      `;
    }

    return { success: true };
  }
);
