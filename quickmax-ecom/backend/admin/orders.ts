import { api } from "encore.dev/api";
import db from "../db";
import type { Order } from "../order/types";

interface ListAllOrdersResponse {
  orders: Order[];
}

// Retrieves all orders across all users
export const listAllOrders = api<void, ListAllOrdersResponse>(
  { expose: true, method: "GET", path: "/admin/orders" },
  async () => {
    const orders = await db.queryAll<Order>`
      SELECT * FROM orders
      ORDER BY created_at DESC
    `;

    return { orders };
  }
);
