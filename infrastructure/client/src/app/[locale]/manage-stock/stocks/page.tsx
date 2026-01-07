"use client";


import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useDeleteStock, useStocks, useToggleStockAvailability, useUpdateStock } from "@/hooks/useStocks";
import { Stocks } from "@/types/stocks";
import { StockManagementTable } from "@/components/stocks/StockManagementTable";
import { CreateStockModal } from "@/components/stocks/StockModal";
import { EditStockForm } from "@/components/stocks/forms/EditStockForm";
import { OpenIPOModal } from "@/components/stocks/orders/OpenIPOModal";
import { useOpenIPO, useCloseIPO } from "@/hooks/useIPO";
import { BarChart3, Building2, ClipboardList, Factory, Plus, ShieldCheck } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
            <p className="text-sm text-white/70">Gestion des actions</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
              <Factory className="h-6 w-6" />
              Actions & IPO
            </h1>
            <p className="text-sm text-white/70 mt-2">Chargement...</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 mt-4">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = useMemo(() => {
    const total = stocks?.length ?? 0;
    const available = stocks?.filter((s) => s.isActionAvailable).length ?? 0;
    const ipo = stocks?.filter((s) => s.availableSharesForIPO && s.availableSharesForIPO > 0).length ?? 0;
    return { total, available, ipo };
  }, [stocks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/50 p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-white/70">Gestion des actions</p>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Factory className="h-6 w-6" />
                Actions & IPO
              </h1>
              <p className="text-sm text-white/80">Gérez la disponibilité, l&apos;édition et les IPO en un seul endroit.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => setIsCreateModalOpen(true)} className="bg-white text-blue-800 hover:bg-slate-100 shadow-sm">
                <Plus className="h-4 w-4" />
                Créer une action
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Actions totales</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Disponibles</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.available}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">IPO ouvertes</p>
              <p className="text-2xl font-bold text-amber-700">{stats.ipo}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Tableau</p>
              <h2 className="text-xl font-bold text-slate-900">Gestion des actions</h2>
            </div>
            <ClipboardList className="h-5 w-5 text-slate-400" />
          </div>
          <StockManagementTable
            stocks={stocks || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAvailability={handleToggleAvailability}
            onOpenIPO={handleOpenIPO}
            onCloseIPO={handleCloseIPO}
          />
        </div>

        <CreateStockModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {editingStock && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Édition</p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Modifier {editingStock.symbol}
                  </h2>
                </div>
                <button
                  onClick={() => setEditingStock(null)}
                  className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
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
    </div>
  );
}