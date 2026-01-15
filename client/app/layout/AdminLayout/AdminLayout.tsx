"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Tag, Palette, Ruler, Plus, User } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

type Section = "users" | "products" | "categories" | "colors" | "sizes";

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const sections: { id: Section; label: string; icon: any; href: string }[] = [
    {
      id: "users",
      label: "Users",
      icon: User,
      href: "/dashboard/home",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      href: "/dashboard/products",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Tag,
      href: "/dashboard/categories",
    },
    { id: "colors", label: "Colors", icon: Palette, href: "/dashboard/colors" },
    { id: "sizes", label: "Sizes", icon: Ruler, href: "/dashboard/sizes" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 mt-2">
          <Link href="/dashboard/home">
            <img
              src="https://themesflat.co/html/ecomus/images/logo/logo@2x.png"
              alt=""
              className="w-45"
            />
          </Link>
        </div>
        <nav className="mt-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = pathname === section.href;
            return (
              <Link
                key={section.id}
                href={section.href}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{section.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
