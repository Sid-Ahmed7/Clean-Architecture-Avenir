"use client";

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    className?: string;
}
export function Select({ label, value, options, onChange, className }: SelectProps) {
  return (
    <div className={`flex flex-col ${className || ""}`}>
      <label className="text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
