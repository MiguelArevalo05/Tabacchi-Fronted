import axios from 'axios';

const API_URL = 'http://localhost:4000/suppliers';

export const getSuppliers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        return [];
    }
};

export const getSupplierById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier:', error);
        return null;
    }
};

export const createSupplier = async (supplierData: { name: string; address: string; phone: string, ruc: string, bank_account: string }) => {
    try {
        const response = await axios.post(API_URL, supplierData);
        return response.data;
    } catch (error) {
        console.error('Error creating supplier:', error);
        return null;
    }
};

export const updateSupplier = async (id: number, supplierData: { name?: string; address?: string; phone?: string, ruc?: string, bank_account?: string}) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, supplierData);
        return response.data;
    } catch (error) {
        console.error('Error updating supplier:', error);
        return null;
    }
};

export const deleteSupplier = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting supplier:', error);
        return null;
    }
};