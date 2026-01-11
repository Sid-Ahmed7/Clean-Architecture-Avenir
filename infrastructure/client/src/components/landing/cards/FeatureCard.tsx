import { LucideProps } from "lucide-react";
import { ComponentType } from "react";

interface FeatureCardProps {
  icon: ComponentType<LucideProps>;
  title: string;
  description: string;
  gradient: string;
}

export default function FeatureCard({ icon: Icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition hover:shadow-lg hover:scale-[1.02] duration-200">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}