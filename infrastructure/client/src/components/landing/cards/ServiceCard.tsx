import { Link } from "@/i18n/navigation";
import { ArrowRight, LucideProps } from "lucide-react";
import { ComponentType } from "react";
import { useTranslations } from 'next-intl';

interface ServiceCardProps {
 icon: ComponentType<LucideProps>;
  title: string;
  description: string;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  linkColor: string;
  href: string;
}

export default function ServiceCard({icon: Icon,title,description,gradient,bgGradient,borderColor,linkColor,href}: ServiceCardProps) {
  const t = useTranslations('landing.services');
  
  return (
    <div className={`bg-gradient-to-br ${bgGradient} border ${borderColor} rounded-2xl p-8 shadow-sm hover:shadow-md transition`}>
      <div className="flex items-start gap-6">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
        </div>
      </div>
    </div>
  );
}