import { api } from "encore.dev/api";
import db from "../db";
import { Category } from "./types";

interface ListCategoriesResponse {
  categories: Category[];
}

// Lists all product categories
export const listCategories = api<void, ListCategoriesResponse>(
  { expose: true, method: "GET", path: "/categories" },
  async () => {
    const categories = await db.queryAll<Category>`
      SELECT * FROM categories ORDER BY name
    `;

    return { categories };
  }
);
