import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <img
                src="https://themesflat.co/html/ecomus/images/logo/logo.svg"
                alt="Logo"
                className="h-7 w-auto"
              />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="text-black hover:text-black transition">
                <Search size={22} />
              </button>

              <button className="text-black hover:text-black transition">
                <User size={22} />
              </button>

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
      <div className="container mx-auto ">
        <nav className="hidden lg:flex items-center justify-center gap-8 py-5">
          <button className="flex items-center gap-1 text-md font-semibold text-black hover:text-black transition">
            Home
            <ChevronDown size={16} />
          </button>

          <button className="flex items-center gap-1 text-md font-semibold text-black hover:text-black transition">
            Shop
            <ChevronDown size={16} />
          </button>

          <button className="flex items-center gap-1 text-md font-semibold text-black hover:text-black transition">
            Products
            <ChevronDown size={16} />
          </button>

          <button className="flex items-center gap-1 text-md font-semibold text-black hover:text-black transition">
            Pages
            <ChevronDown size={16} />
          </button>

          <button className="flex items-center gap-1 text-md font-semibold text-black hover:text-black transition">
            Blog
            <ChevronDown size={16} />
          </button>

          <a
            href="/buy-now"
            className="text-md font-semibold text-black hover:text-black transition"
          >
            Buy now
          </a>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <button className="flex items-center justify-between text-gray-700 hover:text-black font-medium transition py-2">
              <span>Home</span>
              <ChevronDown size={16} />
            </button>
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
          </nav>
        </div>
      )}
    </header>
  );
}
