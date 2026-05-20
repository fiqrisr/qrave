import { Link, Outlet } from "@tanstack/react-router";
import {
  ChefHat,
  LayoutDashboard,
  LogOut,
  UtensilsCrossed,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { OrgSwitcher } from "./org-switcher";

export function DashboardLayout() {
  async function handleSignOut() {
    await signOut();
    globalThis.window.location.reload();
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">Qrave</h1>
        </div>

        <div className="p-4 border-b border-gray-200">
          <OrgSwitcher />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 [&.active]:bg-indigo-50 [&.active]:text-indigo-700 [&.active]:font-medium"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>

          <Link
            to="/menu"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 [&.active]:bg-indigo-50 [&.active]:text-indigo-700 [&.active]:font-medium"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Menu
          </Link>

          <Link
            to="/kitchen"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 [&.active]:bg-indigo-50 [&.active]:text-indigo-700 [&.active]:font-medium"
          >
            <ChefHat className="h-4 w-4" />
            Kitchen
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
