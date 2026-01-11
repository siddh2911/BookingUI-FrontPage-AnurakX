const API_BASE_URL = 'https://api.karunavillas.com';

export const getRooms = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/allRooms`);
        if (!response.ok) {
            throw new Error(`Error fetching rooms: ${response.statusText}`);
        }
        const data = await response.json();

        const littleHaven = {
            id: 5,
            roomName: "Little Haven",
            pricePerNight: "10,000",
            image: "/images/villa-2.png",
            size: "6000 sqft",
            guests: "4 Adults"
        };

        return [...data, littleHaven];
    } catch (error) {
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
        throw error;
    }
};
