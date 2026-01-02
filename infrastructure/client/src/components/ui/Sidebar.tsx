"use client";

import { AuthContext } from "@/contexts/AuthProvider";
import { apiClient } from "@/lib/api/apiClient";
import { CreditCard, ArrowUpRight, TrendingUp, Calendar, Settings, HelpCircle, X, MessageCircle, LogOut, PiggyBank, Home, Users, Wallet } from "lucide-react";
import { useContext } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { RoleEnum } from "@/types/RoleEnum";
import { getRolePrefix } from "@/lib/utils/getRolePrefix";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, setIsAuthenticated, hasAnyRole, user } = useContext(AuthContext);
  const pathname = usePathname();

  // Get role-based URL prefix
  const rolePrefix = getRolePrefix(user?.role);

  const menuItems = [
    { icon: Home, label: "Dashboard", href: `/${rolePrefix}/dashboard` },
    ...(user?.role === 'CLIENT' ? [{ icon: CreditCard, label: "Comptes", href: `/${rolePrefix}/accounts` }] : []),
    ...(user?.role === 'BANK_MANAGER' ? [
      { icon: Users, label: "Gestion Utilisateurs", href: `/manager/users` },
      { icon: Wallet, label: "Tous les Comptes", href: `/manager/accounts` },
    ] : []),
    { icon: ArrowUpRight, label: "Virements", href: `/${rolePrefix}/transfers` },
    ...(user?.role === 'CLIENT' ? [{ icon: PiggyBank, label: "Épargne", href: `/client/savings` }] : []),
    ...(user?.role === 'BANK_MANAGER' ? [{ icon: PiggyBank, label: "Produits d'Épargne", href: `/manager/savings-products` }] : []),
    { icon: TrendingUp, label: "Investissements", href: `/${rolePrefix}/investments` },
    { icon: Calendar, label: "Historique", href: `/${rolePrefix}/history` },
    // { icon: FileText, label: "Demande de crédit", href: "/loan/request", roles: [RoleEnum.CLIENT] },
    // { icon: FileText, label: "Mes demandes de crédit", href: "/loan/requests", roles: [RoleEnum.CLIENT] },
    // { icon: FileText, label: "Demandes crédit (conseiller)", href: "/advisor/loan-requests", roles: [RoleEnum.BANK_ADVISOR] },
    // { icon: FileText, label: "Demandes crédit (directeur)", href: "/director/loan-requests", roles: [RoleEnum.BANK_MANAGER] },
    { icon: MessageCircle, label: "Message", href: `/${rolePrefix}/conversations` },
    { icon: Settings, label: "Paramètres", href: `/${rolePrefix}/settings` },
    { icon: HelpCircle, label: "Aide", href: `/${rolePrefix}/help` },
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
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
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
          {menuItems
            .filter((item) => !item.roles || hasAnyRole(item.roles))
            .map((item) => {
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

        <div className="flex flex-col absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 gap-2 bg-white">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full group relative overflow-hidden flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <LogOut className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-semibold relative z-10">Déconnexion</span>
            </button>
          ) : (
            <>
              <Link href="/login" className="flex w-full cursor-pointer justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                <span>Login</span>
              </Link>
              <Link href="/register" className="w-full cursor-pointer text-center px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
                Register
              </Link>
            </>
          )}

        </div>
      </aside>
    </>
  );
}