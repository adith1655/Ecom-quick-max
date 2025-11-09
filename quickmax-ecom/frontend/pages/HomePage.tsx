import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import backend from "~backend/client";
import ProductCard from "../components/ProductCard";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => backend.product.listCategories(),
  });

  const { data: products } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => backend.product.list({ limit: 8 }),
  });

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Quick Max Delivery
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Fresh groceries delivered in minutes
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="group">
                Shop Now
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories?.categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full">
                    <img
                      src={category.image_url || ""}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold group-hover:text-red-500 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products">
              <Button variant="link" className="text-red-500">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
