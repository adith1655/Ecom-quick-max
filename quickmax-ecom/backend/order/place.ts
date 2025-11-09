import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface PlaceOrderRequest {
  delivery_name: string;
  delivery_address: string;
  delivery_phone: string;
}

interface PlaceOrderResponse {
  order_id: number;
  total: number;
}

// Places a new order from the user's cart
export const place = api<PlaceOrderRequest, PlaceOrderResponse>(
  { auth: true, expose: true, method: "POST", path: "/orders/place" },
  async ({ delivery_name, delivery_address, delivery_phone }) => {
    const { userID: user_id } = getAuthData()!;
    const cart = await db.queryRow<{ id: number }>`
      SELECT id FROM carts WHERE user_id = ${user_id}
    `;

    if (!cart) {
      throw APIError.invalidArgument("cart not found");
    }

    const items = await db.queryAll<{
      product_id: number;
      quantity: number;
      price: number;
    }>`
      SELECT ci.product_id, ci.quantity, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ${cart.id}
    `;

    if (items.length === 0) {
      throw APIError.invalidArgument("cart is empty");
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await db.queryRow<{ id: number }>`
      INSERT INTO orders (user_id, total, delivery_name, delivery_address, delivery_phone)
      VALUES (${user_id}, ${total}, ${delivery_name}, ${delivery_address}, ${delivery_phone})
      RETURNING id
    `;

    for (const item of items) {
      await db.exec`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${order!.id}, ${item.product_id}, ${item.quantity}, ${item.price})
      `;
    }

    await db.exec`DELETE FROM cart_items WHERE cart_id = ${cart.id}`;
    await db.exec`UPDATE carts SET updated_at = NOW() WHERE id = ${cart.id}`;

    return { order_id: order!.id, total };
  }
);
