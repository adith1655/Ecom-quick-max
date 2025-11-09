import { api } from "encore.dev/api";
import db from "../db";
import { ProductWithCategory } from "./types";

interface ListProductsRequest {
  category_id?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

interface ListProductsResponse {
  products: ProductWithCategory[];
  total: number;
}

// Lists all products with optional filtering by category and search term
export const list = api<ListProductsRequest, ListProductsResponse>(
  { expose: true, method: "GET", path: "/products" },
  async ({ category_id, search, limit = 20, offset = 0 }) => {
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (category_id) {
      query += ` AND p.category_id = $${paramCount}`;
      params.push(category_id);
      paramCount++;
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered`;
    const countRow = await db.rawQueryRow<{ total: string }>(countQuery, ...params);
    const total = parseInt(countRow?.total || "0");

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const products = await db.rawQueryAll<ProductWithCategory>(query, ...params);

    return { products, total };
  }
);
