export const ExecuteLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
}

export const ExecuteLogin = (token: string, currentUser: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
};

export const getUserToken = (): string | null => {
    return localStorage.getItem('token')
}