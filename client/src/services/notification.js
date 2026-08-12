const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const notificationService = async (userId) => {
    const response = await fetch(`${baseUrl}/api/notification`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};