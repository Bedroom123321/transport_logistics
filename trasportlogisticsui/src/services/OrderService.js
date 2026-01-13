const API_URL = 'http://localhost:8080/orders';

export const createOrder = async (orderData) => {
    try {
        const response = await fetch(`${API_URL}/post`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('Failed to create order');
        return await response.json();
    } catch (error) {
        console.error('Create order error:', error);
        throw error;
    }
};

export const getAllOrdersWithRelations = async () => {
    try {
        const response = await fetch(`${API_URL}/all_with_relations`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch orders with relations'); // Line 24
        return await response.json();
    } catch (error) {
        console.error('Get orders with relations error:', error);
        throw error;
    }
};

export const updateOrder = async (id, orderData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Не авторизован. Выполните вход.');
        }
        const response = await fetch(`${API_URL}/update/${id}`, {
            method: 'PUT', // Изменили метод на PUT
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('Failed to update order');
        return await response.json();
    } catch (error) {
        console.error('Update order error:', error);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Не авторизован. Выполните вход.');
        }
        const response = await fetch(`${API_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete order');
        return true;
    } catch (error) {
        console.error('Delete order error:', error);
        throw error;
    }
};