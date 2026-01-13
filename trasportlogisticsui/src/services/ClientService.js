const API_URL = 'http://localhost:8080/clients'; // Замените на ваш URL

export const getAllClients = async () => {
    try {
        const response = await fetch(`${API_URL}/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch clients');
        return await response.json();
    } catch (error) {
        console.error('Get clients error:', error);
        throw error;
    }
};

export const updateClient = async (id, clientData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update client');
        }
        return await response.json();
    } catch (error) {
        console.error('Update client error:', error);
        throw error;
    }
};

export const deleteClient = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to delete client');
    } catch (error) {
        console.error('Delete client error:', error);
        throw error;
    }
};

export const loginClient = async (loginData) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        });
        if (!response.ok) throw new Error('Login failed');
        return await response.json(); // Теперь включает password
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const registerClient = async (registerData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData),
        });
        if (!response.ok) throw new Error('Registration failed');
        return await response.json(); // Теперь включает password
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};