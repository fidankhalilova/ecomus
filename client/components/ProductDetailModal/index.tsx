// app/components/ProductDetailModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  Eye,
  Shuffle,
  ShoppingBag,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Define the product prop interface
interface ProductDetailModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountedPrice?: number;
    originalPrice?: number;
    description: string;
    colors?: Array<{ id: string; name: string; colorCode?: string }>;
    sizes?: Array<{ id: string; name: string }>;
    mainImage?: string;
    hoverImage?: string;
    stockInfo?: string;
    isBestSeller?: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
}

// Product Detail Modal Component
export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Initialize selections
  useEffect(() => {
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].id);
    }
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].id);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const images =
    product.mainImage && product.hoverImage
      ? [product.mainImage, product.hoverImage]
      : product.mainImage
        ? [product.mainImage]
        : [];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const getColorStyle = (colorName: string) => {
    const colorMap: any = {
      orange: "#ff8c42",
      black: "#000",
      beige: "#d4a574",
      pink: "#ff69b4",
      lightblue: "#add8e6",
      white: "#fff",
      purple: "#9b59b6",
      gray: "#808080",
      blue: "#4169e1",
      red: "#ef4444",
      green: "#10b981",
      navy: "#1e3a8a",
      teal: "#0d9488",
      yellow: "#fbbf24",
      brown: "#92400e",
    };
    return colorMap[colorName.toLowerCase()] || colorName;
  };

  // Find color name by ID
  const getColorNameById = (colorId: string) => {
    const color = product.colors?.find((c) => c.id === colorId);
    return color?.name || "";
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    // Validate selections
    if (product.sizes?.length && !selectedSize) {
      alert("Please select a size");
      return;
    }

    if (product.colors?.length && !selectedColor) {
      alert("Please select a color");
      return;
    }

    setAddingToCart(true);

    try {
      console.log("🛒 Adding to cart with:", {
        productId: product.id,
        sizeValue: selectedSize, // This is "L", "M", etc.
        colorValue: selectedColor, // This is "blue", "red", etc.
        quantity: quantity,
      });

      // Get the actual size name (not ID)
      const selectedSizeObj = product.sizes?.find((s) => s.id === selectedSize);
      const selectedColorObj = product.colors?.find(
        (c) => c.id === selectedColor,
      );

      const requestBody: any = {
        productId: product.id,
        quantity: quantity,
      };

      // Send the size/color NAME as string, not ID
      if (selectedSizeObj) {
        requestBody.sizeId = selectedSizeObj.name; // Send "L" not ObjectId
      }

      if (selectedColorObj) {
        requestBody.colorId = selectedColorObj.name; // Send "blue" not ObjectId
      }

      console.log("📤 Request body:", requestBody);

      const response = await fetch("http://localhost:3001/api/v1/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      // ... rest of your existing code
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to add item to cart. Please try again.",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl mx-4 relative">
        {/* Close button - positioned at top right of modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Left Side - Image Gallery */}
          <div className="w-full md:w-1/2 bg-gray-50 relative flex items-center justify-center">
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Product Details */}
          <div className="w-full md:w-1/2 p-8 overflow-y-auto">
            <h2 className="text-3xl font-normal text-black mb-4 pr-12">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {product.isBestSeller && (
                <span className="px-3 py-1 text-xs font-medium border border-black text-black rounded">
                  BEST SELLER
                </span>
              )}
              {product.stockInfo && (
                <span className="text-sm font-medium text-black">
                  Selling fast! {product.stockInfo}
                </span>
              )}
            </div>

            <div className="mb-6">
              <span className="text-3xl font-medium text-black">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="ml-3 text-xl text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-black">
                    Color:{" "}
                    <span className="capitalize">
                      {getColorNameById(selectedColor)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color: any) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-10 h-10 rounded-full border-2 transition relative ${
                        selectedColor === color.id
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor:
                          color.colorCode || getColorStyle(color.name),
                      }}
                      aria-label={`Select ${color.name} color`}
                    >
                      {color.name.toLowerCase() === "white" && (
                        <div className="absolute inset-0 rounded-full border border-gray-200"></div>
                      )}
                      {selectedColor === color.id && (
                        <div className="absolute inset-0 rounded-full border-2 border-black"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-black">
                    Size:{" "}
                    {product.sizes.find((s) => s.id === selectedSize)?.name ||
                      ""}
                  </span>
                  <button className="text-sm text-black underline hover:no-underline">
                    Find your size
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {product.sizes.map((size: any) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`w-12 h-12 flex items-center justify-center text-sm font-medium border rounded transition ${
                        selectedSize === size.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300 hover:border-black"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <span className="text-sm font-medium text-black block mb-3">
                Quantity
              </span>
              <div className="inline-flex items-center border border-gray-300 rounded">
                <button
                  onClick={decreaseQuantity}
                  className="w-12 h-12 flex items-center justify-center text-black hover:bg-gray-100 transition text-xl"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-16 h-12 flex items-center justify-center text-black font-medium border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="w-12 h-12 flex items-center justify-center text-black hover:bg-gray-100 transition text-xl"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 h-14 bg-black text-white font-medium rounded hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    {/* Calculate price with discount */}
                    Add to cart - $
                    {(
                      (product.discountedPrice || product.price) * quantity
                    ).toFixed(2)}
                    {/* Show discount badge if applicable */}
                    {product.discountedPrice &&
                      product.discountedPrice < product.price && (
                        <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                          Save $
                          {(
                            (product.price - product.discountedPrice) *
                            quantity
                          ).toFixed(2)}
                        </span>
                      )}
                  </>
                )}
              </button>
              <button className="w-14 h-14 border border-gray-300 rounded flex items-center justify-center hover:border-black transition">
                <Heart size={20} />
              </button>
              <button className="w-14 h-14 border border-gray-300 rounded flex items-center justify-center hover:border-black transition">
                <Shuffle size={20} />
              </button>
            </div>

            <button className="w-full h-14 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500 transition mb-4">
              Buy with <span className="font-bold">PayPal</span>
            </button>

            <button className="text-sm text-gray-600 underline hover:no-underline mb-6 block mx-auto">
              More payment options
            </button>

            <button className="text-sm text-black underline hover:no-underline flex items-center gap-1">
              View full details
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
