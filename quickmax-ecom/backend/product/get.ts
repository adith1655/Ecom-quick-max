import { api, APIError } from "encore.dev/api";
import db from "../db";
import { ProductWithCategory } from "./types";

// Retrieves a single product by ID
export const get = api<{ id: number }, ProductWithCategory>(
  { expose: true, method: "GET", path: "/products/:id" },
  async ({ id }) => {
    const product = await db.queryRow<ProductWithCategory>`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${id}
    `;

    if (!product) {
      throw APIError.notFound("product not found");
    }

    return product;
  }
);
