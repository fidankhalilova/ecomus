"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag, Trash2, Plus, Minus, Tag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const {
    cart,
    loading,
    error,
    updateQuantity,
    removeItem,
    clearCart,
    getItemTotal,
    getItemUnitPrice,
    hasDiscount,
    getDiscountPercentage,
    calculateCartTotal,
  } = useCart();

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setIsUpdating(itemId);
    await updateQuantity(itemId, newQuantity);
    setIsUpdating(null);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  // Calculate total savings from discounts
  const calculateTotalSavings = () => {
    return cart.items.reduce((total, item) => {
      if (hasDiscount(item.product)) {
        const originalTotal = item.product.price * item.quantity;
        const discountedTotal = getItemTotal(item);
        return total + (originalTotal - discountedTotal);
      }
      return total;
    }, 0);
  };

  const totalSavings = calculateTotalSavings();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-gray-800" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Shopping Cart
                </h3>
                {cart.totalItems > 0 && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100 transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : cart.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Your cart is empty
                </h4>
                <p className="text-gray-500 mb-6">
                  Add some products to your cart
                </p>
                <button
                  onClick={onClose}
                  className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="max-h-100 overflow-y-auto pr-2">
                  {cart.items.map((item) => {
                    const itemTotal = getItemTotal(item);
                    const unitPrice = getItemUnitPrice(item);
                    const itemHasDiscount = hasDiscount(item.product);
                    const discountPercent = getDiscountPercentage(item.product);

                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
                      >
                        {/* Product Image with Discount Badge */}
                        <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0">
                          {item.product?.mainImage ? (
                            <Image
                              src={item.product.mainImage}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <ShoppingBag
                                size={24}
                                className="text-gray-400"
                              />
                            </div>
                          )}

                          {/* Discount Badge */}
                          {itemHasDiscount && (
                            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-br">
                              -{discountPercent}%
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 line-clamp-1">
                                {item.product?.name}
                              </h4>

                              {/* Size and Color */}
                              <div className="flex items-center gap-2 mt-1">
                                {item.size && (
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                    Size: {item.size.name}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                    Color: {item.color.name}
                                  </span>
                                )}
                              </div>

                              {/* Price Display */}
                              <div className="mt-2">
                                {itemHasDiscount ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-gray-900">
                                      ${itemTotal.toFixed(2)}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm text-gray-400 line-through">
                                        $
                                        {(
                                          item.product.price * item.quantity
                                        ).toFixed(2)}
                                      </span>
                                      <span className="text-xs text-green-600 font-medium">
                                        Save $
                                        {(
                                          (item.product.price - unitPrice) *
                                          item.quantity
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-lg font-semibold text-gray-900">
                                    ${itemTotal.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-gray-400 hover:text-red-500 transition ml-2"
                              disabled={isUpdating === item._id}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item._id,
                                    Math.max(1, item.quantity - 1),
                                  )
                                }
                                className="px-3 py-1 hover:bg-gray-100 transition"
                                disabled={isUpdating === item._id}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium min-w-10 text-center">
                                {isUpdating === item._id
                                  ? "..."
                                  : item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item._id,
                                    item.quantity + 1,
                                  )
                                }
                                className="px-3 py-1 hover:bg-gray-100 transition"
                                disabled={isUpdating === item._id}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Unit Price */}
                            <div className="text-right">
                              {itemHasDiscount ? (
                                <div className="text-sm">
                                  <span className="text-gray-900 font-medium">
                                    ${unitPrice.toFixed(2)}
                                  </span>
                                  <span className="text-gray-400 line-through ml-1">
                                    ${item.product.price.toFixed(2)}
                                  </span>
                                  <span className="text-red-500 text-xs ml-1">
                                    (-{discountPercent}%)
                                  </span>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  ${item.product.price.toFixed(2)} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cart Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900">
                      ${cart.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Total Savings */}
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-green-600" />
                        <span className="text-green-600">Total Savings</span>
                      </div>
                      <span className="text-green-600 font-medium">
                        -${totalSavings.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Shipping</span>
                    <span className="text-gray-900">
                      Calculated at checkout
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${cart.totalPrice.toFixed(2)}
                      </div>
                      {totalSavings > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          You saved ${totalSavings.toFixed(2)}!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Link href="/checkout">
                      <button
                        onClick={onClose}
                        className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition font-medium"
                      >
                        Proceed to Checkout
                      </button>
                    </Link>
                    <Link href="/cart">
                      <button
                        onClick={onClose}
                        className="w-full border border-gray-800 text-gray-800 py-3 rounded-md hover:bg-gray-50 transition font-medium"
                      >
                        View Full Cart
                      </button>
                    </Link>
                    <button
                      onClick={handleClearCart}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 py-2 rounded-md transition text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} />
                      Clear Cart
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
