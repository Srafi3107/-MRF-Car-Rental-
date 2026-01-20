const API_URL = 'http://localhost:8080';

export const api = {
    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    getCars: async (search = '') => {
        let url = `${API_URL}/cars`;
        if (search) {
            url += `?search=${encodeURIComponent(search)}`;
        }
        const response = await fetch(url);
        return response.json();
    },

    addCar: async (car) => {
        const response = await fetch(`${API_URL}/cars`, {
            method: 'POST',
            body: JSON.stringify(car),
        });
        return response.json();
    },

    updateCar: async (car) => {
        const response = await fetch(`${API_URL}/cars`, {
            method: 'PUT',
            body: JSON.stringify(car),
        });
        return response.json();
    },

    deleteCar: async (id) => {
        await fetch(`${API_URL}/cars?id=${id}`, {
            method: 'DELETE',
        });
    },

    bookCar: async (booking) => {
        const response = await fetch(`${API_URL}/bookings/book`, {
            method: 'POST',
            body: JSON.stringify(booking),
        });
        if (!response.ok) throw new Error('Booking failed');
        return response.json();
    },

    approveBooking: async (bookingId) => {
        const response = await fetch(`${API_URL}/bookings/approve`, {
            method: 'POST',
            body: JSON.stringify({ bookingId }),
        });
        if (!response.ok) throw new Error('Approval failed');
        return response.json();
    },

    cancelBooking: async (bookingId) => {
        const response = await fetch(`${API_URL}/bookings/cancel`, {
            method: 'POST',
            body: JSON.stringify({ bookingId }),
        });
        if (!response.ok) throw new Error('Cancellation failed');
        return response.json();
    },

    rateBooking: async (bookingId, rating, feedback) => {
        const response = await fetch(`${API_URL}/bookings/rate`, {
            method: 'POST',
            body: JSON.stringify({ bookingId, rating, feedback }),
        });
        if (!response.ok) throw new Error('Rating failed');
        return response.json();
    },

    returnCar: async (bookingId) => {
        const response = await fetch(`${API_URL}/bookings/return`, {
            method: 'POST',
            body: JSON.stringify({ bookingId }),
        });
        if (!response.ok) throw new Error('Return failed');
        return response.json();
    },

    getBookings: async (userId = null) => {
        let url = `${API_URL}/bookings`;
        if (userId) {
            url += `?userId=${userId}`;
        }
        const response = await fetch(url);
        return response.json();
    },

    getUsers: async () => {
        const response = await fetch(`${API_URL}/auth/users`);
        return response.json();
    },

    updateProfile: async (id, profileData) => {
        const response = await fetch(`${API_URL}/auth/update-profile`, {
            method: 'POST',
            body: JSON.stringify({ id, ...profileData }),
        });
        if (!response.ok) throw new Error('Profile update failed');
        return response.json();
    },

    deleteUser: async (id) => {
        const response = await fetch(`${API_URL}/auth/delete-user?id=${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('User deletion failed');
        return response.json();
    }
};
