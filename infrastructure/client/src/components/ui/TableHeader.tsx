import { ReactNode } from "react";

export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  className?: string;
}

interface TableHeaderProps {
  columns: TableColumn[];
  className?: string;
}

export function TableHeader({ columns, className = "" }: TableHeaderProps) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase ${
              column.align === "center"
                ? "text-center"
                : column.align === "right"
                ? "text-right"
                : "text-left"
            } ${column.className || ""}`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
