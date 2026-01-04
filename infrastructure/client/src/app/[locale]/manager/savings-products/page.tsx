"use client";

import { useState, useEffect } from "react";
import { getAllSavingsProducts, createSavingsProduct, updateSavingsProduct } from "@/lib/api/savingsProduct";
import { ArrowLeft, Plus, Edit, TrendingUp, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { useTranslations } from "next-intl";

interface SavingsProduct {
    id: string;
    name: string;
    description: string;
    interestRate: number;
    maxDepositAmount: number | null;
    minDepositAmount: number | null;
    isActive: boolean;
    createdAt: string;
}

export default function ManagerSavingsProductsPage() {
    const t = useTranslations("manager.savingsProducts");
    const [products, setProducts] = useState<SavingsProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<SavingsProduct | null>(null);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        interestRate: "",
        maxDepositAmount: "",
        minDepositAmount: ""
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllSavingsProducts(false);
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createSavingsProduct({
                name: formData.name,
                description: formData.description,
                interestRate: parseFloat(formData.interestRate),
                maxDepositAmount: formData.maxDepositAmount ? parseFloat(formData.maxDepositAmount) : null,
                minDepositAmount: formData.minDepositAmount ? parseFloat(formData.minDepositAmount) : null
            });
            setMessage("Produit créé avec succès !");
            setShowCreateForm(false);
            resetForm();
            await loadProducts();
        } catch (error: any) {
            setMessage(error.response?.data?.error || t("messages.createError"));
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            await updateSavingsProduct(editingProduct.id, {
                interestRate: parseFloat(formData.interestRate),
                maxDepositAmount: formData.maxDepositAmount ? parseFloat(formData.maxDepositAmount) : null,
                minDepositAmount: formData.minDepositAmount ? parseFloat(formData.minDepositAmount) : null
            });
            setMessage("Produit mis à jour ! Tous les comptes liés ont été mis à jour.");
            setEditingProduct(null);
            resetForm();
            await loadProducts();
        } catch (error: any) {
            setMessage(error.response?.data?.error || t("messages.updateError"));
        }
    };

    const startEdit = (product: SavingsProduct) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            interestRate: product.interestRate.toString(),
            maxDepositAmount: product.maxDepositAmount?.toString() || "",
            minDepositAmount: product.minDepositAmount?.toString() || ""
        });
        setShowCreateForm(false);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            interestRate: "",
            maxDepositAmount: "",
            minDepositAmount: ""
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/manager/dashboard"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 inline-flex"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Retour au dashboard</span>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Produits d'Épargne
                            </h1>
                            <p className="text-gray-600">
                                Créez et gérez les produits d'épargne disponibles pour les clients
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setShowCreateForm(true);
                                setEditingProduct(null);
                                resetForm();
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            {t("newProduct")}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.includes("succès") || message.includes("mis à jour")
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                        }`}>
                        {message}
                    </div>
                )}

                {/* Create/Edit Form */}
                {(showCreateForm || editingProduct) && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingProduct ? t("form.editTitle") : t("form.createTitle")}
                        </h2>
                        <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={t("form.name")}
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!!editingProduct}
                                    required
                                    placeholder={t("form.namePlaceholder")}
                                />

                                <Input
                                    label={t("form.interestRate")}
                                    type="number"
                                    step="0.01"
                                    value={formData.interestRate}
                                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                                    required
                                    placeholder={t("form.interestRatePlaceholder")}
                                />

                                <Input
                                    label={t("form.maxDeposit")}
                                    type="number"
                                    step="0.01"
                                    value={formData.maxDepositAmount}
                                    onChange={(e) => setFormData({ ...formData, maxDepositAmount: e.target.value })}
                                    placeholder={t("form.maxDepositPlaceholder")}
                                />

                                <Input
                                    label={t("form.minDeposit")}
                                    type="number"
                                    step="0.01"
                                    value={formData.minDepositAmount}
                                    onChange={(e) => setFormData({ ...formData, minDepositAmount: e.target.value })}
                                    placeholder={t("form.minDepositPlaceholder")}
                                />
                            </div>

                            <TextArea
                                label={t("form.description")}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={!!editingProduct}
                                rows={3}
                                placeholder={t("form.descriptionPlaceholder")}
                            />

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    {editingProduct ? t("form.updateButton") : t("form.createButton")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setEditingProduct(null);
                                        resetForm();
                                    }}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    {t("form.cancel")}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products List */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t("existingProducts")}
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center">
                            <p className="text-gray-500">{t("noProducts")}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${product.isActive ? "border-emerald-200" : "border-gray-200 opacity-60"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {product.name}
                                        </h3>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${product.isActive
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {product.isActive ? t("product.active") : t("product.inactive")}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4">
                                        {product.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm text-gray-600">{t("product.rate")}</span>
                                            <span className="font-bold text-indigo-600">
                                                {product.interestRate}%
                                            </span>
                                        </div>

                                        {product.maxDepositAmount && (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-purple-600" />
                                                <span className="text-sm text-gray-600">{t("product.ceiling")}</span>
                                                <span className="font-semibold text-gray-900">
                                                    {product.maxDepositAmount.toLocaleString('fr-FR')} €
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => startEdit(product)}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        {t("product.edit")}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
