import React, { useState } from "react";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  ArrowRight,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-#f6f6f6 border-t border-gray-200">
      {/* Main Footer */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info Column */}
          <div>
            {/* Logo - Add your logo here */}
            <div className="mb-8">
              <img
                src="https://themesflat.co/html/ecomus/images/logo/logo.svg"
                alt="Logo"
                className="h-8 w-auto"
              />
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <p>
                Address: 1234 Fashion Street, Suite 567,
                <br />
                New York, NY 10001
              </p>

              <p className="flex items-start gap-2">
                <span>Email:</span>
                <a
                  href="mailto:info@fashionshop.com"
                  className="text-black hover:underline"
                >
                  info@fashionshop.com
                </a>
              </p>

              <p className="flex items-start gap-2">
                <span>Phone:</span>
                <a
                  href="tel:+12125551234"
                  className="text-black hover:underline"
                >
                  (212) 555-1234
                </a>
              </p>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-black hover:gap-3 transition-all"
              >
                Get direction
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-8">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="font-semibold mb-6 text-black text-xl">Help</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li>
                <a href="/privacy" className="hover:text-black transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-black transition">
                  Returns + Exchanges
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-black transition">
                  Shipping
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-black transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-black transition">
                  FAQ's
                </a>
              </li>
              <li>
                <a href="/compare" className="hover:text-black transition">
                  Compare
                </a>
              </li>
              <li>
                <a href="/wishlist" className="hover:text-black transition">
                  My Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-semibold mb-6 text-black text-xl">About us</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li>
                <a href="/story" className="hover:text-black transition">
                  Our Story
                </a>
              </li>
              <li>
                <a href="/store" className="hover:text-black transition">
                  Visit Our Store
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-black transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/account" className="hover:text-black transition">
                  Account
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-base mb-6 text-black">
              Sign Up for Email
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Sign up to get first dibs on new arrivals, sales, exclusive
              content, events and more!
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email...."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition text-sm"
                />
              </div>
              <button className="w-full bg-black text-white py-3 rounded-sm hover:bg-gray-800 transition font-medium text-sm flex items-center justify-center gap-2">
                Subscribe
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Currency and Language */}
            <div className="flex items-center gap-4 mt-8">
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition">
                <span className="text-base">🇺🇸</span>
                <span>USD</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition">
                <span>English</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Ecomus Store. All Rights Reserved
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">VISA</span>
              </div>
              <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">P</span>
              </div>
              <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div className="w-4 h-4 rounded-full bg-orange-400 -ml-2"></div>
                </div>
              </div>
              <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">AMEX</span>
              </div>
              <div className="h-8 px-3 bg-white border border-gray-200 rounded flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-2 h-4 bg-blue-600 rounded-sm"></div>
                  <div className="w-2 h-4 bg-orange-500 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
