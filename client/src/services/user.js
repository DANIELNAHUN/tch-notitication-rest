const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getMe = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${baseUrl}/api/user/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.json();
};