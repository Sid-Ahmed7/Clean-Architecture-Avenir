"use client";

import { User, Menu, Search } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { NotificationMenu } from "@/components/notification/NotificationMenu";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuClick: () => void;
}

export default function Header({ searchQuery, setSearchQuery, onMenuClick }: HeaderProps) {
  const { user, loading } = useUserProfile();
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 text-gray-900 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {!loading && user?.user && (
            <div className="flex items-center gap-3 ml-6">
              <p className="text-base font-semibold text-gray-900">
                {user.user.firstName} {user.user.lastName}
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                {user.user.role}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <NotificationMenu />

          <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
