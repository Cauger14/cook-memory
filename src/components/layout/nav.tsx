"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home01Icon,
  Search01Icon,
  Add01Icon,
  Logout01Icon,
  FavouriteIcon,
  Settings01Icon,
} from "hugeicons-react";

const navItems = [
  { href: "/", label: "Recettes", icon: Home01Icon },
  { href: "/search", label: "Recherche", icon: Search01Icon },
  { href: "/favorites", label: "Favoris", icon: FavouriteIcon },
  { href: "/recipes/new", label: "Ajouter", icon: Add01Icon },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="fixed left-0 top-0 hidden h-full w-56 flex-col border-r bg-white p-4 md:flex">
        <Link href="/" className="mb-8 text-xl font-bold">
          Cook Memory
        </Link>

        <div className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
            pathname === "/settings"
              ? "bg-gray-100 font-medium text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings01Icon size={20} />
          Paramètres
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <Logout01Icon size={20} />
          Déconnexion
        </button>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white pb-safe md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs ${
                isActive ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <item.icon size={22} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}