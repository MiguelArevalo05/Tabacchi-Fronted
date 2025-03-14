import axios from 'axios';

const API_URL = 'http://localhost:4000/order';

export const getOrders = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const getOrderById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching order with ID ${id}:`, error);
        return null;
    }
};

export const createOrder = async (orderData: {
    supplier_id: number;
    total_amount: number;
    details: { product_id: number; quantity: number; price: number }[];
    billings: { some_billing_data: any }[];
    authorizations?: number[];
    date_issued: Date;
    coin?: string;
    warehouse?: string;
}) => {
    try {
        const response = await axios.post(API_URL, orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
};

export const updateOrder = async (id: number, updateData: Partial<{
    supplier_id?: number;
    total_amount?: number;
    details?: { product_id: number; quantity: number; price: number }[];
    billings?: { id: number; amount: number }[];
    authorizations?: { id: number }[];
    date_issued?: Date;
    coin?: string;
    warehouse?: string;
}>) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        return null;
    }
};

export const deleteOrder = async (id: number) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting order:', error);
        return false;
    }
};