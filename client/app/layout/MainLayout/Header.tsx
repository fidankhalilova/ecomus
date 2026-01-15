"use client";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Check auth state on component mount and when auth state changes
  useEffect(() => {
    checkAuthStatus();

    // Listen for auth state changes
    window.addEventListener("storage", checkAuthStatus);
    window.addEventListener("userLoggedIn", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("userLoggedIn", checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || user.email.split("@")[0]);
      } catch (e) {
        setUserName("User");
      }
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update state
    setIsLoggedIn(false);
    setUserName("");
    setShowUserDropdown(false);

    // Dispatch event for other components
    window.dispatchEvent(new Event("userLoggedOut"));

    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            {/* Currency and Language */}
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm text-black hover:text-black transition">
                <span className="text-base">🇺🇸</span>
                <span>USD</span>
                <ChevronDown size={14} />
              </button>

              <button className="flex items-center gap-2 text-sm text-black hover:text-black transition">
                <span>English</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Logo - Center */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/">
                <img
                  src="https://themesflat.co/html/ecomus/images/logo/logo.svg"
                  alt="Logo"
                  className="h-7 w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="text-black hover:text-black transition">
                <Search size={22} />
              </button>

              {/* User Icon with Authentication */}
              <div className="relative">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-2 text-black hover:text-black transition"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="hidden md:inline text-sm font-medium">
                          Hi, {userName.split(" ")[0]}
                        </span>
                      </div>
                      <ChevronDown size={14} />
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-2">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium">{userName}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {localStorage.getItem("user")
                                ? JSON.parse(localStorage.getItem("user") || "")
                                    ?.email
                                : ""}
                            </p>
                          </div>
                          <Link href="/profile">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                              My Profile
                            </button>
                          </Link>
                          <Link href="/orders">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                              My Orders
                            </button>
                          </Link>
                          <Link href="/wishlist">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                              Wishlist
                            </button>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition flex items-center gap-2"
                          >
                            <LogOut size={14} />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login">
                    <button className="text-black hover:text-black transition flex items-center gap-2">
                      <User size={22} />
                      <span className="hidden md:inline text-sm">Login</span>
                    </button>
                  </Link>
                )}
              </div>

              <button className="text-black hover:text-black transition relative">
                <Heart size={22} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  0
                </span>
              </button>

              <button className="text-black hover:text-black transition relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  0
                </span>
              </button>

              <button
                className="lg:hidden text-black hover:text-black transition ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto">
        <nav className="hidden lg:flex items-center justify-center gap-10 py-5">
          <Link href="/">
            <button className="flex items-center gap-1 text-lg font-semibold text-black hover:text-black transition">
              Home
            </button>
          </Link>

          <button className="flex items-center gap-1 text-lg font-semibold text-black hover:text-black transition">
            Shop
            <ChevronDown size={16} />
          </button>

          <button className="flex items-center gap-1 text-lg font-semibold text-black hover:text-black transition">
            Products
            <ChevronDown size={16} />
          </button>

          <button className="flex items-center gap-1 text-lg font-semibold text-black hover:text-black transition">
            Pages
            <ChevronDown size={16} />
          </button>

          <button className="flex items-center gap-1 text-lg font-semibold text-black hover:text-black transition">
            Blog
            <ChevronDown size={16} />
          </button>

          <a
            href="/buy-now"
            className="text-lg font-semibold text-black hover:text-black transition"
          >
            Buy now
          </a>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <Link href="/">
              <button className="w-full text-left text-gray-700 hover:text-black font-medium transition py-2">
                Home
              </button>
            </Link>
            <button className="flex items-center justify-between text-gray-700 hover:text-black font-medium transition py-2">
              <span>Shop</span>
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center justify-between text-gray-700 hover:text-black font-medium transition py-2">
              <span>Products</span>
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center justify-between text-gray-700 hover:text-black font-medium transition py-2">
              <span>Pages</span>
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center justify-between text-gray-700 hover:text-black font-medium transition py-2">
              <span>Blog</span>
              <ChevronDown size={16} />
            </button>
            <a
              href="/buy-now"
              className="text-gray-700 hover:text-black font-medium transition py-2"
            >
              Buy now
            </a>

            {/* Mobile auth section */}
            {isLoggedIn ? (
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs text-gray-500">
                      {localStorage.getItem("user")
                        ? JSON.parse(localStorage.getItem("user") || "")?.email
                        : ""}
                    </p>
                  </div>
                </div>
                <Link href="/profile">
                  <button className="w-full text-left text-gray-700 hover:text-black font-medium transition py-2">
                    My Profile
                  </button>
                </Link>
                <Link href="/orders">
                  <button className="w-full text-left text-gray-700 hover:text-black font-medium transition py-2">
                    My Orders
                  </button>
                </Link>
                <Link href="/wishlist">
                  <button className="w-full text-left text-gray-700 hover:text-black font-medium transition py-2">
                    Wishlist
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 hover:text-red-700 font-medium transition py-2 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="w-full text-left text-gray-700 hover:text-black font-medium transition py-2 flex items-center gap-2">
                  <User size={18} />
                  Login / Register
                </button>
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </header>
  );
}
