"use client";

import { useEffect, useState } from "react";
import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from "@/services/supplierService";

interface Supplier {
    id?: number;
    name: string;
    address: string;
    phone: string;
    ruc: string;
    bank_account: string;
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Supplier>({
        name: "",
        address: "",
        phone: "",
        ruc: "",
        bank_account: ""
    });
    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const data = await getSuppliers();
            setSuppliers(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            setError("Error al obtener proveedores");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value || ""});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode && selectedId !== null) {
            await updateSupplier(selectedId, formData);
        } else {
            await createSupplier(formData);
        }
        resetForm();
        fetchSuppliers();
    };

    const handleEdit = (supplier: Supplier) => {
        setEditMode(true);
        setSelectedId(supplier.id!);
        setFormData(supplier);
    };

    const handleDelete = async (id: number) => {
        await deleteSupplier(id);
        fetchSuppliers();
    };

    const resetForm = () => {
        setFormData({ name: "", address: "", phone: "", ruc: "", bank_account: "" });
        setEditMode(false);
        setSelectedId(null);
    };

    if (loading) return <p>Cargando proveedores...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">Proveedores</h1>


            <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded">
                <h2 className="text-lg font-semibold mb-2">
                    {editMode ? "Editar Proveedor" : "Nuevo Proveedor"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} className="border p-2" required />
                    <input type="text" name="address" placeholder="Dirección" value={formData.address} onChange={handleChange} className="border p-2" required />
                    <input type="text" name="ruc" placeholder="RUC" value={formData.ruc || ""} onChange={handleChange} className="border p-2"/>
                    <input type="text" name="phone" placeholder="Teléfono" value={formData.phone || ""} onChange={handleChange} className="border p-2" />
                    <input type="text" name="bank_account" placeholder="Cuenta Bancaria" value={formData.bank_account || ""} onChange={handleChange} className="border p-2"/>
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-700 text-white rounded">
                    {editMode ? "Actualizar" : "Guardar"}
                </button>
                {editMode && (
                    <button type="button" onClick={resetForm} className="ml-2 px-4 py-2 bg-gray-600 text-white rounded">
                        Cancelar
                    </button>
                )}
            </form>

            {/* Tabla de proveedores */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Nombre</th>
                        <th className="border p-2">Dirección</th>
                        <th className="border p-2">RUC</th>
                        <th className="border p-2">Teléfono</th>
                        <th className="border p-2">Cuenta Bancaria</th>
                        <th className="border p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.id} className="text-center">
                            <td className="border p-2">{supplier.id}</td>
                            <td className="border p-2">{supplier.name}</td>
                            <td className="border p-2">{supplier.address}</td>
                            <td className="border p-2">{supplier.ruc}</td>
                            <td className="border p-2">{supplier.phone}</td>
                            <td className="border p-2">{supplier.bank_account}</td>
                            <td className="border p-2 flex justify-center gap-2">
                                <button onClick={() => handleEdit(supplier)} className="px-2 p-3 bg-yellow-500 text-white rounded">Editar</button>
                                <button onClick={() => handleDelete(supplier.id!)} className="px-2 p-3 bg-red-500 text-white rounded">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}