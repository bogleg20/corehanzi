"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/learn", label: "Learn", icon: "📚" },
  { href: "/review", label: "Review", icon: "🔄" },
  { href: "/practice", label: "Practice", icon: "✏️" },
  { href: "/words", label: "Words", icon: "📖" },
  { href: "/patterns", label: "Patterns", icon: "📝" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-red-600">
            CoreHanzi
          </Link>

          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
