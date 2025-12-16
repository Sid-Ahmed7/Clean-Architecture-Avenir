"use client";


import { useState } from "react";
import Button from "@/components/ui/Button";
import { useDeleteStock, useStocks, useToggleStockAvailability, useUpdateStock } from "@/hooks/useStocks";
import { Stocks } from "@/types/stocks";
import { StockManagementTable } from "@/components/stocks/StockManagementTable";
import { CreateStockModal } from "@/components/stocks/StockModal";
import { EditStockForm } from "@/components/stocks/forms/EditStockForm";
import { OpenIPOModal } from "@/components/stocks/orders/OpenIPOModal";
import { useOpenIPO, useCloseIPO } from "@/hooks/useIPO";

export default function ManageStocksPage() {
  const { data: stocksData, isLoading } = useStocks();
  const deleteStockMutation = useDeleteStock();
  const toggleAvailabilityMutation = useToggleStockAvailability();
  const updateStockMutation = useUpdateStock();
  const openIPOMutation = useOpenIPO();
  const closeIPOMutation = useCloseIPO();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stocks | null>(null);
  const [openingIPOStock, setOpeningIPOStock] = useState<Stocks | null>(null);

  const stocks = stocksData?.map(stock => ({
    ...stock,
    name: stock.companyName,
    currency: 'EUR'
  }));

  const handleDelete = async (stockId: string) => {
    try {
      await deleteStockMutation.mutateAsync(stockId);
    } catch (err) {
      console.error("Failed to delete stock:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleToggleAvailability = async (stockId: string, isAvailable: boolean) => {
    try {
      await toggleAvailabilityMutation.mutateAsync({ id: stockId, data: { isActionAvailable: isAvailable } });
    } catch (err) {
      console.error("Failed to toggle availability:", err);
      alert("Erreur lors du changement de disponibilité");
    }
  };

  const handleEdit = (stock: Stocks) => {
    setEditingStock(stock);
  };

const handleUpdateStock = async (data: { id: string; companyName: string; name: string; currency: string; isActionAvailable: boolean }) => {
  const updatedStock = {
    ...editingStock,
    ...data
  };
  await updateStockMutation.mutateAsync(updatedStock);
  setEditingStock(null);
};

  const handleOpenIPO = (stock: Stocks) => {
    setOpeningIPOStock(stock);
  };

  const handleConfirmOpenIPO = async (sharesToMakeAvailable: number, ipoType: 'INITIAL' | 'SECONDARY') => {
    if (!openingIPOStock) return;

    try {
      await openIPOMutation.mutateAsync({
        symbol: openingIPOStock.symbol,
        shares: sharesToMakeAvailable,
        ipoType: ipoType
      });
      setOpeningIPOStock(null);
    } catch (error) {
      throw error;
    }
  };

  const handleCloseIPO = async (symbol: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir fermer l'IPO pour ${symbol} ?`)) {
      return;
    }

    try {
      await closeIPOMutation.mutateAsync(symbol);
    } catch (err) {
      console.error("Failed to close IPO:", err);
      alert("Erreur lors de la fermeture de l'IPO");
    }
  };


  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestion des actions</h1>
        <p className="text-center text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des actions</h1>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          + Créer une action
        </Button>
      </div>

      <StockManagementTable
        stocks={stocks || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleAvailability={handleToggleAvailability}
        onOpenIPO={handleOpenIPO}
        onCloseIPO={handleCloseIPO}
      />

      <CreateStockModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {editingStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Modifier {editingStock.symbol}
              </h2>
              <button
                onClick={() => setEditingStock(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

              <EditStockForm
                stock={editingStock}
                onSubmit={handleUpdateStock}
                onCancel={() => setEditingStock(null)}
                isSubmitting={updateStockMutation.isPending}
              />
          </div>
        </div>
      )}

      {openingIPOStock && (
        <OpenIPOModal
          isOpen={true}
          onClose={() => setOpeningIPOStock(null)}
          stockSymbol={openingIPOStock.symbol}
          stockName={openingIPOStock.companyName}
          totalShares={openingIPOStock.totalShares}
          onConfirm={handleConfirmOpenIPO}
        />
      )}
    </div>
  );
}