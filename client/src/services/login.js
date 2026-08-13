const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const loginService = async (username, password) => {
    const response = await fetch(`${baseUrl}/api/user/login`, {
        method: "POST",
        body: JSON.stringify({
            user_name: username,
            user_password: password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};
