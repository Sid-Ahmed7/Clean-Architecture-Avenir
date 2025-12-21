export function TransactionTableHeader() {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
          Symbole
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
          Date
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
          Type
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
          Quantité
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
          Prix unitaire
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
          Total
        </th>
      </tr>
    </thead>
  );
}
