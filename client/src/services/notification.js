const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const notificationService = async (userId) => {
    const response = await fetch(`${baseUrl}/api/notifications/notifications`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.json();
};