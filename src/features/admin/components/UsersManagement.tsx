"use client";

import { useState, useEffect } from "react";
import {
    Trash2,
    Plus,
    Users as UsersIcon,
    Search,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import {
    assignUserProfile,
    createUser,
    deleteUser,
    getProfiles,
    getUsers,
    removeUserProfile,
    updateUserSuperAdmin,
} from "@/features/admin/services/accessControlService";
import { Toast } from "@/components/ui/toast";

// Define el tipo de perfil
interface Profile {
    id: string;
    name: string;
    description: string;
}

// Define el tipo de usuario
interface User {
    id: string;
    email: string;
    fullName: string;
    isSuperAdmin: boolean;
    profiles?: Profile[];
}

const ITEMS_PER_PAGE = 5;

export default function UsersManagement() {
    // Estados
    const [users, setUsers] = useState<User[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [superAdminStates, setSuperAdminStates] = useState<{ [key: string]: boolean }>({});

    // 👇 Estado para el Toast
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Estado para nuevo usuario
    const [newUser, setNewUser] = useState({
        email: "",
        fullName: "",
        password: "",
        isSuperAdmin: false,
    });

    // Cargar usuarios y perfiles
    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await getUsers();
            setUsers(data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            setToast({ type: "error", message: "Error al cargar usuarios." });
        } finally {
            setIsLoading(false);
        }
    };

    const loadProfiles = async () => {
        try {
            const data = await getProfiles();
            setProfiles(data);
        } catch (error) {
            console.error("Error al cargar perfiles:", error);
            setToast({ type: "error", message: "Error al cargar perfiles." });
        }
    };

    useEffect(() => {
        loadUsers();
        loadProfiles();
    }, []);

    // Inicializar estados de Super Admin cuando cargan usuarios
    useEffect(() => {
        if (users && users.length > 0) {
            const states: { [key: string]: boolean } = {};
            users.forEach((user: User) => {
                states[user.id] = user.isSuperAdmin;
            });
            setSuperAdminStates(states);
        }
    }, [users]);

    // Crear usuario
    const handleCreateUser = async () => {
        if (!newUser.email || !newUser.fullName || !newUser.password) {
            setToast({ type: "error", message: "Por favor completa todos los campos." });
            return;
        }

        setCreating(true);
        try {
            await createUser(newUser);
            setShowCreateModal(false);
            setNewUser({
                email: "",
                fullName: "",
                password: "",
                isSuperAdmin: false,
            });
            // ✅ Mostrar Toast de éxito
            setToast({ type: "success", message: "Usuario creado correctamente." });
            loadUsers();
        } catch (error) {
            console.error("Error al crear usuario:", error);
            setToast({ type: "error", message: "Error al crear el usuario." });
        } finally {
            setCreating(false);
        }
    };

    // Eliminar usuario
    const handleDelete = async (userId: string) => {
        setDeleting(true);
        try {
            await deleteUser(userId);
            setUsers(users.filter((user) => user.id !== userId));
            setDeleteConfirm(null);
            setCurrentPage(1);
            setToast({ type: "success", message: "Usuario eliminado correctamente." });
        } catch (error) {
            console.error("Error al eliminar:", error);
            setToast({ type: "error", message: "Error al eliminar el usuario." });
        } finally {
            setDeleting(false);
        }
    };

    // Asignar perfil
    const handleAssignProfile = async (userId: string, profileId: string) => {
        try {
            await assignUserProfile(userId, profileId);
            // ✅ Mostrar Toast de éxito
            setToast({ type: "success", message: "Perfil asignado correctamente." });
            loadUsers();
        } catch (error) {
            console.error("Error al asignar perfil:", error);
            setToast({ type: "error", message: "Error al asignar el perfil." });
        }
    };

    // Quitar perfil
    const handleRemoveProfile = async (userId: string, profileId: string) => {
        try {
            await removeUserProfile(userId, profileId);
            // ✅ Mostrar Toast de éxito
            setToast({ type: "success", message: "Perfil eliminado correctamente." });
            loadUsers();
        } catch (error) {
            console.error("Error al quitar perfil:", error);
            setToast({ type: "error", message: "Error al quitar el perfil." });
        }
    };

    // Cambiar estado de Super Admin
    const handleToggleSuperAdmin = async (userId: string) => {
        const currentStatus = superAdminStates[userId];
        try {
            await updateUserSuperAdmin(userId, !currentStatus);
            // Actualizar el estado local
            setSuperAdminStates((prev) => ({
                ...prev,
                [userId]: !prev[userId],
            }));
            // ✅ Mostrar Toast de éxito
            setToast({ type: "success", message: "Estado de Super Admin actualizado correctamente." });
        } catch (error) {
            console.error("Error al actualizar Super Admin:", error);
            setToast({ type: "error", message: "Error al actualizar el estado de Super Admin." });
        }
    };

    // Filtrar y ordenar usuarios
    const filteredUsers = users
        .filter(
            (user) =>
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.id.localeCompare(b.id));

    // Calcular paginación
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredUsers.slice(startIndex, endIndex);

    // Resetear página al buscar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Loading
    if (isLoading)
        return (
            <div className="max-w-6xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando usuarios...</p>
                </div>
            </div>
        );

    return (
        <div className="max-w-6xl relative">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-700 rounded-xl shadow-lg shadow-blue-700/20">
                            <UsersIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
                    </div>
                    <p className="text-gray-600">Gestiona todos los usuarios y sus perfiles</p>
                </div>

                {/* Buscador y botón nuevo */}
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
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
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-16">
                            <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No hay registros de usuarios</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Crea tu primer usuario para comenzar
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
                                            Email
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Super Admin
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Perfiles
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Asignar Perfil
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className={`border-b transition hover:bg-blue-50 ${
                                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            }`}
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                                {user.fullName}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                    {user.email}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleSuperAdmin(user.id)}
                                                    className={`inline-flex px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                                                        superAdminStates[user.id]
                                                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                    title="Haz clic para cambiar el estado"
                                                >
                                                    {superAdminStates[user.id] ? "Sí" : "No"}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.profiles?.length ? (
                                                        user.profiles.map((profile) => (
                                                            <div
                                                                key={profile.id}
                                                                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 ring-1 ring-blue-100 rounded text-xs font-medium"
                                                            >
                                                                <span>{profile.name}</span>
                                                                <button
                                                                    onClick={() => handleRemoveProfile(user.id, profile.id)}
                                                                    className="hover:text-red-600 transition"
                                                                    title="Quitar perfil"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Sin perfiles</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleAssignProfile(user.id, e.target.value);
                                                            e.target.value = "";
                                                        }
                                                    }}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>
                                                        Seleccionar perfil
                                                    </option>
                                                    {profiles.map((profile) => (
                                                        <option key={profile.id} value={profile.id}>
                                                            {profile.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex gap-1 justify-center">
                                                    <button
                                                        onClick={() => setDeleteConfirm(user.id)}
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
                                        {Math.min(endIndex, filteredUsers.length)}
                                    </span>{" "}
                                    de <span className="font-semibold">{filteredUsers.length}</span>{" "}
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
                                                className={`px-3 py-1 rounded-lg transition font-medium text-sm ${
                                                    currentPage === page
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

                {/* Modal de creación de usuario */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <UsersIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Crear Usuario</h3>
                            </div>
                            <div className="space-y-4 mb-6">
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={newUser.fullName}
                                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isSuperAdmin"
                                        checked={newUser.isSuperAdmin}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, isSuperAdmin: e.target.checked })
                                        }
                                        className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor="isSuperAdmin" className="text-sm font-medium text-gray-700">
                                        ¿Es Super Administrador?
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={creating}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateUser}
                                    disabled={creating}
                                    className="px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition font-medium shadow-sm disabled:opacity-50"
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
                                <h3 className="text-lg font-bold text-gray-900">Eliminar usuario</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede
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