// src/components/ProductList.tsx or your ProductList component
"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { api, DisplayProduct } from "@/http/api";

export default function ProductList() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products from API
      const fetchedProducts = await api.getDisplayProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Optional: Handle quick add to cart
  const handleQuickAdd = (product: DisplayProduct, selectedSize: string) => {
    console.log("Quick add to cart:", product.name, "Size:", selectedSize);
    // Implement your add to cart logic here
  };

  // Optional: Handle add to wishlist
  const handleWishlist = (product: DisplayProduct) => {
    console.log("Add to wishlist:", product.name);
    // Implement your wishlist logic here
  };

  // Optional: Handle compare
  const handleCompare = (product: DisplayProduct) => {
    console.log("Compare product:", product.name);
    // Implement your compare logic here
  };

  if (loading) {
    return (
      <div className="bg-white my-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Best Sellers</h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white my-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Best Sellers</h2>
          <div className="text-center text-red-600 py-12">
            <p>{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white my-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Best Sellers</h2>
          <div className="text-center text-gray-500 py-12">
            <p>No products available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white my-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">Best Sellers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                onQuickAdd: handleQuickAdd,
                onWishlist: handleWishlist,
                onCompare: handleCompare,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
