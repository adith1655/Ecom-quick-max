import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

// Clears all items from the cart
export const clear = api<void, { success: boolean }>(
  { auth: true, expose: true, method: "DELETE", path: "/cart/clear" },
  async () => {
    const { userID: user_id } = getAuthData()!;
    const cart = await db.queryRow<{ id: number }>`
      SELECT id FROM carts WHERE user_id = ${user_id}
    `;

    if (cart) {
      await db.exec`DELETE FROM cart_items WHERE cart_id = ${cart.id}`;
      await db.exec`UPDATE carts SET updated_at = NOW() WHERE id = ${cart.id}`;
    }

    return { success: true };
  }
);
