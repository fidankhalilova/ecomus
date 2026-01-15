// src/components/SeasonCollection.tsx
"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { api, ProductCategory } from "@/http/api";
import Link from "next/link";

export default function SeasonCollection() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.getProductCategories();
      if (response.productCategoryList) {
        // Filter to only show active categories and take max 6
        const activeCategories = response.productCategoryList
          .filter((category) => !category.isDeleted)
          .slice(0, 6); // Show only first 6 categories

        setCategories(activeCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Default images for categories without images
  const getDefaultImage = (categoryName: string, index: number) => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?w=600&h=600&fit=crop",
    ];

    // Try to match category name with specific images
    const name = categoryName.toLowerCase();
    if (name.includes("women") || name.includes("female")) {
      return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop&crop=face";
    }
    if (name.includes("men") || name.includes("male")) {
      return "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&h=600&fit=crop";
    }
    if (name.includes("jewelry") || name.includes("accessor")) {
      return "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop";
    }
    if (name.includes("shoe") || name.includes("sneaker")) {
      return "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop";
    }
    if (name.includes("bag") || name.includes("handbag")) {
      return "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop";
    }
    if (name.includes("glass") || name.includes("sunglass")) {
      return "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop";
    }

    return (
      defaultImages[index] ||
      "https://via.placeholder.com/300x300?text=" +
        encodeURIComponent(categoryName)
    );
  };

  // Mock product count (you would normally get this from your API)
  // For now, we'll use a placeholder count
  const getProductCount = (categoryId: string) => {
    const counts: { [key: string]: number } = {
      "1": 23,
      "2": 9,
      "3": 31,
      "4": 21,
      "5": 5,
      "6": 14,
    };
    return counts[categoryId] || Math.floor(Math.random() * 50) + 1;
  };

  if (loading) {
    return (
      <section className="bg-[#faf8f2] py-16">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-5xl font-normal text-black">
              Season Collection
            </h2>
            <button className="flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all border-b border-black pb-1">
              View all categories
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-full bg-gray-200 animate-pulse"></div>
                <div className="text-center">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2 mx-auto"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#faf8f2] py-16">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-5xl font-normal text-black">Season Collection</h2>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all border-b border-black pb-1"
          >
            View all categories
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                No categories available. Create some categories in the admin
                panel.
              </p>
              <Link
                href="/admin/categories"
                className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Go to Categories
              </Link>
            </div>
          ) : (
            categories.map((category, index) => {
              const imageUrl =
                category.image || getDefaultImage(category.name, index);
              const productCount = getProductCount(category._id);

              return (
                <div
                  key={category._id}
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => {
                    // You can add navigation to category products here
                    console.log(`Navigate to category: ${category.name}`);
                  }}
                >
                  {/* Category Image */}
                  <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-full">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = getDefaultImage(
                          category.name,
                          index
                        );
                      }}
                    />
                  </div>

                  {/* Category Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-black mb-1 group-hover:text-red-500 duration-500">
                      {category.name}
                    </h3>
                    <p className="text-md text-gray-600">
                      {productCount} items
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
