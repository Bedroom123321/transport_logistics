const API_URL = 'http://localhost:8080/trucks';

export const getAllTrucks = async () => {
    try {
        const response = await fetch(`${API_URL}/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch trucks');
        return await response.json();
    } catch (error) {
        console.error('Get trucks error:', error);
        throw error;
    }
};

export const createTruck = async (truckData) => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(truckData),
        });
        if (!response.ok) throw new Error('Failed to create truck');
        return await response.json();
    } catch (error) {
        console.error('Create truck error:', error);
        throw error;
    }
};

export const updateTruck = async (id, truckData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(truckData),
        });
        if (!response.ok) throw new Error('Failed to update truck');
        return await response.json();
    } catch (error) {
        console.error('Update truck error:', error);
        throw error;
    }
};

export const deleteTruck = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to delete truck');
    } catch (error) {
        console.error('Delete truck error:', error);
        throw error;
    }
};