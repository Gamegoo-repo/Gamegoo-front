export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();

    console.log("Token Expiry Time:", expiryTime);
    console.log("Current Time:", currentTime);
    console.log(currentTime > expiryTime);
    return currentTime > expiryTime;
  } catch (error) {
    console.error("Failed to parse token:", error);
    return true;
  }
};
