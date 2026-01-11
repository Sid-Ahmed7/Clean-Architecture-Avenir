"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Users, UserCheck, Briefcase, Trash2, Edit, X } from "lucide-react";
import { User } from "@/types/user";
import { useTranslations } from "next-intl";
import { useNotification } from "@/hooks/useNotifications";
import { NotificationEnum } from "@/types/Notification";

export default function UsersManagementPage() {
    const t = useTranslations("manager.users");
    const { addNotification } = useNotification();
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        status: "ACTIVE"
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [activeTab, users]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        if (activeTab === "all") {
            setFilteredUsers(users);
        } else if (activeTab === "clients") {
            setFilteredUsers(users.filter(u => u.roles?.includes("CLIENT")));
        } else if (activeTab === "advisors") {
            setFilteredUsers(users.filter(u => u.roles?.includes("BANK_ADVISOR")));
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditForm({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            status: user.status
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingUser) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${editingUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(editForm),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            closeEditModal();
            fetchUsers();
        } catch (error) {
            addNotification(NotificationEnum.ALERT, t("errors.updateFailed"));
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm(t("deleteConfirm"))) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "success" | "warning" | "danger" | "neutral"> = {
            ACTIVE: "success",
            INACTIVE: "neutral",
            SUSPENDED: "danger",
        };

        return <Badge variant={variants[status] || "neutral"}>{status}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-gray-700">{t("loading")}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6 mx-auto space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
                </div>
                <p className="text-gray-700 ml-14">{t("subtitle")}</p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "all"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    <Users className="w-4 h-4" />
                    {t("tabs.all")} ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab("clients")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "clients"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    <UserCheck className="w-4 h-4" />
                    {t("tabs.clients")} ({users.filter(u => u.roles?.includes("CLIENT")).length})
                </button>
                <button
                    onClick={() => setActiveTab("advisors")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "advisors"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    <Briefcase className="w-4 h-4" />
                    {t("tabs.advisors")} ({users.filter(u => u.roles?.includes("BANK_ADVISOR")).length})
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.name")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.email")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.phone")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.status")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.roles")}</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-700">{t("table.registered")}</th>
                                <th className="text-right p-4 text-sm font-semibold text-gray-700">{t("table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center p-8 text-gray-500">
                                        {t("table.noUsers")}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="p-4 text-gray-700">{user.email}</td>
                                        <td className="p-4 text-gray-700">{user.phoneNumber}</td>
                                        <td className="p-4">{getStatusBadge(user.status)}</td>
                                        <td className="p-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {user.roles?.map((role) => (
                                                    <Badge key={role} variant="info">
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {user.isRegistered ? (
                                                <Badge variant="success">{t("status.yes")}</Badge>
                                            ) : (
                                                <Badge variant="neutral">{t("status.no")}</Badge>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    {t("actions.edit")}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    {t("actions.delete")}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isEditModalOpen && editingUser && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b border-blue-100 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                                        <Edit className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{t("editModal.title")}</h2>
                                </div>
                                <button
                                    onClick={closeEditModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t("editModal.firstName")}
                                    </label>
                                    <Input
                                        type="text"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t("editModal.lastName")}
                                    </label>
                                    <Input
                                        type="text"
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t("editModal.email")}
                                </label>
                                <Input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t("editModal.phone")}
                                </label>
                                <Input
                                    type="tel"
                                    value={editForm.phoneNumber}
                                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t("editModal.address")}
                                </label>
                                <Input
                                    type="text"
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t("editModal.status")}
                                </label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
                                >
                                    <option value="ACTIVE" className="text-gray-900">{t("editModal.statusOptions.active")}</option>
                                    <option value="INACTIVE" className="text-gray-900">{t("editModal.statusOptions.inactive")}</option>
                                    <option value="SUSPENDED" className="text-gray-900">{t("editModal.statusOptions.suspended")}</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                                >
                                    {t("editModal.cancel")}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transition-all shadow-lg"
                                >
                                    {t("editModal.save")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
