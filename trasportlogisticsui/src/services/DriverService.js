const API_URL = 'http://localhost:8080/drivers'; // Замените на ваш URL

export const getAllDrivers = async () => {
    try {
        const response = await fetch(`${API_URL}/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch drivers');
        return await response.json();
    } catch (error) {
        console.error('Get drivers error:', error);
        throw error;
    }
};

export const createDriver = async (driverData) => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driverData),
        });
        if (!response.ok) throw new Error('Failed to create driver');
        return await response.json();
    } catch (error) {
        console.error('Create driver error:', error);
        throw error;
    }
};

export const updateDriver = async (id, driverData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driverData),
        });
        if (!response.ok) throw new Error('Failed to update driver');
        return await response.json();
    } catch (error) {
        console.error('Update driver error:', error);
        throw error;
    }
};

export const deleteDriver = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to delete driver');
    } catch (error) {
        console.error('Delete driver error:', error);
        throw error;
    }
};