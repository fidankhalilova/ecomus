// Product Card Component
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
import ProductDetailModal from "@/components/ProductDetailModal";

export default function ProductCard({ product }: { product: any }) {
  const {
    name,
    price,
    originalPrice,
    discount,
    image,
    colors = [],
    sizes = ["S", "M", "L", "XL"],
    hasTimer = false,
    isNew = false,
    onQuickAdd,
    onWishlist,
    onCompare,
  } = product;

  const [selectedSize, setSelectedSize] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 11,
    hours: 0,
    minutes: 41,
    seconds: 45,
  });

  useEffect(() => {
    if (!hasTimer) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasTimer]);

  const handleQuickAdd = () => {
    if (onQuickAdd) onQuickAdd(product, selectedSize);
  };

  const handleWishlist = () => {
    if (onWishlist) onWishlist(product);
  };

  const handleQuickView = () => {
    setIsModalOpen(true);
  };

  const handleCompare = () => {
    if (onCompare) onCompare(product);
  };

  return (
    <>
      <div className="group">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-3/4">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              {discount}
            </div>
          )}

          {isNew && (
            <div className="absolute top-3 left-3 bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
              NEW
            </div>
          )}

          {hasTimer && (
            <div className="absolute bottom-3 left-3 right-3 bg-white rounded-lg px-3 py-2 shadow-sm group-hover:opacity-0 transition-opacity">
              <div className="flex items-center justify-center gap-1 text-xs text-red-500 font-medium">
                <span>{timeLeft.days}d</span>
                <span>:</span>
                <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
                <span>:</span>
                <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
                <span>:</span>
                <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
              <button
                onClick={handleQuickAdd}
                className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition"
                aria-label="Add to cart"
              >
                <ShoppingBag size={20} />
              </button>
              <button
                onClick={handleWishlist}
                className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition"
                aria-label="Add to wishlist"
              >
                <Heart size={20} />
              </button>
              <button
                onClick={handleCompare}
                className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition"
                aria-label="Compare"
              >
                <Shuffle size={20} />
              </button>
              <button
                onClick={handleQuickView}
                className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition"
                aria-label="Quick view"
              >
                <Eye size={20} />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black/50 bg-opacity-90 px-4 py-4">
              <div className="flex items-center justify-center gap-3">
                {sizes.map((size: any) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-6 h-6 flex items-center justify-center text-sm font-medium rounded transition ${
                      selectedSize === size
                        ? "bg-white text-black"
                        : "bg-transparent text-white border border-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3
            onClick={handleQuickView}
            className="text-lg font-normal text-black mb-2 group-hover:underline cursor-pointer"
          >
            {name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            {originalPrice ? (
              <>
                <span className="text-base font-medium text-black">
                  ${price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base font-medium text-black">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          {colors.length > 0 && (
            <div className="flex items-center gap-2">
              {colors.map((color: any, index: any) => (
                <button
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-black transition relative"
                  style={{
                    backgroundColor:
                      color === "orange"
                        ? "#ff8c42"
                        : color === "black"
                        ? "#000"
                        : color === "beige"
                        ? "#d4a574"
                        : color === "pink"
                        ? "#ff69b4"
                        : color === "lightblue"
                        ? "#add8e6"
                        : color === "white"
                        ? "#fff"
                        : color === "purple"
                        ? "#9b59b6"
                        : color === "gray"
                        ? "#808080"
                        : color === "blue"
                        ? "#4169e1"
                        : color === "red"
                        ? "#ef4444"
                        : color === "green"
                        ? "#10b981"
                        : color,
                  }}
                  aria-label={`Select ${color} color`}
                >
                  {color === "white" && (
                    <div className="absolute inset-0 rounded-full border border-gray-200"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductDetailModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
