import { UserTransaction } from "@/types/transaction";

interface TransactionCardProps {
    transaction: UserTransaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
    const isBuy = transaction.type === "BUY";
      return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{transaction.stockSymbol}</h3>
          <p className="text-sm text-gray-500">
            {new Date(transaction.executedAt).toLocaleString("fr-FR")}
          </p>
        </div>
        <span className={`px-3 py-1 rounded text-sm font-semibold ${
          isBuy ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
        }`}>
          {isBuy ? "Achat" : "Vente"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Quantité</p>
          <p className="font-semibold text-gray-900">{transaction.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Prix unitaire</p>
          <p className="font-semibold text-gray-900">{transaction.executionPrice.toFixed(2)}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Frais</p>
          <p className="font-semibold text-gray-900">{transaction.fee.toFixed(2)}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Montant total</p>
          <p className={`font-semibold ${isBuy ? "text-red-600" : "text-green-600"}`}>
            {isBuy ? "-" : "+"}{transaction.totalAmount.toFixed(2)}€
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        ID: {transaction.id}
      </div>
    </div>
  );
}