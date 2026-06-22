"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Plus,
    Trash2,
    Edit,
    ChevronLeft,
    ChevronRight,
    UserCog,
    X,
} from "lucide-react";
import {
    createProfile,
    deleteProfile,
    getPrivileges,
    getProfiles,
    removeProfilePrivilege,
    updateProfile,
} from "@/features/admin/services/accessControlService";
import { Toast } from "@/components/ui/toast";

// Define el tipo de privilegio
interface Privilege {
    id: string;
    module: string;
    action: string;
    description: string;
    isActive: boolean;
}

// Define el tipo de perfil
interface Profile {
    id: string;
    name: string;
    description: string;
    privileges?: Privilege[];
    privilegeIds?: string[];
}

const ITEMS_PER_PAGE = 5;

export default function ProfilesManagement() {
    // Estados
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [privileges, setPrivileges] = useState<Privilege[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editProfile, setEditProfile] = useState<Profile | null>(null);

    // 👇 Estado para el Toast
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Estado para nuevo perfil
    const [newProfile, setNewProfile] = useState({
        name: "",
        description: "",
        privilegeIds: [] as string[],
    });

    // Cargar perfiles y privilegios
    const loadProfiles = async () => {
        try {
            setLoading(true);
            const data = await getProfiles();
            setProfiles(data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error al cargar perfiles:", error);
            setToast({ type: "error", message: "Error al cargar perfiles." });
        } finally {
            setLoading(false);
        }
    };

    const loadPrivileges = async () => {
        try {
            const data = await getPrivileges();
            setPrivileges(data);
        } catch (error) {
            console.error("Error al cargar privilegios:", error);
            setToast({ type: "error", message: "Error al cargar privilegios." });
        }
    };

    useEffect(() => {
        loadProfiles();
        loadPrivileges();
    }, []);

    // Crear perfil
    const handleCreateProfile = async () => {
        if (!newProfile.name) {
            setToast({ type: "error", message: "El nombre del perfil es obligatorio." });
            return;
        }

        try {
            await createProfile(newProfile);
            setShowCreateModal(false);
            setNewProfile({
                name: "",
                description: "",
                privilegeIds: [],
            });
            setToast({ type: "success", message: "Perfil creado correctamente." });
            loadProfiles();
        } catch (error) {
            console.error("Error al crear perfil:", error);
            setToast({ type: "error", message: "Error al crear el perfil." });
        }
    };

    // Alternar privilegios
    const handlePrivilegeToggle = (id: string) => {
        setNewProfile((prev) => ({
            ...prev,
            privilegeIds: prev.privilegeIds.includes(id)
                ? prev.privilegeIds.filter((pid) => pid !== id)
                : [...prev.privilegeIds, id],
        }));
    };

    // Quitar privilegio del perfil
    const handleRemovePrivilege = async (profileId: string, privilegeId: string) => {
        try {
            await removeProfilePrivilege(profileId, privilegeId);
            // ✅ Mostrar Toast de éxito
            setToast({ type: "success", message: "Privilegio eliminado correctamente." });
            loadProfiles();
        } catch (error) {
            console.error("Error al quitar privilegio:", error);
            setToast({ type: "error", message: "Error al quitar el privilegio." });
        }
    };

    // Eliminar perfil
    const handleDelete = async (id: string) => {
        try {
            await deleteProfile(id);
            setProfiles(profiles.filter((p) => p.id !== id));
            setCurrentPage(1);
            // ✅ Mostrar Toast de éxito
            setToast({ type: "success", message: "Perfil eliminado correctamente." });
        } catch (error) {
            console.error("Error al eliminar:", error);
            setToast({ type: "error", message: "Error al eliminar el perfil." });
        }
    };

    // Filtrar y ordenar perfiles
    const filteredProfiles = profiles
        .filter(
            (p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.id.localeCompare(b.id));

    // Editar perfiles
    const handleOpenEdit = (profile: Profile) => {
        setEditProfile({
            ...profile,
            privilegeIds: profile.privileges?.map(p => p.id) || []
        });
        setShowEditModal(true);
    };
    // Editar perfiles
    const handleUpdateProfile = async () => {
        if (!editProfile?.name) {
            setToast({ type: "error", message: "El nombre del perfil es obligatorio." });
            return;
        }

        try {
            await updateProfile(editProfile.id, {
                name: editProfile.name,
                description: editProfile.description,
                privilegeIds: editProfile.privilegeIds,
            });

            setShowEditModal(false);
            setEditProfile(null);

            setToast({ type: "success", message: "Perfil actualizado correctamente." });

            loadProfiles();
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            setToast({ type: "error", message: "Error al actualizar el perfil." });
        }
    };

    // Calcular paginación
    const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredProfiles.slice(startIndex, endIndex);

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
                    <p className="text-slate-600">Cargando perfiles...</p>
                </div>
            </div>
        );

    return (
        <div className="max-w-6xl relative">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-700 rounded-xl shadow-lg shadow-blue-700/20">
                            <UserCog className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Perfiles</h1>
                    </div>
                    <p className="text-gray-600">Administra los perfiles y privilegios del sistema</p>
                </div>

                {/* Buscador y botón nuevo */}
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
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
                    {filteredProfiles.length === 0 ? (
                        <div className="text-center py-16">
                            <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No hay registros de perfiles</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Crea tu primer perfil para comenzar
                            </p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Nombre
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Descripción
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Privilegios
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((profile, index) => (
                                        <tr
                                            key={profile.id}
                                            className={`border-b transition hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                }`}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                    {profile.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium max-w-xs truncate">
                                                {profile.description || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.privileges?.length ? (
                                                        profile.privileges.map((priv) => (
                                                            <div
                                                                key={priv.id}
                                                                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 ring-1 ring-blue-100 rounded text-xs font-medium"
                                                                title={priv.description}
                                                            >
                                                                <span>{priv.module}:{priv.action}</span>
                                                                <button
                                                                    onClick={() => handleRemovePrivilege(profile.id, priv.id)}
                                                                    className="hover:text-red-600 transition"
                                                                    title="Quitar privilegio"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Sin privilegios</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex gap-1 justify-center">
                                                    <button
                                                        onClick={() => handleOpenEdit(profile)}
                                                        className="p-1 hover:bg-blue-100 rounded transition text-blue-600 hover:text-blue-700">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(profile.id)}
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
                                        {Math.min(endIndex, filteredProfiles.length)}
                                    </span>{" "}
                                    de <span className="font-semibold">{filteredProfiles.length}</span>{" "}
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

            {/* Modal de creación de perfil */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <UserCog className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Crear Perfil</h3>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Administrador, Editor"
                                    value={newProfile.name}
                                    onChange={(e) =>
                                        setNewProfile({ ...newProfile, name: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    placeholder="Descripción del perfil"
                                    value={newProfile.description}
                                    onChange={(e) =>
                                        setNewProfile({ ...newProfile, description: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Privilegios
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    {privileges.length > 0 ? (
                                        privileges.map((privilege) => (
                                            <label
                                                key={privilege.id}
                                                className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={newProfile.privilegeIds.includes(privilege.id)}
                                                    onChange={() => handlePrivilegeToggle(privilege.id)}
                                                    className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    {privilege.module}:{privilege.action}
                                                </span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500">No hay privilegios disponibles</p>
                                    )}
                                </div>
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
                                onClick={handleCreateProfile}
                                className="px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition font-medium shadow-sm"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de edición de perfil */}
            {showEditModal && editProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-700 rounded-xl">
                                <Edit className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Editar Perfil</h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={editProfile.name}
                                    onChange={(e) =>
                                        setEditProfile({ ...editProfile, name: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    value={editProfile.description || ""}
                                    onChange={(e) =>
                                        setEditProfile({ ...editProfile, description: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Privilegios */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Privilegios
                                </label>

                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    {privileges.length > 0 ? (
                                        privileges.map((priv) => (
                                            <label
                                                key={priv.id}
                                                className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={editProfile.privilegeIds?.includes(priv.id)}
                                                    onChange={() => {
                                                        const updated = editProfile.privilegeIds?.includes(priv.id)
                                                            ? editProfile.privilegeIds.filter(pid => pid !== priv.id)
                                                            : [...(editProfile.privilegeIds || []), priv.id];

                                                        setEditProfile({
                                                            ...editProfile,
                                                            privilegeIds: updated
                                                        });
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    {priv.module}:{priv.action}
                                                </span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500">No hay privilegios disponibles</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditProfile(null);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                className="px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition font-medium"
                            >
                                Actualizar
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