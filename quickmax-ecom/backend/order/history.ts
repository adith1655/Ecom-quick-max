import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import { Order } from "./types";

interface OrderHistoryResponse {
  orders: Order[];
}

// Retrieves the user's order history
export const history = api<void, OrderHistoryResponse>(
  { auth: true, expose: true, method: "GET", path: "/orders/history" },
  async () => {
    const { userID: user_id } = getAuthData()!;
    const orders = await db.queryAll<Order>`
      SELECT * FROM orders
      WHERE user_id = ${user_id}
      ORDER BY created_at DESC
    `;

    return { orders };
  }
);
