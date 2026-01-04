import { Euro, Headset, PieChart, Smartphone, Zap, Lock } from "lucide-react";

export const features = [
  {
    icon: Lock,
    titleKey: 'items.security.title',
    descriptionKey: 'items.security.description',
    gradient: 'from-blue-600 to-indigo-600'
  },
  {
    icon: Smartphone,
    titleKey: 'items.mobile.title',
    descriptionKey: 'items.mobile.description',
    gradient: 'from-emerald-600 to-green-600'
  },
  {
    icon: Euro,
    titleKey: 'items.noFees.title',
    descriptionKey: 'items.noFees.description',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    icon: Headset,
    titleKey: 'items.support.title',
    descriptionKey: 'items.support.description',
    gradient: 'from-orange-600 to-red-600'
  },
  {
    icon: Zap,
    titleKey: 'items.instantTransfer.title',
    descriptionKey: 'items.instantTransfer.description',
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    icon: PieChart,
    titleKey: 'items.analytics.title',
    descriptionKey: 'items.analytics.description',
    gradient: 'from-indigo-600 to-purple-600'
  }
];