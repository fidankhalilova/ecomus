"use client";

import { useState, useEffect, useCallback } from "react";

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  mainImage: string;
  category: {
    _id: string;
    name: string;
  };
}

interface CartItem {
  _id: string;
  product: CartProduct;
  quantity: number;
  size: {
    _id: string;
    name: string;
  }; // Changed from ObjectId to string
  color: {
    _id: string;
    name: string;
  }; // Changed from ObjectId to string
}

interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartUpdated, setCartUpdated] = useState(0); // For forcing re-renders

  // Helper function to get the display price (discounted or regular)
  const getDisplayPrice = (product: CartProduct): number => {
    // Use discountedPrice if available and valid
    if (product.discountedPrice !== undefined && product.discountedPrice > 0) {
      return product.discountedPrice;
    }
    // Use price if discountedPrice is not available
    return product.price;
  };

  // Helper function to check if product has discount
  const hasDiscount = (product: CartProduct): boolean => {
    return (
      product.discountedPrice !== undefined &&
      product.discountedPrice > 0 &&
      product.discountedPrice < product.price
    );
  };

  // Helper function to calculate discount percentage
  const getDiscountPercentage = (product: CartProduct): number => {
    if (!hasDiscount(product)) return 0;

    const discount = product.price - (product.discountedPrice || product.price);
    return Math.round((discount / product.price) * 100);
  };

  // Calculate item total with discount
  const getItemTotal = (item: CartItem): number => {
    const itemPrice = getDisplayPrice(item.product);
    return itemPrice * item.quantity;
  };

  // Calculate cart total with discounts
  const calculateCartTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      return total + getItemTotal(item);
    }, 0);
  };

  // Get unit price for item with discount
  const getItemUnitPrice = (item: CartItem): number => {
    return getDisplayPrice(item.product);
  };

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    console.log("🛒 Fetching cart, token exists:", !!token);

    if (!token) {
      console.log("No token, setting empty cart");
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("📤 Sending cart request...");
      const response = await fetch("http://localhost:3001/api/v1/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("📥 Response status:", response.status);

      if (response.status === 401) {
        console.log("Token expired, clearing auth");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Cart data received:", data);

      if (data.success && data.cart) {
        console.log(`📦 Cart has ${data.cart.items?.length || 0} items`);

        // Process cart items to ensure they have proper structure
        const processedItems = (data.cart.items || []).map((item: any) => {
          // Ensure product has required fields
          const product = item.product || {};
          const processedProduct: CartProduct = {
            _id: product._id || item.product?._id || "",
            name: product.name || "Product",
            price: product.price || 0,
            discountedPrice: product.discountedPrice,
            originalPrice: product.originalPrice,
            mainImage: product.mainImage || "",
            category: product.category || { _id: "", name: "" },
          };

          return {
            _id: item._id || "",
            product: processedProduct,
            quantity: item.quantity || 1,
            size: item.size || undefined,
            color: item.color || undefined,
          };
        });

        // Calculate total with discounts
        const calculatedTotal = calculateCartTotal(processedItems);
        const calculatedItems = processedItems.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0,
        );

        console.log("💰 Calculated total with discounts:", calculatedTotal);

        setCart({
          items: processedItems,
          totalItems: calculatedItems,
          totalPrice: calculatedTotal,
        });

        // Force re-render if needed
        setCartUpdated((prev) => prev + 1);
      } else {
        console.log("⚠️ No cart data or success false");
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      }
    } catch (err) {
      console.error("💥 Error fetching cart:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    size?: string,
    color?: string,
  ) => {
    const token = localStorage.getItem("token");
    console.log("➕ Adding to cart:", { productId, quantity, size, color });

    if (!token) {
      alert("Please login to add items to cart");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/v1/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity,
          sizeId: size || null, // Changed to size (not sizeId)
          colorId: color || null, // Changed to color (not colorId)
        }),
      });

      console.log("📥 Add to cart response status:", response.status);

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userLoggedOut"));
        return null;
      }

      const data = await response.json();
      console.log("📊 Add to cart response:", data);

      if (data.success) {
        console.log("✅ Item added successfully");
        await fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
        return data;
      } else {
        throw new Error(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      setError(err instanceof Error ? err.message : "Failed to add to cart");
      alert("Failed to add item to cart. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to update cart");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/v1/cart/item/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ quantity }),
        },
      );

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userLoggedOut"));
        return;
      }

      const data = await response.json();

      if (data.success) {
        await fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        throw new Error(data.message || "Failed to update cart");
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      setError(err instanceof Error ? err.message : "Failed to update cart");
      alert("Failed to update cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to remove items");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/v1/cart/item/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userLoggedOut"));
        return;
      }

      const data = await response.json();

      if (data.success) {
        await fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        throw new Error(data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError(err instanceof Error ? err.message : "Failed to remove item");
      alert("Failed to remove item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to clear cart");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/v1/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userLoggedOut"));
        return;
      }

      const data = await response.json();

      if (data.success) {
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        throw new Error(data.message || "Failed to clear cart");
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(err instanceof Error ? err.message : "Failed to clear cart");
      alert("Failed to clear cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart on mount and when auth state changes
  useEffect(() => {
    console.log("🔄 useCart mounted");
    fetchCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      console.log("📢 Cart update event received");
      fetchCart();
    };

    const handleUserLoggedIn = () => {
      console.log("👤 User logged in event received");
      fetchCart();
    };

    const handleUserLoggedOut = () => {
      console.log("👋 User logged out event received");
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    window.addEventListener("userLoggedOut", handleUserLoggedOut);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      window.removeEventListener("userLoggedOut", handleUserLoggedOut);
    };
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    cartUpdated, // For forcing re-renders
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    // Price calculation helpers
    getDisplayPrice,
    getItemTotal,
    getItemUnitPrice,
    hasDiscount,
    getDiscountPercentage,
    calculateCartTotal,
  };
};
