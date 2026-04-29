"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  CalendarDays,
  CircleUserRound,
  Droplets,
  FileBarChart2,
  LayoutDashboard,
  MapPinned,
  Upload,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/import-fab", label: "Import FAB", icon: Upload },
  { href: "/zones", label: "Zones", icon: MapPinned },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/reports", label: "Rapports", icon: FileBarChart2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const today = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                <Droplets size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-blue-700">SNDE</p>
                <p className="text-xs text-slate-500">Recouvrement</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-5">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "border border-blue-100 bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                <CircleUserRound size={18} />
              </div>
              <div className="text-sm text-slate-500">
                <p className="font-semibold text-slate-700">admin</p>
                <p>Administrateur</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-blue-900 bg-blue-900 px-6 py-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold md:text-xl">
                  Système de priorisation des zones de recouvrement - SNDE
                </p>
              </div>
              <div className="hidden items-center gap-3 text-right text-sm md:flex">
                <CalendarDays size={16} />
                <div>
                  <p>{today}</p>
                  <p>Admin</p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-5 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
