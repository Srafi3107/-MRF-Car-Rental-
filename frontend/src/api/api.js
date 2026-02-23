const API_URL = 'http://localhost:8080';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const uploadCarImage = async (file) => {
    const response = await fetch(
        `${API_URL}/images/upload?filename=${encodeURIComponent(file.name)}`,
        { method: 'POST', body: file }
    );
    if (!response.ok) throw new Error('Image upload failed');
    return response.json(); // { filename, imageUrl }
};

export const api = {
    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    getCars: async (search = '') => {
        let url = `${API_URL}/cars`;
        if (search) url += `?search=${encodeURIComponent(search)}`;
        const response = await fetch(url);
        return response.json();
    },

    addCar: async (car) => {
        const response = await fetch(`${API_URL}/cars`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(car),
        });
        if (!response.ok) throw new Error('Failed to add car');
        return response.json();
    },

    updateCar: async (car) => {
        const response = await fetch(`${API_URL}/cars`, {
            method: 'PUT',
            headers: JSON_HEADERS,
            body: JSON.stringify(car),
        });
        if (!response.ok) throw new Error('Failed to update car');
        return response.json();
    },

    deleteCar: async (id) => {
        const response = await fetch(`${API_URL}/cars?id=${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete car');
    },

    bookCar: async (booking) => {
        // Convert date strings to epoch milliseconds (what the Java backend expects as long)
        const payload = {
            userId: booking.userId,
            carId: booking.carId,
            startDate: new Date(booking.startDate).getTime(),
            endDate: new Date(booking.endDate).getTime(),
            customerName: booking.customerName || '',
            customerPhone: booking.customerPhone || '',
        };
        const response = await fetch(`${API_URL}/bookings/book`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Booking failed');
        return response.json();
    },

    approveBooking: async (bookingId) => {
        const response = await fetch(`${API_URL}/bookings/approve`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ bookingId }),
        });
        if (!response.ok) throw new Error('Approval failed');
        return response.json();
    },

    cancelBooking: async (bookingId) => {
        const response = await fetch(`${API_URL}/bookings/cancel`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ bookingId }),
        });
        if (!response.ok) throw new Error('Cancellation failed');
        return response.json();
    },

    rateBooking: async (bookingId, rating, feedback) => {
        const response = await fetch(`${API_URL}/bookings/rate`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ bookingId, rating, feedback }),
        });
        if (!response.ok) throw new Error('Rating failed');
        return response.json();
    },

    returnCar: async (bookingId) => {
        const response = await fetch(`${API_URL}/bookings/return`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ bookingId }),
        });
        if (!response.ok) throw new Error('Return failed');
        return response.json();
    },

    getBookings: async (userId = null) => {
        const url = userId ? `${API_URL}/bookings?userId=${userId}` : `${API_URL}/bookings`;
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
            headers: JSON_HEADERS,
            body: JSON.stringify({ id, ...profileData }),
        });
        if (!response.ok) throw new Error('Profile update failed');
        return response.json();
    },

    deleteUser: async (id) => {
        const response = await fetch(`${API_URL}/auth/delete-user?id=${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('User deletion failed');
        return response.json();
    },

    forgotPassword: async (username, email) => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ username, email }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Password reset request failed');
        }
        return data;
    },

    getResetStatus: async (username) => {
        const response = await fetch(`${API_URL}/auth/reset-status`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch status');
        return data;
    },

    approveReset: async (userId) => {
        const response = await fetch(`${API_URL}/auth/approve-reset`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Approval failed');
        return data;
    },

    finalizeReset: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/finalize-reset`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Reset failed');
        return data;
    }
};
