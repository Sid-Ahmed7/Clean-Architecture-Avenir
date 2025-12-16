import { Select } from "@/components/ui/Select";

interface TransactionTableControlsProps {
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  currentCount: number;
  totalCount: number;
}

export function TransactionTableControls({
  itemsPerPage,
  onItemsPerPageChange,
  currentCount,
  totalCount,
}: TransactionTableControlsProps) {
  const pageSizeOptions = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
  ];

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <Select
        label="Afficher"
        value={itemsPerPage.toString()}
        onChange={(val) => onItemsPerPageChange(parseInt(val, 10))}
        options={pageSizeOptions}
        className="w-32"
      />
      <div className="text-sm text-gray-600">
        {currentCount} sur {totalCount} transactions
      </div>
    </div>
  );
}
