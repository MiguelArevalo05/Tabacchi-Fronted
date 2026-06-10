"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    Edit,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import api from "@/services/interceptor";
import { Toast } from "@/components/ui/toast";

// Define el tipo de privilegio
interface Privilege {
    id: number;
    module?: string;
    action?: string;
    description?: string;
    isActive?: boolean;
}

const ITEMS_PER_PAGE = 5;

export default function PrivilegesManagement() {
    // Estados
    const [privileges, setPrivileges] = useState<Privilege[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPrivilege, setSelectedPrivilege] = useState<Privilege | null>(null);

    // 👇 Estado para el Toast
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Estado para nuevo privilegio
    const [newPrivilege, setNewPrivilege] = useState({
        module: "",
        action: "",
        description: "",
    });

    // Cargar privilegios
    const loadPrivileges = async () => {
        try {
            setLoading(true);
            const res = await api.get("/profiles-privileges/privileges");
            setPrivileges(res.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error al cargar privilegios:", error);
            setToast({ type: "error", message: "Error al cargar los privilegios." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrivileges();
    }, []);

    // Crear privilegio
    const handleCreatePrivilege = async () => {
        if (!newPrivilege.module || !newPrivilege.action) {
            setToast({ type: "error", message: "El módulo y la acción son obligatorios." });
            return;
        }

        try {
            await api.post("/profiles-privileges/privileges", newPrivilege);
            setShowCreateModal(false);
            setNewPrivilege({
                module: "",
                action: "",
                description: "",
            });
            // ✅ Mostrar Toast de éxito
            setToast({ type: "success", message: "Privilegio creado correctamente." });
            loadPrivileges();
        } catch (error) {
            console.error("Error al crear privilegio:", error);
            setToast({ type: "error", message: "Error al crear el privilegio." });
        }
    };

    // Eliminar privilegio
    const handleDelete = async (id: number) => {
        setDeleting(true);
        try {
            await api.delete(`/profiles-privileges/privileges/${id}`);
            setPrivileges(privileges.filter((item) => item.id !== id));
            setDeleteConfirm(null);
            setCurrentPage(1);
            // ✅ Mostrar Toast de éxito
            setToast({ type: "success", message: "Privilegio eliminado correctamente." });
        } catch (error) {
            console.error("Error al eliminar:", error);
            setToast({ type: "error", message: "Error al eliminar el privilegio." });
        } finally {
            setDeleting(false);
        }
    };

    // Editar privilegio
    const handleEditClick = (priv: Privilege) => {
        setSelectedPrivilege({ ...priv });
        setShowEditModal(true);
    };

    const handleUpdatePrivilege = async () => {
        if (!selectedPrivilege) return;

        try {
            await api.patch(`/profiles-privileges/privileges/${selectedPrivilege.id}`, {
                module: selectedPrivilege.module,
                action: selectedPrivilege.action,
                description: selectedPrivilege.description,
                isActive: selectedPrivilege.isActive,
            });

            setShowEditModal(false);
            setToast({ type: "success", message: "Privilegio actualizado correctamente" });
            loadPrivileges();
        } catch (error) {
            console.error("Error al actualizar privilegio:", error);
            setToast({ type: "error", message: "Error al actualizar el privilegio." });
        }
    };

    // Filtrar y ordenar privilegios
    const filteredPrivileges = privileges
        .filter(
            (p) =>
                p.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.id - b.id);

    // Calcular paginación
    const totalPages = Math.ceil(filteredPrivileges.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredPrivileges.slice(startIndex, endIndex);

    // Resetear página al buscar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Loading
    if (loading)
        return (
            <div className="max-w-6xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando privilegios...</p>
                </div>
            </div>
        );

    return (
        <div className="max-w-6xl relative">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-700 rounded-xl shadow-lg shadow-blue-700/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Privilegios</h1>
                    </div>
                    <p className="text-gray-600">Administra los privilegios del sistema</p>
                </div>

                {/* Buscador y botón nuevo */}
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por módulo, acción o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition font-medium shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo
                    </button>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200/80">
                    {filteredPrivileges.length === 0 ? (
                        <div className="text-center py-16">
                            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No hay registros de privilegios</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Crea tu primer privilegio para comenzar
                            </p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Módulo
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Acción
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Descripción
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((privilege, index) => (
                                        <tr
                                            key={privilege.id}
                                            className={`border-b transition hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                }`}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                    {privilege.module}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium max-w-xs truncate">
                                                {privilege.action}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {privilege.description || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${privilege.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {privilege.isActive ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex gap-1 justify-center">
                                                    <button
                                                        onClick={() => handleEditClick(privilege)}
                                                        className="p-1 hover:bg-blue-100 rounded transition text-blue-600 hover:text-blue-700">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(privilege.id)}
                                                        className="p-1 hover:bg-red-100 rounded transition text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginación */}
                            <div className="bg-gray-50 px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Mostrando{" "}
                                    <span className="font-semibold">{startIndex + 1}</span> a{" "}
                                    <span className="font-semibold">
                                        {Math.min(endIndex, filteredPrivileges.length)}
                                    </span>{" "}
                                    de <span className="font-semibold">{filteredPrivileges.length}</span>{" "}
                                    registros
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 rounded-lg transition font-medium text-sm ${currentPage === page
                                                    ? "bg-blue-700 text-white"
                                                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Modal de creación de privilegio */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Crear Privilegio</h3>
                            </div>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Módulo *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: orders, users, reports"
                                        value={newPrivilege.module}
                                        onChange={(e) =>
                                            setNewPrivilege({ ...newPrivilege, module: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Acción *
                                    </label>
                                    <select
                                        value={newPrivilege.action}
                                        onChange={(e) =>
                                            setNewPrivilege({ ...newPrivilege, action: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Seleccionar acción</option>
                                        <option value="create">create</option>
                                        <option value="read">read</option>
                                        <option value="update">update</option>
                                        <option value="delete">delete</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Descripción del privilegio"
                                        value={newPrivilege.description}
                                        onChange={(e) =>
                                            setNewPrivilege({ ...newPrivilege, description: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreatePrivilege}
                                    className="px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition font-medium shadow-sm"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de confirmación de eliminación */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Eliminar privilegio</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                ¿Estás seguro de que deseas eliminar este privilegio? Esta acción no se puede
                                deshacer.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={deleting}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    disabled={deleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {deleting && (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    )}
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de edición de privilegio */}
                {showEditModal && selectedPrivilege && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                            <h3 className="text-lg font-bold mb-4">Editar Privilegio</h3>

                            <div className="space-y-4 mb-6">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    value={selectedPrivilege.module}
                                    onChange={(e) =>
                                        setSelectedPrivilege({ ...selectedPrivilege, module: e.target.value })
                                    }
                                />

                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    value={selectedPrivilege.action}
                                    onChange={(e) =>
                                        setSelectedPrivilege({ ...selectedPrivilege, action: e.target.value })
                                    }
                                >
                                    <option value="create">create</option>
                                    <option value="read">read</option>
                                    <option value="update">update</option>
                                    <option value="delete">delete</option>
                                </select>

                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    value={selectedPrivilege.description || ""}
                                    onChange={(e) =>
                                        setSelectedPrivilege({ ...selectedPrivilege, description: e.target.value })
                                    }
                                />

                                <label className="flex items-center gap-2 text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={selectedPrivilege.isActive}
                                        onChange={(e) =>
                                            setSelectedPrivilege({ ...selectedPrivilege, isActive: e.target.checked })
                                        }
                                    />
                                    Activo
                                </label>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdatePrivilege}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 👇 Mostrar el Toast */}
                {toast && (
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast(null)}
                        duration={4500}
                    />
                )}
        </div>
    );
}