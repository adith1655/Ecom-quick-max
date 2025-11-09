import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import { Cart, CartItem } from "./types";

// Retrieves the current user's shopping cart
export const get = api<void, Cart>(
  { auth: true, expose: true, method: "GET", path: "/cart" },
  async () => {
    const { userID: user_id } = getAuthData()!;
    let cart = await db.queryRow<{ id: number }>`
      SELECT id FROM carts WHERE user_id = ${user_id}
    `;

    if (!cart) {
      const result = await db.queryRow<{ id: number }>`
        INSERT INTO carts (user_id) VALUES (${user_id}) RETURNING id
      `;
      cart = result!;
    }

    const items = await db.queryAll<CartItem>`
      SELECT 
        ci.id,
        ci.cart_id,
        ci.product_id,
        ci.quantity,
        p.name as product_name,
        p.price as product_price,
        p.image_url as product_image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ${cart.id}
    `;

    const total = items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

    return {
      id: cart.id,
      user_id,
      items,
      total,
    };
  }
);
