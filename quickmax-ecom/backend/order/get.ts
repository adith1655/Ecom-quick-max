import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import { Order, OrderItem } from "./types";

// Retrieves detailed information about a specific order
export const get = api<{ id: number }, Order>(
  { auth: true, expose: true, method: "GET", path: "/orders/:id" },
  async ({ id }) => {
    const { userID: user_id } = getAuthData()!;
    const order = await db.queryRow<Order>`
      SELECT * FROM orders WHERE id = ${id} AND user_id = ${user_id}
    `;

    if (!order) {
      throw APIError.notFound("order not found");
    }

    const items = await db.queryAll<OrderItem>`
      SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${id}
    `;

    return { ...order, items };
  }
);
