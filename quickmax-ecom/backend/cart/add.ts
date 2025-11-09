import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

// Adds a product to the cart or updates quantity if already present
export const add = api<AddToCartRequest, { success: boolean }>(
  { auth: true, expose: true, method: "POST", path: "/cart/add" },
  async ({ product_id, quantity }) => {
    const auth = getAuthData();
    if (!auth) {
      throw new Error("Not authenticated");
    }
    const user_id = auth.userID;

    let cart = await db.queryRow<{ id: number }>`
      SELECT id FROM carts WHERE user_id = ${user_id}
    `;

    if (!cart) {
      cart = await db.queryRow<{ id: number }>`
        INSERT INTO carts (user_id) VALUES (${user_id}) RETURNING id
      `;
    }

    const existing = await db.queryRow<{ id: number; quantity: number }>`
      SELECT id, quantity FROM cart_items 
      WHERE cart_id = ${cart.id} AND product_id = ${product_id}
    `;

    if (existing) {
      await db.exec`
        UPDATE cart_items 
        SET quantity = ${existing.quantity + quantity}
        WHERE id = ${existing.id}
      `;
    } else {
      await db.exec`
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES (${cart.id}, ${product_id}, ${quantity})
      `;
    }

    await db.exec`
      UPDATE carts SET updated_at = NOW() WHERE id = ${cart.id}
    `;

    return { success: true };
  }
);
