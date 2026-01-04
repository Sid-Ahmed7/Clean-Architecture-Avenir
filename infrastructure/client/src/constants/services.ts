import { Home, PiggyBank, TrendingUp, Wallet } from "lucide-react";

export const services = [
  {
    icon: Wallet,
    titleKey: 'bankAccounts.title',
    descriptionKey: 'bankAccounts.description',
    gradient: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-white to-blue-50',
    borderColor: 'border-blue-200',
    linkColor: 'text-blue-600 hover:text-blue-700',
    href: '/services/comptes'
  },
  {
    icon: PiggyBank,
    titleKey: 'savings.title',
    descriptionKey: 'savings.description',
    gradient: 'from-emerald-600 to-green-600',
    bgGradient: 'from-white to-emerald-50',
    borderColor: 'border-emerald-200',
    linkColor: 'text-emerald-600 hover:text-emerald-700',
    href: '/services/epargne'
  },
  {
    icon: TrendingUp,
    titleKey: 'trading.title',
    descriptionKey: 'trading.description',
    gradient: 'from-purple-600 to-pink-600',
    bgGradient: 'from-white to-purple-50',
    borderColor: 'border-purple-200',
    linkColor: 'text-purple-600 hover:text-purple-700',
    href: '/services/bourse'
  },
  {
    icon: Home,
    titleKey: 'mortgage.title',
    descriptionKey: 'mortgage.description',
    gradient: 'from-orange-600 to-red-600',
    bgGradient: 'from-white to-orange-50',
    borderColor: 'border-orange-200',
    linkColor: 'text-orange-600 hover:text-orange-700',
    href: '/services/credit-immobilier'
  }
];