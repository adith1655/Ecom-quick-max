import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import backend from "~backend/client";
import ProductCard from "../components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const categoryId = searchParams.get("category");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => backend.product.listCategories(),
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", categoryId, search],
    queryFn: () =>
      backend.product.list({
        category_id: categoryId ? parseInt(categoryId) : undefined,
        search: search || undefined,
        limit: 50,
      }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search });
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    if (categoryId) {
      setSearchParams({ category: categoryId.toString() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="bg-red-500 hover:bg-red-600">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={!categoryId ? "default" : "outline"}
          onClick={() => handleCategoryFilter(null)}
          className={!categoryId ? "bg-red-500 hover:bg-red-600" : ""}
        >
          All
        </Button>
        {categories?.categories.map((category) => (
          <Button
            key={category.id}
            variant={categoryId === category.id.toString() ? "default" : "outline"}
            onClick={() => handleCategoryFilter(category.id)}
            className={
              categoryId === category.id.toString()
                ? "bg-red-500 hover:bg-red-600"
                : ""
            }
          >
            {category.name}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : products?.products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
