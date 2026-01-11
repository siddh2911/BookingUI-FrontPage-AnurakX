const API_BASE_URL = 'https://api.karunavillas.com';


export const getRooms = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/allRooms`);
        if (!response.ok) {
            throw new Error(`Error fetching rooms: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch rooms:", error);
        throw error;
    }
};


export const getAvailability = async (startDate, endDate) => {
    try {
        const response = await fetch(`${API_BASE_URL}/available-rooms?startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) {
            throw new Error(`Error fetching availability: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch availability:", error);
        throw error;
    }
};
