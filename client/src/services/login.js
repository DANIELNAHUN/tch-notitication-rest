const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const loginService = async (username, password) => {
    const response = await fetch(`${baseUrl}/api/user/login`, {
        method: "POST",
        body: {
            user_name: username,
            user_password: password,
        },
    });
    return response.json();
};