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

// Product Detail Modal Component
export default function ProductDetailModal({ product, isOpen, onClose }: any) {
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || "orange"
  );
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const images = product.images || [product.image];

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

  const getColorStyle = (color: string) => {
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
    };
    return colorMap[color] || color;
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
                  Selling fast! {product.stockInfo} people have this in their
                  carts.
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
              {product.description ||
                "Nunc arcu faucibus a et lorem eu a mauris adipiscing conubia ac aptent ligula facilisis a auctor habitant parturient a a.Interdum fermentum."}
            </p>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-black">
                  Color: <span className="capitalize">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors?.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition relative ${
                      selectedColor === color
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: getColorStyle(color) }}
                    aria-label={`Select ${color} color`}
                  >
                    {color === "white" && (
                      <div className="absolute inset-0 rounded-full border border-gray-200"></div>
                    )}
                    {selectedColor === color && (
                      <div className="absolute inset-0 rounded-full border-2 border-black"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-black">
                  Size: {selectedSize}
                </span>
                <button className="text-sm text-black underline hover:no-underline">
                  Find your size
                </button>
              </div>
              <div className="flex items-center gap-3">
                {product.sizes?.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-medium border rounded transition ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

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
              <button className="flex-1 h-14 bg-black text-white font-medium rounded hover:bg-gray-800 transition">
                Add to cart - ${(product.price * quantity).toFixed(2)}
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
