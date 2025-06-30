import { STORAGE_KEY } from "@/constants/storage";

export const setId = (id: number, autoLogin: boolean) => {
    if (typeof window !== 'undefined') {
        const storage = autoLogin ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY.userId, id.toString());
    }
    return null;
};

/* 토큰 사용 */
export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEY.accessToken) || sessionStorage.getItem(STORAGE_KEY.accessToken);
    }
    return null;
};

export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEY.refreshToken) || sessionStorage.getItem(STORAGE_KEY.refreshToken);
    }
    return null;
};

/* 닉네임 사용 */
export const getName = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEY.name) || sessionStorage.getItem(STORAGE_KEY.name);
    }
    return null;
};

/* 프로필 이미지 사용 */
export const getProfileImg = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEY.profileImg) || sessionStorage.getItem(STORAGE_KEY.profileImg);
    }
    return null;
};

/* 유저 id 사용 */
export const getUserId = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEY.userId) || sessionStorage.getItem(STORAGE_KEY.userId);
    }
    return null;
};

/* 토큰 제거 */
export const clearTokens = () => {
    localStorage.removeItem(STORAGE_KEY.accessToken);
    localStorage.removeItem(STORAGE_KEY.refreshToken);
    localStorage.removeItem(STORAGE_KEY.name);
    localStorage.removeItem(STORAGE_KEY.profileImg);
    localStorage.removeItem(STORAGE_KEY.userId);
    sessionStorage.removeItem(STORAGE_KEY.accessToken);
    sessionStorage.removeItem(STORAGE_KEY.refreshToken);
    sessionStorage.removeItem(STORAGE_KEY.name);
    sessionStorage.removeItem(STORAGE_KEY.profileImg);
    sessionStorage.removeItem(STORAGE_KEY.userId);
    sessionStorage.removeItem(STORAGE_KEY.chatPosition);
};

/* 매칭 완료 여부 */
export const setIsCompleted = (isCompleted: string) => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY.isCompleted, isCompleted);
    }
    return null;
};

export const getIsCompleted = () => {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(STORAGE_KEY.isCompleted);
    }
    return null;
};

/* 이메일 인증코드 사용 */
export const setVerifyCode = (verifyCode: string) => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY.verifyCode, verifyCode);
    }
    return null;
};

export const getVerifyCode = () => {
    if (typeof window !== "undefined") {
        return sessionStorage.getItem(STORAGE_KEY.verifyCode);
    }
    return null;
};