"use client";



interface LimitProgressBarProps {
    label: string;
    value: number;
    max: number;
    currency?: string;
}

export function LimitProgressBar({label, value, max, currency}: LimitProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-100 mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-600 text-sm font-medium">{label}</span>
        <span className="text-gray-700 text-sm font-semibold">
          {value.toLocaleString()} {currency}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            percentage > 90
              ? "bg-red-500"
              : percentage > 60
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0</span>
        <span>
          {max.toLocaleString()} {currency}
        </span>
      </div>
    </div>
  );
}