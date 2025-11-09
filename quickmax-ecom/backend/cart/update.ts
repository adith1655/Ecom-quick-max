import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface UpdateCartItemRequest {
  product_id: number;
  quantity: number;
}

// Updates the quantity of a cart item
export const updateQuantity = api<UpdateCartItemRequest, { success: boolean }>(
  { auth: true, expose: true, method: "PUT", path: "/cart/update" },
  async ({ product_id, quantity }) => {
    const { userID: user_id } = getAuthData()!;
    const cart = await db.queryRow<{ id: number }>`
      SELECT id FROM carts WHERE user_id = ${user_id}
    `;

    if (cart) {
      if (quantity <= 0) {
        await db.exec`
          DELETE FROM cart_items 
          WHERE cart_id = ${cart.id} AND product_id = ${product_id}
        `;
      } else {
        await db.exec`
          UPDATE cart_items 
          SET quantity = ${quantity}
          WHERE cart_id = ${cart.id} AND product_id = ${product_id}
        `;
      }

      await db.exec`
        UPDATE carts SET updated_at = NOW() WHERE id = ${cart.id}
      `;
    }

    return { success: true };
  }
);
