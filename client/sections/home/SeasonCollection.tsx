import React from "react";
import { ArrowRight } from "lucide-react";

export default function SeasonCollection() {
  const categories = [
    {
      id: 1,
      name: "Women's",
      items: 23,
      image:
        "https://themesflat.co/html/ecomus/images/collections/collection-circle-1.jpg",
    },
    {
      id: 2,
      name: "Men's",
      items: 9,
      image:
        "https://themesflat.co/html/ecomus/images/collections/collection-circle-2.jpg",
    },
    {
      id: 3,
      name: "Jewelry",
      items: 31,
      image:
        "https://themesflat.co/html/ecomus/images/collections/collection-circle-3.jpg",
    },
    {
      id: 4,
      name: "Sneakers",
      items: 21,
      image:
        "https://themesflat.co/html/ecomus/images/collections/collection-circle-4.jpg",
    },
    {
      id: 5,
      name: "Bags",
      items: 5,
      image:
        "https://themesflat.co/html/ecomus/images/collections/collection-circle-5.jpg",
    },
    {
      id: 6,
      name: "Glasses",
      items: 14,
      image:
        "https://themesflat.co/html/ecomus/images/collections/collection-circle-6.jpg",
    },
  ];

  return (
    <section className="bg-[#faf8f2] py-16">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-5xl font-normal text-black">Season Collection</h2>
          <button className="flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all border-b border-black pb-1">
            View all categories
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Category Image */}
              <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-full">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Category Info */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-black mb-1 group-hover:text-red-500 duration-500">
                  {category.name}
                </h3>
                <p className="text-md text-gray-600">{category.items} items</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
