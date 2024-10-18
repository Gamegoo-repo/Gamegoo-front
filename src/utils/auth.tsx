export const isTokenExpired = (token: string): boolean => {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime > expiryTime;
};