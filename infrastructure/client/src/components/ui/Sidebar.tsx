"use client";

import { AuthContext } from "@/contexts/AuthProvider";
import { apiClient } from "@/lib/api/apiClient";
import { CreditCard, ArrowUpRight, TrendingUp, Calendar, Settings, HelpCircle, X, MessageCircle, LogOut } from "lucide-react";
import { useContext } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const pathname = usePathname();

  const menuItems = [
    { icon: CreditCard, label: "Comptes", active: true },
    { icon: ArrowUpRight, label: "Virements" },
    { icon: TrendingUp, label: "Investissements" },
    { icon: Calendar, label: "Historique" },
    { icon: Calendar, label: "Historique", href: "/transactions" },

    { icon: Settings, label: "Paramètres" },
    { icon: HelpCircle, label: "Aide" },
  ];

  const handleLogout = () => {
    apiClient.post("/auth/logout").then(() => {
      setIsAuthenticated(false);
    })
  }

  const isActive = (href: string) => {
    return pathname?.includes(href);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 w-64 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BankAvenir</span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const ItemIcon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <ItemIcon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 gap-2">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          ) : (
            <>
              <Link href="/login" className="flex w-full cursor-pointer justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <span>Login</span>
              </Link>
              <Link href="/register" className="w-full cursor-pointer text-center px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Register
              </Link>
            </>
          )}

        </div>
      </aside>
    </>
  );
}
