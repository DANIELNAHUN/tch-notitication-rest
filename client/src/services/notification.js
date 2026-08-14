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

export const createNotification = async (formData) => {
    const response = await fetch(`${baseUrl}/api/notifications/notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            sender_id: parseInt(formData.sender_id),
            receiver_id: parseInt(formData.receiver_id),
            subject: formData.subject,
            message: formData.message,
            channel: formData.channel,
        }),
    });
    return response.json();
};