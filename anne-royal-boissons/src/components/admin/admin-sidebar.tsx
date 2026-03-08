"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Truck,
  Users,
  LogOut,
  Wine,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminRole } from "@prisma/client";

interface AdminSidebarProps {
  adminRole?: AdminRole;
}

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/stock", label: "Stock", icon: Warehouse },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/livraisons", label: "Livraisons", icon: Truck },
  { href: "/admin/zones", label: "Zones livraison", icon: MapPin },
  { href: "/admin/employes", label: "Employés", icon: Users, adminOnly: true },
];

export function AdminSidebar({ adminRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || adminRole === "ADMIN");

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-900 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col shrink-0 transform transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wine className="w-7 h-7 text-amber-400" />
          <div>
            <p className="font-bold text-sm">Anne Royal</p>
            <p className="text-xs text-gray-400">Back-office</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="md:hidden text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? "bg-amber-500 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Déconnexion
        </Button>
      </div>
      </div>
    </>
  );
}
