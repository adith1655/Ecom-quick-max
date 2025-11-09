import { api, APIError } from "encore.dev/api";
import db from "../db";

interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  stock: number;
}

interface UpdateProductRequest {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  stock: number;
}

// Creates a new product
export const createProduct = api<CreateProductRequest, { id: number }>(
  { expose: true, method: "POST", path: "/admin/products" },
  async ({ name, description, price, image_url, category_id, stock }) => {
    const result = await db.queryRow<{ id: number }>`
      INSERT INTO products (name, description, price, image_url, category_id, stock)
      VALUES (${name}, ${description}, ${price}, ${image_url}, ${category_id}, ${stock})
      RETURNING id
    `;

    return { id: result!.id };
  }
);

// Updates an existing product
export const updateProduct = api<UpdateProductRequest, { success: boolean }>(
  { expose: true, method: "PUT", path: "/admin/products/:id" },
  async ({ id, name, description, price, image_url, category_id, stock }) => {
    await db.exec`
      UPDATE products
      SET name = ${name},
          description = ${description},
          price = ${price},
          image_url = ${image_url},
          category_id = ${category_id},
          stock = ${stock}
      WHERE id = ${id}
    `;

    return { success: true };
  }
);

// Deletes a product
export const deleteProduct = api<{ id: number }, { success: boolean }>(
  { expose: true, method: "DELETE", path: "/admin/products/:id" },
  async ({ id }) => {
    await db.exec`DELETE FROM products WHERE id = ${id}`;
    return { success: true };
  }
);
