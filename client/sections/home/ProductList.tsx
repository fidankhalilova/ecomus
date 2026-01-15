import ProductCard from "@/components/ProductCard";

export default function ProductList() {
  const sampleProducts = [
    {
      id: 1,
      name: "Ribbed Tank Top",
      price: 16.95,
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop",
      colors: ["orange", "black", "white"],
      sizes: ["S", "M", "XL"],
    },
    {
      id: 2,
      name: "Ribbed modal T-shirt",
      price: 18.95,
      originalPrice: 28.95,
      discount: "-33%",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
      colors: ["beige", "pink", "lightblue"],
      hasTimer: true,
      sizes: ["L", "XL"],
    },
    {
      id: 3,
      name: "Oversized Printed T-shirt",
      price: 10.0,
      image:
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop",
      isNew: true,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 4,
      name: "Oversized Printed T-shirt",
      price: 16.95,
      image:
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop",
      colors: ["white", "purple", "black"],
      sizes: ["S", "XL"],
    },
  ];
  return (
    <div className="bg-white my-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">Best Sellers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
